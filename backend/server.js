import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Add debugging middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to extract headlines from text response
function extractHeadlinesFromText(text) {
  console.log("Attempting to extract headlines from text response");
  
  // Looking for patterns like "1. Headline: Description" or similar formats
  const headlines = [];
  
  // Try to find numbered headlines (e.g., "1. Title - Source")
  const numberedPattern = /\d+\.\s+["']?([^"'\n:]+)["']?(?:\s*[-:]\s*|\s*from\s*)([^\n]+)/gi;
  let match;
  
  while ((match = numberedPattern.exec(text)) !== null) {
    headlines.push({
      headline: match[1].trim(),
      url: match[2].includes("http") ? 
        match[2].trim() : 
        "https://www.example.com/finance/news"
    });
  }
  
  // If no numbered headlines found, try to find bullet points
  if (headlines.length === 0) {
    const bulletPattern = /[•\-*]\s+["']?([^"'\n:]+)["']?(?:\s*[-:]\s*|\s*from\s*)([^\n]+)/gi;
    while ((match = bulletPattern.exec(text)) !== null) {
      headlines.push({
        headline: match[1].trim(),
        url: match[2].includes("http") ? 
          match[2].trim() : 
          "https://www.example.com/finance/news"
      });
    }
  }
  
  // If still no headlines, try to extract lines that look like titles
  if (headlines.length === 0) {
    const lines = text.split('\n').filter(line => line.trim());
    for (const line of lines) {
      // Skip lines that are too long to be titles
      if (line.length > 120) continue;
      
      // Skip lines that seem to be instructions or explanations
      if (line.toLowerCase().includes("here are") || 
          line.toLowerCase().includes("latest") || 
          line.toLowerCase().includes("financial news")) {
        continue;
      }
      
      headlines.push({
        headline: line.trim(),
        url: "https://www.example.com/finance/news"
      });
      
      // Limit to 5 headlines
      if (headlines.length >= 5) break;
    }
  }
  
  console.log(`Extracted ${headlines.length} headlines from text`);
  return headlines.slice(0, 5); // Return at most 5 headlines
}

// Helper function to summarize news headline using Sonar
async function summarizeNewsHeadline(headline, sourceUrl) {
  // Check if API key exists
  if (!process.env.PERPLEXITY_API_KEY) {
    console.warn("Missing Perplexity API key - using placeholder data");
    return {
      summary: "Summary unavailable - API key not configured",
      market_impact: "Market impact analysis requires API connection",
      citation: sourceUrl,
    };
  }

  const prompt = `
You are a financial AI assistant. Given this news headline:
"${headline}"
Do the following:
1. Summarize the headline in 2-3 sentences.
2. Explain the potential market impact in simple language.
3. Provide a citation link using the source URL provided.

Format your response STRICTLY as a JSON object with these exact keys:
{
  "summary": "...",
  "market_impact": "...",
  "citation": "..."
}

NO extra text before or after the JSON. JSON format only.
Source URL: ${sourceUrl}
`;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log("Perplexity API response status:", response.status);
    
    const result = response.data.choices?.[0]?.message?.content;
    if (!result) {
      console.error("Empty response content from Perplexity API");
      return {
        summary: "Summary unavailable - empty API response",
        market_impact: "Market impact analysis unavailable",
        citation: sourceUrl,
      };
    }
    
    try {
      // Try to extract JSON from the response (in case there's text before/after)
      const jsonMatch = result.match(/({[\s\S]*})/);
      const jsonStr = jsonMatch ? jsonMatch[0] : result;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError.message);
      console.log("Raw response:", result);
      
      // Generate a synthetic summary from the text response
      return {
        summary: result.substring(0, 200) + "...",
        market_impact: "Could not analyze market impact due to parsing error",
        citation: sourceUrl,
      };
    }
  } catch (error) {
    console.error("Sonar API error:", error.message);
    if (error.response) {
      console.error("API response status:", error.response.status);
      console.error("API response data:", error.response.data);
    }
    
    return {
      summary: "Summary unavailable due to API error",
      market_impact: "Market impact analysis unavailable",
      citation: sourceUrl,
    };
  }
}

// GET /api/financial-news — fetch top 5 latest financial/business headlines + summaries
app.get("/api/financial-news", async (req, res) => {
  try {
    // Check if API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      console.warn("Missing Perplexity API key - returning mock data");
      return res.json({ data: MOCK_FINANCIAL_NEWS });
    }
    
    const prompt = `
You are a financial news agent. Fetch the top 5 latest business or financial news headlines with source URLs. 

Format your response STRICTLY as a valid JSON array of objects like:
[
  {"headline": "Apple Reports Record Q3 Profits", "url": "https://example.com/apple-profits"},
  {"headline": "Fed to Hold Interest Rates Steady", "url": "https://example.com/fed-rates"}
]

NO introductory or concluding text. ONLY the JSON array.
`;

    console.log("Sending request to Perplexity API...");
    
    const sonarRes = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000 // 15 second timeout
      }
    );

    console.log("Received response from Perplexity API");
    
    // Get the response content
    const responseContent = sonarRes.data.choices?.[0]?.message?.content;
    if (!responseContent) {
      console.error("Empty response from Perplexity API");
      return res.json({ data: MOCK_FINANCIAL_NEWS });
    }
    
    console.log("Raw API response content:", responseContent.substring(0, 100) + "...");
    
    let headlines = [];
    try {
      // Try to extract JSON from the response (in case there's text before/after)
      const jsonMatch = responseContent.match(/(\[[\s\S]*\])/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseContent;
      headlines = JSON.parse(jsonStr);
      
      if (!Array.isArray(headlines)) {
        throw new Error("Response is not an array");
      }
      
      console.log(`Successfully parsed ${headlines.length} headlines as JSON`);
    } catch (parseError) {
      console.error("Error parsing headlines as JSON:", parseError.message);
      
      // Fallback: try to extract headlines from text
      headlines = extractHeadlinesFromText(responseContent);
      
      if (headlines.length === 0) {
        console.warn("Could not extract headlines from text, returning mock data");
        return res.json({ data: MOCK_FINANCIAL_NEWS });
      }
    }
    
    // Process each headline to get summaries
    const summarizedHeadlines = await Promise.all(
      headlines.map(async (article) => {
        if (!article.headline) {
          console.warn("Malformed article data:", article);
          return null;
        }
        
        // Ensure URL is present
        const url = article.url || "https://www.example.com/finance/news";
        
        const result = await summarizeNewsHeadline(article.headline, url);
        return {
          headline: article.headline,
          ...result,
        };
      })
    ).then(results => results.filter(item => item !== null));

    if (summarizedHeadlines.length === 0) {
      console.warn("No valid headlines found, returning mock data");
      return res.json({ data: MOCK_FINANCIAL_NEWS });
    }

    res.json({ data: summarizedHeadlines });
  } catch (error) {
    console.error("Financial news fetch error:", error.message);
    if (error.response) {
      console.error("API response status:", error.response.status);
      console.error("API response data:", error.response.data);
    }
    
    // Return mock data on error
    console.log("Returning mock data due to error");
    return res.json({ data: MOCK_FINANCIAL_NEWS });
  }
});

// POST /api/learn endpoint using Sonar
app.post('/api/learn', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Check if API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(500).json({ 
        error: 'Perplexity API key is not configured',
        details: 'Please add PERPLEXITY_API_KEY to your .env file'
      });
    }
    
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    const aiResponse = response.data.choices?.[0]?.message?.content;
    
    if (aiResponse) {
      return res.status(200).json({ message: aiResponse });
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error("Error in learn request:", error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.response?.data || error.message
    });
  }
});

// Add a basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    apiConfigured: !!process.env.PERPLEXITY_API_KEY
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`CORS enabled for origin: http://localhost:5173`);
  console.log(`Perplexity API key ${process.env.PERPLEXITY_API_KEY ? 'is' : 'is NOT'} configured`);
});
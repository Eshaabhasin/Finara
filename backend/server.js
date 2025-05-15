import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Function to check if the message is finance-related
const isFinanceRelated = (message) => {
  const financeKeywords = [
    'finance', 'money', 'investment', 'stock', 'market', 'banking', 
    'savings', 'budget', 'economy', 'financial', 'revenue', 'profit', 
    'expense', 'capital', 'trade', 'asset', 'wealth', 'portfolio', 
    'income', 'loan', 'debt', 'credit', 'mortgage', 'insurance', 
    'entrepreneurship', 'startup', 'business plan', 'funding', 
    'financial literacy', 'financial planning', 'economic', 
    'investment strategy', 'personal finance', 'financial goal', 
    'financial education', 'business', 'Hey','bank account', 'Loan'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  
  return financeKeywords.some(keyword => 
    lowercaseMessage.includes(keyword)
  );
};

const trimResponse = (message) => {
  if (!message) return '';
  
  // Define patterns to remove (introductory and conclusion phrases)
  const introPatterns = [
    /^(sure|of course|i'm happy to help|let me help|i can assist|i'd be glad to).*?(\.|!|\n)/i,
    /^(hi|hello|hey|greetings|welcome|good (morning|afternoon|evening|day)).*?(\.|!|\n)/i,
    /^thank you.*?(\.|!|\n)/i,
  ];
  
  const conclusionPatterns = [
    /(thank you|let me know if you need anything else|happy to help|feel free to ask).*$/i,
    /(goodbye|have a great day|take care|best wishes).*$/i,
    /^(i hope this helps|does this answer your question|let me know if).*$/i,
  ];
  
  // Remove intro patterns
  introPatterns.forEach((pattern) => {
    message = message.replace(pattern, '').trim();
  });
  
  // Remove conclusion patterns
  conclusionPatterns.forEach((pattern) => {
    message = message.replace(pattern, '').trim();
  });
  
  return message;
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required.' });
  }
  
  // Check if the message is finance-related
  if (!isFinanceRelated(userMessage)) {
    return res.status(400).send({
       error: 'Sorry, I can only assist with finance-related queries. Please ask a question about finance, business, investment, or economic topics.'
     });
  }
  
  try {
    // Using Perplexity Sonar API instead of NVIDIA
    const options = {
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a helpful financial assistant. Be precise and concise with your answers."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 1024,
        temperature: 0.5,
        top_p: 1
      }
    };
    
    const response = await axios.request(options);
    
    // Process and trim the response
    const botMessage = trimResponse(response.data.choices[0].message.content);
    
    return res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error("Error in chat request:", error);
    
    return res.status(500).send({
      error: `Internal Server Error: ${error.message}`,
      details: error.response?.data || 'No details available',
    });
  }
});

// Add the learning path endpoint for Sonar API
app.post('/api/learn', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Configure the request for Perplexity Sonar API
    const options = {
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "Be precise and concise."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      }
    };

    const response = await axios.request(options);
    
    // Extract the message from the response
    if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      const text = response.data.choices[0].message.content;
      return res.status(200).json({ message: trimResponse(text) });
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error("Error in learn request:", error);

    return res.status(500).json({
      error: `Internal Server Error: ${error.message}`,
      details: error.response?.data || 'No details available',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
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

app.post('/api/learn', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: "sonar",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      }
    });
    
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
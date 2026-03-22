const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
  const { system, message } = req.body;

  const apiKey = process.env.GROQ_API_KEY || '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';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ],
        max_tokens: 80,
        temperature: 0.9
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'API request failed' 
      });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎭 AI Debate Arena server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Groq AI (Llama 3.3 70B)`);
  if (process.env.GROQ_API_KEY) {
    console.log(`✓ Custom API key configured`);
  } else {
    console.log(`✓ Using default API key`);
  }
});

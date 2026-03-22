export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}

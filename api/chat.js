module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, message } = req.body;
  const apiKey = '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';

  try {
    const https = require('https');
    
    const data = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message }
      ],
      max_tokens: 80,
      temperature: 0.9
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      }
    };

    const apiResponse = await new Promise((resolve, reject) => {
      const apiReq = https.request(options, (apiRes) => {
        let body = '';
        apiRes.on('data', (chunk) => body += chunk);
        apiRes.on('end', () => {
          try {
            resolve({ statusCode: apiRes.statusCode, data: JSON.parse(body) });
          } catch (e) {
            reject(e);
          }
        });
      });
      apiReq.on('error', reject);
      apiReq.write(data);
      apiReq.end();
    });

    if (apiResponse.statusCode !== 200) {
      return res.status(apiResponse.statusCode).json({ 
        error: apiResponse.data.error?.message || 'API request failed' 
      });
    }

    const reply = apiResponse.data.choices?.[0]?.message?.content || '';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
};

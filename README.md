# AI Debate Arena

A cyberpunk-styled web application where two AI advocates debate any topic in real-time.

## Features

- **Dual AI Debaters**: Advocate Alpha argues FOR the topic, Advocate Beta argues AGAINST
- **Real-time Debates**: Watch AI arguments unfold with typing indicators
- **Cyberpunk UI**: Beautiful gradient design with responsive layout
- **Mobile Friendly**: Optimized for both desktop and mobile devices
- **Keyboard Shortcuts**: Press F to stop debates anytime

## Tech Stack

- Frontend: Vanilla HTML/CSS/JavaScript
- Backend: Vercel Serverless Functions
- AI: Groq API (Llama 3.3 70B)

## Setup

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/redeyessssss/ai-debate-arena.git
cd ai-debate-arena
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

5. Run the server:
```bash
node server.js
```

6. Open `http://localhost:3000` in your browser

### Vercel Deployment

1. Fork this repository
2. Import to Vercel
3. Add environment variable in Vercel dashboard:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key
4. Deploy!

## Getting a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and use in your `.env` file

## Usage

1. Enter a debate topic (e.g., "Is AI good for humanity?")
2. Click "Start" to begin the debate
3. Watch Alpha and Beta argue their positions
4. Press "Stop" or "F" key to end the debate anytime

## License

MIT License - see LICENSE file for details

# AI Debate Arena

Two AI advocates debate any topic you choose — one argues FOR, one argues AGAINST.

Powered by Groq AI (Llama 3.3 70B).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Groq API key:
```bash
cp .env.example .env
# Edit .env and add your Groq API key
```

3. Start the server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## Usage

- Enter any debate topic
- Click "Start" to begin
- Watch Alpha (FOR) and Beta (AGAINST) debate in real-time
- Click "Stop" to end the debate at any time

## Alternative: Standalone Version

Open `standalone.html` directly in your browser - no server needed!

## Requirements

- Node.js 14+
- Uses Groq API (free tier, key included)

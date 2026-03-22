let debating = false;
let round = 0;
let history = [];
let userHasScrolled = false;

// Track when user manually scrolls
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    userHasScrolled = !isAtBottom;
  }, 100);
});

const SYSTEM_A = `You are Advocate Alpha — a sharp, confident debater arguing STRONGLY IN FAVOR of the given topic. Keep responses EXTREMELY concise (1-2 sentences ONLY). Be persuasive and direct. Do NOT use bullet points. Speak in flowing prose. Always argue FOR the topic, never concede defeat.`;

const SYSTEM_B = `You are Advocate Beta — a sharp, witty debater arguing STRONGLY AGAINST the given topic. Keep responses EXTREMELY concise (1-2 sentences ONLY). Be critical and incisive. Do NOT use bullet points. Speak in flowing prose. Always argue AGAINST the topic, never concede defeat.`;

async function callAI(systemPrompt, userPrompt) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        message: userPrompt
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }
    
    const data = await response.json();
    return data.reply;
  } catch(e) {
    console.error('API Error:', e);
    showError(e.message);
    throw e;
  }
}

function showError(msg) {
  const arena = document.getElementById('arena');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-msg';
  errorDiv.textContent = `Error: ${msg}`;
  arena.appendChild(errorDiv);
}

function addTypingIndicator(side) {
  removeTypingIndicator();
  const arena = document.getElementById('arena');
  const div = document.createElement('div');
  div.id = 'typingIndicator';
  div.className = `typing ${side}`;
  div.innerHTML = `
    <div class="typing-dots"><span></span><span></span><span></span></div>
    <span>${side === 'a' ? 'Alpha' : 'Beta'} thinking...</span>
  `;
  if (side === 'b') div.style.alignSelf = 'flex-end';
  arena.appendChild(div);
}

function removeTypingIndicator() {
  document.getElementById('typingIndicator')?.remove();
}

function addMessage(side, text, roundNum) {
  removeTypingIndicator();
  const arena = document.getElementById('arena');
  const msg = document.createElement('div');
  msg.className = `message ${side}`;
  const label = side === 'a' ? 'Advocate Alpha · FOR' : 'Advocate Beta · AGAINST';
  msg.innerHTML = `
    <div class="msg-header">${label} · Round ${roundNum}</div>
    <div class="msg-bubble">${text}</div>
  `;
  arena.appendChild(msg);
}

function setDotPulse(side, on) {
  const dot = document.getElementById(side === 'a' ? 'dotA' : 'dotB');
  dot.classList.toggle('pulse', on);
}

async function startDebate() {
  const topic = document.getElementById('topicInput').value.trim();
  if (!topic) { 
    document.getElementById('topicInput').focus(); 
    return; 
  }

  debating = true;
  round = 0;
  history = [];
  userHasScrolled = false;
  document.getElementById('arena').innerHTML = '';
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
  document.getElementById('topicInput').disabled = true;
  document.getElementById('emptyState')?.remove();
  document.getElementById('topicDisplay').style.display = '';
  document.getElementById('topicLabel').textContent = topic;
  document.getElementById('statusBar').textContent = 'Debate in progress...';

  while (debating) {
    round++;

    if (round > 1) {
      const badge = document.createElement('div');
      badge.className = 'round-badge';
      badge.textContent = `Round ${round}`;
      document.getElementById('arena').appendChild(badge);
    }

    // Alpha speaks
    setDotPulse('a', true);
    addTypingIndicator('a');
    
    const aPrompt = round === 1
      ? `The debate topic is: "${topic}". Open the debate with your strongest argument.`
      : `The topic is "${topic}". Beta's last point: "${history[history.length-1]}". Respond with a strong counter-argument.`;
    
    let aReply;
    try {
      aReply = await callAI(SYSTEM_A, aPrompt);
    } catch(e) { 
      stopDebate(); 
      break; 
    }
    
    if (!debating) break;
    
    setDotPulse('a', false);
    addMessage('a', aReply, round);
    history.push(aReply);
    
    await delay(600);
    if (!debating) break;

    // Beta speaks
    setDotPulse('b', true);
    addTypingIndicator('b');
    
    const bPrompt = `The topic is "${topic}". Alpha just argued: "${aReply}". Counter their argument powerfully.`;
    
    let bReply;
    try {
      bReply = await callAI(SYSTEM_B, bPrompt);
    } catch(e) { 
      stopDebate(); 
      break; 
    }
    
    if (!debating) break;
    
    setDotPulse('b', false);
    addMessage('b', bReply, round);
    history.push(bReply);
    
    await delay(800);
  }

  document.getElementById('statusBar').textContent = `Debate ended after ${round} round${round !== 1 ? 's' : ''}.`;
}

function stopDebate() {
  debating = false;
  removeTypingIndicator();
  setDotPulse('a', false);
  setDotPulse('b', false);
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('topicInput').disabled = false;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Allow Enter key to start
document.getElementById('topicInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !document.getElementById('startBtn').disabled) {
    startDebate();
  }
});

// Allow F key to stop debate
document.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    if (debating) {
      e.preventDefault();
      stopDebate();
    }
  }
});

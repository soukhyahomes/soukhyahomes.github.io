// Simple custom chatbot logic

const chatbotFAQ = [
  {
    question: /^(hi|hello|hey|greetings|good (morning|afternoon|evening))$/i,
    answer: 'Hello! How can I help you today?'
  },
  {
    question: /where.*located|location|address/i,
    answer: 'We are located here: <a href="https://share.google/UcSnI6Rc39oQleYNw" target="_blank">Google Maps</a>'
  },
  {
    question: /buy|rental|rent|purchase/i,
    answer: 'We have only Rental Available.'
  },
  {
    question: /tariff|rate|price|pricing|cost/i,
    answer: 'Please see our pricing/contact page: <a href="https://soukhyahomes.com/contact.html" target="_blank">Contact & Pricing</a>'
  }
];


function getChatbotAnswer(userInput) {
  for (const faq of chatbotFAQ) {
    if (faq.question.test(userInput.trim())) {
      return faq.answer;
    }
  }
  return 'For more information, please <a href="https://soukhyahomes.com/contact.html" target="_blank">contact us</a>.';
}

let inactivityTimer = null;
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return;
    messages.innerHTML += `<div style='margin-bottom:12px;'><b>Bot:</b> Do you have anything else we can help you with?<br><button id='chatbot-yes-btn' style='margin:8px 8px 0 0;padding:6px 18px;background:#009688;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Yes</button><button id='chatbot-no-btn' style='margin:8px 0 0 0;padding:6px 18px;background:#bbb;color:#222;border:none;border-radius:8px;cursor:pointer;'>No</button></div>`;
    messages.scrollTop = messages.scrollHeight;
    document.getElementById('chatbot-yes-btn').onclick = function() {
      messages.innerHTML += `<div style='margin-bottom:12px;'><b>Bot:</b> You can reach us directly on WhatsApp: <a href='https://wa.me/919677227627' target='_blank'>Chat with Agent Now</a></div>`;
      messages.scrollTop = messages.scrollHeight;
    };
    document.getElementById('chatbot-no-btn').onclick = function() {
      messages.innerHTML += `<div style='margin-bottom:12px;'><b>Bot:</b> Thank you for reaching out to us. Wishing to meet you soon!</div>`;
      messages.scrollTop = messages.scrollHeight;
    };
  }, 120000); // 2 minutes
}

// Chatbot UI logic
function showChatbot() {
  if (document.getElementById('custom-chatbot')) return;
  const bot = document.createElement('div');
  bot.id = 'custom-chatbot';
  bot.style.position = 'fixed';
  bot.style.bottom = '32px';
  bot.style.left = '32px';
  bot.style.width = '340px';
  bot.style.background = '#fff';
  bot.style.borderRadius = '16px';
  bot.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  bot.style.zIndex = '9999';
  bot.style.fontFamily = 'inherit';
  bot.innerHTML = `
  <div style="background:#009688;color:#fff;padding:16px 20px;border-radius:16px 16px 0 0;font-weight:bold;font-size:1.2em;">Soukhya Chatbot <span style='float:right;cursor:pointer;' id='chatbot-close-btn'>&times;</span></div>
    <div id="chatbot-messages" style="padding:16px;min-height:120px;max-height:180px;overflow-y:auto;font-size:1em;"></div>
    <form id="chatbot-form" style="display:flex;padding:12px 16px 16px 16px;gap:8px;">
      <input type="text" id="chatbot-input" placeholder="Type your question..." style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid #ccc;">
      <button type="submit" style="background:#009688;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:bold;cursor:pointer;">Send</button>
    </form>
  `;
  document.body.appendChild(bot);
  const messages = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  document.getElementById('chatbot-close-btn').onclick = function() {
    document.getElementById('custom-chatbot').remove();
    setTimeout(() => {
      if (!document.getElementById('chatbot-launch-btn')) addChatbotButton();
    }, 300);
  };
  form.onsubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const userText = input.value.trim();
    if (!userText) return;
    messages.innerHTML += `<div style='margin-bottom:8px;'><b>You:</b> ${userText}</div>`;
    const answer = getChatbotAnswer(userText);
    messages.innerHTML += `<div style='margin-bottom:12px;'><b>Bot:</b> ${answer}</div>`;
    messages.scrollTop = messages.scrollHeight;
    input.value = '';
    resetInactivityTimer();
  };
  resetInactivityTimer();
}

// Floating button to open chatbot
function addChatbotButton() {
  if (document.getElementById('chatbot-launch-btn')) return;
  // Chatbot button only
  const btn = document.createElement('button');
  btn.id = 'chatbot-launch-btn';
  btn.innerText = 'Chatbot';
  btn.style.position = 'fixed';
  btn.style.bottom = '32px';
  btn.style.left = '32px';
  btn.style.background = '#009688';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '50%';
  btn.style.width = '56px';
  btn.style.height = '56px';
  btn.style.fontSize = '0.85em';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
  btn.style.zIndex = '9998';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.textAlign = 'center';
  btn.style.padding = '0';
  btn.onclick = function() {
    btn.remove();
    showChatbot();
  };
  document.body.appendChild(btn);
}

window.addEventListener('DOMContentLoaded', addChatbotButton);

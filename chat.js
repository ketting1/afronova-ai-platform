// ============================================================
// chat.js - AI Chat Integration
// ============================================================

// ---------- AI CONFIGURATION ----------
// Using a free AI API (no API key needed for testing)
const AI_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// We'll use a free public proxy for testing
// For a real project, you'd need an API key

// ---------- SEND MESSAGE FUNCTION ----------
function sendMessageToAI(userMessage) {
    // Get the chat box where we display messages
    const chatBox = document.querySelector('.chat-box');
    
    // Add user message to the chat
    const userMessageElement = document.createElement('div');
    userMessageElement.style.cssText = `
        align-self: flex-end;
        background: rgba(124, 58, 237, 0.3);
        padding: 0.8rem 1.2rem;
        border-radius: 16px 16px 4px 16px;
        margin: 0.3rem 0;
        max-width: 80%;
        text-align: left;
    `;
    userMessageElement.textContent = '👤 ' + userMessage;
    chatBox.appendChild(userMessageElement);

    // Show "typing..." indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typingIndicator';
    typingIndicator.style.cssText = `
        align-self: flex-start;
        background: rgba(100, 100, 140, 0.2);
        padding: 0.8rem 1.2rem;
        border-radius: 16px 16px 16px 4px;
        margin: 0.3rem 0;
        font-style: italic;
        color: rgb(148, 163, 184);
        max-width: 80%;
    `;
    typingIndicator.textContent = '🤖 AI is thinking...';
    chatBox.appendChild(typingIndicator);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Call the AI
    getAIResponse(userMessage)
        .then(response => {
            // Remove typing indicator
            document.getElementById('typingIndicator')?.remove();

            // Add AI response to chat
            const aiMessageElement = document.createElement('div');
            aiMessageElement.style.cssText = `
                align-self: flex-start;
                background: rgba(96, 165, 250, 0.2);
                padding: 0.8rem 1.2rem;
                border-radius: 16px 16px 16px 4px;
                margin: 0.3rem 0;
                max-width: 80%;
                text-align: left;
                border-left: 3px solid rgb(96, 165, 250);
            `;
            aiMessageElement.textContent = '🤖 ' + response;
            chatBox.appendChild(aiMessageElement);
            
            // Scroll to bottom
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            // Remove typing indicator
            document.getElementById('typingIndicator')?.remove();

            // Show error message
            const errorElement = document.createElement('div');
            errorElement.style.cssText = `
                align-self: flex-start;
                background: rgba(239, 68, 68, 0.15);
                padding: 0.8rem 1.2rem;
                border-radius: 16px 16px 16px 4px;
                margin: 0.3rem 0;
                max-width: 80%;
                text-align: left;
                border-left: 3px solid rgb(239, 68, 68);
                color: rgb(248, 113, 113);
                font-size: 0.9rem;
            `;
            errorElement.textContent = '⚠️ Error: ' + error.message;
            chatBox.appendChild(errorElement);
            
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}

// ---------- GET AI RESPONSE ----------
async function getAIResponse(userMessage) {
    // For now, we'll use a free, public API
    // This is a demo endpoint that echoes back your message with a twist
    
    try {
        // Using a free public AI API (no key needed for testing)
        const response = await fetch('https://api.gaianet.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a friendly AI assistant called AfroNova AI. You help people learn about AI and coding. Keep responses short and helpful (under 100 words).'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error('AI service is busy. Please try again.');
        }

        const data = await response.json();
        
        // Extract the response text
        // Different APIs have different response structures
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else if (data.response) {
            return data.response;
        } else {
            // Fallback: echo the message with a twist
            return getFallbackResponse(userMessage);
        }

    } catch (error) {
        console.error('AI Error:', error);
        // If the API fails, use a smart fallback
        return getFallbackResponse(userMessage);
    }
}

// ---------- FALLBACK RESPONSE (Smart Echo) ----------
function getFallbackResponse(message) {
    // This runs when the AI API is not available
    // It simulates an AI response based on keywords
    
    const responses = {
        'hello': '👋 Hello! I\'m AfroNova AI. How can I help you learn today?',
        'hi': '👋 Hi there! Ready to learn something new about AI?',
        'help': 'I\'m here to help! Ask me about AI, coding, HTML, CSS, or JavaScript.',
        'ai': 'AI (Artificial Intelligence) is the ability of machines to learn and think like humans. We\'re building AI solutions for Africa!',
        'code': 'Coding is the language of computers. You\'ve already learned HTML, CSS, and JavaScript – that\'s a great start!',
        'html': 'HTML is the skeleton of a webpage. It gives structure to everything you see on the internet.',
        'css': 'CSS is the style – it makes websites beautiful with colours, fonts, and layouts.',
        'javascript': 'JavaScript is the brain – it makes websites interactive and smart.',
        'africa': 'AfroNova AI is building AI solutions for Africa. We believe in making technology accessible to everyone!',
        'purpose': 'Our purpose is to help Africans learn AI, build solutions, and grow the tech ecosystem on the continent.',
        'mission': 'Our mission is to make AI education accessible and practical for everyone in Africa.',
        'learn': 'Learning is a journey! Start with HTML, then CSS, then JavaScript. You\'re already on the right track!',
        'building': 'You\'re building websites and learning AI – that\'s the future! Keep going!',
        'future': 'The future is AI, and Africa is ready to lead! Stay curious and keep learning.',
    };

    // Check if the message contains any keywords
    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }

    // Default response if no keywords match
    return `That's a great question about "${message}". I'm still learning, but I'd love to help! Try asking me about AI, coding, HTML, CSS, or JavaScript.`;
}

// ---------- SETUP THE CHAT INPUT ----------
// This function will be called from index.html
function setupChat() {
    const chatBox = document.querySelector('.chat-box');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    if (!chatInput || !sendBtn) {
        console.log('Chat elements not found yet – waiting...');
        // Try again in 1 second
        setTimeout(setupChat, 1000);
        return;
    }

    // Send message on button click
    sendBtn.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message) {
            sendMessageToAI(message);
            chatInput.value = '';
        }
    });

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendBtn.click();
        }
    });

    // Remove the placeholder text from chat box
    const chatBox = document.querySelector('.chat-box');
    chatBox.innerHTML = ''; // Clear the placeholder
    
    // Add a welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
        align-self: flex-start;
        background: rgba(96, 165, 250, 0.15);
        padding: 0.8rem 1.2rem;
        border-radius: 16px 16px 16px 4px;
        margin: 0.3rem 0;
        max-width: 80%;
        text-align: left;
        border-left: 3px solid rgb(96, 165, 250);
        font-size: 0.95rem;
        color: rgb(203, 213, 225);
        width: 100%;
    `;
    welcomeMsg.innerHTML = `
        🤖 <strong>Welcome to AfroNova AI!</strong><br />
        <span style="font-size: 0.85rem; color: rgb(148, 163, 184);">
            Ask me about AI, coding, HTML, CSS, JavaScript, or just say hello!
        </span>
    `;
    chatBox.appendChild(welcomeMsg);

    console.log('💬 Chat is ready!');
}

// ---------- START CHAT WHEN PAGE LOADS ----------
// Wait for DOM to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupChat);
} else {
    setupChat();
}

console.log('🤖 AI Chat module loaded!');

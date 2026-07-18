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
    
// ============================================================
// AGENT INSTRUCTIONS GENERATOR
// ============================================================

function generateAgentInstructions() {
    // Get the instruction box where we'll show the result
    const instructionBox = document.querySelector('.instruction-box');
    
    // Show loading state
    instructionBox.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <div style="font-size: 2rem;">⚙️</div>
            <div style="color: rgb(196, 181, 253); font-weight: 600;">Generating AI instructions...</div>
            <div style="font-size: 0.85rem; color: rgb(100, 116, 139);">Please wait while we prepare your onboarding guide</div>
            <div style="width: 100%; max-width: 200px; height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; margin-top: 0.5rem;">
                <div id="loadingBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, rgb(167,139,250), rgb(96,165,250)); border-radius: 4px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;

    // Animate loading bar
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
        const bar = document.getElementById('loadingBar');
        if (bar) bar.style.width = progress + '%';
    }, 200);

    // Call AI to generate instructions
    getAIInstructions()
        .then(response => {
            clearInterval(loadingInterval);
            const bar = document.getElementById('loadingBar');
            if (bar) bar.style.width = '100%';
            
            // Show the result after a small delay for effect
            setTimeout(() => {
                instructionBox.innerHTML = `
                    <div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 0.5rem;">
                        <div style="color: rgb(74, 222, 128); font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            ✅ <span>Instructions Generated Successfully!</span>
                        </div>
                        <div style="color: rgb(203, 213, 225); font-size: 0.9rem; line-height: 1.8; white-space: pre-wrap;">
                            ${response}
                        </div>
                        <button onclick="copyInstructions()" style="
                            margin-top: 1rem;
                            padding: 0.5rem 1.5rem;
                            border-radius: 40px;
                            border: none;
                            background: linear-gradient(135deg, rgb(167, 139, 250), rgb(96, 165, 250));
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 0.85rem;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            📋 Copy Instructions
                        </button>
                    </div>
                `;
                document.querySelector('.instruction-hint')?.remove();
            }, 500);
        })
        .catch(error => {
            clearInterval(loadingInterval);
            instructionBox.innerHTML = `
                <div style="color: rgb(248, 113, 113);">
                    ❌ Error generating instructions: ${error.message}
                </div>
                <button onclick="generateAgentInstructions()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1.5rem;
                    border-radius: 40px;
                    border: 1px solid rgb(248, 113, 113);
                    background: transparent;
                    color: rgb(248, 113, 113);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                    Try Again
                </button>
            `;
        });
}

// ---------- GET AI INSTRUCTIONS ----------
async function getAIInstructions() {
    try {
        // This is a free public AI API for demo purposes
        // In production, you'd use your own API key
        const response = await fetch('https://api.gaianet.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI onboarding expert. Generate a step-by-step guide for onboarding AI onto a codebase. 
                        
                        The user has built a website called "AfroNova AI" with:
                        - HTML, CSS, and JavaScript
                        - A starfield animation
                        - Lesson cards
                        - A chat interface
                        
                        Provide clear, actionable instructions. Use bullet points. Keep it under 300 words.`
                    },
                    {
                        role: 'user',
                        content: 'Please generate instructions for onboarding AI onto my AfroNova AI codebase. Include steps for integration, best practices, and next steps.'
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('AI service is busy. Please try again.');
        }

        const data = await response.json();
        
        // Extract the response
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else if (data.response) {
            return data.response;
        } else {
            return getFallbackInstructions();
        }

    } catch (error) {
        console.error('AI Error:', error);
        return getFallbackInstructions();
    }
}

// ---------- FALLBACK INSTRUCTIONS ----------
function getFallbackInstructions() {
    return `📋 **AI Onboarding Instructions for AfroNova AI**

**Step 1: Analyse Your Codebase**
• Review your HTML structure (index.html, lesson pages)
• Check your CSS styling and layout
• Understand your JavaScript functions

**Step 2: Prepare Your AI Integration**
• Choose an AI provider (OpenAI, Mistral, or local LLM)
• Get your API key and keep it secure
• Test with simple prompts first

**Step 3: Integrate AI Services**
• Add the AI API to your chat.js file
• Create a backend proxy if needed (for security)
• Test with sample messages

**Step 4: Best Practices**
• Always show loading states
• Handle errors gracefully
• Limit user input length
• Cache responses when possible

**Step 5: Next Steps**
• Add more AI features (code suggestions, answers)
• User authentication
• Track usage and improve prompts

**🎯 Your AI journey starts now! Keep building and learning!**`;
}

// ---------- COPY INSTRUCTIONS ----------
function copyInstructions() {
    const instructionBox = document.querySelector('.instruction-box');
    const text = instructionBox.textContent.replace('📋 Copy Instructions', '').trim();
    
    // Use clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('📋 Instructions copied to clipboard!');
            })
            .catch(() => {
                // Fallback
                copyToClipboardFallback(text);
            });
    } else {
        // Fallback for older browsers
        copyToClipboardFallback(text);
    }
}

// ---------- COPY TO CLIPBOARD FALLBACK ----------
function copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.left = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('📋 Instructions copied to clipboard!');
    } catch (err) {
        showToast('❌ Could not copy. Please select and copy manually.');
    }
    document.body.removeChild(textarea);
}

// ---------- TOAST NOTIFICATION ----------
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(11, 14, 30, 0.95);
        color: rgb(240, 244, 255);
        padding: 1rem 2rem;
        border-radius: 60px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(12px);
        z-index: 9999;
        font-size: 1rem;
        font-weight: 600;
        animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(styleSheet);

console.log('🤖 Agent instructions module loaded!');
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

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Knowledge base for FAQ
let knowledgeBase = {};
let faqById = {};

// Random greetings
const randomGreetings = [
    '👋 Hi there! Welcome to Sunbuzz Media!',
    '🙌 Hello! Great to see you here!',
    '😊 Hey! What can we help you with today?',
    '🎉 Whatsup! Excited to connect with you!',
    '💼 Hey there! Let\'s explore Sunbuzz Media together!',
    '✨ Hello! Welcome aboard!'
];

// Menu structure
const menuStructure = {
    main: [
        { id: 'about', label: '📋 About Sunbuzz', type: 'submenu' },
        { id: 'work', label: '🚀 Our Previous Work', type: 'submenu' },
        { id: 'services', label: '🛠️ Our Services', type: 'submenu' }
    ],
    
    about: [
        { 
            id: 'company', 
            label: '🏢 Company Details',
            type: 'info',
            content: '<strong>🏢 Sunbuzz Media - Delhi Based Digital Agency</strong><br><br>✅ 4+ years of experience<br>✅ 10+ years team expertise<br>✅ Serving 100+ clients PAN India & Globally<br>✅ Specialists in AI-powered digital solutions<br>✅ Full-service digital marketing & tech agency<br><br><strong>Our Mission:</strong> Transform businesses through innovative digital strategies!'
        },
        { id: 'back', label: '⬅️ Back', type: 'submenu' }
    ],
    
    work: [
        { 
            id: 'projects', 
            label: '🔗 Our Project Portfolio',
            type: 'link',
            url: 'https://sunbuzzmedia.site/portfolio.html'
        },
        { 
            id: 'case_studies', 
            label: '📊 Case Studies',
            type: 'link',
            url: 'https://sunbuzzmedia.site/about.html'
        },
        { id: 'back', label: '⬅️ Back', type: 'submenu' }
    ],
    
    services: [
        { id: 'ai_chatbot', label: '🤖 AI Chatbot Development', type: 'info', content: '<strong>AI Chatbot Development</strong><br><br>Custom AI-powered chatbots for customer support, lead generation, and engagement.<br><br>✅ WhatsApp Integration<br>✅ Website Integration<br>✅ Messaging Platforms<br>✅ 24/7 Support Capability' },
        { id: 'web_design', label: '🌐 Website Designing & Development', type: 'info', content: '<strong>Website Designing & Development</strong><br><br>Responsive, fast, and SEO-optimized websites.<br><br>✅ Custom Designs<br>✅ E-commerce Solutions<br>✅ Landing Pages<br>✅ Corporate Websites<br>✅ Mobile Responsive' },
        { id: 'digital_marketing', label: '📱 Digital Marketing', type: 'info', content: '<strong>Digital Marketing Services</strong><br><br>Complete digital growth strategies to increase your online presence.<br><br>✅ Social Media Marketing (SMM)<br>✅ Search Engine Optimization (SEO)<br>✅ Content Marketing<br>✅ PPC Campaigns<br>✅ Analytics & Reporting' },
        { id: 'branding', label: '🎨 Branding & Design', type: 'info', content: '<strong>Branding & Design Solutions</strong><br><br>Complete branding solutions for your business.<br><br>✅ Logo Design<br>✅ Brand Identity<br>✅ Visual Guidelines<br>✅ Brand Strategy<br>✅ Packaging Design' },
        { id: 'ecommerce', label: '🛒 E-commerce Solutions', type: 'info', content: '<strong>E-commerce Solutions</strong><br><br>End-to-end e-commerce platforms and solutions.<br><br>✅ Shopify Stores<br>✅ WooCommerce Setup<br>✅ Payment Integration<br>✅ Inventory Management<br>✅ Conversion Optimization' },
        { id: 'ai_tools', label: '⚙️ AI Tools & Automation', type: 'info', content: '<strong>AI Tools & Automation</strong><br><br>Custom AI solutions for business growth and automation.<br><br>✅ Marketing Automation<br>✅ Content Generation AI<br>✅ Analytics Tools<br>✅ Custom AI Solutions<br>✅ Process Automation' },
        { id: 'back', label: '⬅️ Back', type: 'submenu' }
    ]
};

// Load FAQ data from JSON file
async function loadFAQData() {
    try {
        const response = await fetch('dataoffile.json');
        const faqData = await response.json();
        
        faqData.faqs.forEach(faq => {
            const keywordsString = faq.keywords.join('|');
            knowledgeBase[keywordsString] = {
                responses: [faq.answer]
            };
            faqById[faq.id] = faq;
        });

        console.log('✅ Knowledge Base Loaded with ' + faqData.faqs.length + ' FAQs');
    } catch (error) {
        console.error('Error loading FAQ data:', error);
        // Fallback FAQ data - ALL 37 FAQs if file cannot be loaded
        const fallbackData = {
            "faqs": [
                {"id": 1, "question": "What is your pricing?", "keywords": ["pricing", "cost", "how much", "rate", "price", "packages"], "answer": "<strong>3 tiers:</strong> Basic (₹15k/month), Pro (₹35k/month), Enterprise (₹75k+/month). Custom packages available. Free consultation to choose right plan!"},
                {"id": 2, "question": "What are your working hours?", "keywords": ["hours", "available", "when open", "support hours", "timing"], "answer": "We're available <strong>24/7 via chat!</strong> 🕐 Phone support: Mon-Fri 9 AM - 6 PM IST."},
                {"id": 3, "question": "What services does Sunbuzz Media offer?", "keywords": ["product", "features", "what do you offer", "services", "offerings", "sunbuzz services"], "answer": "Sunbuzz Media offers <strong>AI-powered digital marketing</strong>, website development, branding, content creation, SMM, SEO, e-commerce, and tech solutions. Which service interests you most?"},
                {"id": 4, "question": "How do I contact Sunbuzz Media?", "keywords": ["email", "contact", "reach", "information", "phone", "address", "phone number", "phone no", "call"], "answer": "Contact us at contact@sunbuzzmedia.site or call +91 77018 90895. Free consultation available!"},
                {"id": 5, "question": "What is your refund policy?", "keywords": ["refund", "money back", "return", "policy", "guarantee"], "answer": "We offer a <strong>30-day money-back guarantee</strong> if you're not satisfied. No questions asked! Contact us for details."},
                {"id": 6, "question": "Do you offer free trial?", "keywords": ["free trial", "trial period", "free plan", "demo", "test"], "answer": "✅ <strong>Yes!</strong> 14-day free trial of all premium features. No credit card required to get started."},
                {"id": 7, "question": "How long does setup take?", "keywords": ["setup", "installation", "how long", "time", "implementation"], "answer": "Most clients are up and running within <strong>2-3 hours</strong>. Our team provides complete setup support and training."},
                {"id": 8, "question": "Do you provide API access?", "keywords": ["api", "integration", "developers", "technical", "access"], "answer": "✅ <strong>Yes!</strong> Professional and Enterprise plans include full API access. Check our documentation at api.sunbuzzmedia.site"},
                {"id": 9, "question": "What is Sunbuzz Media?", "keywords": ["company", "about", "what is sunbuzz", "sunbuzz media"], "answer": "Sunbuzz Media is a <strong>Delhi-based digital agency</strong> specializing in AI-powered customer support, website development, branding, SMM, SEO, and tech solutions for business growth."},
                {"id": 10, "question": "Where is Sunbuzz Media located?", "keywords": ["location", "where located", "address", "office", "delhi"], "answer": "Sunbuzz Media is based in <strong>Delhi, India</strong>. We serve clients PAN India and internationally with our remote-first approach."},
                {"id": 11, "question": "Is Sunbuzz Media a marketing agency or AI & Tech company?", "keywords": ["marketing agency", "ai tech", "what type", "agency or tech"], "answer": "Sunbuzz Media is <strong>both!</strong> A full-service digital marketing agency AND AI-driven tech solutions company combining creativity with cutting-edge technology."},
                {"id": 12, "question": "Does Sunbuzz Media work with startups or established businesses?", "keywords": ["startups", "established", "small business", "large business"], "answer": "We work with <strong>startups, SMEs, and established businesses</strong>. Flexible packages for bootstrapped startups to Fortune 500 companies."},
                {"id": 13, "question": "Does Sunbuzz Media serve PAN India clients?", "keywords": ["pan india", "all india", "india clients"], "answer": "✅ <strong>Yes!</strong> Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, and 100+ cities across PAN India."},
                {"id": 14, "question": "Does Sunbuzz Media work with international clients?", "keywords": ["international", "outside india", "global"], "answer": "✅ <strong>Yes!</strong> USA, UK, Australia, Middle East, Europe. Seamless remote delivery worldwide."},
                {"id": 15, "question": "Does Sunbuzz Media provide branding services?", "keywords": ["branding", "brand identity", "logo design"], "answer": "✅ <strong>Complete branding!</strong> Logo, brand identity, visual guidelines, strategy, packaging design."},
                {"id": 16, "question": "Does Sunbuzz Media create content?", "keywords": ["content", "content creation", "video content"], "answer": "✅ <strong>Yes!</strong> Social media posts, reels, videos, blogs, brochures, presentations."},
                {"id": 17, "question": "Does Sunbuzz Media manage social media?", "keywords": ["social media", "smm", "instagram", "facebook"], "answer": "✅ <strong>Full SMM!</strong> Instagram, Facebook, LinkedIn, YouTube - content, posting, growth, analytics."},
                {"id": 18, "question": "Does Sunbuzz Media design websites?", "keywords": ["website", "web design", "web development"], "answer": "✅ <strong>Yes!</strong> Custom responsive websites, landing pages, corporate sites, SEO-optimized."},
                {"id": 19, "question": "Does Sunbuzz Media build e-commerce sites?", "keywords": ["ecommerce", "online store", "shopify"], "answer": "✅ <strong>E-commerce solutions!</strong> Shopify, WooCommerce, payment integration, inventory management."},
                {"id": 20, "question": "How can Sunbuzz Media help my business grow?", "keywords": ["help business", "grow business", "business growth"], "answer": "<strong>Digital transformation:</strong> Branding + Website + SMM + SEO + AI tools = 3x growth in 3-6 months."},
                {"id": 21, "question": "Does Sunbuzz Media work on AI projects?", "keywords": ["ai", "artificial intelligence", "ai tools"], "answer": "✅ <strong>AI specialists!</strong> Chatbots, content generation, marketing automation, analytics."},
                {"id": 22, "question": "Why choose Sunbuzz Media?", "keywords": ["why choose", "best agency", "advantages"], "answer": "<strong>Delhi-based, 4+ years experience</strong>, PAN India reach, AI-powered, startup-friendly pricing."},
                {"id": 23, "question": "Does Sunbuzz Media provide ongoing support?", "keywords": ["support", "maintenance", "customer support"], "answer": "✅ <strong>24/7 support + maintenance packages</strong> for websites and digital assets."},
                {"id": 24, "question": "Is first consultation with Sunbuzz Media free?", "keywords": ["free consultation", "first meeting"], "answer": "✅ <strong>Yes! FREE 30-min consultation</strong>. Discuss your needs with our experts."},
                {"id": 25, "question": "Can I talk to Sunbuzz Media team?", "keywords": ["talk team", "meet team", "tech expert"], "answer": "Book FREE call: +91 77018 90895 or WhatsApp us anytime for expert consultation."},
                {"id": 26, "question": "Does Sunbuzz Media do SEO?", "keywords": ["seo", "search engine", "google ranking"], "answer": "✅ <strong>Complete SEO services!</strong> On-page, off-page, technical, local SEO for Google growth."},
                {"id": 27, "question": "Can Sunbuzz Media redesign my old website?", "keywords": ["redesign", "old website", "website refresh"], "answer": "✅ <strong>Yes!</strong> Modern redesigns - faster, mobile-friendly, SEO-optimized, better conversions."},
                {"id": 28, "question": "How does Sunbuzz Media create websites?", "keywords": ["website creation", "website process", "how build website"], "answer": "Our process: Requirements → Design → Development → Testing → Launch. Custom, responsive, optimized."},
                {"id": 29, "question": "What tech stack does Sunbuzz Media use?", "keywords": ["technology", "tech stack", "programming"], "answer": "Modern tech: React, Node.js, Python, AWS, AI/ML frameworks. Latest & most scalable solutions."},
                {"id": 30, "question": "Does Sunbuzz Media provide maintenance services?", "keywords": ["maintenance", "upkeep", "ongoing maintenance"], "answer": "✅ <strong>Yes!</strong> Regular updates, security patches, performance optimization, 24/7 monitoring."},
                {"id": 31, "question": "How do I sell products online with Sunbuzz Media?", "keywords": ["sell online", "ecommerce setup", "online sales"], "answer": "We setup: E-commerce platform → Payment gateway → Product listing → Marketing. Complete solution."},
                {"id": 32, "question": "What are Sunbuzz Media's tech solutions?", "keywords": ["tech solutions", "technology services", "software"], "answer": "AI tools, chatbots, automation, custom software, APIs, integrations, web apps, mobile apps."},
                {"id": 33, "question": "Does Sunbuzz Media follow current trends?", "keywords": ["trends", "latest", "modern", "innovation"], "answer": "✅ <strong>Yes!</strong> We follow latest trends: AI, blockchain, voice search, mobile-first design."},
                {"id": 34, "question": "How can I improve my online presence?", "keywords": ["online presence", "digital presence", "visibility"], "answer": "Website + SEO + Social Media + Content + Branding = Strong online presence & customer trust."},
                {"id": 35, "question": "What makes Sunbuzz Media different?", "keywords": ["difference", "unique", "why different"], "answer": "Unique blend of marketing expertise + AI tech + affordability + personalized approach = Results."},
                {"id": 36, "question": "What packages does Sunbuzz Media offer?", "keywords": ["packages", "plans", "pricing tiers"], "answer": "<strong>3 main tiers:</strong> Basic (₹15k), Pro (₹35k), Enterprise (₹75k+), plus custom solutions."},
                {"id": 37, "question": "How do I get started with Sunbuzz Media?", "keywords": ["get started", "how to begin", "onboarding"], "answer": "Step 1: Free consultation call. Step 2: Custom proposal. Step 3: Sign & start project. Simple!"}
            ]
        };
        
        fallbackData.faqs.forEach(faq => {
            const keywordsString = faq.keywords.join('|');
            knowledgeBase[keywordsString] = {
                responses: [faq.answer]
            };
            faqById[faq.id] = faq;
        });
        
        console.log('⚠️ Using fallback FAQ data - ' + fallbackData.faqs.length + ' FAQs loaded');
    }
}

// Show random greeting on load
function showRandomGreeting() {
    const greeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
    addMessage(greeting, 'bot');
    setTimeout(() => {
        showMainMenu();
    }, 800);
}

// Show main menu buttons
function showMainMenu() {
    showMenuButtons(menuStructure.main);
}

// Display menu buttons
function showMenuButtons(items) {
    const container = document.getElementById('faqButtons');
    container.innerHTML = ''; // Clear previous buttons

    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'faq-btn';
        btn.textContent = item.label;
        btn.title = item.label;

        btn.addEventListener('click', () => {
            handleMenuClick(item);
        });

        container.appendChild(btn);
    });
}

// Handle menu item click
function handleMenuClick(item) {
    if (item.type === 'submenu') {
        if (item.id === 'back') {
            addMessage('Going back to main menu...', 'bot');
            setTimeout(() => showMainMenu(), 500);
        } else {
            addMessage(`Showing ${item.label}...`, 'bot');
            setTimeout(() => {
                showMenuButtons(menuStructure[item.id]);
            }, 500);
        }
    } else if (item.type === 'info') {
        addMessage(item.label, 'user');
        addMessage(item.content, 'bot');
        setTimeout(() => {
            showMainMenu();
        }, 1500);
    } else if (item.type === 'link') {
        addMessage(item.label, 'user');
        addMessage(`<a href="${item.url}" target="_blank" style="color: #667eea; font-weight: bold;">🔗 Click here to view: ${item.label}</a>`, 'bot');
        setTimeout(() => {
            showMainMenu();
        }, 1500);
    }
}

// Load FAQ data on page load and then show greeting
loadFAQData().then(() => {
    setTimeout(() => {
        messageInput.focus();
        showRandomGreeting();
    }, 500);
});
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

// Send message on Enter key
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;

    showTypingIndicator();

    const delayTime = 500 + Math.random() * 1000;
    setTimeout(() => {
        const response = generateResponse(message);
        removeTypingIndicator();
        addMessage(response, 'bot');
        sendBtn.disabled = false;
    }, delayTime);
}

function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Step 1: Try exact keyword matching first
    for (const [keywords, data] of Object.entries(knowledgeBase)) {
        const keywordArray = keywords.split('|');
        if (keywordArray.some(keyword => lowerMessage.includes(keyword))) {
            return data.responses[0];
        }
    }

    // Step 2: Fuzzy matching with spell correction
    const correctedMessage = correctSpelling(lowerMessage);
    for (const [keywords, data] of Object.entries(knowledgeBase)) {
        const keywordArray = keywords.split('|');
        if (keywordArray.some(keyword => correctedMessage.includes(keyword))) {
            return `📝 Did you mean: <strong>"${correctedMessage}"</strong>?<br><br>` + data.responses[0];
        }
    }

    // Step 3: Similarity matching using Levenshtein distance
    const bestMatch = findSimilarFAQ(lowerMessage);
    if (bestMatch && bestMatch.similarity > 0.4) {
        return bestMatch.answer;
    }

    // Step 4: Intent-based intelligent response
    const intent = detectIntent(lowerMessage);
    return generateSmartResponse(lowerMessage, intent);
}

// Spell correction using common misspellings
function correctSpelling(text) {
    const commonMisspellings = {
        'pricng': 'pricing',
        'servises': 'services',
        'webiste': 'website',
        'seo': 'seo',
        'ai': 'ai',
        'chatbot': 'chatbot',
        'ecomerce': 'ecommerce',
        'brandig': 'branding',
        'marketng': 'marketing',
        'contacte': 'contact',
        'refund': 'refund',
        'supprt': 'support',
        'designn': 'design',
        'developmnet': 'development',
        'maintanance': 'maintenance',
        'consulattion': 'consultation'
    };

    let corrected = text;
    for (const [wrong, correct] of Object.entries(commonMisspellings)) {
        const regex = new RegExp(`\\b${wrong}\\b`, 'g');
        corrected = corrected.replace(regex, correct);
    }
    return corrected;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
}

// Find similar FAQ using similarity matching
function findSimilarFAQ(userQuery) {
    let bestMatch = null;
    let highestSimilarity = 0;

    for (const [faqId, faq] of Object.entries(faqById)) {
        const question = faq.question.toLowerCase();
        const similarity = levenshteinDistance(userQuery, question);
        
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = {
                id: faqId,
                question: faq.question,
                answer: faq.answer,
                similarity: similarity
            };
        }
    }

    return bestMatch;
}

// Detect user intent from message
function detectIntent(message) {
    const intents = {
        pricing: ['price', 'cost', 'rate', 'plan', 'package', 'fee', 'charge', 'how much'],
        contact: ['contact', 'reach', 'email', 'phone', 'call', 'whatsapp', 'telegram'],
        services: ['service', 'offer', 'do you', 'help', 'solve', 'solution', 'what can'],
        about: ['what is', 'about', 'who', 'company', 'info', 'information'],
        support: ['help', 'issue', 'problem', 'error', 'broken', 'not working', 'support'],
        process: ['how', 'process', 'work', 'create', 'build', 'develop', 'design'],
        timeline: ['how long', 'time', 'days', 'hours', 'when', 'duration', 'setup'],
        quality: ['best', 'why', 'advantage', 'different', 'good', 'quality'],
        location: ['where', 'located', 'office', 'address', 'city', 'delhi', 'india']
    };

    let detectedIntent = 'general';
    let maxMatches = 0;

    for (const [intent, keywords] of Object.entries(intents)) {
        const matches = keywords.filter(keyword => message.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedIntent = intent;
        }
    }

    return detectedIntent;
}

// Generate smart contextual response
function generateSmartResponse(message, intent) {
    const smartResponses = {
        pricing: "💰 <strong>Interested in pricing?</strong> We offer 3 tiers:<br>• Basic: ₹15k/month<br>• Pro: ₹35k/month<br>• Enterprise: ₹75k+/month<br><br>Want a <strong>free consultation</strong> to find the right plan? Call +91 77018 90895!",
        
        contact: "📞 <strong>Let's connect!</strong><br>📧 Email: contact@sunbuzzmedia.site<br>📱 Phone: +91 77018 90895<br>💬 WhatsApp: +91 77018 90895<br>🕐 Available 24/7 for your queries!",
        
        services: "🛠️ <strong>We offer comprehensive services:</strong><br>✅ AI Chatbots<br>✅ Website Development<br>✅ Digital Marketing & SEO<br>✅ Branding & Design<br>✅ E-commerce Solutions<br>✅ AI Tools & Automation<br><br>Which one interests you?",
        
        about: "🏢 <strong>Sunbuzz Media</strong> - Delhi-based digital agency<br>✅ 4+ years experience<br>✅ 100+ happy clients<br>✅ Serving PAN India & Globally<br>✅ AI-powered solutions<br>✅ Full-service digital partner<br><br>Let's transform your business! 🚀",
        
        support: "🤝 <strong>We've got your back!</strong><br>✅ 24/7 Chat Support<br>✅ Phone: Mon-Fri 9 AM - 6 PM IST<br>✅ Dedicated account manager<br>✅ Regular updates & maintenance<br><br>What issue can we help you with?",
        
        process: "🔄 <strong>Our Process:</strong><br>1️⃣ Requirements & Discovery<br>2️⃣ Design & Planning<br>3️⃣ Development & Implementation<br>4️⃣ Testing & Quality Check<br>5️⃣ Launch & Deployment<br>6️⃣ Ongoing Support<br><br>Transparent & collaborative every step!",
        
        timeline: "⏱️ <strong>Quick Setup!</strong><br>⚡ Most projects: 2-3 weeks<br>⚡ Setup: 2-3 hours<br>⚡ Quick fixes: 24-48 hours<br>⚡ Custom projects: Varies<br><br>We prioritize speed without compromising quality!",
        
        quality: "⭐ <strong>Why Choose Sunbuzz Media?</strong><br>✨ AI-powered solutions<br>✨ Affordable pricing<br>✨ Fast turnaround<br>✨ 24/7 support<br>✨ Proven track record<br>✨ Personalized approach<br><br>Let's create something amazing together!",
        
        location: "📍 <strong>Based in Delhi, India</strong><br>We serve clients across:<br>✅ All major Indian cities (PAN India)<br>✅ USA, UK, Australia<br>✅ Middle East & Europe<br>✅ And many more countries!<br><br>Remote-first approach = seamless delivery worldwide!",
        
        general: "👋 <strong>Great question!</strong> I'm here to help!<br><br>You can ask me about:<br>💰 Pricing & Packages<br>🛠️ Our Services<br>📞 How to Contact Us<br>⏱️ Timeline & Process<br>🏢 About Sunbuzz Media<br><br>Or use the menu buttons above for guided navigation!"
    };

    return smartResponses[intent] || smartResponses['general'];
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = text;

    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = 'typingIndicator';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    messageDiv.appendChild(typingDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}


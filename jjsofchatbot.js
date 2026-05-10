// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Load FAQ data from JSON file
// function loadFAQData() {
//     try {
//         const dataPath = path.join(__dirname, 'dataoffile.json');
//         const rawData = fs.readFileSync(dataPath, 'utf8');
//         return JSON.parse(rawData);
//     } catch (error) {
//         console.error('Error loading FAQ data:', error);
//         return { faqs: [] };
//     }
// }

// // API endpoint to get all FAQs
// app.get('/api/faqs', (req, res) => {
//     const data = loadFAQData();
//     res.json(data);
// });

// // API endpoint to search FAQs by query
// app.post('/api/search', (req, res) => {
//     const { query } = req.body;
    
//     if (!query) {
//         return res.status(400).json({ error: 'Query is required' });
//     }

//     const data = loadFAQData();
//     const lowerQuery = query.toLowerCase();

//     // Search through FAQs
//     const matches = data.faqs.filter(faq => {
//         // Check if any keyword matches
//         return faq.keywords.some(keyword => 
//             lowerQuery.includes(keyword)
//         ) || 
//         lowerQuery.includes(faq.question.toLowerCase());
//     });

//     // If exact match found, return first match
//     if (matches.length > 0) {
//         res.json({ 
//             success: true,
//             answer: matches[0].answer,
//             matchedFAQ: matches[0]
//         });
//     } else {
//         // No match found
//         res.json({ 
//             success: false,
//             answer: "I couldn't find an answer to that. Would you like to contact support?"
//         });
//     }
// });

// // API endpoint to get FAQ by ID
// app.get('/api/faqs/:id', (req, res) => {
//     const { id } = req.params;
//     const data = loadFAQData();
    
//     const faq = data.faqs.find(f => f.id === parseInt(id));
    
//     if (faq) {
//         res.json({ success: true, faq });
//     } else {
//         res.status(404).json({ success: false, error: 'FAQ not found' });
//     }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.json({ status: 'Server is running ✓' });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Chatbot backend running at http://localhost:${PORT}`);
//     console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
//     console.log(`💬 Serve your HTML file in the /public folder`);
// });

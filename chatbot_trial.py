# #ml_backend.py
# # Python ML Backend for FAQ Chatbot using FastAPI
# # Implements: Semantic Similarity + Intent Classification + Entity Extraction

# import json
# import re
# import logging
# from typing import List, Dict, Optional

# import numpy as np
# import spacy
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# # app = FastAPI()

# # Setup logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize FastAPI app
# app = FastAPI(
#     title="FAQ Chatbot ML Backend",
#     description="ML-powered semantic search + intent classification for FAQ chatbot",
#     version="1.0.0"
# )

# # Enable CORS for your Node.js frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ============================================================================
# # 1. LOAD MODELS & DATA
# # ============================================================================

# # Load Sentence Transformer model for semantic similarity (lightweight & commercial-friendly)
# # all-MiniLM-L6-v2 is Apache-2.0 licensed, perfect for commercial use
# logger.info("Loading Sentence Transformer model...")
# embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# # Load spaCy model for NER (entity extraction)
# # Download first time: python -m spacy download en_core_web_sm
# try:
#     nlp = spacy.load("en_core_web_sm")
#     logger.info("spaCy model loaded successfully")
# except OSError:
#     logger.warning("spaCy model not found. Run: python -m spacy download en_core_web_sm")
#     nlp = None

# # Load FAQ data from JSON file
# def load_faq_data():
#     try:
#         with open('dataoffile.json', 'r') as f:
#             return json.load(f)
#     except FileNotFoundError:
#         logger.error("dataoffile.json not found!")
#         return {"faqs": []}

# faq_data = load_faq_data()
# faqs = faq_data.get("faqs", [])

# # Pre-compute embeddings for all FAQ questions (done once at startup)
# logger.info(f"Pre-computing embeddings for {len(faqs)} FAQs...")
# faq_embeddings = {}
# for faq in faqs:
#     question = faq.get("question", "")
#     faq_embeddings[faq["id"]] = embedding_model.encode(question, convert_to_numpy=True)

# logger.info(f"✓ Loaded {len(faqs)} FAQs with pre-computed embeddings")

# # ============================================================================
# # 2. DEFINE REQUEST/RESPONSE MODELS
# # ============================================================================

# class QueryRequest(BaseModel):
#     query: str
#     top_k: int = 3  # Return top 3 matching FAQs

# class IntentRequest(BaseModel):
#     query: str

# class SemanticResponse(BaseModel):
#     success: bool
#     query: str
#     best_match_id: int
#     best_match_question: str
#     answer: str
#     confidence: float
#     top_k_matches: List[Dict]

# class IntentResponse(BaseModel):
#     query: str
#     intent: str
#     confidence: float
#     entities: List[Dict]

# class HealthResponse(BaseModel):
#     status: str
#     faq_count: int
#     model_loaded: bool

# # ============================================================================
# # 3. SEMANTIC SIMILARITY (FAQ RETRIEVAL)
# # ============================================================================

# def semantic_search(query: str, top_k: int = 3) -> Dict:
#     """
#     Find the most similar FAQ to the user's query using semantic similarity.
#     This is the core ML task for FAQ chatbots.
#     """
#     if not faqs:
#         return {
#             "success": False,
#             "error": "No FAQs loaded",
#             "answer": "Sorry, our FAQ database is empty. Please contact support."
#         }

#     # Encode user query
#     query_embedding = embedding_model.encode(query, convert_to_numpy=True)

#     # Compute similarity with all FAQ questions
#     similarities = {}
#     faq_matrix = np.vstack(list(faq_embeddings.values()))
# def semantic_search(query: str, top_k: int = 3) -> Dict:
#     if not faqs:
#         return {
#             "success": False,
#             "error": "No FAQs loaded",
#             "answer": "Sorry, our FAQ database is empty."
#         }

#     # Encode user query
#     query_embedding = embedding_model.encode(query, convert_to_numpy=True)

#     # Stack FAQ embeddings into matrix
#     faq_ids = list(faq_embeddings.keys())
#     faq_matrix = np.vstack([faq_embeddings[fid] for fid in faq_ids])

#     # Compute cosine similarity
#     scores = cosine_similarity([query_embedding], faq_matrix)[0]

#     # Pair FAQ IDs with scores
#     similarities = list(zip(faq_ids, scores))
#     similarities.sort(key=lambda x: x[1], reverse=True)

#     best_faq_id, best_score = similarities[0]
#     best_faq = next(f for f in faqs if f["id"] == best_faq_id)

#     # Top-K matches
#     top_k_matches = []
#     for faq_id, score in similarities[:top_k]:
#         if score < 0.2:
#             continue
#         faq = next(f for f in faqs if f["id"] == faq_id)
#         top_k_matches.append({
#             "id": faq["id"],
#             "question": faq["question"],
#             "similarity_score": float(score),
#             "answer": faq["answer"]
#         })

#     # Low-confidence fallback
#     if best_score < 0.35:
#         return {
#             "success": True,
#             "query": query,
#             "best_match_id": -1,
#             "best_match_question": "",
#             "answer": "Sorry, I couldn't find a confident answer. Can you rephrase?",
#             "confidence": float(best_score),
#             "top_k_matches": top_k_matches
#         }

#     return {
#         "success": True,
#         "query": query,
#         "best_match_id": best_faq["id"],
#         "best_match_question": best_faq["question"],
#         "answer": best_faq["answer"],
#         "confidence": float(best_score),
#         "top_k_matches": top_k_matches
#     }


#     # Sort by similarity score (descending)
# sorted_faqs = sorted(similarities.items(), key=lambda x: x[1], reverse=True)

# if not sorted_faqs:
#     # return {
#     #         "success": False,
#     #         "error": "No FAQs available",
#     #         "answer": "FAQ database is empty."
#     # }

#     # Get best match
#     best_faq_id, best_score = sorted_faqs[0]
#     best_faq = next((faq for faq in faqs if faq["id"] == best_faq_id), None)

#     # Get top_k matches
#     top_k_matches = []
#     for faq_id, score in sorted_faqs[:top_k]:
#         faq = next((f for f in faqs if f["id"] == faq_id), None)
#         if faq and score > 0.2:  # Filter out very low similarity matches
#             top_k_matches.append({
#                 "id": faq["id"],
#                 "question": faq["question"],
#                 "similarity_score": float(score),
#                 "answer": faq["answer"]
#             })

#     return {
#         "success": True,
#         "query": query,
#         "best_match_id": best_faq["id"],
#         "best_match_question": best_faq["question"],
#         "answer": best_faq["answer"],
#         "confidence": float(best_score),
#         "top_k_matches": top_k_matches
#     }

# # ============================================================================
# # 4. INTENT CLASSIFICATION
# # ============================================================================

# # Define intents and their keywords (can be extended or trained)
# INTENT_KEYWORDS = {
#     "pricing": ["price", "cost", "how much", "rate", "charge", "plan", "subscription", "fee"],
#     "support": ["help", "issue", "problem", "error", "bug", "broken", "not working"],
#     "refund": ["refund", "money back", "return", "cancel", "refunds", "policy"],
#     "contact": ["contact", "reach", "email", "phone", "support", "address"],
#     "features": ["feature", "offer", "product", "service", "what do you", "capabilities"],
#     "hours": ["hours", "open", "available", "timing", "when", "schedule"],
#     "trial": ["trial", "free", "demo", "test", "no credit card"],
#     "api": ["api", "integration", "developers", "technical", "access", "documentation"],
#     "greeting": ["hello", "hi", "hey", "greetings", "thanks", "thank you"],
#     "general": ["general", "question", "info", "information", "tell me"]
# }

# def classify_intent(query: str) -> Dict:
#     """
#     Classify user intent based on keyword matching.
#     Can be upgraded to ML-based classification later.
#     """
#     query_lower = query.lower()
#     intent_scores = {}

#     # Score each intent based on keyword matches
#     for intent, keywords in INTENT_KEYWORDS.items():
#         score = sum(1 for keyword in keywords if keyword in query_lower)
#         if score > 0:
#             intent_scores[intent] = score

#     if not intent_scores:
#         return {
#             "query": query,
#             "intent": "general",
#             "confidence": 0.5,
#             "entities": []
#         }

#     # Get best intent
#     best_intent = max(intent_scores, key=intent_scores.get)
#     confidence = min(intent_scores[best_intent] / 5.0, 1.0)  # Normalize to 0-1

#     # Extract entities (if spaCy available)
#     entities = extract_entities(query)

#     return {
#         "query": query,
#         "intent": best_intent,
#         "confidence": float(confidence),
#         "entities": entities
#     }

# # ============================================================================
# # 5. ENTITY EXTRACTION
# # ============================================================================

# def extract_entities(query: str) -> List[Dict]:
#     """
#     Extract named entities and custom entities from user query.
#     Uses spaCy for NER + regex for custom patterns.
#     """
#     entities = []

#     if nlp:
#         # Use spaCy for NER
#         doc = nlp(query)
#         for ent in doc.ents:
#             entities.append({
#                 "text": ent.text,
#                 "label": ent.label_,
#                 "start": ent.start_char,
#                 "end": ent.end_char
#             })

#     # Custom entity extraction (email, phone, dates, plan names)
#     email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#     phone_pattern = r'\+?1?\d{9,15}'
#     plan_pattern = r'(pro|basic|premium|starter|enterprise)'

#     for match in re.finditer(email_pattern, query):
#         entities.append({
#             "text": match.group(),
#             "label": "EMAIL",
#             "start": match.start(),
#             "end": match.end()
#         })

#     for match in re.finditer(phone_pattern, query):
#         entities.append({
#             "text": match.group(),
#             "label": "PHONE",
#             "start": match.start(),
#             "end": match.end()
#         })

#     for match in re.finditer(plan_pattern, query, re.IGNORECASE):
#         entities.append({
#             "text": match.group(),
#             "label": "PLAN",
#             "start": match.start(),
#             "end": match.end()
#         })

#     return entities

# # ============================================================================
# # 6. API ENDPOINTS
# # ============================================================================

# @app.get("/api/health", response_model=HealthResponse)
# def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "ML backend running ✓",
#         "faq_count": len(faqs),
#         "model_loaded": embedding_model is not None
#     }

# @app.post("/api/search", response_model=SemanticResponse)
# def search_faq(request: QueryRequest):
#     """
#     Semantic search endpoint - finds best matching FAQ
#     Input: { "query": "How much does it cost?" }
#     Output: Best matching FAQ with confidence score
#     """
#     if not request.query.strip():
#         raise HTTPException(status_code=400, detail="Query cannot be empty")

#     result = semantic_search(request.query, top_k=request.top_k)

#     if not result["success"]:
#         raise HTTPException(status_code=500, detail=result["error"])

#     return SemanticResponse(**result)

# @app.post("/api/intent", response_model=IntentResponse)
# def classify_user_intent(request: IntentRequest):
#     """
#     Intent classification endpoint
#     Input: { "query": "I want a refund" }
#     Output: Classified intent + confidence + extracted entities
#     """
#     if not request.query.strip():
#         raise HTTPException(status_code=400, detail="Query cannot be empty")

#     result = classify_intent(request.query)
#     return IntentResponse(**result)

# @app.post("/api/combined")
# def combined_search(request: QueryRequest):
#     """
#     Combined endpoint - both semantic search + intent classification
#     Useful for more intelligent chatbot responses
#     """
#     if not request.query.strip():
#         raise HTTPException(status_code=400, detail="Query cannot be empty")

#     semantic_result = semantic_search(request.query, top_k=request.top_k)
#     intent_result = classify_intent(request.query)

#     return {
#         "query": request.query,
#         "semantic_search": semantic_result,
#         "intent_classification": intent_result,
#         "recommended_action": determine_action(intent_result["intent"])
#     }

# @app.get("/api/faqs")
# def get_all_faqs():
#     """Get all FAQs (for admin/dashboard)"""
#     return {
#         "total_faqs": len(faqs),
#         "faqs": faqs
#     }

# @app.get("/api/faqs/{faq_id}")
# def get_faq_by_id(faq_id: int):
#     """Get specific FAQ by ID"""
#     faq = next((f for f in faqs if f["id"] == faq_id), None)
#     if not faq:
#         raise HTTPException(status_code=404, detail="FAQ not found")
#     return faq

# # ============================================================================
# # 7. HELPER FUNCTIONS
# # ============================================================================

# def determine_action(intent: str) -> str:
#     """
#     Determine what action to take based on intent.
#     Can be extended with API calls, notifications, etc.
#     """
#     actions = {
#         "pricing": "Show pricing page",
#         "support": "Connect to support agent",
#         "refund": "Open refund form",
#         "contact": "Show contact info",
#         "features": "Show features page",
#         "hours": "Show business hours",
#         "trial": "Start free trial",
#         "api": "Show API documentation",
#         "greeting": "Continue conversation",
#         "general": "Search FAQ database"
#     }
#     return actions.get(intent, "Continue conversation")

# # ============================================================================
# # 8. RELOAD FAQs (for dynamic updates without restart)
# # ============================================================================

# @app.post("/api/reload-faqs")
# def reload_faqs():
#     """
#     Reload FAQ data and re-compute embeddings.
#     Call this after updating dataoffile.json
#     """
#     global faq_data, faqs, faq_embeddings

#     try:
#         faq_data = load_faq_data()
#         faqs = faq_data.get("faqs", [])

#         # Recompute embeddings
#         faq_embeddings = {}
#         for faq in faqs:
#             question = faq.get("question", "")
#             faq_embeddings[faq["id"]] = embedding_model.encode(question, convert_to_numpy=True)

#         logger.info(f"✓ Reloaded {len(faqs)} FAQs")
#         return {
#             "success": True,
#             "message": f"Loaded {len(faqs)} FAQs",
#             "faq_count": len(faqs)
#         }
#     except Exception as e:
#         logger.error(f"Error reloading FAQs: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error reloading FAQs: {str(e)}")

# # ============================================================================
# # 9. RUN SERVER
# # ============================================================================

# if __name__ == "__main__":
#     import uvicorn
#     print("\n" + "="*60)
#     print("🚀 ML FAQ Chatbot Backend Starting...")
#     print("="*60)
#     print(f"📡 Server: http://localhost:8000")
#     print(f"📚 Docs: http://localhost:8000/docs")
#     print(f"✓ Loaded {len(faqs)} FAQs")
#     print(f"✓ Model: Sentence Transformers (all-MiniLM-L6-v2)")
#     print("="*60 + "\n")

#     uvicorn.run(
#         app,
#         host="0.0.0.0",
#         port=8000,
#         reload=False  # Set to True for development
#     )

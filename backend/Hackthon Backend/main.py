import os
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

# Import your perfectly encapsulated underlying extraction engine
from pdf_engine import extract_pdf_text 

app = FastAPI(title="Debt Verification API")

# Enable CORS for seamless frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🧠 Configure the Gemini Super Brain (Debt Verification Edition)
# ==========================================
# [IMPORTANT] Paste your Google AI Studio API Key here
GOOGLE_API_KEY = "AIzaSyBwn62SdrBqk_E2mpwkM4vdeAdJfa0X03k"
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(
    'gemini-2.5-flash',
    generation_config={"response_mime_type": "application/json"}
)

def run_gemini_pipeline(raw_text: str) -> dict:
    """
    Highly specialized Gemini prompt perfectly mapped to the team's 
    'Debt Verification' whiteboard requirements.
    """
    safe_text = raw_text[:8000] 
    
    # This prompt strictly enforces the 4 tests and 3 file types from the whiteboard
    prompt = f"""
    You are an expert Real Estate Debt Verification Assistant.
    Analyze the extracted document text and return a JSON object with EXACTLY this structure:
    {{
        "document_type": "Classify as exactly one of: [Annual Secured Property Tax Bill, Preliminary Title Report, Payment Receipt, Unknown]",
        "verification_tests": {{
            "debt_and_liens": "Extract any recorded list of liens or debts, or null",
            "ownership": "Extract the property owner's name, or null",
            "physical_characteristics": "Extract any physical property characteristics, or null",
            "legal_description": "Extract the legal description of the property, or null"
        }},
        "specific_document_data": {{
            "AIN": "If Tax Bill, extract the Assessor's Identification Number (AIN), else null",
            "total_taxes_due": "If Tax Bill, extract the total current year taxes due, else null",
            "proof_of_payment": "If Payment Receipt, extract evidence of seller claiming paid off installments, else null"
        }}
    }}
    
    Document Text to analyze:
    {safe_text}
    """

    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        return {"error": "AI classification failed."}


# ==========================================
# 🌐 Your API Endpoint Layer
# ==========================================
@app.post("/api/upload-pdf")
async def handle_pdf_upload(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        
        # 1. Convert PDF to raw text using your engine
        engine_result = extract_pdf_text(pdf_bytes)
        
        if not engine_result.get("success") or not engine_result.get("raw_text"):
            return {
                "status": "error", 
                "message": "Failed to extract text from the PDF.",
            }
            
        extracted_text = engine_result["raw_text"]
            
        # 2. Pass text to the specialized Debt Verification AI
        pipeline_result = run_gemini_pipeline(extracted_text)
        
        # 3. Return the exact JSON structure the frontend expects
        return {
            "status": "success",
            "filename": file.filename,
            "analysis": pipeline_result
        }
            
    except Exception as e:
        return {"status": "error", "message": f"Internal Server Error: {str(e)}"}
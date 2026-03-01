import os
import google.generativeai as genai

# Insert your Gemini API Key here
GOOGLE_API_KEY = "INSERT_API_KEY_FROM_GCP_CONSOLE"
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash')

def generate_customer_document(ain, total_due, penalty, default_year):
    """
    Use real LA County data to prompt Gemini to generate a realistic 
    synthetic tax bill or lien document for testing purposes.
    """
    prompt = f"""
    You are an expert at generating realistic synthetic documents for software testing.
    I need you to generate the full TEXT of a "Los Angeles County Notice of Defaulted Property Taxes".
    
    You MUST include these exact details naturally in the document:
    - Assessor's Identification Number (AIN): {ain}
    - Total Taxes Due: ${total_due}
    - Penalty Amount: ${penalty}
    - Year of Default: {default_year}
    - Owner Name: (Make up a realistic name, e.g., John Doe)
    - Property Address: (Make up a realistic LA address)
    
    Make it look like an official government letter. Include headers, warnings about foreclosure, and legal jargon.
    Do not use markdown formatting, just output raw plain text that I can save to a file.
    """
    
    print(f"Asking Gemini to generate a realistic document for AIN {ain}...")
    response = model.generate_content(prompt)
    return response.text

# ==========================================
# 🚀 Simulate extracting 3 rows of real data from the LA County database.
# Using a mix of minor and severe default cases for testing the pipeline.
# ==========================================
la_county_database_rows = [
    {"ain": "1111-222-333", "total_due": "45000.00", "penalty": "4500.00", "default_year": "2018"}, # Severe default
    {"ain": "4444-555-666", "total_due": "2100.50", "penalty": "210.05", "default_year": "2023"},  # Minor default
    {"ain": "7777-888-999", "total_due": "125000.75", "penalty": "12500.00", "default_year": "2015"} # Extremely high risk
]

# Batch generate files and save them locally
for i, row in enumerate(la_county_database_rows):
    doc_text = generate_customer_document(row["ain"], row["total_due"], row["penalty"], row["default_year"])
    
    # Save the generated text as a .txt file
    filename = f"Customer_Profile_AIN_{row['ain']}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(doc_text)
    
    print(f"✅ Successfully generated file: {filename}")

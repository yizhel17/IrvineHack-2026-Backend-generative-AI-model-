import os
import random
import google.generativeai as genai

# Insert your Gemini API Key here
GOOGLE_API_KEY = "AIza_PASTE_YOUR_GEMINI_API_KEY_HERE_XXXXXXXX"
genai.configure(api_key=GOOGLE_API_KEY)

# Use flash for speed during the hackathon
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_specific_document(ain, row_data, doc_type, is_faked_risk):
    """
    Generates a specific document type. If is_faked_risk is True, it intentionally 
    injects fatal financial red flags to fail the underwriting test.
    """
    
    # 1. Define the base prompt based on the Document Type
    if doc_type == "Annual Secured Property Tax Bill":
        doc_context = f"Generate an 'Annual Secured Property Tax Bill'. Must include AIN: {ain}."
        if is_faked_risk:
            # FATAL RISK: Unpaid massive taxes
            instructions = f"INJECT RISK: Make the 'Total Taxes Due' a massive unpaid amount like $450,000. Add an extreme 'Penalty Amount' of $45,000 for the default year {row_data['default_year']}. Use aggressive warning language about property seizure."
        else:
            # PASS: Normal clean bill
            instructions = f"MAKE IT CLEAN: Total taxes due should be a normal amount like $3,500. Show $0 penalties. State clearly that the account is in good standing."

    elif doc_type == "Preliminary Title Report":
        doc_context = f"Generate a 'Preliminary Title Report' for real estate. Reference property AIN: {ain}."
        if is_faked_risk:
            # FATAL RISK: Severe Liens (Debts) on the property
            instructions = "INJECT RISK: Add a massive IRS Tax Lien of $150,000 and a Mechanic's Lien of $50,000. State clearly that the title is NOT clear and ownership is contested."
        else:
            # PASS: Clean Title
            instructions = "MAKE IT CLEAN: Explicitly state 'No active liens or encumbrances'. The title is completely clear and free of debt."

    elif doc_type == "Payment Receipt":
        doc_context = f"Generate an official 'Property Tax Payment Receipt'. Reference AIN: {ain}."
        if is_faked_risk:
            # FATAL RISK: Bounced Check / Rejected Payment
            instructions = "INJECT RISK: Explicitly state 'PAYMENT REJECTED - INSUFFICIENT FUNDS'. Show a failed payment attempt of $10,000. The current balance remains completely unpaid."
        else:
            # PASS: Paid in full
            instructions = "MAKE IT CLEAN: Show a successful payment of $3,500. Explicitly state 'Balance Paid in Full. Zero balance remaining'."
    
    else:
        return ""

    # 2. Assemble the final prompt
    prompt = f"""
    You are an expert at generating realistic synthetic legal documents for software testing.
    {doc_context}
    
    CRITICAL INSTRUCTIONS:
    {instructions}
    
    Make it look like a highly professional, official California document.
    Include made-up but realistic Owner Names and Addresses in Irvine, CA.
    Do not use markdown formatting (no asterisks). Output raw plain text only.
    """
    
    print(f"   -> Calling Gemini for {doc_type} (Risk Injected: {is_faked_risk})...")
    response = model.generate_content(prompt)
    return response.text

# ==========================================
# 🚀 THE LA COUNTY DATABASE SIMULATION
# Each row represents ONE property.
# ==========================================
la_county_database_rows = [
    {"ain": "1111-222-333", "default_year": "2018"}, 
    {"ain": "4444-555-666", "default_year": "2021"}
]

document_types = [
    "Annual Secured Property Tax Bill", 
    "Preliminary Title Report", 
    "Payment Receipt"
]

print("🚀 Starting the Underwriting Demo Data Generator...")

# Loop through each property in the database
for row in la_county_database_rows:
    ain = row["ain"]
    print(f"\n🏠 Processing Property AIN: {ain}")
    
    # Randomly pick ONE document type to be the "Bad Apple" (Faked Risk)
    the_bad_apple = random.choice(document_types)
    
    # Generate the 3 documents
    for doc_type in document_types:
        # If this doc type matches our chosen bad apple, flag it as True for risk
        is_risk = (doc_type == the_bad_apple)
        
        doc_text = generate_specific_document(ain, row, doc_type, is_risk)
        
        # Save the file with a clear naming convention so you and your frontend teammate know which is which!
        risk_label = "FAIL" if is_risk else "PASS"
        safe_doc_name = doc_type.replace(" ", "_")
        filename = f"{ain}_{safe_doc_name}_{risk_label}.txt"
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(doc_text)
            
        print(f"   ✅ Saved: {filename}")

print("\n🎉 All cross-validation test suites generated successfully!")
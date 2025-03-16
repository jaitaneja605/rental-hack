import google.generativeai as genai
import os
import requests
from dotenv import load_dotenv
from fpdf import FPDF
from flask import Flask, request, send_file, jsonify

app = Flask(__name__)

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

def download_image(url, filename):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filename, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
    else:
        raise Exception(f"Failed to download image from {url}")

def generate_contract(asset_id, asset_name, asset_type, city, state, price, description, owner_id, owner_name, owner_address, owner_phone, owner_email, tenant_id, tenant_name, tenant_address, tenant_phone, tenant_email, start_date, end_date):
    prompt = f"""
    Generate a legal rental contract for the asset '{asset_name}' (Asset ID: {asset_id}) of type {asset_type}. 
    The contract should include:
    - Location: {city}, {state}
    - Price: ${price}
    - Description: {description}
    
    | Field       | Details                |
    |------------|------------------------|
    | Asset ID   | {asset_id}             |
    | Asset Name | {asset_name}           |
    | Asset Type | {asset_type}           |
    | Owner ID   | {owner_id}             |
    | Owner Name | {owner_name}           |
    | Owner Address | {owner_address}     |
    | Owner Phone | {owner_phone}         |
    | Owner Email | {owner_email}         |
    | Tenant ID  | {tenant_id}            |
    | Tenant Name | {tenant_name}         |
    | Tenant Address | {tenant_address}   |
    | Tenant Phone | {tenant_phone}       |
    | Tenant Email | {tenant_email}       |
    | Start Date | {start_date}           |
    | End Date   | {end_date}             |
    
    Make sure to add ids as it is unique for each person and asset.
    The contract should follow standard legal terms and be professionally formatted. Leave space for signatures at the end.
    Do not use any unicode characters.
    """
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    
    return response.text

def create_pdf(contract_text, aadhar_path, pan_path, output_pdf):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # First Page: Contract Text
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, contract_text)
    
    # Add Signature Space
    pdf.ln(10)
    pdf.cell(0, 10, "Owner Signature: ________________________", ln=True)
    pdf.cell(0, 10, "Tenant Signature: ________________________", ln=True)
    
    # Second Page: Aadhaar Image
    pdf.add_page()
    pdf.image(aadhar_path, x=10, y=10, w=190)
    
    # Third Page: PAN Image
    pdf.add_page()
    pdf.image(pan_path, x=10, y=10, w=190)
    
    # Save PDF
    pdf.output(output_pdf)

@app.route('/generate_contract', methods=['POST'])
def generate_contract_api():
    try:
        data = request.json
        contract_text = generate_contract(
            asset_id=data["asset_id"], asset_name=data["asset_name"], asset_type=data["asset_type"],
            city=data["city"], state=data["state"], price=data["price"], description=data["description"],
            owner_id=data["owner_id"], owner_name=data["owner_name"], owner_address=data["owner_address"], owner_phone=data["owner_phone"], owner_email=data["owner_email"],
            tenant_id=data["tenant_id"], tenant_name=data["tenant_name"], tenant_address=data["tenant_address"], tenant_phone=data["tenant_phone"], tenant_email=data["tenant_email"],
            start_date=data["start_date"], end_date=data["end_date"]
        )
        
        aadhar_url = data["aadhar_url"]
        pan_url = data["pan_url"]
        aadhar_path = "aadhar.jpg"
        pan_path = "pan.jpg"
        
        download_image(aadhar_url, aadhar_path)
        download_image(pan_url, pan_path)
        
        output_pdf = "contract.pdf"
        create_pdf(contract_text, aadhar_path, pan_path, output_pdf)
        return send_file(output_pdf, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

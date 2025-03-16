# SafeRent - Rental Agreement Risk Detector & Contract Generator

This project is a web application designed to help tenants and landlords analyze rental agreements for hidden fees, unfair clauses, and legal risks. The app uses Natural Language Processing (NLP) to evaluate contracts and offers suggestions for fairer terms. It also features a **Tenant & Landlord Trust Score** system based on rental history, payment behavior, and property care, helping users make informed decisions. 

Additionally, it includes a **contract generation** feature using the **Google Gemini API**, allowing users to create legally sound rental contracts.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Contract Creation with Gemini API](#contract-creation-with-gemini-api)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Future Prospects](#future-prospects)

---

## Project Overview

Rental Agreement Risk Detector is designed to help tenants and landlords ensure fair rental agreements. The application:
- Analyzes rental agreements for risks.
- Provides suggestions for fairer contract terms.
- Features a **Tenant & Landlord Trust Score** system for better decision-making.
- Allows **contract generation** using the **Google Gemini API** to create legally sound rental contracts based on provided data.

---

## Tech Stack

- **Frontend:**
  - React
  - React Router
  - Vite (for fast builds)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (for database storage)
  - **Google Gemini API** (for generating rental contracts)
  - **FPDF** (for PDF document generation)

- **DevOps:**
  - GitHub Actions (for CI/CD)
  
- **Other Tools:**
  - CORS for cross-origin resource sharing
  - Dotenv for environment variable management

---

## Features

- **Contract Analysis**: Automatically detects hidden fees, unfair clauses, and legal risks in rental agreements.
- **Contract Generation using Gemini API**: Users can generate customized rental contracts with legal clauses using **Google Gemini API**. This feature generates contracts based on asset details, owner and tenant information, and rental terms.
- **Tenant & Landlord Trust Score**: A scoring system based on past rental behavior (fairness, property care, payment history).
- **PDF Generation with FPDF**: Generates a downloadable PDF with contract details, including signatures and document verification images.
- **Notifications**: Real-time updates and alerts for both landlords and tenants.

---

## Contract Creation with Gemini API

The **Gemini API** is used to generate **custom rental contracts** by processing input data such as:

- **Asset details**: Name, type, price, location.
- **Tenant and Landlord details**: Names, addresses, phone numbers, and email.
- **Rental terms**: Contract start and end dates, terms, and conditions.

### How it Works:
1. **Data Input**: Users provide necessary details (asset, tenant, landlord, and terms).
2. **Contract Generation**: The Gemini API generates a legal contract, formatted with all provided details.
3. **PDF Creation**: The contract is generated as a PDF using **FPDF**, with options to add Aadhaar and PAN images for verification.

This feature ensures that users can easily generate legal rental contracts with standard terms, removing ambiguities or unfair clauses.

---

## Installation

To set up this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/rental-agreement-risk-detector.git
   cd rental-agreement-risk-detector
   ```

2. **Install Backend Dependencies**:
   In the backend folder:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   In the frontend folder:
   ```bash
   cd frontend
   npm install
   ```

4. **Set up Environment Variables**:
   Copy `.env.example` to `.env` and modify the environment variables according to your setup:
   ```bash
   cp .env.example .env
   ```

5. **Run the Backend**:
   In the backend folder, start the server:
   ```bash
   npm start
   ```

6. **Run the Frontend**:
   In the frontend folder, start the React application:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### `/api/v1/users`
- **POST**: Create a new user
- **GET**: Get user details

### `/api/v1/assets`
- **POST**: Add a new rental asset
- **GET**: List all rental assets

### `/api/v1/generate_contract`
- **POST**: Generate a rental contract using the Gemini API (Accepts JSON data with asset and tenant/landlord details)
- **Response**: PDF contract file

---

## Screenshots

![WhatsApp Image 2025-03-16 at 20 16 08_cb836206](https://github.com/user-attachments/assets/bf03da33-d1f2-4dd7-a1bb-c7e95e012a9e)
![WhatsApp Image 2025-03-16 at 20 16 32_b42928c8](https://github.com/user-attachments/assets/55e7c404-d633-4ac5-91fc-0aefc04daa8b)
![WhatsApp Image 2025-03-16 at 20 17 47_0ebf9674](https://github.com/user-attachments/assets/825f199f-d669-4a42-9624-93a076b28e91)
![WhatsApp Image 2025-03-16 at 20 18 13_1d6463b1](https://github.com/user-attachments/assets/a03bb171-7a8d-4ac1-94e8-2729359c02c4)
![WhatsApp Image 2025-03-16 at 20 18 43_8b745c31](https://github.com/user-attachments/assets/90e84a6c-5d23-467c-8e00-86d5dc7e626b)
![WhatsApp Image 2025-03-16 at 20 18 54_4bc2631f](https://github.com/user-attachments/assets/b7be388d-bf72-40ec-9587-e3c86b44756f)
![WhatsApp Image 2025-03-16 at 20 19 45_2ea7d906](https://github.com/user-attachments/assets/b86160d6-b45f-41f8-bc75-cb6da0dd5eb8)
![WhatsApp Image 2025-03-16 at 20 21 04_65437a37](https://github.com/user-attachments/assets/4e0c42ad-70b1-46bb-a37b-13e95bb642b1)
![WhatsApp Image 2025-03-16 at 20 21 27_97cc1e50](https://github.com/user-attachments/assets/229c0fd6-7f64-4cb4-9563-e5b965fc41ca)
![WhatsApp Image 2025-03-16 at 20 22 02_52f4655e](https://github.com/user-attachments/assets/4513ddf9-24ef-4c29-bd51-3e5084a99fca)
![WhatsApp Image 2025-03-16 at 20 24 07_751c6e70](https://github.com/user-attachments/assets/b4905515-aed7-4219-99ca-35d373b27f54)
![WhatsApp Image 2025-03-16 at 20 26 50_6fc2285d](https://github.com/user-attachments/assets/e871e91f-1b36-4184-8a8c-0b950c5a5a87)
![WhatsApp Image 2025-03-16 at 20 27 21_fc6221d1](https://github.com/user-attachments/assets/125ac874-f650-44fe-9b33-511d84ee11f5)
![WhatsApp Image 2025-03-16 at 17 56 53_971071af](https://github.com/user-attachments/assets/8243ebb4-1581-4b70-8c4f-4d798052dc50)
![WhatsApp Image 2025-03-16 at 17 58 16_38140503](https://github.com/user-attachments/assets/15800289-8a81-4cde-8f0f-d92ca6e038a1)




---

## Contributing

We welcome contributions! To contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- Thanks to [Google Gemini](https://cloud.google.com/ai) for generative AI tools used in contract creation.
- Thanks to [FPDF](http://www.fpdf.org/) for PDF document generation.

---

## Future Prospects

- **DigiLocker Integration**: Integration with DigiLocker to store and verify legal documents digitally. Users will be able to upload, store, and access contracts securely via DigiLocker for easier document management and sharing.
  
- **Payment Gateway Integration**: We plan to integrate a payment gateway (such as **Razorpay**, **Stripe**, or **PayPal**) to allow tenants to pay their rent directly through the platform. This will simplify the payment process and ensure transparency for both tenants and landlords.

- **AI-powered Risk Predictions**: Utilizing machine learning models to predict potential risks or disputes in rental agreements based on historical contract data and user feedback. This feature would offer preemptive alerts for both tenants and landlords.

- **Automated Dispute Resolution**: The platform could use AI to suggest solutions to potential rental disputes based on historical data, rental terms, and feedback, helping users find fair resolutions to issues.

---

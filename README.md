# Prescription Platform

A full-stack web application for doctor–patient consultations, prescription management, and automatic PDF generation.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup & Running Locally](#setup--running-locally)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots / Demo](#screenshots--demo)
- [Credits](#credits)
- [License](#license)

---

## Project Overview

This platform enables patients to browse doctors, book consultations, submit medical history, make payments (UPI QR), and receive prescriptions as downloadable PDFs. Doctors can manage their dashboard, write prescriptions, generate PDFs, and send them to patients.

---

## Features

### 👨‍⚕️ Doctor
- Signup/login with profile (name, specialty, experience, photo)
- View pending & completed consultations
- Create prescriptions
- Edit & resend prescriptions
- Generate PDF prescriptions
- Cloud-based PDF storage (Cloudinary)

### 👤 Patient
- Signup/login with profile (name, age, surgery history, illnesses)
- Browse list of doctors
- Multi-step consultation form:
  - Step 1: Current illness & surgery details
  - Step 2: Family medical history
  - Step 3: UPI QR-based payment (dummy QR)
- View consultation status

### 🔧 System Features
- JWT Authentication
- Role-based access
- PDF generation using PDFKit
- File uploads using Cloudinary
- QR Code generation
- MongoDB database with Mongoose schemas
- Responsive UI (React + Tailwind + Framer Motion)

---

## Technology Stack

### Frontend:
- React
- React Router DOM
- Tailwind CSS
- Framer Motion
- Lucide-react icons
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB / Mongoose
- JWT Authentication
- Cloudinary
- Multer
- PDFKit
- QRCode library

---

## Project Structure

```bash
Prescription-Platform/
│
├── backend/
|   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── utils/
        ├── App.jsx
        └── main.jsx



Environment Variables
Create backend/.env:
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Setup & Running Locally
1. Clone Repository
git clone https://github.com/biradarvivek/Prescription-Platform.git
cd Prescription-Platform

2. Setup Backend
cd backend
npm install
npm run dev

Backend runs on:
http://localhost:5000

3. Setup Frontend
cd ../frontend
npm install
npm start

Frontend runs on:
http://localhost:3000

API Endpoints
Auth
POST /api/auth/doctor/signup
POST /api/auth/patient/signup
POST /api/auth/login

Consultations
POST /api/consultations
GET  /api/consultations/my-consultations
GET  /api/doctors/consultations
GET  /api/consultations/payment-qr

Prescriptions
POST /api/prescriptions
GET  /api/prescriptions/consultation/:consultationId
GET  /api/prescriptions/:id/generate-pdf
PUT  /api/prescriptions/:id
DELETE /api/prescriptions/:id

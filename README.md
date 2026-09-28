# 🏥 CareSphere - Healthcare Geo-Fence Management System

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**A next-generation healthcare platform for real-time patient geo-fence perimeter tracking, breach alert management, and clinical administration.**

[Features](#-features) • [Installation](#-installation-guide) • [Document Export](#-document-export-support) • [Architecture](#-project-architecture) • [Security](#-security--compliance)

</div>

---

## 📌 Overview

**CareSphere** empowers medical administrators, nursing coordinators, and patient emergency dispatch teams to monitor patient boundaries, set customizable geo-fence zones, manage family member contacts, track breach alerts in real time, and export HIPAA-compliant audit reports.

---

## ✨ Key Features

- 🚨 **Real-Time Geo-Fence Perimeter Monitoring**: Set boundary radiuses and trigger automated emergency breach alerts.
- 🔔 **Header Bell Icon Notification Routing**: Tap the header notification bell from anywhere in the application to instantly jump to the Alert Management dashboard.
- 👤 **Enhanced Admin Profile Hub**:
  - Hero header with role tags, status pills, and quick stats (Monitored Patients, Active Geofences, Resolved Alerts, Security Clearance).
  - Tabbed management for Personal Details, Security & 2FA, System Permissions, and Notification Preferences.
- 🌓 **Dark & Light Mode Theme Switcher**:
  - Live theme toggle with visual preview cards in Settings.
  - Full system-wide high-contrast Dark Theme with persistent `localStorage` state.
- 📄 **Multi-Format Document Export**:
  - One-click export of Patient Registries, Alert Logs, Geofence Zones, and System Audit Reports into **PDF (`.pdf`)**, **Word (`.docx`)**, and **Excel (`.xlsx`)**.
- 🛡️ **Comprehensive Input Validation**:
  - Strict phone number validation enforcing a minimum of **10 digits**.
  - Verified email structure, minimum 2-character names, and secure password validation.
- 📐 **Clean Layout & Title Overlap Fix**:
  - Dedicated top navigation headers for smooth, overlap-free back navigation.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 | High-performance SPA frontend |
| **Styling** | Vanilla CSS3 | Modern CSS variables, glassmorphism, responsive grids |
| **Icons & Visuals** | Lucide React | Clean, intuitive vector icon set |
| **Document Exports** | `jspdf`, `jspdf-autotable`, `xlsx` | PDF table rendering & native Excel workbook creation |
| **Backend API** | FastAPI + Python 3.11 | Asynchronous, OpenAPI-documented Python backend |
| **Database ORM** | SQLAlchemy + SQLite / PostgreSQL | Relational schema management with CASCADE relations |

---

## 📁 Project Architecture

```
healthcare-geofence/
├── backend/
│   ├── app/
│   │   ├── database.py         # DB connection & session factory
│   │   ├── main.py             # FastAPI server initialization
│   │   ├── models/             # SQLAlchemy DB schemas (Patient, Alert, Location, Family)
│   │   ├── routes/             # RESTful API Endpoints
│   │   └── schemas/            # Pydantic data validation schemas
│   └── requirements.txt
└── frontend/
    ├── public/                 # Static web assets
    ├── src/
    │   ├── components/         # Reusable React UI components
    │   │   ├── DashboardLayout.jsx
    │   │   ├── PatientDetails.jsx
    │   │   └── PatientForm.jsx
    │   ├── pages/              # Primary route view pages
    │   │   ├── AlertsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── SettingsPage.jsx
    │   │   └── PatientsPage.jsx
    │   ├── services/
    │   │   └── api.js          # Axios API HTTP client
    │   └── utils/
    │       ├── exportUtils.js  # PDF, DOCX, and Excel export generators
    │       └── validation.js   # Phone, email, name, and password validators
    ├── App.css                 # Global stylesheets & Dark Mode overrides
    └── package.json
```

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** v3.10+

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation will be live at `http://localhost:8000/docs`*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```
*Frontend application will be live at `http://localhost:5173`*

---

## 📊 Document Export Support

| Document Type | PDF Export (`.pdf`) | Word Export (`.docx`) | Excel Export (`.xlsx`) |
| :--- | :---: | :---: | :---: |
| **Patient Master Registry** | ✅ Included | ✅ Included | ✅ Included |
| **Geo-Fence Alert Logs** | ✅ Included | ✅ Included | ✅ Included |
| **Monitored Zone Coordinates** | ✅ Included | ✅ Included | ✅ Included |
| **Full Master System Audit** | ✅ Included | ✅ Included | ✅ Included |

---

## 🔒 Security & Compliance

- **HIPAA Compliance Readiness**: End-to-end data validation and audit timestamping.
- **Input Sanitization**: Client & server validation preventing malicious injections.
- **Role-Based Access Control**: Configurable security clearance levels for clinical staff.

---

<div align="center">

Made with ❤️ for Healthcare Excellence • © 2026 CareSphere Management

</div>

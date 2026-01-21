<p align="center">
  <a href="https://www.unicam.it/">
    <img alt="Unicam Logo" src="./docs/logo-unicam.svg">
  </a>
</p>

# PhysioFitness System

**PhysioFitness** is a comprehensive, full-stack web application designed to modernize physiotherapy clinic operations. It integrates Role-Based Access Control (RBAC), AI-driven demand forecasting, and smart scheduling into a unified platform.

The system is split into two interfaces:
1.  **Public Patient Portal:** A responsive landing page for patients to discover services and request appointments.
2.  **Staff Dashboard:** A secure internal tool for physiotherapists and admins to manage patients, billing, and clinical data.

---

## Key Features

### Clinic Management
* **Smart Scheduling:** Interactive Drag-and-Drop Calendar for appointment management.
* **Patient Records:** Centralized database for personal info, medical history, and insurance details.
* **Role-Based Access:** Distinct permissions for **Admins** (Full Access), **Physiotherapists** (Limited), and **Patients**.

### AI & Analytics
* **Demand Forecasting:** Machine Learning (Heuristic) engine predicts patient volume for the next 7 days.
* **Risk Analysis:** Automated risk scoring for patient "No-Shows" based on distance, age, and history.
* **Business Intelligence:** Real-time visualization of monthly revenue, active patients, and appointment distribution.

### Security & Architecture
* **Authentication:** JWT.
* **Data Integrity:** PostgreSQL database with normalized 3NF schema.
* **API-First Design:** Fully documented REST API (Swagger).

---

## Technology Stack

### Backend
* **Framework:** Django 5.x & Django REST Framework (DRF)
* **Database:** PostgreSQL
* **AI/ML:** Python (Scikit-Learn logic integration)

### Frontend
* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API

---

## Installation Guide

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)
* PostgreSQL

### 1. Backend Setup
```bash
cd backend
python -m venv venv
```
for Windows:
```bash
venv\Scripts\activate
```
for Mac/Linux:
```bash
source venv/bin/activate
```
then run these commands:
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Notifications and Reminders
The system is implemented with Celery to send email notifications and reminders to users, based on their role/job.
To run (in development environment), it’s important to first use the Celery Worker
```bash 
celery -A clinic backend worker -l info -P gevent
```
that will take care
of sending confirmation emails and reminders for the appointments.
Then, the system will need Celery Beat 
```bash
celery -A clinic backend beat -l info)
 ```
which will silently trigger the tasks if they satifsy the requirements.

## Quick Start (Demo Data with PostgreSQL)

To quickly set up the system with users, patients, and appointments for testing:

1.  **Install Dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Database Configuration:**
    Ensure PostgreSQL is running on your machine, so create a new database in it:
    ```sql
    CREATE DATABASE physiofitness_db;
    ```
    Then, in the `/backend` folder create a `.env` file (copy from `.env.example`)
    and fill in your PostgreSQL credentials.
    Run migrations after:
    ```bash
       python manage.py migrate
    ```
    Then create your own superuser account: 

    ```bash
       python manage.py createsuperuser
    ```
    You can now run the application normally (with `python manage.py runserver`)
3. **Load Demo Data:**
    If you want to populate the system with mock patients and appointments after creating your admin:
    ```bash
       python manage.py setup_demo
    ```
    
    Login Credentials for already created users:
    - Admin: admin@test.com / password123
    - Physiotherapist: physio@test.com / password123
    - Receptionist: reception@test.com / password123
    - Patient: patient1@test.com / password123
---
This project is developed for academic purposes.
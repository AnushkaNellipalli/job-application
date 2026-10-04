# Job Application Website

A multi-page job application platform with structured navigation, interactive UI components, and form-based interactions for submitting applications.

🔗 **Live Demo:** https://jobapplication-nu.vercel.app/
📂 **Repository:** https://github.com/AnushkaNellipalli/jobapplication

<!-- Add a screenshot or GIF of the main page here once available -->
<!-- ![Job Application Homepage](./screenshots/homepage.png) -->

## Overview

This project simulates a real-world job application platform, built to practice structuring multi-page frontend flows, handling form input, and organizing a user journey from browsing to submitting an application.

## Features

- Multi-page structure with clear, organized navigation
- Form-based interactions including input validation and submission handling
- Interactive UI components for a smooth application flow
- Responsive layout tested across different screen sizes

## Tech Stack

- **JavaScript** — application logic and interactivity
- **HTML5 & CSS3** — markup and styling
- **Vercel** — deployment and hosting

## Getting Started

Clone the repository and run it locally:

```bash
git clone https://github.com/AnushkaNellipalli/jobapplication.git
cd jobapplication
```

If the project uses a bundler (e.g. npm/Vite), install and run:

```bash
npm install
npm start
```

Otherwise, simply open `index.html` in your browser.

## Project Structure

```
jobapplication/
├── index.html
├── css/
├── js/
└── README.md
```

*(Update this structure to match your actual folder layout.)*

## What I Learned

- Structuring multi-page frontend navigation without a framework
- Building form validation and handling submission states
- Practicing responsive layout techniques across screen sizes

## Author

**Anushka Nellipalli**
- GitHub: [@AnushkaNellipalli](https://github.com/AnushkaNellipalli)
- LinkedIn: [anushka-nellipalli](https://linkedin.com/in/anushka-nellipalli-277a213ab)
- Portfolio: [anushkanellipalli.github.io/portfolio](https://anushkanellipalli.github.io/portfolio/)


---

## Running with the Django backend

The React app now loads jobs and handles sign-up / login through the Django API in `backend/`.
Run both at the same time in two terminals:

```bash
# Terminal 1 - backend (http://127.0.0.1:8000)
cd backend
python -m venv venv && source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_jobs
python manage.py runserver

# Terminal 2 - frontend (http://localhost:5173)
npm install
npm run dev
```

If the API is not on `http://127.0.0.1:8000`, copy `.env.example` to `.env` and set `VITE_API_URL`.
Before deploying, add your frontend's URL to `CORS_ALLOWED_ORIGINS` (see `backend/.env.example`).

Connected to the API: job list + search, job details, similar/recent jobs, register, login, logout.
Still local for now: the apply form submit, My Applications, and Profile.
`src/data/jobs.js` is no longer imported anywhere and can be deleted.

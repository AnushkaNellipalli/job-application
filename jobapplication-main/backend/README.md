# JobPortal backend (Django REST Framework)

API for the Vite + React job portal. Lives in `backend/`, next to the frontend's `src/`.

## Run it

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_jobs          # loads the 6 sample jobs from src/data/jobs.js
python manage.py createsuperuser    # optional: gives you /admin/ and staff rights
python manage.py runserver          # http://127.0.0.1:8000
python manage.py test               # 39 tests
```

## Endpoints

| Method | URL | Auth | Used by |
|---|---|---|---|
| GET | `/api/jobs/` | public | `Jobs.jsx` (supports `?search=`, `?employmentType=`, `?location=`, `?company=`, `?ordering=`, `?page=`, `?page_size=` up to 50) |
| GET | `/api/jobs/{id}/` | public | `JobDetailsCard.jsx` |
| GET | `/api/jobs/{id}/similar/?limit=3` | public | `Sidebar.jsx` "Similar Jobs" |
| GET | `/api/jobs/recent/?limit=5` | public | `Sidebar.jsx` second list |
| POST/PUT/PATCH/DELETE | `/api/jobs/` , `/api/jobs/{id}/` | staff | admin tooling |
| POST | `/api/auth/register/` | public | future Register page |
| POST | `/api/auth/login/` | public | future Login page |
| POST | `/api/auth/token/refresh/` | refresh token | axios/fetch 401 handler |
| POST | `/api/auth/logout/` | refresh token | Navbar "Logout" |
| GET | `/api/auth/me/` | Bearer token | Profile / navbar |

### Auth examples

```bash
# Register (also returns tokens, so the user is signed in straight away)
curl -X POST http://127.0.0.1:8000/api/auth/register/ -H 'Content-Type: application/json' \
  -d '{"fullName":"Jane Doe","email":"jane@example.com","password":"Sup3r-Secret-Pass!","confirmPassword":"Sup3r-Secret-Pass!"}'

# Login -> {"access": "...", "refresh": "...", "user": {...}}
curl -X POST http://127.0.0.1:8000/api/auth/login/ -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"Sup3r-Secret-Pass!"}'

# Call a protected endpoint
curl http://127.0.0.1:8000/api/auth/me/ -H 'Authorization: Bearer <access>'
```

Access tokens last 30 minutes, refresh tokens 7 days. Refreshing rotates the refresh
token (the old one stops working), and logout revokes it.

## Planned next apps (not built yet)
`applications` (ApplyForm submit + "My Applications" + saved jobs) and `profiles` (Profile page).

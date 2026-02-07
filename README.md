# edweb

Instructor dashboard: course management (create, list, filter by status, publish/draft) with a FastAPI backend and React frontend.

## Backend (FastAPI + SQLite)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: `http://localhost:8000`  
- `POST /courses` — create course (title, image_url optional; status defaults to draft)  
- `GET /courses` — list all  
- `GET /courses?status=draft` | `GET /courses?status=published` — filter  
- `PUT /courses/{id}/publish` | `PUT /courses/{id}/draft` — update status  

If you had an older DB schema, delete `backend/test.db` so the app can create the new `courses` table on startup.

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`  
- **My Courses**: list from API, filter tabs (All / Published / Drafts / Archived), **New Course** → POST, card menu **Publish** / **Set to Draft** → PUT.  
- **Dashboard** “Create Course” links to My Courses.
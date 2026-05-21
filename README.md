# Xplorer

Xplorer is a social discovery platform for finding like-minded people online.  
It combines a FastAPI backend with WebSocket-powered matchmaking and chat, plus a React/Vite frontend for authentication, profiles, real-time rooms, and messaging.

> ## Before you proceed
> The project is currently under development and may require environment configuration before use.  
> Use the `DevNotes.md` file for ongoing implementation details and developer decisions.  
>
> ### [`DevNotes.md`](./DevNotes.md)

## 

## Key Features

- JWT-based authentication and user profile management.
- Real-time matchmaking and room discovery via WebSockets.
- Public rooms and private chat support.
- Redis-powered connection management and session state.
- PostgreSQL-backed user data storage.
- Docker Compose setup for backend, frontend, database, and Redis.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, asyncpg, Redis, Uvicorn
- Frontend: React, Vite, React Router, Axios, React Toastify
- Persistence: PostgreSQL, Redis
- Containerization: Docker, Docker Compose

## Getting Started

### Prerequisites

- **Running with Docker Compose**
    - Docker
    - Docker Compose
- **Running Locally** 
    - Node.js (frontend development)
    - Python 3.11+ (backend development)
    - PostgreSQL (primary database)
    - Redis (secondary development)

### Environment Variables

1. Use `example.env` file in the project root.  
2. If you're running locally, you also need to use the `example.env` in `/frontend`


## Run with Docker Compose

Start the full stack:

```bash
docker compose up --build
```

After startup:

- Frontend will be available at `http://localhost:5000`
- Backend API will be available at `http://localhost:8000`

## Run Locally

### Backend

From the project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

## Backend Endpoints

The backend exposes:

- `GET /` – health check
- Auth routes under `/auth` for sign-up and login
- User routes under `/user` for profile access
- WebSocket routes for matchmaking and public rooms

FastAPI automatic docs are available when the backend is running:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Frontend Routes

- `/` – home page
- `/auth` – authentication and registration pages
- `/chat/:roomId` – chat room interface

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

If you find this project useful and want to support its development:

[![Buy Me A Coffee](./.assets/bmc-button.svg)](https://buymeacoffee.com/parteek)
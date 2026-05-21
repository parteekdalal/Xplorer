# Dev Notes
This project is a work in progress — docs will catch up eventually.
You are very welcome to contribute, *financially or keyboardingly*.

Thank You

## Goals

### PHASE I
- ✅ User Authentication
- ✅ Xplore People
- ✅ Public Rooms
- ✅ Simple Chat UI

### PHASE II
- Guest Logins
- Profiles
- Add Friends
- Feed

### PHASE III
- Moderations & Guidelines Upgrade

> More phases to be defined as the project evolves.

## Repository Layout

- `backend/`
  - `Dockerfile.backend` – backend image build instructions
  - `main.py` – entry point for running the backend with Uvicorn
  - `requirements.txt` – Python dependencies
  - `app/` – application package
    - `core/` – configuration, logging, middleware
    - `database/` – database and auth helpers
    - `models/` – ORM models
    - `routers/` – REST and WebSocket API endpoints
    - `websocket/` – connection manager and real-time logic
- `frontend/`
  - `Dockerfile.frontend` – frontend image build instructions
  - `src/` – React application source
  - `public/` – static frontend assets
- `docker-compose.yml` – service orchestration for development and deployment
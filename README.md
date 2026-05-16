# TaskForge

Monorepo for a task management app with Android client and Express/MongoDB backend.

## Project Structure

task-manager-api/
  android/        # Android app (client)
  backend/        # Express + MongoDB API

## Tech Stack

- **Mobile:** Android (Kotlin)
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud instance)

## Backend Setup

### 1) Navigate to backend

```bash
cd backend
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskforge
JWT_SECRET=replace_with_a_secure_secret
```

### 4) Run the backend

```bash
npm run dev
```

If your project doesn’t have a `dev` script yet:

```bash
npm start
```

## API Base URL

- Local: `http://localhost:5000`

## Current Backend Modules

- Auth
- Users
- Tasks

## Git & Branching

- Default branch: `main`
- Create feature branches from `main` (example: `feat/auth-login`)

## Roadmap

- [ ] Complete Android app scaffolding
- [ ] Connect Android app to backend auth APIs
- [ ] Integrate task CRUD flows
- [ ] Add request validation and centralized error handling
- [ ] Add tests for routes/controllers

## Contributing

1. Create a branch from `main`
2. Make focused commits with clear messages
3. Open a pull request

## License

MIT

# StudyUp

A web app to organize and track your learning.

## Stack

- **Frontend** — React, Vite, Apollo Client (GraphQL)
- **Backend** — Express, Apollo Server, MongoDB, JWT, Resend (email OTP)

## Setup

Copy the example env files and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Run

### Backend
```bash
cd backend && npm install && npm start
```

### Frontend
```bash
cd frontend && npm install && npm run dev
```

### Tests

```bash
cd backend
npm test                    # all tests
npm run test unit           # unitary tests
npm run test integration    # integration tests
```

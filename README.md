# Intiger

Full-stack web app with a Node/Express backend and a React (Vite) frontend.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
- Frontend: React, Vite, React Router, Tailwind
- Email: Resend
- Media: Cloudinary

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local) or a hosted MongoDB URI

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Create a backend .env file in [backend](backend) with the following keys:

```bash
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
RESEND_API=your_resend_api_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# Optional: used only when NODE_ENV=production
DBURL=mongodb+srv://user:pass@host/dbname
```

MongoDB local default: when NODE_ENV is not production, the app connects to mongodb://127.0.0.1:27017/intiger.

## Running the app

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

By default, the frontend runs on http://localhost:5173 and the backend on http://localhost:4000.

## Build (frontend)

```bash
cd frontend
npm run build
```

## Notes

- Auth cookies are configured with SameSite=none and Secure=true. For local development, you may need HTTPS or adjust cookie settings.

# CareerBridge AI

CareerBridge AI is a full-stack career and job eligibility portal for students.
It includes smart job matching, government and MNC job browsing, eligibility analysis, resume feedback, and admin management.

## Features
- JWT authentication with student and admin roles
- Student profile management with skills, CGPA, branch, college, backlog, and graduation year
- Government and MNC job catalog
- Smart eligibility checker and match percentage calculation
- AI career recommendation and resume analyzer
- Admin user and job management
- Modern responsive React UI with Tailwind CSS

## Folder structure
- `server/` - Express backend, MongoDB models, API routes
- `client/` - React frontend built with Vite and Tailwind CSS

## Setup

### Backend
1. Navigate to `server`
2. Copy `.env.example` to `.env`
3. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`
4. Install packages:
   ```bash
   npm install
   ```
5. Seed sample jobs:
   ```bash
   npm run seed
   ```
6. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to `client`
2. Install packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Notes
- The backend API listens on `http://localhost:5000`
- The frontend runs on `http://localhost:5173`
- Use an admin user by manually setting `role: 'admin'` in MongoDB or extend registration logic

## Environment variables
- `server/.env`
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL`
- `client/.env` (optional)
  - `VITE_API_URL=http://localhost:5000/api`

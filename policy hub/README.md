# PolicyHub

An insurance policy and claims management web application built with the MERN stack.

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken) for authentication
- bcryptjs for password hashing
- Multer for file uploads

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- Tailwind CSS
- Recharts (admin analytics charts)

---

## Folder Structure

```
policy hub/
├── server/                  Express API
│   ├── config/
│   │   ├── db.js            MongoDB connection
│   │   └── multer.js        File upload config
│   ├── controllers/         Route handler logic
│   ├── middleware/
│   │   └── authMiddleware.js JWT verification + role guard
│   ├── models/              Mongoose schemas
│   │   ├── User.js
│   │   ├── Policy.js
│   │   ├── Application.js
│   │   └── Claim.js
│   ├── routes/              Express routers
│   ├── uploads/             Uploaded claim documents (gitignored)
│   ├── seed.js              Demo data seeder
│   └── index.js             Entry point
│
└── client/                  React frontend
    └── src/
        ├── api/
        │   └── axiosInstance.js    Pre-configured Axios with JWT header
        ├── context/
        │   ├── AuthContext.jsx     Login state + localStorage persistence
        │   └── ToastContext.jsx    Global toast notifications
        ├── components/
        │   ├── ProtectedRoute.jsx  Auth + role-based route guard
        │   └── StatusBadge.jsx     Coloured status pill
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── customer/           Customer-facing views
            ├── agent/              Agent-facing views
            └── admin/              Admin dashboard + analytics
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017 (or update MONGO_URI in .env)

### 1. Clone the repository

```bash
git clone <repo-url>
cd "policy hub"
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/policyhub
JWT_SECRET=change_this_to_a_long_random_string
```

### 4. Seed demo data

```bash
cd server
npm run seed
```

This inserts 3 demo users and 8 policies. Credentials are printed to the console after seeding.

Demo accounts:
- customer@policyhub.dev / Demo@1234
- agent@policyhub.dev / Demo@1234
- admin@policyhub.dev / Demo@1234

### 5. Run the application

From the project root (`policy hub/`):

```bash
npm run dev
```

This starts both the server (port 5000) and the client (port 5173) concurrently.

Open http://localhost:5173 in your browser.

---

## API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/policies | Public |
| GET | /api/policies/:id | Public |
| POST | /api/policies | Admin |
| PUT | /api/policies/:id | Admin |
| POST | /api/applications | Customer |
| GET | /api/applications/my | Customer |
| GET | /api/applications/pending | Agent |
| PUT | /api/applications/:id/decision | Agent |
| POST | /api/claims | Customer |
| GET | /api/claims/my | Customer |
| GET | /api/claims/queue | Agent |
| PUT | /api/claims/:id/status | Agent |
| GET | /api/admin/stats | Admin |

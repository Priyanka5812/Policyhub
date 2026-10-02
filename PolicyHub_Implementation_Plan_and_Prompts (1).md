# PolicyHub — Implementation Plan & Antigravity Prompts

## How the system works (flow overview)

1. **Customer** registers/logs in → browses policy catalog → applies for a policy → application goes to **Agent's queue** as "pending".
2. **Agent** reviews the application → approves or rejects (with remarks) → if approved, it becomes an **active policy** for that customer.
3. **Customer** sees the active policy in "My Policies" → if something happens, files a **claim** against that policy (with reason, amount, documents).
4. Claim goes to **Agent's claims queue** as "Filed" → agent reviews → moves it to "Under Review" → then **Approved** or **Rejected** (with remarks).
5. **Admin** doesn't touch applications/claims directly — just watches everything via a dashboard: total policies sold, approval vs rejection ratio, revenue trend, recent activity.
6. Every status change ideally triggers a small notification/toast so the customer/agent knows something moved.

This is the same flow shown in your PPT (System Overview slide) — Customer/Agent/Admin → API → Database, with the claim pipeline Filed → Under Review → Approved/Rejected.

## Build order (why this order)

We build backend before frontend because the frontend needs real APIs to call. Within backend, we go Auth → Policy → Application → Claims because each depends on the previous one existing (you can't apply for a policy that doesn't exist, can't file a claim against an application that doesn't exist). Frontend follows the same dependency order.

---

# HOW TO USE THESE PROMPTS

- Use these **in the same Antigravity session**, one after another, in order. Don't jump ahead.
- After each prompt, actually **check the output** before pasting the next one — if something's broken, fix it first (just tell Antigravity what's wrong in plain language).
- Prompt 1 already contains the full project context, so Antigravity will remember it for the rest of the session — you don't need to repeat the tech stack every time.

---

## PROMPT 1 — Project Setup & Context (paste this first)

```
I'm building a full-stack college project called PolicyHub — a role-based Insurance Policy & Claims Management System. Read this whole message carefully, it's the full context for everything I'll ask you to build in this session.

PROJECT SUMMARY:
Insurance today is fragmented and manual — customers can't easily check policy or claim status, agents track things on spreadsheets, no audit trail exists. PolicyHub fixes this with a role-based platform for three user types: Customer, Agent, and Admin.

ROLES:
1. Customer — browse policies, apply for coverage, track active policies, file & track claims
2. Agent — review pending applications, approve/reject with remarks, review and resolve claims
3. Admin — dashboard with policies sold, claims approval ratio, revenue trend, recent activity

FLOW:
Customer applies for a policy -> Agent approves/rejects the application -> if approved it becomes an active policy for that customer -> customer can file a claim against an active policy -> claim goes through Filed -> Under Review -> Approved/Rejected (agent decides, with remarks) -> Admin sees aggregated stats on all of this.

TECH STACK (stick to exactly this, don't add anything else without asking me):
- Frontend: React (Vite), plain JavaScript (no TypeScript), Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT + bcrypt
- Charts: Recharts (admin dashboard only)
- File uploads (for claim documents): Multer, stored locally
No Docker, no microservices, no Redis, no GraphQL, no testing frameworks, no AI/ML or external APIs. Keep this a simple, standard MERN stack project — I'm a 3rd year IT student who's done one full-stack internship, not a senior engineer, so the code should reflect that skill level: clean and working, but not over-engineered.

CODE STYLE RULES (important, follow throughout this whole project):
- Don't comment every line — only comment where genuinely useful, like a real student would (occasional TODO comments are fine)
- Normal folder structure: /client and /server, with routes, controllers, models on backend and components, pages on frontend. No services/repositories/DTO layers, no unnecessary abstraction.
- Don't make every file identically templated — natural minor variation is fine
- Plain, functional UI text — no marketing language, no excessive exclamation marks
- Basic try/catch error handling on backend routes, nothing more elaborate
- Clean but simple Tailwind UI — no animations, gradients, or agency-style design polish
- Use realistic sample/seed data later (real-sounding policy names, believable amounts), not lorem ipsum

For now, just set up the project skeleton:
1. Create /server and /client folders
2. Initialize the Express server (server.js or index.js) with a basic health-check route
3. Set up MongoDB connection using Mongoose and a .env file for the connection string and JWT secret
4. Set up the Vite + React app in /client with Tailwind CSS configured
5. Give me the package.json for both, and tell me what commands to run to install and start both

Don't build any features yet — just the skeleton and confirm it runs.
```

---

## PROMPT 2 — User Model & Authentication

```
Now build the authentication system.

1. Create a User model (Mongoose) with: name, email (unique), password (hashed with bcrypt), role (enum: customer, agent, admin), phone, createdAt
2. Create auth routes: POST /api/auth/register (customer self-registration only — agents and admins will be seeded manually later, don't expose role selection on the public register endpoint), POST /api/auth/login (returns a JWT with user id and role)
3. Create a role-based auth middleware that verifies the JWT and checks the user's role, so I can protect routes later like requireAuth and requireRole('agent')
4. Keep error handling simple — just basic try/catch with sensible status codes and messages

Show me the model, routes, controller, and middleware files.
```

---

## PROMPT 3 — Policy Model & Catalog APIs

```
Now build the Policy module.

1. Create a Policy model: title, type (enum: health, vehicle), description, coverageAmount, premium, durationMonths, isActive (default true)
2. Create routes: GET /api/policies (public, list all active policies, with optional ?type= filter), GET /api/policies/:id, POST /api/policies (admin only, create a policy), PUT /api/policies/:id (admin only)
3. Wire up the requireRole('admin') middleware from before on the create/update routes

Show me the model, routes, and controller.
```

---

## PROMPT 4 — Application (Underwriting) Module

```
Now build the Application module — this is how a customer applies for a policy and an agent approves/rejects it.

1. Create an Application model: user (ref User), policy (ref Policy), status (enum: pending, approved, rejected, default pending), agentRemarks, appliedAt, decidedAt
2. Routes:
   - POST /api/applications (customer only — apply for a policy)
   - GET /api/applications/my (customer only — see their own applications)
   - GET /api/applications/pending (agent only — see all pending applications, populate user and policy details)
   - PUT /api/applications/:id/decision (agent only — body has status: approved/rejected and remarks, sets decidedAt)
3. When an application is approved, don't create a separate "active policy" record — we'll just treat an Application with status "approved" as the customer's active policy when we query it later. Keep it simple, no duplicate data.

Show me the model, routes, and controller.
```

---

## PROMPT 5 — Claims Module

```
Now build the Claims module.

1. Create a Claim model: user (ref User), application (ref Application — the approved policy this claim is against), claimAmount, reason, documents (array of file paths), status (enum: filed, under_review, approved, rejected, default filed), agentRemarks, filedAt, resolvedAt
2. Set up Multer for document upload (local storage, /server/uploads folder, accept pdf/jpg/png, reasonable size limit)
3. Routes:
   - POST /api/claims (customer only — file a claim against one of their approved applications, with file upload for documents)
   - GET /api/claims/my (customer only — their claim history with status)
   - GET /api/claims/queue (agent only — all claims that are filed or under_review, populated with user and policy info)
   - PUT /api/claims/:id/status (agent only — body has status and remarks, sets resolvedAt when approved/rejected)

Show me the model, routes, controller, and multer config.
```

---

## PROMPT 6 — Frontend: Auth Pages & Protected Routing

```
Now let's start the frontend. Set up:

1. React Router with these routes: / (landing page), /login, /register, and placeholder protected routes /customer/*, /agent/*, /admin/*
2. A simple AuthContext (React Context) that stores the logged-in user and JWT token (in memory + localStorage for persistence), with login() and logout() functions
3. Axios instance configured to attach the JWT token to requests automatically
4. Login page and Register page (register is customer-only, like the backend) — plain forms with Tailwind styling, nothing fancy
5. A ProtectedRoute component that redirects to /login if not authenticated, and redirects to an "unauthorized" message if the role doesn't match the route
6. After login, redirect based on role: customer -> /customer/dashboard, agent -> /agent/dashboard, admin -> /admin/dashboard

Keep the landing page simple — project name, one-line description, login/register buttons. No hero animations or marketing copy.

Show me the folder structure and all the files.
```

---

## PROMPT 7 — Customer Pages

```
Now build the Customer-facing pages:

1. Policy Catalog page — fetch GET /api/policies, show as cards (title, type, premium, coverage, duration), with a type filter (health/vehicle), and an "Apply" button that opens a simple confirmation and calls POST /api/applications
2. My Policies page — fetch GET /api/applications/my, show as a table/list with status badges (pending/approved/rejected), and for approved ones show a "File a Claim" button
3. File a Claim page/form — dropdown to pick which approved application it's against, claim amount, reason textarea, file upload for documents, submits to POST /api/claims
4. My Claims page — fetch GET /api/claims/my, show status pipeline visually (Filed -> Under Review -> Approved/Rejected) with remarks shown if resolved
5. A simple sidebar/nav for the customer section linking these pages together

Keep the UI clean and functional with Tailwind, use status badges with sensible colors (yellow for pending, green for approved, red for rejected).

Show me all the page components.
```

---

## PROMPT 8 — Agent Pages

```
Now build the Agent-facing pages:

1. Pending Applications queue — fetch GET /api/applications/pending, show applicant name, policy applied for, applied date, with Approve/Reject buttons that open a small remarks input before submitting to PUT /api/applications/:id/decision
2. Claims Queue — fetch GET /api/claims/queue, similar pattern — show claimant, policy, amount, reason, with actions to move status forward (Under Review / Approved / Rejected) with remarks, calling PUT /api/claims/:id/status
3. A simple Agent Dashboard landing page with basic counts (pending applications count, pending claims count) fetched from the existing APIs
4. Sidebar/nav for the agent section

Show me all the page components.
```

---

## PROMPT 9 — Admin Dashboard & Analytics

```
Now build the Admin dashboard.

1. Backend: add a GET /api/admin/stats route (admin only) that returns: total policies sold (count of approved applications), total customers, claims approval ratio (approved vs rejected count), and a simple monthly revenue trend for the last 6 months (sum of premium from approved applications grouped by month). Keep the aggregation queries simple, use Mongoose aggregate if needed but don't overcomplicate it.
2. Frontend: Admin Dashboard page that fetches this and displays:
   - Summary cards (total policies sold, total customers, claims approved, claims rejected)
   - A pie chart (Recharts) for claims approved vs rejected ratio
   - A bar or line chart (Recharts) for the 6-month revenue trend
3. Sidebar/nav for the admin section

Show me the backend route and the frontend dashboard component.
```

---

## PROMPT 10 — Seed Data, Notifications & Final Polish

```
Final steps to make this demo-ready:

1. Write a seed script (server/seed.js) that connects to MongoDB and inserts: 3 demo users (one customer, one agent, one admin — print their login credentials in the console after seeding), and 6-8 realistic policies (mix of health and vehicle, with believable names like "Family Health Shield", "Two-Wheeler Comprehensive Cover", "Senior Citizen Health Plan", realistic premium and coverage amounts). Add an npm script "seed" to run it.
2. Add simple toast notifications (a lightweight approach, no heavy library needed — a basic toast component is fine) that fire on: successful application submission, application approved/rejected (agent side confirmation), claim filed, claim status updated
3. Write a plain README.md: project name, one-line description, tech stack used, folder structure overview, and steps to run it locally (clone, npm install in both client and server, set up .env, npm run seed, npm run dev). No badges, no emojis, no marketing tone.
4. Do a quick pass and point out if there are any obvious bugs or missing error states I should fix before I submit this.

Show me the seed script, the toast setup, and the README.
```

---

## After all 10 prompts

At this point you should have a fully working demo. Before submission:
- Actually click through the whole flow yourself once (register as customer, apply, log in as agent and approve, log back in as customer and file a claim, agent resolves it, check admin dashboard updates)
- Take screenshots of each role's dashboard for your ITR report
- Write the "what I learned in my internship and how I applied it" section separately — that's not something Antigravity should write, that should be in your own words since it needs to reflect your actual internship experience

# 🎯 Interview AI — Personalized Interview Preparation Platform

An AI-powered full-stack web application that generates deeply personalized interview strategies, question banks, 14-day preparation plans, and ATS-optimized resume PDFs — all tailored to a specific job description and the candidate's own background.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Interview Strategy** | Generates 12–15 technical questions, 10–12 behavioral questions, 3–5 case studies — all role-specific |
| 📊 **Match Score** | Rates how well your profile matches the job (0–100) |
| 💪 **Strengths & Weaknesses** | Identifies your strong points and areas to improve for the role |
| 🧩 **Skill Gap Analysis** | Lists missing skills with severity (low/medium/high) and a specific learning resource for each |
| 🗺️ **14-Day Preparation Plan** | Day-wise roadmap with 3–5 concrete tasks per day |
| 💡 **Interview Tips** | 6–8 role-specific, actionable tips — not generic advice |
| 💰 **Salary Insights (INR)** | Expected salary range in Indian Rupees + negotiation tips |
| 📄 **Resume PDF Download** | Generates a beautifully formatted, ATS-friendly resume PDF tailored to the job |
| 🔐 **Auth System** | JWT-based register/login with `httpOnly` secure cookies |
| 📋 **Report History** | All generated reports are saved and accessible from the dashboard |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express 5** — REST API server
- **MongoDB** + **Mongoose** — Database & ODM
- **Groq SDK** (`meta-llama/llama-4-scout-17b-16e-instruct`) — AI generation
- **Puppeteer** — Headless Chrome PDF generation
- **JWT** + **bcryptjs** — Authentication & password hashing
- **Multer** + **pdf-parse** — Resume file upload & text extraction
- **Zod** + **zod-to-json-schema** — Schema validation & structured AI output
- **nodemon** — Development server with hot-reload

### Frontend
- **React 18** + **Vite** — UI framework & dev tooling
- **React Router v7** — Client-side routing
- **SCSS (Sass)** — Styling with design tokens
- **Axios** — HTTP client

---

## 📁 Project Structure

```
interview-ai-yt/
├── Backend/
│   ├── server.js               # Entry point
│   ├── .env                    # Environment variables
│   └── src/
│       ├── app.js              # Express app setup + global error handler
│       ├── config/
│       │   └── db.js           # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js        # Register, login, logout, getMe
│       │   └── interview.controller.js   # Generate report, get reports, PDF
│       ├── middlewares/
│       │   └── auth.middleware.js        # JWT cookie verification
│       ├── models/
│       │   ├── user.model.js             # User schema
│       │   ├── interviewReport.model.js  # Full report schema (expanded)
│       │   └── blacklist.model.js        # Token blacklist with TTL index
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       ├── services/
│       │   └── ai.service.js   # Groq AI + Puppeteer PDF generation
│       └── utils/
│           └── asyncHandler.js # Global async error wrapper
│
└── Frontend/
    ├── index.html
    └── src/
        ├── App.jsx              # Root with ToastProvider + Router
        ├── app.routes.jsx       # Route definitions
        └── features/
            ├── auth/
            │   ├── hooks/useAuth.js           # Login/register/logout logic
            │   ├── pages/Login.jsx
            │   ├── pages/Register.jsx
            │   └── components/Protected.jsx   # Route guard
            ├── interview/
            │   ├── hooks/useInterview.js      # API calls for reports & PDF
            │   ├── pages/Home.jsx             # Strategy generator form
            │   ├── pages/Interview.jsx        # 7-section report viewer
            │   └── style/
            │       ├── home.scss
            │       └── interview.scss
            └── common/
                ├── Header.jsx               # Sticky nav with logout
                ├── Toast.jsx                # Global toast notifications
                └── header.scss / toast.scss
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)
- A [Groq API key](https://console.groq.com/keys) (free)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/interview-ai.git
cd interview-ai-yt
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
GROQ_API_KEY=your_groq_api_key
```

Start the backend dev server:

```bash
npm run dev
# Runs on http://localhost:3000
```

### 3. Frontend setup

```bash
cd ../Frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Create a new account | ❌ |
| `POST` | `/login` | Login and receive cookie | ❌ |
| `POST` | `/logout` | Invalidate session | ✅ |
| `GET` | `/me` | Get current user | ✅ |

### Interview — `/api/interview`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/` | Generate AI interview strategy | ✅ |
| `GET` | `/` | Get all reports for current user | ✅ |
| `GET` | `/:id` | Get a specific report | ✅ |
| `POST` | `/resume/pdf/:id` | Generate resume PDF download | ✅ |

---

## 🤖 AI Model

The app uses **Groq's `meta-llama/llama-4-scout-17b-16e-instruct`** for both interview report and resume generation.

The AI generates a structured JSON response using Groq's `json_schema` response format containing:
- `matchScore` — 0 to 100 compatibility score
- `technicalQuestions` — 12 Q&A pairs with difficulty tags
- `behavioralQuestions` — 10 STAR-method Q&A pairs
- `caseStudyQuestions` — 3–5 role-specific scenarios
- `skillGaps` — missing skills with severity + learning resource
- `preparationPlan` — 14-day day-wise task plan
- `interviewTips` — role-specific actionable advice
- `salaryInsights` — INR salary range + negotiation tips
- `strengths` / `weaknesses` — profile analysis

---

## 🔒 Security Highlights

- JWT tokens stored in `httpOnly`, `sameSite: Strict` cookies (not `localStorage`) — XSS-safe
- Logged-out tokens are blacklisted in MongoDB with a TTL index for automatic cleanup
- PDF generation requires ownership verification — users can only download their own reports
- Passwords hashed with `bcryptjs` (salt rounds: 10)
- Global `asyncHandler` wrapper prevents server crashes from unhandled promise rejections

---

## 📦 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens (use a long random string) |
| `GROQ_API_KEY` | ✅ | Groq API key from [console.groq.com](https://console.groq.com/keys) |
| `GOOGLE_GENAI_API_KEY` | ❌ | Legacy Gemini key (no longer used) |

---

## 💡 Generating a Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ⚠️ Known Limitations

- **Puppeteer on Ubuntu 23.10+**: Chrome requires `--no-sandbox` and `--no-zygote` flags due to AppArmor restrictions. These are already configured in `ai.service.js`.
- **Groq Free Tier**: Rate limits apply. If you hit quota, wait a few minutes or upgrade your Groq plan.
- **Old reports**: Reports generated before the schema expansion won't have newer fields like `caseStudyQuestions`, `interviewTips`, or `salaryInsights`. Generate a fresh report to get all sections.

---

## 🗺️ Roadmap

- [ ] Streaming AI responses for faster perceived performance
- [ ] Mock interview mode (voice/text Q&A with AI feedback)
- [ ] Export interview plan to PDF
- [ ] Team/recruiter mode — share reports with a link
- [ ] Input validation with Zod middleware on all routes

---

## 📄 License

MIT — feel free to use, modify, and distribute.

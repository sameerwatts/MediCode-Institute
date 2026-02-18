# MediCode Institute — Technical Architecture

## 1. System Design Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                     React SPA (Vercel)                          │
└──────────┬──────────┬──────────┬──────────┬─────────────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼
     ┌──────────┐ ┌────────┐ ┌───────┐ ┌──────────┐
     │ Firebase │ │YouTube │ │ Jitsi │ │Cloudinary│
     │   Auth   │ │ Embed  │ │ Meet  │ │  (Files) │
     └────┬─────┘ └────────┘ └───────┘ └──────────┘
          │ (token)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Flask)                           │
│                     Render (Free Tier)                           │
│  ┌───────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │   Routes   │ │  Services │ │Middleware│ │ Firebase Admin  │  │
│  │ (REST API) │ │ (Logic)   │ │(Auth,CORS)│ │ (Token Verify) │  │
│  └───────────┘ └───────────┘ └──────────┘ └─────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                          │
│                    Render (Free Tier)                            │
│  Users │ Courses │ Topics │ Lessons │ Enrollments │ Quizzes     │
│  Submissions │ Payments │ Blogs │ LiveSessions                  │
└─────────────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** Three-tier (Presentation → Application → Data)
- **Presentation:** React SPA handles all UI, talks directly to Firebase Auth, YouTube, Jitsi
- **Application:** Flask REST API handles business logic, data validation, authorization
- **Data:** PostgreSQL stores all structured data; Cloudinary stores files

---

## 2. Key Components

### 2.1 Frontend (React + TypeScript SPA)
| Concern | Technology |
|---------|-----------|
| Language | TypeScript |
| UI Framework | React.js |
| Styling | Styled Components |
| Forms | Formik + Yup |
| State | useReducer + useContext |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Video Player | YouTube iframe embed |
| Live Classes | Jitsi Meet iframe API |

### 2.2 Backend (Flask API)
| Concern | Technology |
|---------|-----------|
| Framework | Flask + Flask-RESTful |
| ORM | SQLAlchemy |
| Migrations | Flask-Migrate (Alembic) |
| Auth Verification | Firebase Admin SDK |
| CORS | Flask-CORS |
| File URLs | Cloudinary SDK |
| Payments | Razorpay Python SDK |

### 2.3 Database (PostgreSQL)
- Relational database for all structured data
- Relationships: Users → Enrollments → Courses → Topics → Lessons
- Teacher-student mapping through Enrollments table

### 2.4 External Services
| Service | Purpose | Interaction |
|---------|---------|-------------|
| Firebase Auth | User authentication (email, Google, phone OTP) | Direct from frontend |
| YouTube | Video hosting and playback | Embed in frontend |
| Jitsi | Live class video conferencing | Embed in frontend |
| Cloudinary | PDF/image storage (notes, solutions) | Upload from frontend, URL stored in DB |
| Razorpay | Payments with 80/20 split | Checkout in frontend, webhook to backend |

---

## 3. Component Interactions (Data Flows)

### 3.1 Authentication Flow
```
Student/Teacher → React App → Firebase Auth SDK → Firebase
                                    │
                                    ▼ (ID Token)
                              React App stores token
                                    │
                              Sends token in header
                                    │
                                    ▼
                              Flask API → Firebase Admin SDK
                                    │        (verifies token)
                                    ▼
                              Returns user data + role (student/teacher)
```

### 3.2 Video Lecture Flow
```
Teacher uploads video to YouTube → Copies YouTube URL
        │
        ▼
Teacher Dashboard (React) → Flask API → DB (stores YouTube URL + metadata)

Student browses courses → Flask API → Returns lesson with YouTube URL
        │
        ▼
React embeds YouTube iframe → Student watches video
```
**Note:** No video goes through our servers. YouTube handles all streaming.

### 3.3 Live Class Flow
```
Teacher creates live session → Flask API → DB (stores session details + timing)
        │
        ▼
Teacher starts class → React opens Jitsi room (teacher is moderator)

Student (with subscription) → Checks schedule → Joins Jitsi room via iframe
```
**Note:** Jitsi handles all WebRTC. We only manage scheduling and access control.

### 3.4 Payment Flow (Razorpay Route-Based Split)
```
Student clicks "Subscribe" → React → Razorpay Checkout (80/20 split configured)
        │
        ▼
Razorpay processes payment → 80% → Instructor's linked account
                           → 20% → Platform account
        │
        ▼
Razorpay webhook → Flask API → Updates DB (payment record, enrollment status)
        │
        ▼
Student gets access to paid content (live classes, premium)
```

### 3.5 Notes/PDF Upload Flow
```
Teacher selects PDF → React → Cloudinary Upload Widget → Cloudinary
        │                                                     │
        │                                          Returns file URL
        ▼                                                     │
Flask API ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
        │ (stores URL + metadata in DB)
        ▼
Student browses notes → Flask API → Returns Cloudinary URL → Download/View
```

### 3.6 Quiz / Exam Flow
```
Teacher creates quiz → Flask API → DB (stores questions, options, answers)

Student takes quiz → React renders quiz form
        │
        ▼
Student submits → Flask API → DB (stores submission + auto-grade MCQs)
        │
        ▼
Teacher Dashboard → Flask API → Returns submissions for THEIR students only
        │
        ▼
Teacher reviews/grades → Flask API → Updates score → Student sees result
```

---

## 4. Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| firebase_uid | VARCHAR | Firebase Auth UID |
| email | VARCHAR | User email |
| name | VARCHAR | Full name |
| role | ENUM | 'student', 'teacher', 'admin' |
| phone | VARCHAR | Phone number |
| avatar_url | VARCHAR | Profile image URL |
| razorpay_account_id | VARCHAR | For instructor payouts (teachers only) |
| created_at | TIMESTAMP | Account creation date |

### Courses
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| teacher_id | UUID (FK → Users) | Course creator |
| title | VARCHAR | Course name |
| description | TEXT | Course description |
| category | ENUM | 'medical', 'computer_science' |
| thumbnail_url | VARCHAR | Cloudinary image URL |
| price | DECIMAL | Course price (0 = free) |
| is_published | BOOLEAN | Visibility status |
| created_at | TIMESTAMP | Creation date |

### Topics
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| course_id | UUID (FK → Courses) | Parent course |
| title | VARCHAR | Topic name (e.g., "JavaScript Basics") |
| order | INTEGER | Display order within course |

### Lessons
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| topic_id | UUID (FK → Topics) | Parent topic |
| title | VARCHAR | Lesson title |
| youtube_url | VARCHAR | YouTube video link |
| notes_url | VARCHAR | Cloudinary PDF link |
| order | INTEGER | Display order within topic |
| duration_minutes | INTEGER | Video duration |

### Enrollments (Teacher-Student Mapping)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| student_id | UUID (FK → Users) | Student |
| course_id | UUID (FK → Courses) | Course enrolled in |
| teacher_id | UUID (FK → Users) | Teacher of the course |
| status | ENUM | 'active', 'expired', 'cancelled' |
| enrolled_at | TIMESTAMP | Enrollment date |

**Key:** A teacher can only see students where `enrollments.teacher_id = teacher.id`

### Quizzes
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| course_id | UUID (FK → Courses) | Parent course |
| title | VARCHAR | Quiz title |
| total_marks | INTEGER | Maximum marks |
| duration_minutes | INTEGER | Time limit |
| created_by | UUID (FK → Users) | Teacher who created it |

### Quiz Questions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| quiz_id | UUID (FK → Quizzes) | Parent quiz |
| question_text | TEXT | The question |
| option_a | VARCHAR | Option A |
| option_b | VARCHAR | Option B |
| option_c | VARCHAR | Option C |
| option_d | VARCHAR | Option D |
| correct_option | CHAR(1) | 'a', 'b', 'c', or 'd' |
| marks | INTEGER | Marks for this question |

### Submissions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| quiz_id | UUID (FK → Quizzes) | Quiz taken |
| student_id | UUID (FK → Users) | Student who submitted |
| answers | JSONB | Student's answers |
| score | INTEGER | Auto-graded or teacher-graded score |
| submitted_at | TIMESTAMP | Submission time |

### Payments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| student_id | UUID (FK → Users) | Who paid |
| course_id | UUID (FK → Courses) | What they paid for |
| razorpay_payment_id | VARCHAR | Razorpay transaction ID |
| amount | DECIMAL | Total amount |
| instructor_share | DECIMAL | 80% of amount |
| platform_share | DECIMAL | 20% of amount |
| status | ENUM | 'success', 'failed', 'refunded' |
| paid_at | TIMESTAMP | Payment time |

### Live Sessions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| course_id | UUID (FK → Courses) | Related course |
| teacher_id | UUID (FK → Users) | Host teacher |
| title | VARCHAR | Session title |
| jitsi_room_id | VARCHAR | Jitsi room identifier |
| scheduled_at | TIMESTAMP | Scheduled start time |
| duration_minutes | INTEGER | Expected duration |
| status | ENUM | 'scheduled', 'live', 'completed' |

### Blogs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| author_id | UUID (FK → Users) | Teacher/admin who wrote it |
| title | VARCHAR | Blog title |
| content | TEXT | Blog body (markdown) |
| category | ENUM | 'news', 'exam_update', 'article' |
| thumbnail_url | VARCHAR | Cloudinary image URL |
| is_published | BOOLEAN | Visibility |
| published_at | TIMESTAMP | Publish date |

### Entity Relationship Summary
```
Users ──┬── 1:N ──→ Courses (as teacher)
        ├── 1:N ──→ Enrollments (as student)
        ├── 1:N ──→ Submissions
        ├── 1:N ──→ Payments
        └── 1:N ──→ Blogs

Courses ──┬── 1:N ──→ Topics ──→ 1:N ──→ Lessons
          ├── 1:N ──→ Enrollments
          ├── 1:N ──→ Quizzes ──→ 1:N ──→ Quiz Questions
          ├── 1:N ──→ Live Sessions
          └── 1:N ──→ Payments
```

---

## 5. API Design

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user (after Firebase signup) | Public |
| GET | /api/auth/me | Get current user profile | Authenticated |
| PUT | /api/auth/me | Update profile | Authenticated |

### Courses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/courses | List all published courses | Public |
| GET | /api/courses/:id | Get course details with topics | Public |
| POST | /api/courses | Create course | Teacher |
| PUT | /api/courses/:id | Update course | Course owner |
| DELETE | /api/courses/:id | Delete course | Course owner |

### Topics & Lessons
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/courses/:id/topics | Add topic to course | Course owner |
| PUT | /api/topics/:id | Update topic | Course owner |
| POST | /api/topics/:id/lessons | Add lesson to topic | Course owner |
| PUT | /api/lessons/:id | Update lesson | Course owner |

### Enrollments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/courses/:id/enroll | Enroll in course | Student |
| GET | /api/my/enrollments | List my enrollments | Student |
| GET | /api/my/students | List my students | Teacher |
| GET | /api/my/students/:id | Get student details | Teacher (own students only) |

### Quizzes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/courses/:id/quizzes | Create quiz | Course owner |
| GET | /api/quizzes/:id | Get quiz (questions) | Enrolled student |
| POST | /api/quizzes/:id/submit | Submit quiz answers | Enrolled student |
| GET | /api/quizzes/:id/submissions | View submissions | Course owner |

### Live Sessions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/courses/:id/sessions | Schedule live session | Course owner |
| GET | /api/sessions/upcoming | List upcoming sessions | Authenticated |
| GET | /api/sessions/:id/join | Get Jitsi room details | Paid subscriber |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/payments/create-order | Create Razorpay order | Student |
| POST | /api/payments/verify | Verify payment (webhook) | Razorpay |
| GET | /api/my/payments | Payment history | Authenticated |

### Blogs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/blogs | List published blogs | Public |
| GET | /api/blogs/:id | Get blog detail | Public |
| POST | /api/blogs | Create blog | Teacher/Admin |
| PUT | /api/blogs/:id | Update blog | Author |

---

## 6. Frontend Project Structure

```
medicode-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                    # Static images, icons, fonts
│   │   ├── images/
│   │   └── icons/
│   ├── components/                # Reusable UI components
│   │   ├── common/                # Button, Input, Card, Modal, Loader
│   │   ├── layout/                # Navbar, Footer, Sidebar, PageWrapper
│   │   └── course/                # CourseCard, LessonList, VideoPlayer
│   ├── pages/                     # Route-level page components
│   │   ├── Home/                  # Landing page
│   │   ├── About/                 # About the institute
│   │   ├── Courses/               # Course listing + Course detail
│   │   ├── Login/                 # Login page
│   │   ├── Register/              # Signup page
│   │   ├── Dashboard/             # Student dashboard
│   │   ├── TeacherDashboard/      # Teacher dashboard
│   │   ├── LiveSession/           # Jitsi live class page
│   │   ├── Quiz/                  # Take quiz page
│   │   ├── Blog/                  # Blog listing + Blog detail
│   │   └── NotFound/              # 404 page
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.tsx        # User auth state
│   │   └── AppContext.tsx         # Global app state
│   ├── services/                  # API call functions
│   │   ├── api.ts                 # Axios instance with auth headers
│   │   ├── courseService.ts       # Course-related API calls
│   │   ├── quizService.ts        # Quiz-related API calls
│   │   └── paymentService.ts     # Payment-related API calls
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useCourses.ts
│   ├── data/                      # Dummy data for MVP (no backend)
│   │   ├── courses.ts
│   │   ├── teachers.ts
│   │   └── blogs.ts
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts               # Shared interfaces and types
│   ├── styles/                    # Global styles and theme
│   │   ├── GlobalStyle.ts         # Styled Components global styles
│   │   └── theme.ts               # Colors, breakpoints, typography
│   ├── utils/                     # Helper functions
│   │   └── helpers.ts
│   ├── App.tsx                    # Root component with routing
│   └── index.tsx                  # Entry point
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## 7. Backend Project Structure

```
medicode-backend/
├── app/
│   ├── __init__.py                # Flask app factory
│   ├── config.py                  # Environment config (dev, prod)
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── topic.py
│   │   ├── lesson.py
│   │   ├── enrollment.py
│   │   ├── quiz.py
│   │   ├── submission.py
│   │   ├── payment.py
│   │   ├── live_session.py
│   │   └── blog.py
│   ├── routes/                    # API route blueprints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── courses.py
│   │   ├── quizzes.py
│   │   ├── payments.py
│   │   ├── sessions.py
│   │   └── blogs.py
│   ├── services/                  # Business logic layer
│   │   ├── auth_service.py        # Firebase token verification
│   │   ├── course_service.py
│   │   ├── quiz_service.py
│   │   └── payment_service.py     # Razorpay integration + split
│   ├── middleware/                 # Request middleware
│   │   ├── auth_middleware.py     # Verify Firebase token on requests
│   │   └── role_middleware.py     # Check user role (student/teacher)
│   └── utils/
│       └── helpers.py
├── migrations/                    # Flask-Migrate / Alembic
├── requirements.txt
├── .env.example
└── run.py                         # App entry point
```

---

## 8. Security Considerations

| Concern | Solution |
|---------|----------|
| Authentication | Firebase Auth handles passwords, tokens, and OAuth securely |
| API Authorization | Every Flask route verifies Firebase ID token via middleware |
| Role-Based Access | Middleware checks user role before allowing teacher/admin actions |
| Teacher-Student Isolation | Queries always filter by `teacher_id` — teachers see only their students |
| Input Validation | Yup (frontend) + Flask request validation (backend) |
| CORS | Flask-CORS configured to allow only the Vercel frontend domain |
| Payment Security | Razorpay handles card data (PCI compliant), we never touch card details |
| Webhook Verification | Verify Razorpay webhook signature before processing payments |
| SQL Injection | SQLAlchemy ORM parameterizes all queries |
| XSS | React auto-escapes JSX output; sanitize any user-generated HTML (blogs) |
| File Uploads | Files go to Cloudinary (not our server), validated for type and size |

---

## 9. Deployment Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel      │     │   Render     │     │   Render     │
│  (Frontend)   │────▶│  (Flask API) │────▶│ (PostgreSQL) │
│  React SPA    │     │  Free Tier   │     │  Free Tier   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │ Firebase   │ │Cloudinary │ │ Razorpay  │
       │   Auth     │ │  (Files)  │ │(Payments) │
       └───────────┘ └───────────┘ └───────────┘
```

### Deployment Steps (when ready)
1. **Frontend:** Push to GitHub → Vercel auto-deploys from main branch
2. **Backend:** Push to GitHub → Render auto-deploys from main branch
3. **Database:** Render provisions PostgreSQL, connection string in env vars
4. **Environment Variables:** Set Firebase keys, Cloudinary keys, Razorpay keys in Render dashboard

### MVP Deployment (frontend only)
- Just deploy React app to Vercel with dummy data — no backend needed yet
- **MVP Pages & Routes:**
  | Page | Route | Description |
  |------|-------|-------------|
  | Home | `/` | Landing page |
  | All Courses | `/courses` | Course listing page |
  | About | `/about` | About the institute |
  | Quiz | `/quiz` | Quiz listing/page |
  | Blogs | `/blogs` | Blog listing page |
- **Header Navigation:** Shared across all pages with links to Home, All Courses, About, Quiz, Blogs

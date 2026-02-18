# MediCode Institute — Brainstorm

## Vision
- Educational technology company covering 2 fields: Medical and Computer Science (separate tracks)
- Differentiator: Live classes + quizzes alongside recorded content — something other platforms lack

## Target Audience
- Beginners and university students
- Students and their parents
- Geography: Initially India, later globally

## Core Features

### Admin / Teacher Login
- Upload video lectures
- Set topic curriculum (e.g., JavaScript, Git as topics with curriculum inside each)
- Give live classes to students
- Upload notes and solutions (PDF format)
- Upload mock test papers and check submitted exams
- Teacher-student mapping: Each teacher sees only their own students' progress and details
  - Example: John teaches A, B, E — Monika teaches C, D, F — each sees only their students
- Upload blogs and news about upcoming exams
- Manage course content and scheduling

### Student Login
- Watch recorded video content and download for offline use
- Take exam papers and submit (auto-reflects on teacher's dashboard)
- View teacher's name (read-only, no modifications)
- Read or download notes uploaded by teacher
- Read blogs and news
- Join live sessions (subscription required, based on timing)
- Track personal progress and quiz scores

## Tech Stack

### Frontend
- **Language:** TypeScript
- **Framework:** React.js (start here with dummy data)
- **Styling:** Styled Components
- **Forms:** Formik + Yup for validation
- **State Management:** useReducer + useContext (no Redux)
- **Dependencies:** Free to use any npm packages (e.g., react-slick for sliders)
- **Hosting:** Vercel (free)
- **Design approach:** Mobile-first and responsive

### Backend (later)
- **Framework:** Flask + Flask-RESTful
- **ORM:** SQLAlchemy + Flask-Migrate
- **Hosting:** Render (free tier — 750 hrs/month)

### Database (later)
- **Database:** PostgreSQL (Render free tier — 256MB)

### Authentication (later)
- **Provider:** Firebase Authentication (free — 50k MAU)
- Supports email/password, Google, phone OTP

### Storage & Media
- **Videos:** YouTube (embedded/linked, no local storage)
- **Live classes:** Jitsi (free, open-source)
- **Files (PDFs, images):** Cloudinary (free — 25GB)

### Payments (later)
- **India:** Razorpay (with route-based split for revenue sharing)
- **Global:** Stripe

### Total launch cost: $0/month

## Monetization
- Subscription model + per-course pricing
- Free: Download offline videos, browse content
- Paid: Join live sessions, access premium content
- Allow other instructors to publish (multi-tenant instructor model)

## Milestones
- **MVP** — Simple frontend website using mentioned tech stack without login or authentication.
  - **Header Navigation:** Home, All Courses, About, Quiz, Blogs — each with its own page route
  - Pages: Landing page (Home), All Courses listing, About page, Quiz page, Blogs listing
  - All pages use dummy data (no backend)
  - Responsive layout with shared Header/Footer across all pages
- **v1** — Add login functionality
- **v2** — Admin can upload notes (PDF), students can read/download
- Later versions defined as we progress

## Decisions
- **Payment gateway:** Razorpay (India), Stripe (global expansion)
- **Video hosting:** YouTube — lectures are free to view, embed or link directly to YouTube (no local storage)
- **Live classes:** Jitsi integration
- **Revenue sharing:** Instructor 80% / Platform 20% — auto-split at payment time, instructor share goes directly to their account

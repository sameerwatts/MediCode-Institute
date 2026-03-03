# Plan: Admin Portal — Students List + Feature Roadmap

## Context

The admin panel currently has only one section: **Teacher Requests** (list + detail + approve/reject/resend-invite). The admin needs visibility into registered students. This plan adds a **Students List** page to the admin panel, following the exact patterns already established by the TeacherRequests feature. Students are already stored as `User` records with `role='student'` — no new database tables needed.

---

## Part 1: Students List Implementation

### Files to Modify (4)

| File | Change |
|------|--------|
| `backend/app/routers/admin.py` | Add `GET /api/admin/students` endpoint |
| `src/types/index.ts` | Add `IStudentListItem` + `IPaginatedStudents` interfaces |
| `src/services/adminService.ts` | Add `getStudents()` function |
| `src/components/admin/AdminSidebar/index.tsx` | Add "Students" nav item |

### Files to Create (4)

| File | Purpose |
|------|---------|
| `backend/app/schemas/student.py` | Pydantic schemas: `StudentListItem`, `StudentListResponse` |
| `src/views/Admin/StudentsList/index.tsx` | StudentsList view (table + search + pagination) |
| `app/admin/students/page.tsx` | Next.js route page |
| `src/views/Admin/StudentsList/StudentsList.test.tsx` | Jest/RTL tests |

---

### Step 1 — Backend Pydantic Schema

**Create** `backend/app/schemas/student.py`

```python
class StudentListItem(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    avatar_url: str | None = None
    created_at: datetime

class StudentListResponse(BaseModel):
    items: list[StudentListItem]
    total: int
    page: int
    page_size: int
    has_next: bool
```

### Step 2 — Backend API Endpoint

**Modify** `backend/app/routers/admin.py` — add endpoint following `list_applications` pattern:

- **Route:** `GET /api/admin/students?search=&page=1`
- **Auth:** `require_admin` dependency
- **Query:** `db.query(User).filter(User.role == "student")`
- **Search:** `ilike` on `User.name` and `User.email`
- **Sort:** `User.created_at.desc()` (newest first)
- **Pagination:** Same `PAGE_SIZE = 10`, same `offset/limit` pattern
- No status filter needed (all returned users are active students)

### Step 3 — Frontend Types

**Modify** `src/types/index.ts` — add:

```typescript
export interface IStudentListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface IPaginatedStudents {
  items: IStudentListItem[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}
```

### Step 4 — Frontend Service

**Modify** `src/services/adminService.ts` — add `getStudents()`:

- Mirrors `getApplications()` pattern exactly
- Params: `{ search?: string; page?: number }` (no status param needed)
- Endpoint: `GET /admin/students`
- Uses same `api` axios instance and `toError` helper

### Step 5 — StudentsList View Component

**Create** `src/views/Admin/StudentsList/index.tsx`

Follows `TeacherRequests/index.tsx` pattern with these differences:
- **No status filter buttons** (students have no status lifecycle)
- **Table columns:** Name, Email, Phone, Registered (date)
- **No "View" link** (no student detail page in this scope)
- Phone shows `'—'` for null values
- Same search form, pagination, loading/error/empty states

### Step 6 — Route Page

**Create** `app/admin/students/page.tsx`

```typescript
import StudentsList from '@/views/Admin/StudentsList';
export const metadata = { title: 'Students | MediCode Admin' };
export default function StudentsPage() { return <StudentsList />; }
```

### Step 7 — Sidebar Nav

**Modify** `src/components/admin/AdminSidebar/index.tsx`:

Add `{ label: 'Students', href: '/admin/students' }` to `navItems` array. Active-state highlighting already works via `pathname.startsWith()`.

### Step 8 — Tests

**Create** `src/views/Admin/StudentsList/StudentsList.test.tsx`

Mock `adminService.getStudents`, test:
- Renders heading and search input
- Shows loading state
- Renders students in table after fetch
- Shows "No students found" for empty results
- Shows error alert on fetch failure
- Displays dash for missing phone
- Pagination controls render

---

## Part 2: Admin & Teacher Portal Feature Suggestions (EdTech)

### Admin Portal — Suggested Features (prioritized)

> **Note:** A separate "Teachers List" is NOT needed — the existing Teacher Requests page with the "Registered" filter already serves as the active teachers list.

| Priority | Feature | Description |
|----------|---------|-------------|
| **Now** | Students List | View all registered students (this plan) |
| **Now** | Teacher Requests | Already built — approve/reject/resend + "Registered" filter = teachers list |
| **Next** | Dashboard Overview | Stats cards: total students, teachers, pending requests, active courses |
| **Next** | Course Oversight | View all courses, feature/unfeature on homepage, unpublish if reported — NO approval needed (teachers own content quality, students validate via ratings) |
| **Later** | Enrollment Reports | Which students enrolled in which courses, completion rates |
| **Later** | Revenue/Payments | Payment history, refunds, teacher payouts (if paid courses) |
| **Later** | Content Moderation | Review flagged content, blog posts, quiz questions |
| **Later** | Announcements | Broadcast messages to students/teachers |
| **Later** | System Settings | Site configuration (site name, contact email, logo), email templates |
| **Later** | Audit Log | Track admin actions (who approved/rejected what, when) |
| **Later** | Analytics Dashboard | Enrollment trends, popular courses, user growth charts |

### Teacher Portal — Suggested Features

| Priority | Feature | Description |
|----------|---------|-------------|
| **Next** | Teacher Dashboard | Stats for **their own** data: my courses count, my enrolled students (unique across their courses), my average rating |
| **Next** | Course Builder | Create/edit courses with modules, lessons, PDF/text content (video deferred — Supabase free tier can't handle video storage/bandwidth) |
| **Next** | Student Roster | View enrolled students per course |
| **Later** | Quiz Builder | Create quizzes linked to courses |
| **Later** | Assignment Management | Create, collect, grade assignments |
| **Later** | Messaging | Communicate with enrolled students |
| **Later** | Earnings Dashboard | Revenue from courses, payout history |
| **Later** | Course Analytics | Views, completion rates, drop-off points |
| **Later** | Blog/Content | Publish educational blog posts |

---

## Verification

1. **Backend:** Run `pytest` (or manually test `GET /api/admin/students` with admin session cookie)
2. **Frontend:** Run `npm test` — StudentsList tests should pass
3. **Lint/Build:** `npm run lint && npm run build` must pass
4. **E2E:** Login as admin → sidebar shows "Students" link → click it → see paginated student list → search works → pagination works
5. **Access control:** Non-admin users hitting `/admin/students` should be redirected to `/login`

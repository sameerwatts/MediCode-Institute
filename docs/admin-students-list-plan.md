# Plan: Admin Students List

## Context
The admin panel currently has only one section: Teacher Requests. This feature adds a Students List page so admins can see all registered students. Students are already stored as `User` records with `role='student'` — no new DB tables needed. The implementation follows the exact TeacherRequests pattern established in the codebase.

---

## Files to Modify (5)

| File | Change |
|------|--------|
| `backend/app/routers/admin.py` | Add `GET /api/admin/students` endpoint |
| `src/types/index.ts` | Add `IStudentListItem` + `IPaginatedStudents` interfaces |
| `src/services/adminService.ts` | Add `getStudents()` function |
| `src/components/admin/AdminSidebar/index.tsx` | Add "Students" nav item |
| `src/components/admin/AdminSidebar/AdminSidebar.test.tsx` | Add test for Students nav item |

## Files to Create (4)

| File | Purpose |
|------|---------|
| `backend/app/schemas/student.py` | Pydantic schemas: `StudentListItem`, `StudentListResponse` |
| `src/views/Admin/StudentsList/index.tsx` | StudentsList view (table + search + pagination) |
| `app/admin/students/page.tsx` | Next.js route page |
| `src/views/Admin/StudentsList/StudentsList.test.tsx` | Jest/RTL tests |

---

## Step-by-Step Implementation

### Step 1 — Backend Pydantic Schema
**Create** `backend/app/schemas/student.py`

```python
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class StudentListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # required for SQLAlchemy ORM

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

class StudentListResponse(BaseModel):
    items: list[StudentListItem]
    total: int
    page: int
    page_size: int
    has_next: bool
```

### Step 2 — Backend API Endpoint
**Modify** `backend/app/routers/admin.py`

Add imports for the new schemas. Add endpoint after existing routes:

```python
from app.schemas.student import StudentListItem, StudentListResponse

@router.get("/students", response_model=StudentListResponse)
def list_students(
    search: str = Query("", description="Search by name or email"),
    page: int = Query(1, ge=1, description="Page number"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(User).filter(User.role == "student")

    if search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(User.name.ilike(search_term), User.email.ilike(search_term))
        )

    total = query.count()
    items = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .all()
    )

    return StudentListResponse(
        items=[
            StudentListItem(
                id=str(user.id),  # UUID → str required
                name=user.name,
                email=user.email,
                phone=user.phone,
                avatar_url=user.avatar_url,
                created_at=user.created_at,
            )
            for user in items
        ],
        total=total,
        page=page,
        page_size=PAGE_SIZE,
        has_next=(page * PAGE_SIZE) < total,
    )
```

### Step 3 — Frontend Types
**Modify** `src/types/index.ts` — append after existing interfaces:

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
**Modify** `src/services/adminService.ts` — add `getStudents()` mirroring `getApplications()`:

```typescript
export async function getStudents(params?: {
  search?: string;
  page?: number;
}): Promise<IPaginatedStudents> {
  try {
    const res = await api.get<IPaginatedStudents>('/admin/students', { params });
    return res.data;
  } catch (err) {
    toError(err, 'Failed to fetch students.');
  }
}
```

### Step 5 — StudentsList View Component
**Create** `src/views/Admin/StudentsList/index.tsx`

Follows `TeacherRequests/index.tsx` pattern exactly with these differences:
- **No status filter buttons** — students have no status lifecycle
- **Table columns:** Name, Email, Phone (full number; `'—'` for null), Registered (MMM DD, YYYY)
- **No "View" link** — no student detail page in scope
- **Dual search state pattern:** `searchInput` (UI state) + `search` (API trigger, reset to page 1 on submit)
- **aria-label on search input:** `"Search students"` (for accessibility + tests)
- Same loading ("Loading..."), error (`role="alert"`), empty ("No students found"), and pagination states as TeacherRequests

### Step 6 — Route Page
**Create** `app/admin/students/page.tsx`

```typescript
import type { Metadata } from 'next';
import StudentsList from '@/views/Admin/StudentsList';

export const metadata: Metadata = { title: 'Students | MediCode Admin' };

export default function StudentsPage() {
  return <StudentsList />;
}
```

### Step 7 — Sidebar Nav
**Modify** `src/components/admin/AdminSidebar/index.tsx`

Add to `navItems` array:
```typescript
const navItems = [
  { label: 'Teacher Requests', href: '/admin/teacher-requests' },
  { label: 'Students', href: '/admin/students' },
];
```
Active-state highlighting already works via `pathname.startsWith(item.href)`.

### Step 8 — Update AdminSidebar Tests
**Modify** `src/components/admin/AdminSidebar/AdminSidebar.test.tsx`

Add test (following existing mock of `usePathname`):
```typescript
it('renders Students nav link', () => {
  render(<AdminSidebar />);
  expect(screen.getByRole('link', { name: /Students/i })).toBeInTheDocument();
});
```

### Step 9 — StudentsList Tests
**Create** `src/views/Admin/StudentsList/StudentsList.test.tsx`

Mock `adminService.getStudents`. Test cases:
1. Renders heading "Students"
2. Renders search input (`getByLabelText(/Search students/i)`)
3. Shows "Loading..." state (mock never-resolving promise)
4. Renders students in table rows after successful fetch
5. Shows "No students found" for empty result
6. Shows `role="alert"` error on fetch failure
7. Displays `'—'` for null phone number
8. Renders Previous/Next pagination buttons

---

## Key Patterns (from codebase exploration)

- **UUID serialization**: `str(user.id)` required — User model uses `UUID(as_uuid=True)`
- **Schema ORM compat**: `model_config = ConfigDict(from_attributes=True)` required
- **Auth guard**: `AdminLayout` already redirects non-admin users to `/login` — no extra work needed
- **Test imports**: Use `@/test-utils` not `@testing-library/react`; mock with `jest.mocked(adminService.getStudents)`
- **Mock data pattern**: Use `as const` for literal types in test mock objects

---

## Verification

1. **Backend**: `GET /api/admin/students` returns paginated student list with correct fields; search filters by name/email
2. **Frontend**: `npm test` — all StudentsList tests and updated AdminSidebar test pass
3. **Lint/Build**: `npm run lint && npm run build` must pass
4. **E2E**: Login as admin → sidebar shows "Students" link → click → see paginated list → search works → pagination works
5. **Access control**: Non-admin hitting `/admin/students` → redirected to `/login` (handled by AdminLayout)

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

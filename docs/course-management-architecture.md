# Feature: Text-Based Course Management System

## Context
Teachers need to create and publish text-based courses on MediCode Institute. Currently, courses are dummy data — no backend, no CRUD, no real content. This feature adds the full pipeline: teachers create courses with a rich text editor (TipTap), organize content into topics/subtopics, upload images, save drafts, and publish. Students browse published courses, enroll (free), and read the content. Guests see the table of contents but must log in to read.

## Decisions
- **Editor:** TipTap (headless, JSON output, Tailwind-friendly)
- **Structure:** Course → Topics → Subtopics (3 levels)
- **Content storage:** JSONB in PostgreSQL (Supabase)
- **Images:** Supabase Storage bucket, URLs referenced in TipTap JSON
- **Teacher UI:** Separate `/teacher` dashboard (same pattern as `/admin`)
- **Courses are FREE** — enrollment is just a tracking mechanism
- **Auto-save everything** — all fields (metadata, titles, content) auto-save on change with debounce (~1s), no Save buttons. Persistent "Saving..." / "All changes saved" indicator like Google Docs

---

## Database Schema

### `courses`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | default uuid4 |
| teacher_id | UUID FK→users | NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| slug | VARCHAR(220) | UNIQUE, indexed |
| description | TEXT | NOT NULL |
| category | ENUM('medical','cs') | NOT NULL |
| thumbnail_url | VARCHAR(500) | NULL |
| status | ENUM('draft','published') | default 'draft' |
| created_at | TIMESTAMPTZ | server_default now() |
| updated_at | TIMESTAMPTZ | server_default now(), onupdate |

### `topics`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | default uuid4 |
| course_id | UUID FK→courses | ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| order | INTEGER | default 0 |
| created_at | TIMESTAMPTZ | server_default now() |
| updated_at | TIMESTAMPTZ | server_default now(), onupdate |

### `subtopics`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | default uuid4 |
| topic_id | UUID FK→topics | ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| content | JSONB | TipTap JSON, NULL initially |
| order | INTEGER | default 0 |
| created_at | TIMESTAMPTZ | server_default now() |
| updated_at | TIMESTAMPTZ | server_default now(), onupdate |

### `enrollments`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | default uuid4 |
| student_id | UUID FK→users | NOT NULL |
| course_id | UUID FK→courses | NOT NULL |
| enrolled_at | TIMESTAMPTZ | server_default now() |
| | UNIQUE | (student_id, course_id) |

---

## API Endpoints

### Teacher (require_teacher + ownership check)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/teacher/courses` | Create course |
| GET | `/api/teacher/courses` | List my courses |
| GET | `/api/teacher/courses/{course_id}` | Get course with topics/subtopics |
| PUT | `/api/teacher/courses/{course_id}` | Update course metadata |
| DELETE | `/api/teacher/courses/{course_id}` | Delete course (cascades) |
| POST | `/api/teacher/courses/{course_id}/publish` | Publish course |
| POST | `/api/teacher/courses/{course_id}/unpublish` | Unpublish (back to draft) |
| POST | `/api/teacher/courses/{course_id}/topics` | Create topic |
| PUT | `/api/teacher/topics/{topic_id}` | Update topic |
| DELETE | `/api/teacher/topics/{topic_id}` | Delete topic |
| POST | `/api/teacher/topics/{topic_id}/subtopics` | Create subtopic |
| PUT | `/api/teacher/subtopics/{subtopic_id}` | Update subtopic (title + content) |
| DELETE | `/api/teacher/subtopics/{subtopic_id}` | Delete subtopic |
| POST | `/api/teacher/upload-image` | Upload image → Supabase Storage → return URL |

### Public / Student
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/courses` | List published courses (paginated, filterable) |
| GET | `/api/courses/{slug}` | Course detail + TOC (no content) |
| POST | `/api/courses/{slug}/enroll` | Enroll (requires auth + student role) |
| GET | `/api/courses/{slug}/enrollment-status` | Check enrollment |
| GET | `/api/courses/{slug}/subtopics/{subtopic_id}` | Get content (requires enrollment) |

---

## Frontend Pages

### Teacher Dashboard (`/teacher`)
```
/teacher                           → Dashboard (course count, enrollment stats)
/teacher/courses                   → My Courses list (draft/published badges)
/teacher/courses/new               → Create course form
/teacher/courses/[courseId]         → Edit course metadata + publish toggle
/teacher/courses/[courseId]/content → Topic/subtopic manager + TipTap editor
```

### Student / Public
```
/courses                           → Published courses list (from API, not dummy data)
/courses/[slug]                    → Course detail + TOC + Enroll button
/courses/[slug]/learn/[subtopicId] → Read subtopic (enrolled only)
```

---

## Key Reusable Code
- `AppSidebar` (`src/components/layout/AppSidebar/index.tsx`) — add `teacher` variant to `VARIANT_CONFIG` and `TVariant` union
- `AdminLayout` (`src/views/Admin/AdminLayout/index.tsx`) — clone for TeacherLayout, change role check to `teacher`
- `AdminHeader` (`src/components/admin/AdminHeader/`) — clone for TeacherHeader
- `require_teacher` (`backend/app/dependencies/roles.py`) — already exists
- `get_current_user` (`backend/app/dependencies/auth.py`) — for enrollment endpoints
- User model pattern (`backend/app/models/user.py`) — UUID PK, timestamps, enums

---

## New Dependencies
```
# Frontend (npm)
@tiptap/react @tiptap/pm @tiptap/starter-kit
@tiptap/extension-image @tiptap/extension-code-block-lowlight
@tiptap/extension-table @tiptap/extension-table-row
@tiptap/extension-table-cell @tiptap/extension-table-header
lowlight

# Backend (pip)
supabase  (for Supabase Storage uploads)
python-slugify  (for URL slug generation)
```

---

## PR Breakdown (27 PRs)

### Phase 1: Backend Models + Migrations

**PR 1** — Course model + migration
- New: `backend/app/models/course.py` (Course class)
- New: Alembic migration `create_courses_table`
- Files: 2

**PR 2** — Topic model + migration
- Modify: `backend/app/models/course.py` (add Topic class)
- New: Alembic migration `create_topics_table`
- Files: 2

**PR 3** — Subtopic model + migration
- Modify: `backend/app/models/course.py` (add Subtopic class)
- New: Alembic migration `create_subtopics_table`
- Files: 2

**PR 4** — Enrollment model + migration
- Modify: `backend/app/models/course.py` (add Enrollment class)
- New: Alembic migration `create_enrollments_table`
- Files: 2

### Phase 2: Backend Schemas

**PR 5** — Course, Topic, Subtopic schemas
- New: `backend/app/schemas/course.py`
- Files: 1

**PR 6** — Enrollment schemas
- Modify: `backend/app/schemas/course.py`
- Files: 1

### Phase 3: Backend Service Layer

**PR 7** — Course CRUD service
- New: `backend/app/services/course_service.py` (create, read, update, delete, slug generation, ownership check)
- Files: 1

**PR 8** — Topic + Subtopic CRUD service
- Modify: `backend/app/services/course_service.py`
- Files: 1

**PR 9** — Public queries + Enrollment service
- Modify: `backend/app/services/course_service.py` (list published, detail by slug, enroll, check enrollment, get content)
- Files: 1

### Phase 4: Backend API Endpoints

**PR 10** — Teacher course CRUD endpoints
- New: `backend/app/routers/teacher.py`
- Modify: `backend/app/main.py` (include router)
- Files: 2

**PR 11** — Teacher topic + subtopic endpoints
- Modify: `backend/app/routers/teacher.py`
- Files: 1

**PR 12** — Public course list + detail endpoints
- New: `backend/app/routers/courses.py`
- Modify: `backend/app/main.py` (include router)
- Files: 2

**PR 13** — Enrollment + subtopic content endpoints
- Modify: `backend/app/routers/courses.py`
- Files: 1

### Phase 5: Image Upload

**PR 14** — Supabase Storage config + service
- Modify: `backend/app/config.py` (add supabase_url, supabase_service_role_key)
- New: `backend/app/services/storage_service.py`
- Files: 2

**PR 15** — Image upload endpoint
- Modify: `backend/app/routers/teacher.py` (add POST /upload-image)
- Files: 1

### Phase 6: Frontend Types + Services

**PR 16** — Course types
- Modify: `src/types/index.ts` (add ICourseSummary, ICourseDetail, ITopicDetail, ISubtopicSummary, ISubtopicContent, IEnrollment)
- Files: 1

**PR 17** — Frontend API services
- New: `src/services/courseService.ts` (public APIs)
- New: `src/services/teacherCourseService.ts` (teacher CRUD APIs)
- Files: 2

### Phase 7: Teacher Dashboard Shell

**PR 18** — Teacher layout + sidebar variant
- Modify: `src/components/layout/AppSidebar/index.tsx` (add `teacher` variant)
- New: `src/views/Teacher/TeacherLayout/index.tsx` (clone AdminLayout, role='teacher')
- New: `src/components/teacher/TeacherHeader/index.tsx`
- New: `app/teacher/layout.tsx`
- Files: 4

**PR 19** — Teacher dashboard home
- New: `src/views/Teacher/Dashboard/index.tsx`
- New: `app/teacher/page.tsx`
- Files: 2

**PR 20** — Teacher courses list page
- New: `src/views/Teacher/CoursesList/index.tsx`
- New: `app/teacher/courses/page.tsx`
- Files: 2

### Phase 8: Teacher Course CRUD

**PR 21** — Create course form
- New: `src/views/Teacher/CourseForm/index.tsx` (React Hook Form + Zod)
- New: `app/teacher/courses/new/page.tsx`
- Files: 2

**PR 22** — Edit course + publish/unpublish
- New: `app/teacher/courses/[courseId]/page.tsx`
- Modify: `src/views/Teacher/CourseForm/index.tsx` (edit mode, publish button)
- Files: 2

### Phase 9: TipTap Editor

**PR 23** — TipTap editor component + install packages
- Modify: `package.json` (add TipTap deps)
- New: `src/components/course/TipTapEditor/index.tsx`
- New: `src/components/course/TipTapEditor/TipTapToolbar.tsx`
- Files: 3

**PR 24** — Course content management page
- New: `src/views/Teacher/CourseContent/index.tsx` (topic tree + editor pane)
- New: `app/teacher/courses/[courseId]/content/page.tsx`
- Files: 2

**PR 25** — Auto-save everywhere + image upload in editor
- New: `src/hooks/useAutoSave.ts` (generic debounced auto-save hook, "Saving..."/"Saved" state)
- Modify: `src/components/course/TipTapEditor/index.tsx` (auto-save on update, image upload)
- Modify: `src/views/Teacher/CourseForm/index.tsx` (auto-save metadata fields on change)
- Modify: `src/views/Teacher/CourseContent/index.tsx` (auto-save topic/subtopic titles on change)
- Files: 4
- Note: No Save buttons — all fields auto-save with ~1s debounce. Persistent "Saving..." / "All changes saved" indicator in the UI.

### Phase 10: Student-Facing Pages

**PR 26** — Course detail page + enrollment
- New: `src/views/Courses/CourseDetail/index.tsx` (TOC, enroll button)
- New: `src/components/course/TopicAccordion/index.tsx`
- New: `app/(public)/courses/[slug]/page.tsx`
- Files: 3

**PR 27** — Subtopic reader page
- New: `src/views/Courses/SubtopicReader/index.tsx`
- New: `src/components/course/TipTapRenderer/index.tsx` (read-only)
- New: `app/(public)/courses/[slug]/learn/[subtopicId]/page.tsx`
- Files: 3

---

## Merge Order

```
Phase 1: PR 1 → 2 → 3 → 4  (sequential, each migration depends on prior)
Phase 2: PR 5 → 6
Phase 3: PR 7 → 8 → 9
Phase 4: PR 10 → 11, PR 12 → 13  (two parallel chains)
Phase 5: PR 14 → 15
Phase 6: PR 16 → 17
Phase 7: PR 18 → 19 → 20
Phase 8: PR 21 → 22
Phase 9: PR 23 → 24 → 25
Phase 10: PR 26 → 27
```

Backend phases (1-5) go first. Frontend phases (6-10) depend on backend being complete.

---

## Verification
1. **Teacher flow:** Log in as teacher → /teacher → Create course → Add topics/subtopics → Write content with TipTap → Upload image → Save draft → Publish → Verify visible on /courses
2. **Student flow:** Log in as student → Browse /courses → Click course → See TOC → Enroll → Read subtopics
3. **Guest flow:** Visit /courses → Click course → See TOC (locked) → Prompted to log in
4. **Draft isolation:** Create draft course → Not visible on /courses → Not accessible by students
5. Run `npm run lint && npm run build && npm test` before every PR

## Pre-merge checklist (every PR)
- `npm run lint && npm run build && npm test` must pass
- Update CHANGELOG.md + project_status.md before push

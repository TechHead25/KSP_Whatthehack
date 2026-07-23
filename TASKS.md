# NETRA AI — Master Task List
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Chief Architect Agent + Product Manager Agent  
**Note:** This is the granular task breakdown. See SPRINT_BOARD.md for sprint assignments.

---

## Phase 1: Architecture & Documentation ✅ COMPLETE

- [x] Create MASTER_PRD.md
- [x] Create ARCHITECTURE.md
- [x] Create DATABASE.md
- [x] Create API_SPEC.md
- [x] Create SECURITY.md
- [x] Create UI_DESIGN_SYSTEM.md
- [x] Create CODING_STANDARDS.md
- [x] Create SPRINT_BOARD.md
- [x] Create PROJECT_STATE.md
- [x] Create ROADMAP.md
- [x] Create CHANGELOG.md
- [x] Create TASKS.md (this file)

---

## Phase 2: Project Foundation

### Monorepo Setup
- [ ] TASK-001-A: Initialize Turborepo with pnpm workspaces
- [ ] TASK-001-B: Create apps/frontend (Next.js 14)
- [ ] TASK-001-C: Create apps/backend (FastAPI)
- [ ] TASK-001-D: Create apps/ai (AI services)
- [ ] TASK-001-E: Create apps/ml (ML pipelines)
- [ ] TASK-001-F: Create apps/graph (Graph intelligence)
- [ ] TASK-001-G: Create packages/ui (Shared UI library)
- [ ] TASK-001-H: Create packages/types (Shared TypeScript types)
- [ ] TASK-001-I: Create packages/config (Shared config)
- [ ] TASK-001-J: Create packages/shared (Shared utilities)
- [ ] TASK-001-K: Configure ESLint + Prettier for monorepo
- [ ] TASK-001-L: Configure TypeScript project references
- [ ] TASK-001-M: Setup Husky + lint-staged pre-commit
- [ ] TASK-001-N: Create root package.json scripts (dev, build, test, lint)
- [ ] TASK-001-O: Create .env.example for frontend and backend
- [ ] TASK-001-P: Create docker-compose.yml for local development

### Design System (packages/ui + frontend)
- [ ] TASK-002-A: Install and configure TailwindCSS with custom config
- [ ] TASK-002-B: Initialize shadcn/ui
- [ ] TASK-002-C: Create design tokens (colors.ts, typography.ts, spacing.ts, motion.ts)
- [ ] TASK-002-D: Create globals.css with CSS variables (dark theme)
- [ ] TASK-002-E: Load Inter + IBM Plex Sans + IBM Plex Mono fonts (next/font)
- [ ] TASK-002-F: Component: Button (primary, secondary, ghost, danger, loading state)
- [ ] TASK-002-G: Component: Card (default + glass variant)
- [ ] TASK-002-H: Component: Badge (risk levels: critical/high/medium/low + status)
- [ ] TASK-002-I: Component: Input, Textarea, Select (dark theme)
- [ ] TASK-002-J: Component: DataTable (with sorting, filtering, pagination)
- [ ] TASK-002-K: Component: Modal/Dialog
- [ ] TASK-002-L: Component: Toast (animated, with severity levels)
- [ ] TASK-002-M: Component: Sidebar (collapsible, role-based nav items)
- [ ] TASK-002-N: Component: TopBar (search, alerts, profile)
- [ ] TASK-002-O: Component: PageHeader (title, breadcrumb, actions)
- [ ] TASK-002-P: Component: SkeletonLoader (for loading states)
- [ ] TASK-002-Q: Component: EmptyState (no data variant)
- [ ] TASK-002-R: Component: ErrorBoundary
- [ ] TASK-002-S: Theme provider + dark mode context

### Backend Foundation
- [ ] TASK-003-A: FastAPI app initialization with lifespan events
- [ ] TASK-003-B: Global exception handler middleware
- [ ] TASK-003-C: Request ID middleware (X-Request-ID header)
- [ ] TASK-003-D: Audit log middleware (async, non-blocking)
- [ ] TASK-003-E: CORS middleware configuration
- [ ] TASK-003-F: Rate limiting middleware (Redis-based)
- [ ] TASK-003-G: Structured logging setup (structlog)
- [ ] TASK-003-H: Database connection pool (async SQLAlchemy)
- [ ] TASK-003-I: Dependency injection setup (FastAPI Depends)
- [ ] TASK-003-J: Environment configuration (Pydantic Settings)
- [ ] TASK-003-K: Health check endpoint (GET /health)
- [ ] TASK-003-L: Catalyst Data Store connection utilities
- [ ] TASK-003-M: Neo4j driver setup and connection pooling
- [ ] TASK-003-N: Redis client setup
- [ ] TASK-003-O: Base repository class with pagination support

### Database Setup
- [ ] TASK-004-A: Migration 001: Create all primary tables (PostgreSQL)
- [ ] TASK-004-B: Migration 002: Create all indexes
- [ ] TASK-004-C: Migration 003: Enable PostGIS + pgvector extensions
- [ ] TASK-004-D: Migration 004: Create audit_logs table (append-only)
- [ ] TASK-004-E: Neo4j schema: Create constraints and indexes
- [ ] TASK-004-F: Neo4j schema: Create GDS graph projection
- [ ] TASK-004-G: Seed data: 5 Karnataka districts
- [ ] TASK-004-H: Seed data: 25 police stations
- [ ] TASK-004-I: Seed data: 10 officer accounts (one per role)
- [ ] TASK-004-J: Seed data: 500 synthetic FIRs with geospatial data
- [ ] TASK-004-K: Seed data: 200 suspect profiles
- [ ] TASK-004-L: Seed data: Criminal network relationships (Neo4j)
- [ ] TASK-004-M: Seed data: Historical crime hotspots

### Authentication Module
- [ ] TASK-005-A: Catalyst Auth integration (login verification)
- [ ] TASK-005-B: JWT generation (RS256) with officer claims
- [ ] TASK-005-C: JWT verification dependency (FastAPI)
- [ ] TASK-005-D: Refresh token logic + rotation
- [ ] TASK-005-E: RBAC permission check dependency
- [ ] TASK-005-F: Jurisdiction scope dependency
- [ ] TASK-005-G: MFA TOTP generation + verification
- [ ] TASK-005-H: Account lockout logic (5 failed attempts)
- [ ] TASK-005-I: POST /auth/login endpoint
- [ ] TASK-005-J: POST /auth/mfa/verify endpoint
- [ ] TASK-005-K: POST /auth/refresh endpoint
- [ ] TASK-005-L: POST /auth/logout endpoint
- [ ] TASK-005-M: Frontend: Login page (dark animated)
- [ ] TASK-005-N: Frontend: MFA page
- [ ] TASK-005-O: Frontend: Auth store (Zustand)
- [ ] TASK-005-P: Frontend: API client with auth interceptor
- [ ] TASK-005-Q: Frontend: Protected route middleware (Next.js middleware.ts)
- [ ] TASK-005-R: Frontend: Auto token refresh (Axios interceptor)

---

## Phase 3-5: Intelligence Modules (Detailed tasks in SPRINT_BOARD.md)

### FIR Module
- [ ] TASK-006-A: FIR repository (CRUD + filters + pagination)
- [ ] TASK-006-B: FIR service (jurisdiction-scoped)
- [ ] TASK-006-C: GET /firs endpoint with all filters
- [ ] TASK-006-D: GET /firs/{id} with full detail
- [ ] TASK-006-E: POST /firs (create FIR)
- [ ] TASK-006-F: GET /firs/{id}/related (AI-powered)
- [ ] TASK-006-G: FIR AI summarization (Gemini)
- [ ] TASK-006-H: Vector embedding on FIR create/update
- [ ] TASK-006-I: Frontend: FIR search page with filters
- [ ] TASK-006-J: Frontend: FIR detail page
- [ ] TASK-006-K: Frontend: FIR creation form

### AI Intelligence Assistant
- [ ] TASK-007-A: LangChain RAG pipeline setup
- [ ] TASK-007-B: Vector store retriever (FIR + suspect embeddings)
- [ ] TASK-007-C: Conversation memory (PostgreSQL-backed)
- [ ] TASK-007-D: Gemini chat model integration
- [ ] TASK-007-E: System prompt engineering (crime intelligence expert)
- [ ] TASK-007-F: Citation extraction from AI response
- [ ] TASK-007-G: Suggested questions generation
- [ ] TASK-007-H: POST /intelligence/query (streaming)
- [ ] TASK-007-I: Conversation CRUD endpoints
- [ ] TASK-007-J: Voice transcription (Whisper API)
- [ ] TASK-007-K: Frontend: AI chat interface
- [ ] TASK-007-L: Frontend: Streaming response rendering
- [ ] TASK-007-M: Frontend: Citation link rendering
- [ ] TASK-007-N: Frontend: Voice input button + transcription
- [ ] TASK-007-O: Frontend: Conversation history sidebar
- [ ] TASK-007-P: Frontend: PDF export

### Criminal Network Graph
- [ ] TASK-008-A: Neo4j graph ingestion pipeline
- [ ] TASK-008-B: Graph API: GET /suspects/{id}/network
- [ ] TASK-008-C: Graph API: POST /graph/path (shortest path)
- [ ] TASK-008-D: Graph API: GET /graph/communities
- [ ] TASK-008-E: Graph API: GET /graph/centrality
- [ ] TASK-008-F: Community detection (Louvain via GDS)
- [ ] TASK-008-G: Centrality computation (Betweenness + PageRank)
- [ ] TASK-008-H: Frontend: React Force Graph 3D setup
- [ ] TASK-008-I: Frontend: Node type rendering (Person/Vehicle/etc)
- [ ] TASK-008-J: Frontend: Community color coding
- [ ] TASK-008-K: Frontend: Centrality size scaling
- [ ] TASK-008-L: Frontend: Click → suspect profile panel
- [ ] TASK-008-M: Frontend: Filter controls
- [ ] TASK-008-N: Frontend: Shortest path highlight
- [ ] TASK-008-O: Frontend: Export PNG/SVG

### Crime Heatmap & Hotspot
- [ ] TASK-009-A: Crime density GeoJSON API
- [ ] TASK-009-B: Hotspot prediction API
- [ ] TASK-009-C: Kernel Density Estimation (scipy)
- [ ] TASK-009-D: Prophet temporal model training
- [ ] TASK-009-E: XGBoost spatial risk model training
- [ ] TASK-009-F: Hotspot polygon generation (convex hull/alphashape)
- [ ] TASK-009-G: Catalyst Cron: Daily prediction update
- [ ] TASK-009-H: Frontend: MapLibre GL map setup
- [ ] TASK-009-I: Frontend: Heatmap layer rendering
- [ ] TASK-009-J: Frontend: Hotspot polygon overlay
- [ ] TASK-009-K: Frontend: Station boundary overlay
- [ ] TASK-009-L: Frontend: Filter controls panel
- [ ] TASK-009-M: Frontend: Time-lapse animation mode

### Risk Analytics
- [ ] TASK-010-A: XGBoost risk model training
- [ ] TASK-010-B: SHAP explainer integration
- [ ] TASK-010-C: Risk score API endpoints
- [ ] TASK-010-D: Daily risk score update (Catalyst Cron)
- [ ] TASK-010-E: Frontend: Suspect risk profile card
- [ ] TASK-010-F: Frontend: SHAP waterfall chart
- [ ] TASK-010-G: Frontend: Risk trend chart
- [ ] TASK-010-H: Frontend: Risk matrix visualization

### Court Report Generator
- [ ] TASK-011-A: Report data assembly service
- [ ] TASK-011-B: AI narrative generation (Gemini)
- [ ] TASK-011-C: PDF generation (WeasyPrint)
- [ ] TASK-011-D: Watermark + classification stamp
- [ ] TASK-011-E: POST /reports/generate endpoint (async)
- [ ] TASK-011-F: Catalyst File Store: PDF upload
- [ ] TASK-011-G: Frontend: Report generation form
- [ ] TASK-011-H: Frontend: Report preview
- [ ] TASK-011-I: Frontend: Report list + download

---

## Phase 7: Testing

- [ ] TASK-018-A: Backend unit tests (services, repositories)
- [ ] TASK-018-B: Backend integration tests
- [ ] TASK-018-C: Backend API tests (TestClient)
- [ ] TASK-018-D: Security tests (auth bypass, IDOR, injection)
- [ ] TASK-018-E: Frontend component tests (Vitest)
- [ ] TASK-018-F: Frontend E2E tests (Playwright)
- [ ] TASK-018-G: Performance benchmarks (k6)
- [ ] TASK-018-H: Accessibility audit (axe-core)

---

## Phase 8: Deployment

- [ ] TASK-021-A: Catalyst AppSail setup (frontend)
- [ ] TASK-021-B: Catalyst AppSail setup (backend)
- [ ] TASK-021-C: Catalyst Functions deployment (AI endpoints)
- [ ] TASK-021-D: Environment variables configuration
- [ ] TASK-021-E: Catalyst Cron jobs configuration
- [ ] TASK-021-F: Catalyst Monitoring setup
- [ ] TASK-021-G: Final data seed (production demo data)
- [ ] TASK-021-H: Judge demo guide creation
- [ ] TASK-021-I: Performance testing (production load)
- [ ] TASK-021-J: Security final audit

---

## Progress Summary

| Phase | Total Tasks | Completed | Progress |
|---|---|---|---|
| Phase 1 (Docs) | 12 | 12 | 100% ✅ |
| Phase 2 (Foundation) | 57 | 0 | 0% |
| Phase 3-5 (Modules) | 78 | 0 | 0% |
| Phase 7 (Testing) | 8 | 0 | 0% |
| Phase 8 (Deploy) | 10 | 0 | 0% |
| **TOTAL** | **165** | **12** | **7%** |

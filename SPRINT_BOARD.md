# NETRA AI — Sprint Board & Task Management
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Product Manager Agent + Chief Architect Agent  
**Status:** ACTIVE — Phase 1 Complete → Phase 2 Starting

---

## Sprint Overview

| Sprint | Phase | Focus | Duration | Status |
|---|---|---|---|---|
| Sprint 0 | 1 | Architecture & Documentation | 1 day | ✅ COMPLETE |
| Sprint 1 | 2-3 | Project Setup + Auth + Dashboard | 3 days | 🔵 NEXT |
| Sprint 2 | 4-5 | FIR + AI Assistant + Graph | 4 days | ⬜ PENDING |
| Sprint 3 | 5-6 | Heatmap + ML + Risk Analytics | 3 days | ⬜ PENDING |
| Sprint 4 | 6 | Evidence + Timeline + Reports | 3 days | ⬜ PENDING |
| Sprint 5 | 6 | Patrol + Alerts + Admin | 2 days | ⬜ PENDING |
| Sprint 6 | 7 | Testing + QA | 2 days | ⬜ PENDING |
| Sprint 7 | 8 | Deployment + Demo Prep | 1 day | ⬜ PENDING |

---

## ✅ Sprint 0 — Architecture & Documentation (COMPLETE)

### Deliverables
- [x] MASTER_PRD.md — Product requirements
- [x] ARCHITECTURE.md — System architecture
- [x] DATABASE.md — Database schema
- [x] API_SPEC.md — API specification
- [x] SECURITY.md — Security architecture
- [x] UI_DESIGN_SYSTEM.md — Design system
- [x] CODING_STANDARDS.md — Engineering guidelines
- [x] SPRINT_BOARD.md — This document
- [x] ROADMAP.md — Product roadmap
- [x] CHANGELOG.md — Change tracking
- [x] PROJECT_STATE.md — State tracking
- [x] TASKS.md — Detailed task breakdown

---

## 🔵 Sprint 1 — Foundation (NEXT)

### TASK-001: Monorepo Setup
**Agent:** DevOps Agent  
**Priority:** P0  
**Estimate:** 2 hours

- [ ] Initialize Turborepo monorepo
- [ ] Create package.json workspace config
- [ ] Setup apps/frontend (Next.js 14)
- [ ] Setup apps/backend (FastAPI)
- [ ] Setup packages/ui, packages/types, packages/config
- [ ] Configure ESLint, Prettier, TypeScript
- [ ] Setup Husky pre-commit hooks
- [ ] Create .env.example files

### TASK-002: Design System Implementation
**Agent:** Frontend Agent + UI/UX Agent  
**Priority:** P0  
**Estimate:** 3 hours

- [ ] Install and configure TailwindCSS
- [ ] Install shadcn/ui base components
- [ ] Create design tokens (colors, typography, spacing)
- [ ] Create global CSS with CSS variables
- [ ] Setup Inter + IBM Plex fonts
- [ ] Create base component library:
  - [ ] Button (variants: primary, secondary, ghost, danger)
  - [ ] Card (glass variant)
  - [ ] Badge (risk levels, status)
  - [ ] Input, Textarea, Select
  - [ ] Table with sorting
  - [ ] Modal/Dialog
  - [ ] Toast notifications
  - [ ] Sidebar navigation
  - [ ] TopBar component
  - [ ] Loading states (skeleton, spinner)

### TASK-003: Authentication Module
**Agent:** Backend Agent + Security Agent  
**Priority:** P0  
**Estimate:** 4 hours

**Backend:**
- [ ] FastAPI app setup with middleware
- [ ] Catalyst Auth integration
- [ ] JWT token generation (RS256)
- [ ] Refresh token logic
- [ ] RBAC middleware
- [ ] Jurisdiction scope enforcement
- [ ] Auth router (/auth/login, /refresh, /logout)
- [ ] MFA endpoints

**Frontend:**
- [ ] Login page (dark theme, animated)
- [ ] MFA verification page
- [ ] Auth store (Zustand)
- [ ] API client with JWT interceptor
- [ ] Protected route HOC
- [ ] Auto-refresh token logic

### TASK-004: Application Shell
**Agent:** Frontend Agent  
**Priority:** P0  
**Estimate:** 3 hours

- [ ] Sidebar navigation with role-based items
- [ ] TopBar with search, alerts bell, profile
- [ ] Role badge display
- [ ] Responsive layout container
- [ ] Page transition animations (Framer Motion)
- [ ] Dark theme provider

### TASK-005: Officer Dashboard
**Agent:** Frontend Agent + Backend Agent  
**Priority:** P0  
**Estimate:** 4 hours

**Backend:**
- [ ] GET /analytics/dashboard endpoint
- [ ] Aggregation queries (FIR counts, trends)
- [ ] WebSocket for real-time updates

**Frontend:**
- [ ] Animated KPI cards (6 metrics)
- [ ] Crime type donut chart
- [ ] 7-day crime trend line chart
- [ ] Top crime areas bar chart
- [ ] Active alerts panel
- [ ] Recent FIRs list
- [ ] Role-adaptive widget visibility

---

## ⬜ Sprint 2 — Intelligence Core

### TASK-006: FIR Search Module
- [ ] Advanced search with multiple filters
- [ ] Full-text search (Catalyst Search)
- [ ] List view + detail view
- [ ] AI-powered "related FIRs" discovery
- [ ] FIR creation form (validated)

### TASK-007: AI Intelligence Assistant
- [ ] LangChain RAG pipeline setup
- [ ] Gemini integration
- [ ] Conversation memory (PostgreSQL)
- [ ] Citation extraction and display
- [ ] Voice input (Whisper)
- [ ] Chat UI with streaming response
- [ ] Suggested questions
- [ ] Conversation history sidebar
- [ ] PDF export

### TASK-008: Criminal Network Graph
- [ ] Neo4j connection and schema setup
- [ ] Graph data API endpoints
- [ ] React Force Graph visualization
- [ ] Community detection display
- [ ] Centrality coloring
- [ ] Node click → suspect profile
- [ ] Shortest path finder
- [ ] Filter controls (crime type, date)
- [ ] Export graph as PNG

---

## ⬜ Sprint 3 — Geospatial & ML

### TASK-009: Crime Heatmap
- [ ] MapLibre/Leaflet map setup
- [ ] Karnataka boundary GeoJSON
- [ ] Crime density heatmap layer
- [ ] Station/beat boundary overlay
- [ ] Crime type + time filters
- [ ] Animation (time-lapse mode)

### TASK-010: Hotspot Prediction ML
- [ ] Feature engineering pipeline
- [ ] Prophet temporal forecasting
- [ ] XGBoost spatial risk model
- [ ] Hotspot polygon generation
- [ ] Prediction API endpoint
- [ ] Prediction overlay on map
- [ ] Prediction accuracy metrics

### TASK-011: Risk Analytics
- [ ] Risk score calculation (XGBoost)
- [ ] SHAP explanation integration
- [ ] Suspect risk profile UI
- [ ] Risk trend charts
- [ ] Risk matrix visualization
- [ ] Daily risk score update (Catalyst Cron)

---

## ⬜ Sprint 4 — Investigation Tools

### TASK-012: Evidence Explorer
- [ ] Evidence list per FIR
- [ ] Evidence upload (Catalyst File Store)
- [ ] Evidence type filtering
- [ ] Chain of custody display
- [ ] Evidence preview (image/document)

### TASK-013: Case Timeline
- [ ] Chronological event visualization
- [ ] FIR events, arrests, bail, hearings
- [ ] Interactive timeline scrubbing
- [ ] Export as PDF section

### TASK-014: Court Report Generator
- [ ] Report template system
- [ ] 5 report types
- [ ] AI narrative generation (Gemini)
- [ ] PDF generation (WeasyPrint/Puppeteer)
- [ ] Watermark + classification stamp
- [ ] Report management page

---

## ⬜ Sprint 5 — Operations

### TASK-015: Patrol Recommendations
- [ ] Patrol zone risk scoring
- [ ] Shift-based recommendations
- [ ] Map visualization of zones
- [ ] Officer assignment logic
- [ ] Recommendation refresh (8-hour cycle)

### TASK-016: Early Warning System
- [ ] Alert rule engine
- [ ] Alert types (hotspot, suspect, anomaly)
- [ ] WebSocket push notifications
- [ ] Alert management page
- [ ] Acknowledge/resolve workflow
- [ ] Alert severity coloring

### TASK-017: Administration Panel
- [ ] Officer management CRUD
- [ ] Role assignment
- [ ] Station/district management
- [ ] Audit log viewer with filters
- [ ] System health dashboard

---

## ⬜ Sprint 6 — Testing

### TASK-018: Backend Testing
- [ ] Unit tests (90% coverage target)
- [ ] Integration tests
- [ ] API endpoint tests
- [ ] Security tests (auth bypass, IDOR)
- [ ] Performance tests (k6)

### TASK-019: Frontend Testing
- [ ] Component tests (Vitest + Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Accessibility tests (axe-core)

### TASK-020: AI Testing
- [ ] RAG accuracy evaluation
- [ ] Prompt safety testing
- [ ] Response latency benchmarks

---

## ⬜ Sprint 7 — Deployment

### TASK-021: Catalyst Deployment
- [ ] AppSail configuration (frontend)
- [ ] AppSail configuration (backend)
- [ ] Catalyst Functions deployment (AI)
- [ ] Environment variables configuration
- [ ] Catalyst Cron jobs setup
- [ ] Monitoring and alerting setup

### TASK-022: Demo Preparation
- [ ] Seed data script (realistic Karnataka data)
- [ ] Demo scenario scripts
- [ ] Judge demo guide
- [ ] Performance optimization
- [ ] Final security review

---

## Velocity & Progress Tracking

| Sprint | Planned Tasks | Completed | Velocity |
|---|---|---|---|
| Sprint 0 | 12 | 12 | 100% |
| Sprint 1 | 5 | 0 | TBD |

---

## Team Agent Assignments

| Agent | Primary Sprints | Current Task |
|---|---|---|
| Chief Architect | All | Architecture review |
| Product Manager | All | Sprint planning |
| UI/UX Design | 1-5 | Design system |
| Frontend | 1-5 | Implementation |
| Backend | 1-5 | API implementation |
| AI | 2-4 | RAG pipeline |
| Graph Intelligence | 2 | Neo4j setup |
| ML | 3 | Model training |
| Database | 1 | Schema setup |
| DevOps | 1, 7 | Infrastructure |
| Security | 1, 6 | Auth + review |
| QA | 6 | Testing |
| Documentation | 0, 7 | Docs |

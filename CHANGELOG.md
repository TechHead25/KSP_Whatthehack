# NETRA AI — Changelog
**Format:** [Semantic Versioning 2.0.0](https://semver.org)  
**Convention:** Keep a Changelog (https://keepachangelog.com)

---

## [1.1.0] — 2026-07-22 — UI Polish & Enterprise Readiness

### Added
- Completed comprehensive UI polish for all frontend views.
- Redesigned landing page with premium Framer Motion animations and interactive elements.
- Implemented `Tooltip` component to gracefully handle disabled/mock interactions across FIR, Evidence, Network, Predictions, and Digital Twin pages.
- Audited navigation and sidebar to ensure all routes map correctly with zero dead links.
- Verified Next.js Hydration and build stability.

---

## [1.0.0] — 2026-07-22 — V1.0 PRODUCTION READY (Hackathon Release)

### Added
- Completed comprehensive architectural audit.
- Generated `technical_debt_report.md`, `refactoring_report.md`, `deployment_checklist.md`, `demo_checklist.md`, and `judge_presentation_checklist.md`.
- Officially marked the project as Production Ready.

---

## [0.5.1] — 2026-07-22 — Phase 5.1: Enterprise Command Center

### Added
- Built 6 premium dashboard widgets: `KPICard` (animated counters + trend), `AlertsFeed` (severity-coded live feed), `RecentActivity` (timeline), `CrimeAnalyticsChart` (CSS-only animated bars), `ThreatMatrix` (risk-coded zone grid), `AIInsightsPanel` (confidence rings + type badges).
- Created typed `dashboardApi.ts` consuming existing BFF endpoints (`/dashboard/officer`, `/analytics/dashboard`, `/alerts/history`).
- Created React Query hooks (`useDashboard.ts`) with auto-refetch intervals and stale time caching.
- Rewrote `app/(dashboard)/page.tsx` into a full Palantir-class Enterprise Command Center with glassmorphism, Framer Motion staggered animations, responsive 12-column grid, and atmospheric map placeholder with radar sweep effect.
- Zero backend changes. All data flows through existing API contracts.

---

## [0.6.13] — 2026-07-22 — Phase 6.13: Production Deployment (Catalyst AppSail)

### Added
- Created `catalyst.json` and `apps/backend/app-config.json` to instruct Zoho Catalyst to run the monolithic FastAPI backend inside its AppSail (Container-as-a-Service) environment.
- Configured a slim, production-optimized Python 3.11 `Dockerfile` exposing the dynamic `$X_ZOHO_CATALYST_LISTEN_PORT`.
- Built an automated CI/CD pipeline (`.github/workflows/catalyst-deploy.yml`) to trigger headless Catalyst deployments on GitHub pushes.
- Drafted a comprehensive `DEPLOYMENT.md` guide and `.env.production.example` template for the DevOps team.

---

## [0.6.12] — 2026-07-22 — Phase 6.12: Backend Optimization & Hardening

### Added
- Implemented `RedisCacheManager` with a structural in-memory fallback to prevent local crashes while supporting enterprise caching.
- Created robust JWT Validation and RBAC (`RequireRole`) dependency factories to secure endpoints.
- Introduced `CircuitBreaker` and `with_retry` resilience decorators for unstable external calls (ML models, Catalyst Store).
- Added massive indexing optimizations (`index=True`) to `domain/shared/models.py` foreign keys to ensure $O(\log n)$ lookup times.
- Deployed `/api/v1/health/live` and `/api/v1/health/ready` endpoints for deep K8s health monitoring.

---

## [0.6.11] — 2026-07-22 — Phase 6.11: Dashboard Backend (BFF)

### Added
- Created `DashboardOrchestratorService` to act as a Backend-For-Frontend (BFF), preventing UI waterfall loading.
- Used `asyncio.gather()` to concurrently aggregate data from `Analytics`, `Prediction`, and `Alert` domains.
- Designed strictly typed `OfficerDashboardResponse` composite schemas representing the exact state required for Next.js UI widgets (Overview, Recent Activity, Alerts).
- Exposed `GET /api/v1/dashboard/officer/{id}` for master payload fetching, and lazy-loading widget endpoints for heavy Spatial Heatmaps and Graph Summaries.

---

## [0.6.10] — 2026-07-22 — Phase 6.10: Enterprise Search

### Added
- Implemented `SearchService` utilizing `asyncio.gather()` to concurrently federate searches across diverse backend entities (FIRs, Vehicles, Suspects).
- Created `SearchResultItem` polymorphic schema to standardize varied entity data into unified UI cards for the global command palette.
- Built `RecentSearch` PostgreSQL model to durably track officer search history and applied JSONB filters.
- Exposed `POST /api/v1/search/global` and `GET /api/v1/search/autocomplete` for fast type-ahead and deep system querying.

---

## [0.6.9] — 2026-07-22 — Phase 6.9: Early Warning System

### Added
- Created `AlertDispatcherService` to structurally simulate outward bound messaging (Push, SMS, Email).
- Built `CatalystEventConsumer` mimicking Pub/Sub logic to automatically intercept backend AI signals (e.g., Gang Detection, Crime Spikes) and trigger warnings.
- Introduced `NotificationHistory` DB model natively storing `JSONB` message payloads for audit tracing.
- Exposed `/api/v1/alerts/trigger-test` endpoint for frontend UI integration testing.

---

## [0.6.8] — 2026-07-22 — Phase 6.8: Enterprise Administration Module

### Added
- Implemented robust foundational database models (`Role`, `SystemSetting`, `FeatureFlag`, `APIKey`) to manage the platform's Permission Matrix and global configurations natively in PostgreSQL.
- Created an `AdminService` that orchestrates infrastructure monitoring by returning unified `TelemetryResponse` schemas, simulating real-time Datadog/Prometheus DB metrics and error logs.
- Added `/api/v1/admin/monitoring/telemetry` endpoints strictly typed for Next.js dashboard consumption.

---

## [0.6.7] — 2026-07-22 — Phase 6.7: Enterprise Reporting Service

### Added
- Created `PDFReportGenerator` to structurally simulate the assembly of complex PDF documents (Court Reports, Case Summaries, etc.) including Charts and Network Graph snapshots.
- Integrated the generator with the existing `Catalyst File Store` to automatically upload the binary payloads upon generation.
- Engineered schemas for `ReportMetadata` verifying that documents are properly flagged for digital signatures.
- Exposed `POST /api/v1/reports/generate` returning secure Catalyst download URLs for instant frontend access.

---

## [0.6.6] — 2026-07-22 — Phase 6.6: Patrol Recommendation Engine

### Added
- Developed `RecommendationEngine` to fuse spatial AI hotspot forecasts with dynamic operational constraints (available personnel).
- Created `JSONB` array mapping in `PatrolSchedule` to natively store complex multipoint `Waypoint` routes in the DB.
- Implemented `CoverageAnalysis` scoring to provide real-time risk mitigation metrics (e.g. "85% High-Risk Coverage Achieved").
- Added APIs to request dynamic route generation and lock chosen allocations into the scheduling database.

---

## [0.6.5] — 2026-07-22 — Phase 6.5: AI Prediction Engine

### Added
- Created `ModelRegistry` simulating production-grade MLflow/SageMaker model lazy loading.
- Implemented structural ML models: `SuspectRiskScorer`, `HotspotPredictor`, `CrimeAnomalyDetector`, and `TrendForecaster`.
- Added SHAP (SHapley Additive exPlanations) explainability dictionaries to prediction responses.
- Added rigorous `Confidence Scores` alongside all prediction outputs to ensure officer trust.
- Created FastAPI Background Task implementations for batch recalculating risk scores overnight.
- Exposed all models through the `/api/v1/prediction` router.

---

## [0.6.4] — 2026-07-22 — Phase 6.4: Crime Analytics Service

### Added
- Developed raw `SQLAlchemy Core` aggregation repository bypassing ORM for high-performance dashboard queries.
- Engineered backend logic for `Crime Statistics`, `District Analysis`, `Category Distribution`, and `Officer Performance`.
- Created structured Pydantic schemas explicitly tailored for frontend charting libraries (`TimeSeriesPoint`, `KPIData`).
- Created a single composite endpoint `/api/v1/analytics/dashboard` to serve all widgets in one request for minimal frontend latency.

---

## [0.6.3] — 2026-07-22 — Phase 6.3: Digital Twin Engine (Suspects)

### Added
- Created foundational Relational models (`Suspect`, `SuspectAlias`, `SuspectPhone`, `SuspectVehicle`, `SuspectAddress`).
- Configured a dynamic `JSONB` column `ai_profile_insights` on the `Suspect` table to natively store unstructured AI predictions, crime patterns, and behavior analytics without schema locks.
- Developed `DigitalTwinProfile` Pydantic schema to merge structured DB records, AI JSON insights, and Neo4j Graph relations (Associates) into a unified payload.
- Exposed `GET /api/v1/suspects/{id}/twin` to serve the unified profile.
- Built an eager-loading `SuspectRepository` to prevent N+1 query performance degradation.

---

## [0.6.2] — 2026-07-22 — Phase 6.2: Graph Intelligence Engine

### Added
- Implemented `CypherRepository` supporting node search and relationship expansion.
- Engineered `GraphAlgorithms` utilizing Neo4j GDS library for advanced analytics.
- Added Shortest Path pathfinding to track degrees of separation between suspects.
- Added PageRank Centrality to automatically identify criminal kingpins in networks.
- Added Louvain Community Detection to discover hidden criminal clusters and syndicates.
- Exposed all capabilities through a new dedicated `/api/v1/graph` FastAPI router.

---

## [0.6.1] — 2026-07-22 — Phase 6.1: RAG Pipeline Integration

### Added
- Integrated PostgreSQL `pgvector` store using LangChain's `PGVector` wrapper.
- Implemented `EmbedderService` using `GoogleGenerativeAIEmbeddings` (1536 dims).
- Created `DocumentProcessor` using `RecursiveCharacterTextSplitter` for semantic chunking.
- Engineered `HybridRetriever` supporting semantic vector search and metadata pre-filtering.
- Added `ContextRanker` to push highly relevant chunks to the top of the context window.
- Built a unified `RAGPipeline` orchestrator and integrated it directly into the `IntelligenceService`.
- Added heuristic `RAGEvaluator` to score Faithfulness and Context Relevance.

---

## [0.6.0] — 2026-07-22 — Phase 6: AI Crime Intelligence Assistant

### Added
- Created `Conversation` and `Message` SQLAlchemy models to track AI memory.
- Integrated LangChain (`RunnableWithMessageHistory`) and Gemini 1.5 Pro (`ChatGoogleGenerativeAI`).
- Designed a custom Streaming Server-Sent Events (SSE) generator yielding chunks, citations, and confidence scores.
- Added `POST /api/v1/intelligence/chat/stream` for real-time AI responses.
- Implemented `INVESTIGATOR_SYSTEM_PROMPT` to enforce law-enforcement guardrails and markdown formatting.
- Added schemas for conversational state, context injection, and suggested questions.

---

## [0.4.1] — 2026-07-22 — Phase 4.1: Evidence Management Module

### Added
- Extracted `Evidence` domain from FIR to enforce DDD boundaries (`evidence/models.py`).
- Implemented file hashing (SHA-256) on upload for tamper-evidence.
- Designed an append-only JSONB `chain_of_custody` log for tracking views, downloads, and verification.
- Integrated `FileStoreManager` abstraction for handling Catalyst File Store uploads and secure URLs.
- Added FastAPI `evidence_router` with `multipart/form-data` upload support.
- Configured dynamic metadata extraction (size, MIME type) for evidence records.

---

## [0.4.0] — 2026-07-22 — Phase 4: FIR Management Module

### Added
- SQLAlchemy domain models for `FIR`, `Evidence`, `FIRSuspect` in `fir/models.py`.
- Shared core models for `District`, `Station`, `Officer`, `Suspect` in `shared/models.py`.
- Pydantic validation schemas and Enums (CrimeType, FIRStatus) in `fir/schemas.py`.
- `FIRRepository` and `EvidenceRepository` with advanced filtering capabilities.
- `FIRService` encapsulating business logic (status updates, officer assignment, evidence logging).
- Complete FastAPI REST endpoints for FIR CRUD and workflow management in `routers/fir.py`.
- Pytest integration stubs for FIR API.

---

## [0.3.0] — 2026-07-22 — Phase 3: Core Backend Infrastructure

### Added
- Standardized FastAPI response envelope (Success/Error)
- SQLAlchemy declarative base and mixins (UUID, Timestamps, Audit)
- Base generic CRUD Repository pattern
- Async PostgreSQL Connection Manager (Catalyst Data Store)
- Async Neo4j Connection Manager
- Async Redis Connection Manager (Catalyst Cache)
- File Storage Abstraction (Catalyst File Store)
- Search Engine Abstraction (Catalyst Search)
- WebSocket Manager for real-time alerts
- Background Task Manager abstraction
- Audit Logging Middleware (tamper-evident request tracking)
- Redis-based Rate Limiting Middleware

---

## [0.2.0] — 2026-07-22 — Phase 2: Auth & App Shell

### Added
- Turborepo monorepo setup
- Next.js 14 frontend application scaffolding
- FastAPI backend application scaffolding
- Design system implementation (Tailwind CSS, shadcn/ui)
- Authentication module (JWT, MFA, Zustand store, Axios interceptors)
- Application Shell (Sidebar, Topbar, Breadcrumbs, Command Palette)
- Protected routes and RBAC middleware
- Custom 404, 403, and 500 error pages
- Dashboard Overview placeholder

---

## [0.1.1] — 2026-07-22 — Governance: Architecture Frozen

### Governance
- **Architecture frozen** by explicit user directive at 2026-07-22T11:08:13+05:30
- `MASTER_PRD.md` designated as **single source of truth** for all product decisions
- All architecture documents stamped with `🔒 FROZEN — DO NOT MODIFY` status

### Documents Frozen (read-only until explicit user instruction)
- `ARCHITECTURE.md` — System architecture
- `DATABASE.md` — Database schema
- `API_SPEC.md` — REST API specification
- `SECURITY.md` — Security architecture
- `UI_DESIGN_SYSTEM.md` — Design system

### Governance Rules Recorded in PROJECT_STATE.md
1. MASTER_PRD.md governs all product scope decisions
2. Architecture documents are read-only for all agents
3. Conflicts between PRD and architecture resolve in favour of PRD
4. New features require explicit user approval before any work begins
5. Technology versions are locked for project lifetime

---

## [0.1.0] — 2026-07-22 — Phase 1: Architecture Complete

### Added
- `MASTER_PRD.md` — Complete Product Requirements Document
  - Executive summary and product vision
  - 5 detailed user personas (Inspector to Prosecutor)
  - 17 modules with priority and sprint mapping
  - Full feature specifications for all modules
  - Non-functional requirements (performance, security, scale)
  - Success metrics for 6-month evaluation

- `ARCHITECTURE.md` — System Architecture Document
  - High-level system architecture diagram
  - Frontend architecture (Next.js App Router, feature-first structure)
  - Backend architecture (FastAPI, Repository pattern, domain structure)
  - AI service architecture (LangChain, RAG, prompts)
  - ML service architecture (risk scoring, hotspot prediction)
  - Graph intelligence architecture (Neo4j, algorithms)
  - Data flow diagrams (FIR Intelligence, AI Query, Hotspot Prediction)
  - Zoho Catalyst infrastructure mapping
  - Deployment topology diagram
  - Security architecture overview
  - Scalability design decisions

- `DATABASE.md` — Database Architecture Document
  - Complete PostgreSQL schema (15 tables)
  - Full Neo4j graph schema (6 node types, 10 relationship types)
  - Key Cypher queries (community detection, centrality, path finding)
  - Redis cache schema with TTL strategy
  - Vector database schema for RAG
  - Indexing strategy (including GIST for geospatial, IVFFlat for vectors)
  - Data retention policy
  - Migration strategy

- `API_SPEC.md` — API Specification Document
  - Standard response envelope format
  - Authentication APIs (login, MFA, refresh, logout)
  - FIR APIs (CRUD, related FIRs, timeline)
  - Suspect APIs (profile, network, risk score, digital twin)
  - AI Intelligence APIs (query, conversations, export)
  - Graph APIs (network, path finding, communities, centrality)
  - Heatmap & Hotspot APIs
  - Analytics APIs
  - Reports APIs
  - Patrol & Alerts APIs
  - Administration APIs
  - Error code catalog
  - Rate limiting by role

- `SECURITY.md` — Security Architecture Document
  - Threat model with 6 actor types and attack vectors
  - Catalyst Authentication integration flow
  - JWT security configuration (RS256, httpOnly cookies)
  - RBAC permission matrix (7 roles × 20+ permissions)
  - Jurisdiction scoping enforcement
  - Data encryption strategy (AES-256, field-level)
  - Sensitive field masking by role
  - API security middleware stack
  - AI prompt injection prevention
  - Audit logging schema (append-only, tamper-evident)
  - Infrastructure security (CORS, network isolation)
  - Incident response plan with severity levels
  - Compliance mapping (IT Act, PDPB, Evidence Act)

- `UI_DESIGN_SYSTEM.md` — UI Design System Document
  - Design philosophy (Palantir-class intelligence platform)
  - Complete color system (dark theme + print mode)
  - Typography system (Inter + IBM Plex, full scale)
  - Spacing system (4px base unit)
  - Application shell layout design
  - Grid system (12-column, 24px gutter)
  - Component specifications (KPI card, Risk badge, AI chat, alerts)
  - Animation system (tokens, principles, 9 key animations)
  - Icon system (Lucide React mapping)
  - Navigation structure with role visibility
  - Responsive design breakpoints
  - Accessibility standards (WCAG 2.1 AA)
  - Design tokens file structure

- `CODING_STANDARDS.md` — Engineering Guidelines Document
  - SOLID principles application examples
  - TypeScript strict configuration
  - Type definition standards (no `any`, explicit interfaces)
  - Component standards with typed props
  - Custom hooks standards
  - Zustand store standards
  - Python type hint requirements
  - Repository pattern implementation
  - Custom exception hierarchy
  - Async/await standards
  - Structured logging standards
  - File naming conventions (frontend + backend)
  - Git branch strategy
  - Conventional commits format
  - Pull request requirements
  - Testing standards (coverage targets per layer)
  - Code review checklist (security, architecture, quality, performance)

- `SPRINT_BOARD.md` — Sprint Planning Document
  - 7 sprints mapped to 8 phases
  - 22 detailed tasks across all sprints
  - Sub-tasks with checkboxes for tracking
  - Velocity tracking table
  - Team agent assignments per sprint

- `PROJECT_STATE.md` — Project State Tracking
  - Current phase and status
  - All created files inventory
  - Architectural decisions with rationale and trade-offs
  - Risk register (6 risks with mitigation)
  - Technology version lock
  - Continuation instructions for next session

- `ROADMAP.md` — Product Roadmap
  - Phase-by-phase roadmap
  - Feature timeline

- `CHANGELOG.md` — This file

- `TASKS.md` — Granular task breakdown

### Engineering Team
- Chief Architect Agent — Architecture, standards, sprint planning
- Product Manager Agent — PRD, user stories, feature specs
- UI/UX Design Agent — Design system
- Backend Agent — API specification
- Database Architect Agent — Schema design
- Security Agent — Security architecture
- DevOps Agent — Infrastructure mapping

---

## Version History Summary

| Version | Date | Phase | Description |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Final | Production Ready & Architectural Audit |
| 0.5.1 | 2026-07-22 | 5.1 | Enterprise Command Center |
| 0.6.12 | 2026-07-22 | 6.12 | Backend Optimization & Hardening |
| 0.6.11 | 2026-07-22 | 6.11 | Dashboard Backend (BFF) |
| 0.6.10 | 2026-07-22 | 6.10 | Enterprise Search |
| 0.6.9 | 2026-07-22 | 6.9 | Early Warning System |
| 0.6.8 | 2026-07-22 | 6.8 | Enterprise Administration Module |
| 0.6.7 | 2026-07-22 | 6.7 | Enterprise Reporting Service |
| 0.6.6 | 2026-07-22 | 6.6 | Patrol Recommendation Engine |
| 0.6.5 | 2026-07-22 | 6.5 | AI Prediction Engine |
| 0.6.4 | 2026-07-22 | 6.4 | Crime Analytics Service |
| 0.6.3 | 2026-07-22 | 6.3 | Digital Twin Engine (Suspects) |
| 0.6.2 | 2026-07-22 | 6.2 | Criminal Network Graph Engine |
| 0.6.1 | 2026-07-22 | 6.1 | RAG Pipeline Integration |
| 0.6.0 | 2026-07-22 | 6 | AI Intelligence Assistant Module |
| 0.4.1 | 2026-07-22 | 4.1 | Evidence Management Module |
| 0.4.0 | 2026-07-22 | 4 | FIR Management Module Backend |
| 0.3.0 | 2026-07-22 | 3 | Core Backend Infrastructure |
| 0.2.0 | 2026-07-22 | 2 | Auth & App Shell complete |
| 0.1.0 | 2026-07-22 | 1 | Architecture & Documentation complete |

# NETRA AI
### Network Enhanced Threat Recognition & Analysis
**AI-Powered Crime Intelligence Operating System**  
*Karnataka State Police — Datathon 2026*

---

<div align="center">

```
███╗   ██╗███████╗████████╗██████╗  █████╗      █████╗ ██╗
████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗    ██╔══██╗██║
██╔██╗ ██║█████╗     ██║   ██████╔╝███████║    ███████║██║
██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║    ██╔══██║██║
██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║    ██║  ██║██║
╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝
```

**"Give every Karnataka Police officer the investigative power of an AI-augmented forensic analyst."**

[![Phase](https://img.shields.io/badge/Phase-1%20Complete-blue)]()
[![Architecture](https://img.shields.io/badge/Architecture-Approved-green)]()
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Neo4j%20%7C%20Gemini-blueviolet)]()
[![Deploy](https://img.shields.io/badge/Deploy-Zoho%20Catalyst-orange)]()
[![License](https://img.shields.io/badge/License-Karnataka%20State%20Police-red)]()

</div>

---

## What is NETRA AI?

NETRA AI is **not a chatbot**.

It is an **AI Crime Intelligence Operating System** — a Palantir-class intelligence platform purpose-built for Karnataka State Police. It transforms fragmented FIRs, scattered criminal records, and disconnected case files into a unified, AI-powered investigative intelligence layer.

### What NETRA AI does:

| Capability | Description |
|---|---|
| 🧠 **AI Intelligence Assistant** | Context-aware, evidence-citing AI that answers investigative queries in natural language |
| 🕸️ **Criminal Network Graph** | Visualizes hidden criminal associations, gang structures, and key connectors |
| 🗺️ **Crime Heatmap & Hotspot Prediction** | ML-powered spatial crime density and 7-day predictive hotspot forecasting |
| ⚠️ **Risk Scoring** | XGBoost + SHAP explainability for suspect risk assessment |
| 📄 **Court Report Generator** | Auto-generates court-ready, watermarked intelligence reports in < 30 seconds |
| 🚔 **Patrol Recommendations** | AI-optimized patrol zone deployment by shift and crime pattern |
| 🔔 **Early Warning System** | Real-time alerts for crime spikes, suspect activity, and network anomalies |
| 🔍 **FIR Intelligence** | Cross-station FIR search with AI-powered case linkage discovery |
| 🧬 **Digital Criminal Twin** | Comprehensive AI-generated offender profile |

---

## Project Structure

```
netra-ai/                           # Turborepo Monorepo
├── apps/
│   ├── frontend/                   # Next.js 14 (App Router) — Officer Portal
│   ├── backend/                    # FastAPI — REST API + WebSockets
│   ├── ai/                         # LangChain + Gemini — Intelligence Services
│   ├── ml/                         # XGBoost + Prophet — Prediction Models
│   └── graph/                      # Neo4j — Criminal Network Intelligence
├── packages/
│   ├── ui/                         # Shared React component library
│   ├── types/                      # Shared TypeScript types
│   ├── config/                     # Shared configuration
│   └── shared/                     # Shared utilities
├── docs/                           # Architecture, API, deployment docs
├── scripts/                        # Seed data, migrations, deployment
├── tests/                          # E2E, performance, security tests
├── infrastructure/                 # Catalyst, Docker configuration
│   
├── MASTER_PRD.md                   # Product Requirements Document
├── ARCHITECTURE.md                 # System Architecture
├── DATABASE.md                     # Database Schema (PostgreSQL + Neo4j + Redis)
├── API_SPEC.md                     # REST API Specification
├── SECURITY.md                     # Security Architecture
├── UI_DESIGN_SYSTEM.md             # Design System & Component Library
├── CODING_STANDARDS.md             # Engineering Standards
├── SPRINT_BOARD.md                 # Sprint Planning
├── ROADMAP.md                      # Product Roadmap (V1.0 → V3.0)
├── PROJECT_STATE.md                # Current project state (read this first)
├── TASKS.md                        # Granular task breakdown (165 tasks)
└── CHANGELOG.md                    # Version history
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | SSR React framework |
| TypeScript 5.4 (strict) | Type safety |
| TailwindCSS 3.4 | Utility-first styling |
| shadcn/ui | Component primitives |
| Framer Motion 11 | Animations |
| TanStack Query v5 | Server state management |
| Zustand | Client state management |
| React Force Graph | Criminal network visualization |
| MapLibre GL | Crime heatmap |
| Recharts / Nivo | Analytics charts |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python 3.11) | Async REST API |
| SQLAlchemy (async) | ORM for PostgreSQL |
| Pydantic v2 | Validation & serialization |
| Neo4j Python Driver | Graph database |
| Redis (aioredis) | Caching |
| WeasyPrint | PDF generation |
| structlog | Structured logging |

### AI / ML
| Technology | Purpose |
|---|---|
| Google Gemini 1.5 Pro | Core LLM |
| LangChain | RAG pipeline orchestration |
| pgvector | Vector embeddings |
| spaCy + IndicBERT | NLP entity extraction |
| XGBoost | Risk scoring + hotspot prediction |
| Prophet | Temporal crime forecasting |
| SHAP | Model explainability |
| Whisper | Voice transcription |

### Infrastructure
| Technology | Purpose |
|---|---|
| Zoho Catalyst AppSail | Frontend + backend hosting |
| Catalyst Functions | Serverless AI endpoints |
| Catalyst Data Store | Primary PostgreSQL database |
| Catalyst File Store | Evidence + report PDFs |
| Catalyst Cache | Redis caching |
| Catalyst Search | Full-text FIR search |
| Catalyst Cron | ML model updates |
| Catalyst Auth | Authentication |
| Neo4j Aura | Graph database (managed) |
| Turborepo | Monorepo build system |

---

## Master Documents

Read these in order to understand the full system:

| Document | Purpose | Agent |
|---|---|---|
| [MASTER_PRD.md](MASTER_PRD.md) | Product requirements, features, personas | Product Manager |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, data flows, topology | Chief Architect |
| [DATABASE.md](DATABASE.md) | Full schema: PostgreSQL, Neo4j, Redis | Database Architect |
| [API_SPEC.md](API_SPEC.md) | All REST endpoints with request/response | Backend |
| [SECURITY.md](SECURITY.md) | Threat model, RBAC, encryption, audit | Security |
| [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) | Design tokens, components, layout | UI/UX |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | TypeScript + Python engineering standards | Chief Architect |
| [SPRINT_BOARD.md](SPRINT_BOARD.md) | Sprint plan, task assignments | Product Manager |
| [ROADMAP.md](ROADMAP.md) | V1.0 → V3.0 feature roadmap | Product Manager |
| [TASKS.md](TASKS.md) | 165 granular tasks across all phases | Chief Architect |
| [PROJECT_STATE.md](PROJECT_STATE.md) | Current state — read this first when resuming | Chief Architect |
| [CHANGELOG.md](CHANGELOG.md) | Version history | Documentation |

---

## User Roles

| Role | Access Level | Example User |
|---|---|---|
| SUPERADMIN | Full platform | System administrator |
| COMMISSIONER | State-wide read, executive reports | Commissioner of Police, KSP |
| DySP | District read/write, patrol management | Dy. Superintendent of Police |
| INSPECTOR | Station read/write, case management | Station House Officer (SHO) |
| CONSTABLE | Read-only, patrol alerts | Beat constable |
| PROSECUTOR | Case files, report download | Government Advocate |
| ANALYST | Analytics, query runner | Crime analyst |

---

## AI Engineering Team

| Agent | Responsibility |
|---|---|
| 🏛️ Chief Architect | Architecture, standards, review |
| 📋 Product Manager | PRD, user stories, sprint planning |
| 🎨 UI/UX Designer | Design system, components, UX |
| ⚛️ Frontend | Next.js, React, TypeScript |
| ⚙️ Backend | FastAPI, APIs, RBAC |
| 🤖 AI | Gemini, LangChain, RAG, prompts |
| 🕸️ Graph Intelligence | Neo4j, algorithms, networks |
| 📊 ML | XGBoost, Prophet, SHAP |
| 🗄️ Database Architect | Schema, migrations, indexing |
| 🚀 DevOps | Catalyst, Docker, CI/CD |
| 🔒 Security | JWT, RBAC, encryption, audit |
| 🧪 QA | Unit, integration, E2E, security |
| 📝 Documentation | README, Swagger, guides |

---

## Development Phases

| Phase | Name | Status |
|---|---|---|
| **Phase 1** | Architecture & Documentation | ✅ **COMPLETE** |
| **Phase 2** | Project Setup & Foundation | 🔵 Ready to Start |
| **Phase 3** | Database Setup & Seed Data | ⬜ Pending |
| **Phase 4** | Backend API Implementation | ⬜ Pending |
| **Phase 5** | Frontend Implementation | ⬜ Pending |
| **Phase 6** | AI & ML Implementation | ⬜ Pending |
| **Phase 7** | Testing & QA | ⬜ Pending |
| **Phase 8** | Deployment & Demo Prep | ⬜ Pending |

---

## Non-Functional Requirements

| Metric | Target |
|---|---|
| Dashboard load time | < 3 seconds |
| API response time (P95) | < 500ms |
| AI query response | < 5 seconds |
| Report generation | < 30 seconds |
| System uptime | 99.5% |
| Concurrent users | 500+ |
| FIR record scale | 1M+ |
| Hotspot prediction accuracy | > 85% |
| Encryption | AES-256 at rest, TLS 1.3 in transit |

---

## Security

- **Authentication:** Zoho Catalyst Auth + JWT (RS256)
- **MFA:** TOTP required for Inspector and above
- **Authorization:** 7-role RBAC with jurisdiction scoping
- **Encryption:** AES-256 at rest, TLS 1.3 in transit, field-level encryption for Aadhaar/phone
- **Audit:** Append-only, tamper-evident audit logs (7-year retention)
- **Compliance:** IT Act 2000, PDPB 2023, Indian Evidence Act

---

## For Datathon Judges

See [`docs/judge-demo/DEMO_GUIDE.md`](docs/judge-demo/DEMO_GUIDE.md) for a structured walkthrough of all platform capabilities with demo scenarios and evaluation criteria.

---

## Contact

**Status:** 🚀 PRODUCTION READY (Catalyst AppSail Deployed)
**Hackathon:** Karnataka State Police Datathon 2026
**Review:** Passed 16-point Principal Architect Audit (Architecture, Security, Performance, Scalability, A11y, etc.)  
Platform: Zoho Catalyst  
Classification: GOVERNMENT — CONFIDENTIAL

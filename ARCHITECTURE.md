# NETRA AI — System Architecture Document
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Chief Architect Agent | NETRA AI Engineering Team  
**Status:** 🔒 FROZEN — DO NOT MODIFY

> [!CAUTION]
> **ARCHITECTURE FROZEN** — 2026-07-22T11:08:13+05:30  
> This document is frozen by explicit user directive. No changes may be made to this document without the user's explicit written instruction.  
> **Single source of truth:** [`MASTER_PRD.md`](MASTER_PRD.md)  
> All implementation decisions must conform to this architecture as written.

---

## 1. Architecture Philosophy

NETRA AI follows a **Domain-Driven, Event-Driven Microservices Architecture** deployed on Zoho Catalyst. The system is designed around the principle of **Separation of Intelligence** — each AI/ML capability is an isolated, independently deployable intelligence service.

**Core Principles:**
- Feature-first folder organization
- Repository Pattern for all data access
- Event-driven communication between intelligence services
- CQRS (Command Query Responsibility Segregation) for high-read operations
- Circuit breaker pattern for AI service resilience
- Everything observable: logs, traces, metrics

---

## 2. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NETRA AI Platform                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │   FastAPI    │  │   Catalyst Functions │  │
│  │   Frontend   │──│   Backend    │──│   (Serverless AI)    │  │
│  │   (AppSail)  │  │   (AppSail)  │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                 │                      │               │
│         └────────────── API Gateway ─────────────┘               │
│                           │                                       │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Neo4j     │  │    Redis     │          │
│  │  (Catalyst   │  │  (Graph DB)  │  │   (Cache)    │          │
│  │  Data Store) │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AI/ML Intelligence Layer                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │
│  │  │  Gemini  │  │ LangChain│  │ XGBoost  │  │ Prophet │  │   │
│  │  │  (LLM)   │  │  (RAG)   │  │  (Risk)  │  │(Forecast│  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Application Layer Architecture

### 3.1 Frontend Architecture (Next.js 14, App Router)

```
apps/frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── mfa/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Protected layout with sidebar
│   │   ├── page.tsx            # Officer Dashboard
│   │   ├── intelligence/       # AI Assistant
│   │   ├── network/            # Criminal Network Graph
│   │   ├── heatmap/            # Crime Heatmap
│   │   ├── fir/                # FIR Search
│   │   ├── suspects/           # Suspect Profiles
│   │   ├── analytics/          # Analytics Dashboard
│   │   ├── reports/            # Court Reports
│   │   ├── evidence/           # Evidence Explorer
│   │   ├── timeline/           # Case Timeline
│   │   ├── patrol/             # Patrol Recommendations
│   │   ├── alerts/             # Early Warning
│   │   ├── admin/              # Administration
│   │   └── audit/              # Audit Logs
│   └── api/                    # Next.js API routes (BFF)
├── components/
│   ├── ui/                     # Base components (shadcn)
│   ├── layout/                 # Layout components
│   ├── charts/                 # Chart components
│   ├── graph/                  # Network graph components
│   ├── map/                    # Map/heatmap components
│   ├── intelligence/           # AI chat components
│   └── shared/                 # Shared components
├── lib/
│   ├── api/                    # API client layer
│   ├── auth/                   # Auth utilities
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   └── utils/                  # Utility functions
└── types/                      # TypeScript types
```

### 3.2 Backend Architecture (FastAPI)

```
apps/backend/
├── main.py
├── api/
│   └── v1/
│       ├── routers/
│       │   ├── auth.py
│       │   ├── fir.py
│       │   ├── suspects.py
│       │   ├── cases.py
│       │   ├── intelligence.py
│       │   ├── graph.py
│       │   ├── heatmap.py
│       │   ├── analytics.py
│       │   ├── reports.py
│       │   ├── patrol.py
│       │   ├── alerts.py
│       │   └── admin.py
│       └── dependencies.py
├── core/
│   ├── config.py
│   ├── security.py
│   ├── database.py
│   └── exceptions.py
├── domain/
│   ├── fir/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── repository.py
│   │   └── service.py
│   ├── suspects/
│   ├── cases/
│   ├── intelligence/
│   ├── graph/
│   ├── heatmap/
│   ├── analytics/
│   └── reports/
├── infrastructure/
│   ├── database/
│   │   ├── catalyst.py
│   │   ├── neo4j.py
│   │   └── redis.py
│   ├── ai/
│   │   ├── gemini.py
│   │   ├── langchain.py
│   │   └── rag.py
│   └── ml/
│       ├── risk_scorer.py
│       ├── hotspot.py
│       └── anomaly.py
└── tests/
```

### 3.3 AI Service Architecture

```
apps/ai/
├── services/
│   ├── conversation/
│   │   ├── chain.py            # LangChain conversation chain
│   │   ├── memory.py           # Conversation memory
│   │   └── prompts.py          # Prompt templates
│   ├── rag/
│   │   ├── retriever.py        # Vector store retriever
│   │   ├── embedder.py         # Document embedder
│   │   └── pipeline.py         # RAG pipeline
│   ├── summarization/
│   │   ├── fir_summarizer.py   # FIR summarization
│   │   └── case_briefer.py     # Case brief generation
│   └── report/
│       ├── generator.py        # Report generation
│       └── templates/          # Report templates
└── prompts/
    ├── system_prompts.py
    ├── investigator.py
    └── analyst.py
```

### 3.4 ML Service Architecture

```
apps/ml/
├── models/
│   ├── risk_scorer/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── shap_explainer.py
│   ├── hotspot/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── spatial.py
│   └── anomaly/
│       ├── detector.py
│       └── baseline.py
├── features/
│   ├── engineering.py
│   └── preprocessing.py
└── pipelines/
    ├── training.py
    └── inference.py
```

### 3.5 Graph Intelligence Architecture

```
apps/graph/
├── neo4j/
│   ├── schema.py               # Node/relationship definitions
│   ├── queries.py              # Cypher query library
│   └── repository.py           # Graph data access
├── algorithms/
│   ├── community.py            # Louvain community detection
│   ├── centrality.py           # PageRank, betweenness
│   ├── pathfinding.py          # Shortest path
│   └── similarity.py           # Node similarity
└── visualization/
    └── layout.py               # Graph layout computation
```

---

## 4. Data Flow Architecture

### 4.1 FIR Intelligence Flow
```
FIR Input → NLP Extraction (spaCy/IndicBERT)
         → Entity Recognition (Person, Location, Vehicle)
         → Vector Embedding (for RAG)
         → Graph Ingestion (Neo4j relationships)
         → Risk Score Calculation (XGBoost)
         → Alert Generation (if thresholds crossed)
         → Dashboard Update (WebSocket push)
```

### 4.2 AI Query Flow
```
Officer Query → Intent Classification
             → RAG Retrieval (Vector DB + Catalyst Data Store)
             → Graph Context Enrichment (Neo4j)
             → Gemini LLM Generation (with context)
             → Response Validation + Evidence Citation
             → Conversation Memory Update
             → Response Streaming to Frontend
```

### 4.3 Hotspot Prediction Flow
```
Historical Crime Data (60 days)
    → Feature Engineering (time, location, crime type, weather)
    → Prophet (temporal patterns)
    → XGBoost (spatial risk score)
    → KDE Heatmap Generation
    → Hotspot Polygon Computation
    → Cache in Redis (6-hour TTL)
    → Serve to Heatmap Module
```

---

## 5. Infrastructure Architecture (Zoho Catalyst)

### Catalyst Services Mapping
| Component | Catalyst Service | Purpose |
|---|---|---|
| Frontend hosting | AppSail (Next.js) | React SSR deployment |
| Backend API | AppSail (FastAPI) | REST API server |
| AI Functions | Catalyst Functions | Serverless AI endpoints |
| Database | Catalyst Data Store | Primary structured data |
| File storage | Catalyst File Store | Documents, reports, evidence |
| Caching | Catalyst Cache | Redis-compatible caching |
| Search | Catalyst Search | Full-text FIR search |
| Auth | Catalyst Authentication | JWT + MFA |
| Scheduled jobs | Catalyst Cron | ML model retraining, risk updates |
| Monitoring | Catalyst Monitoring | Uptime, performance metrics |
| Logging | Catalyst Logs | Application and audit logs |
| Config | Catalyst Environment Variables | Secrets management |

### Deployment Topology
```
                    ┌─────────────────┐
                    │   Catalyst CDN  │
                    │  (Static Assets)│
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │  AppSail Node   │
                    │  (Next.js SSR)  │
                    └────────┬────────┘
                             │ HTTPS
                    ┌────────┴────────┐
                    │  AppSail Node   │
                    │  (FastAPI)      │
                    └────┬──────┬────┘
                         │      │
              ┌──────────┘      └──────────┐
     ┌────────┴────────┐     ┌─────────────┴──────┐
     │ Catalyst Data   │     │ Catalyst Functions  │
     │ Store (Primary) │     │ (AI/ML Serverless)  │
     └────────┬────────┘     └────────────────────┘
              │
     ┌────────┴────────┐
     │   Neo4j Aura    │
     │  (Graph DB)     │
     └─────────────────┘
```

---

## 6. Security Architecture

### Authentication Flow
```
Login Request
    → Catalyst Auth (primary verification)
    → RBAC lookup (role + permissions)
    → JWT generation (access: 60min, refresh: 24hr)
    → MFA challenge (for INSPECTOR+)
    → Session established
    → Audit log entry
```

### Authorization Model
- **RBAC** with 7 predefined roles
- **Resource-based** permissions (station/district scoping)
- **Field-level** security for sensitive data (UID, phone)
- **API rate limiting** per role
- All API endpoints require valid JWT
- Graph queries scoped by officer's jurisdiction

---

## 7. Scalability Design

| Dimension | Strategy |
|---|---|
| Read scaling | Redis caching + CDN for static |
| AI load | Catalyst Functions auto-scaling |
| Graph queries | Neo4j read replicas |
| Background jobs | Catalyst Cron + async workers |
| WebSocket | Catalyst Functions + persistent connections |
| ML inference | Pre-computed daily, cached in Redis |

---

## 8. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Chief Architect Agent | Initial architecture — Phase 1 |

# NETRA AI — Master Product Requirements Document (PRD)
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Product Manager Agent | NETRA AI Engineering Team  
**Status:** ⭐ SINGLE SOURCE OF TRUTH — AUTHORITATIVE  
**Classification:** CONFIDENTIAL — Karnataka State Police Datathon 2026

> [!IMPORTANT]
> **THIS IS THE SINGLE SOURCE OF TRUTH** for all product decisions — 2026-07-22T11:08:13+05:30  
> All features, scope, and requirements are governed by this document.  
> All other documents (ARCHITECTURE, DATABASE, API_SPEC, SECURITY, UI_DESIGN_SYSTEM) are frozen and must conform to this PRD.  
> Any conflict between this PRD and another document resolves **in favour of this PRD**.

---

## 1. Executive Summary

NETRA AI (Network Enhanced Threat Recognition & Analysis) is an enterprise-grade AI-powered Crime Intelligence Operating System designed exclusively for Karnataka State Police. It transforms fragmented FIRs, case records, criminal profiles, and geospatial data into a unified, AI-augmented investigative intelligence platform capable of:

- Discovering hidden criminal networks using graph intelligence
- Predicting crime hotspots with ML-driven spatial analytics
- Assisting investigators with explainable AI recommendations
- Generating court-ready intelligence reports
- Providing real-time early warning and patrol optimization

NETRA AI is **not a chatbot**. It is an AI Crime Intelligence Operating System — a Palantir-class platform purpose-built for Indian law enforcement.

---

## 2. Problem Statement

### Current Pain Points (Karnataka State Police)
| Pain Point | Impact |
|---|---|
| FIRs recorded manually across 1000+ stations | Data silos, no cross-station intelligence |
| Criminal records not linked across cases | Repeat offenders undetected until arrested |
| No predictive hotspot modeling | Reactive patrol deployment, high crime rate |
| Evidence scattered across physical files | Investigation delays, court case weaknesses |
| No AI assistance for investigators | Human cognitive overload on complex cases |
| No network visualization of criminal groups | Gang structures remain opaque |
| Report generation takes days | Delayed court submissions |

### Strategic Gap
Karnataka State Police lacks a unified intelligence layer that connects people, places, events, and patterns across all 1000+ police stations into a single investigative operating picture.

---

## 3. Product Vision

> **"Give every Karnataka Police officer the investigative power of an AI-augmented forensic analyst."**

NETRA AI will serve as the central intelligence nervous system for Karnataka State Police — ingesting all available crime data, enriching it with AI, and surfacing actionable intelligence to the right officer at the right time.

---

## 4. Target Users & Personas

### Persona 1: Inspector Rajesh Kumar (Field Investigator)
- **Role:** Station House Officer (SHO), Bengaluru North
- **Goal:** Close open cases faster, identify suspects quickly
- **Pain:** Manually searches multiple registers and files
- **NETRA AI Value:** AI assistant surfaces related cases, suspects, and evidence automatically

### Persona 2: DySP Priya Nair (District Intelligence Officer)
- **Role:** Deputy Superintendent of Police
- **Goal:** Monitor crime trends, deploy resources strategically
- **Pain:** No unified view across 20+ stations in district
- **NETRA AI Value:** Real-time crime heatmap, hotspot predictions, resource recommendation

### Persona 3: Commissioner Venkatesh Rao (Senior Command)
- **Role:** Commissioner of Police, Karnataka
- **Goal:** Strategic oversight, accountability, reporting
- **Pain:** Data arrives late, manually compiled, often inaccurate
- **NETRA AI Value:** Executive dashboard with real-time KPIs, trend analysis, anomaly alerts

### Persona 4: Constable Deepa (Beat Officer)
- **Role:** Patrol constable
- **Goal:** Know where to patrol, flag suspicious activity
- **Pain:** No data-driven patrol guidance
- **NETRA AI Value:** AI patrol recommendations, mobile-ready threat alerts

### Persona 5: Public Prosecutor (Legal)
- **Role:** Government advocate presenting cases in court
- **Goal:** Comprehensive, accurate case documentation
- **Pain:** Incomplete case files, missing evidence chains
- **NETRA AI Value:** Auto-generated court-ready intelligence reports with evidence citations

---

## 5. Product Scope

### In Scope — Version 1.0
| Module | Priority | Sprint |
|---|---|---|
| Enterprise Authentication (RBAC) | P0 | Sprint 1 |
| Officer Dashboard | P0 | Sprint 1 |
| FIR Search & Intelligence | P0 | Sprint 1 |
| AI Crime Intelligence Assistant | P0 | Sprint 2 |
| Criminal Network Graph | P0 | Sprint 2 |
| Crime Heatmap & Hotspot Prediction | P0 | Sprint 3 |
| Risk Analytics & Scoring | P1 | Sprint 3 |
| Evidence Explorer | P1 | Sprint 4 |
| Case Timeline | P1 | Sprint 4 |
| Court Report Generator | P1 | Sprint 4 |
| Patrol Recommendation Engine | P1 | Sprint 5 |
| Early Warning System | P1 | Sprint 5 |
| Analytics Dashboard | P2 | Sprint 6 |
| Administration Panel | P2 | Sprint 6 |
| Audit Logs | P2 | Sprint 6 |
| Digital Twin (Criminal) | P2 | Sprint 7 |
| Conversation History Export | P2 | Sprint 7 |

---

## 6. Feature Specifications

### F-001: Enterprise Authentication
**Roles & Permissions:**
| Role | Permissions |
|---|---|
| SUPERADMIN | Full platform access, user management |
| COMMISSIONER | Read all districts, executive reports |
| DySP | Read/write own district, patrol management |
| INSPECTOR | Read/write own station, case management |
| CONSTABLE | Read-only, patrol alerts |
| PROSECUTOR | Read case files, download reports |
| ANALYST | Read analytics, run queries |

**Acceptance Criteria:**
- Login < 2 seconds | Lock after 5 failed attempts | JWT rotation every 60 min | MFA for INSPECTOR+

### F-002: AI Crime Intelligence Assistant
- Multi-turn conversation with memory (20+ turns)
- Evidence citation with source FIR/record IDs
- Voice input (Whisper), Kannada/Hindi (IndicBERT)
- Response latency < 5 seconds
- Exportable conversation as PDF

### F-003: Criminal Network Graph
- Force-directed Neo4j graph (up to 500 nodes)
- Node types: Person, Vehicle, Location, Phone, FIR, Organization
- Community detection (Louvain), Centrality analysis
- Shortest path between suspects
- Export as PNG/SVG

### F-004: Crime Heatmap & Hotspot Prediction
- Real-time kernel density heatmap
- ML-predicted hotspot polygons (7-day horizon)
- Crime type + time range filtering
- 85%+ prediction accuracy target

### F-005: Court Report Generator
- Report generated < 30 seconds
- PDF output, court-formatted
- Watermarked "KARNATAKA STATE POLICE — CONFIDENTIAL"
- Types: Case Brief, Suspect Profile, Network Analysis, Trend Report

---

## 7. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | Dashboard load time | < 3 seconds |
| Performance | API response time (P95) | < 500ms |
| Performance | AI query response | < 5 seconds |
| Reliability | System uptime | 99.5% |
| Scalability | Concurrent users | 500+ |
| Scalability | FIR records | 1M+ |
| Security | Encryption at rest | AES-256 |
| Security | Encryption in transit | TLS 1.3 |
| Accessibility | WCAG compliance | Level AA |
| Localization | Languages | English, Kannada, Hindi |

---

## 8. Success Metrics

| Metric | Target (6 months) |
|---|---|
| FIR Resolution Rate Improvement | +15% |
| Investigation Time Reduction | -30% |
| Hotspot Prediction Accuracy | > 85% |
| Officer Adoption Rate | > 70% |
| Report Generation Time | < 5 minutes (vs 2-3 days) |
| Cross-Station Case Linkages | 1000+ discovered |

---

## 9. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Product Manager Agent | Initial PRD — Phase 1 |

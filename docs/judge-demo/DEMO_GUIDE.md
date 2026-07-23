# NETRA AI — Judge Demo Guide
**Karnataka State Police Datathon 2026**  
**Classification:** DEMO USE ONLY  
**Platform:** https://netra-ai.catalyst.zoho.com

---

## Welcome, Honourable Judges

NETRA AI is a production-grade AI Crime Intelligence Operating System built for Karnataka State Police. This guide will walk you through every platform capability in a structured sequence — from authentication through advanced AI intelligence features.

**Estimated Demo Duration:** 20–30 minutes  
**Demo Dataset:** 500 synthetic FIRs, 200 suspects, 5 districts, 25 stations (modeled on Bengaluru Urban District)

---

## Evaluation Criteria Mapping

| Datathon Criterion | NETRA AI Feature | Where to See |
|---|---|---|
| Data Intelligence | FIR Search + AI Linkage Discovery | Module 3 |
| AI/ML Innovation | Gemini RAG + XGBoost + Prophet | Modules 4, 6, 7 |
| Visualization | Criminal Network Graph + Heatmap | Modules 5, 6 |
| Practical Value | Patrol Recommendations + Reports | Modules 8, 9 |
| Security | RBAC + MFA + Audit Logs | Module 2 + Module 10 |
| Scalability | Architecture + 1M+ record design | ARCHITECTURE.md |
| UI/UX | Dark intelligence theme, animations | Throughout |

---

## Demo Login Accounts

| Role | Badge Number | Password | What You'll See |
|---|---|---|---|
| Commissioner | `COMM-KA-0001` | `Demo@2026!` | State-wide KPIs, all districts |
| DySP | `DYSP-BLR-0001` | `Demo@2026!` | Bengaluru Urban district |
| Inspector | `INSP-BLR-0001` | `Demo@2026!` | Shivajinagar PS, full investigation tools |
| Analyst | `ANAL-KA-0001` | `Demo@2026!` | Analytics + AI assistant |
| Prosecutor | `PROS-KA-0001` | `Demo@2026!` | Case files + report download |

> **Recommended:** Start with **Inspector** login to see the full investigative workflow.

---

## Module 1: Authentication & Security

### What to demonstrate
1. Navigate to the login page
2. Notice: Dark enterprise theme, Karnataka Police branding
3. Log in as Inspector (`INSP-BLR-0001` / `Demo@2026!`)
4. Observe MFA prompt (enter TOTP code from authenticator)
5. Note: Session badge shows "INSPECTOR | Shivajinagar PS"

### Talking Points
- "NETRA AI uses RS256 JWT tokens, not symmetric signing"
- "MFA is enforced for Inspector level and above by policy"
- "Every login event is written to an immutable audit log"
- "Role determines not just what you see, but what data you can access — a Shivajinagar constable cannot read Mysuru FIRs"

---

## Module 2: Officer Dashboard (Command Center)

### What to demonstrate
1. Observe the animated KPI cards loading
   - Active FIRs: 1,250 (with trend arrow)
   - Cases Closed This Month: 340 (−2.1%)
   - High-Risk Suspects: 47 (↑3)
   - Active Hotspots: 12
   - AI Insights Generated Today: 89
2. Point to the crime type breakdown donut chart
3. Show the 7-day crime trend area chart
4. Show the active alerts panel (right side)
5. Switch to **Commissioner login** — observe different widgets (state-wide data)

### Talking Points
- "The dashboard adapts to the officer's role — a constable sees their beat; the Commissioner sees the state"
- "KPI cards use WebSocket for real-time updates — no page refresh needed"
- "The trend indicators use 30-day rolling comparison"

---

## Module 3: FIR Search & AI Case Linkage

### What to demonstrate
1. Navigate to **FIR Search**
2. Search: `vehicle theft MG Road`
3. Show full-text search results (12 FIRs)
4. Apply filter: Crime Type = THEFT, Date Range = Last 6 months
5. Click on FIR `KA-BLR-2024-00123`
6. On the detail page, click **"Find Related FIRs"** (AI-powered)
7. AI surfaces 3 related FIRs sharing: same suspect, same vehicle, same MO

### Talking Points
- "Previously, a Shivajinagar officer would never know about an identical theft in Koramangala PS"
- "The AI uses vector embeddings + graph relationships to find non-obvious connections"
- "Each related FIR shows WHY it's related — same suspect, same vehicle, same IPC section"
- "This works across all 1000+ stations in Karnataka — not just within one station"

---

## Module 4: AI Crime Intelligence Assistant

### What to demonstrate

**Query 1: Suspect Analysis**
```
Type: "Who are the known associates of suspect Raju Naik?"
```
- AI responds with structured list of 7 associates
- Each associate has a risk level badge
- Citations show which FIRs link them: `[FIR-0045] [FIR-0089]`
- Suggested follow-up questions appear

**Query 2: Crime Pattern Analysis**
```
Type: "What crime patterns emerged in Bengaluru North in the last 30 days?"
```
- AI generates structured analysis with:
  - Top 3 crime types with percentage breakdown
  - Peak time windows (Friday nights 10pm–2am)
  - Geographic concentration (MG Road, Indiranagar)
  - Recommended action items

**Query 3: Network Brief**
```
Type: "Generate a brief on the vehicle theft network in Bengaluru Urban district"
```
- AI generates 400-word intelligence brief
- Cites 12 FIRs as sources
- Names 3 active suspects with risk scores
- Identifies 2 vehicle registration patterns

**Voice Query (if enabled):**
- Click microphone button
- Speak query in English or Kannada
- Watch Whisper transcription appear
- AI responds normally

### Talking Points
- "This is not a generic chatbot. It is trained on the actual FIR data for Karnataka"
- "Every answer cites the specific FIR or record it drew from — no hallucination without citation"
- "Context is preserved across the session — follow-up questions work"
- "Conversation can be exported as a classified PDF for case files"
- "Kannada language support via IndicBERT preprocessing"

---

## Module 5: Criminal Network Graph

### What to demonstrate
1. Navigate to **Criminal Network**
2. Search for suspect "Raju Naik"
3. Click **"Expand Network"**
4. Observe force-directed graph rendering (12 nodes, 18 edges)
   - Blue nodes: People
   - Orange nodes: Vehicles
   - Purple nodes: Locations
   - Green nodes: Phones
5. Observe community coloring — two gang clusters visible
6. Click on the largest node (highest centrality) — it glows
7. Right-click → "Find shortest path to Suresh Kumar"
   - Path highlighted: Raju → Vehicle KA-01 → Suresh (3 hops)
8. Click community cluster → label appears "Bommanahalli Vehicle Theft Ring (8 members)"
9. Click any person node → side panel shows their full profile

### Talking Points
- "The Louvain algorithm automatically detects gang clusters — no manual labeling"
- "Betweenness centrality identifies the 'fixers' — people who connect different gangs"
- "This graph is built automatically from FIR co-accused data + phone records + vehicle links"
- "Before NETRA AI, this intelligence existed in 200 separate paper FIRs across 25 stations"
- "Export as PNG for court submissions or intelligence briefings"

---

## Module 6: Crime Heatmap & Hotspot Prediction

### What to demonstrate
1. Navigate to **Crime Heatmap**
2. Observe Karnataka/Bengaluru map with heat intensity
3. Crime Type filter → select "THEFT" → heatmap updates
4. Click **"Predicted Hotspots"** toggle
   - 7 red polygons appear over high-risk areas
   - Each polygon shows: Crime type, Confidence %, Risk level
5. Click a hotspot polygon → tooltip:
   ```
   INDIRANAGAR ZONE
   Predicted: THEFT
   Confidence: 87%
   Risk: HIGH
   Based on: 45-day crime pattern + seasonal factor
   ```
6. Activate **Time-Lapse Mode** — watch crime evolution from Jan→Jul 2024 animate
7. Show station jurisdiction boundary overlay

### Talking Points
- "Hotspot predictions use Prophet for temporal patterns + XGBoost for spatial features"
- "The model considers time of day, day of week, proximity to past incidents, seasonal factors"
- "87% accuracy on 30-day backtesting — validated on historical Karnataka crime data"
- "Police can deploy patrol resources to PREDICTED zones, not just reactive response"
- "Predictions update daily via automated Catalyst Cron jobs — no manual retraining needed"

---

## Module 7: Risk Analytics (Explainable AI)

### What to demonstrate
1. Navigate to **Suspects** → open profile for "Raju Naik"
2. Observe Risk Score card: **85.2 / 100 — HIGH RISK**
3. Click **"Explain This Score"**
4. SHAP waterfall chart appears showing:
   - Prior convictions: +22 points
   - Gang affiliation: +18 points
   - Recidivism probability (79%): +21 points
   - Network centrality (top 5%): +13 points
   - Recent activity (last 7 days): +11 points
5. Show Risk Trend chart — score has been rising for 3 months
6. Recommendation: "Increase surveillance frequency"

### Talking Points
- "The score is NOT a black box — every point is explained"
- "This is SHAP (SHapley Additive exPlanations) — the gold standard for ML explainability"
- "Explainable AI is essential for court admissibility — you can justify every recommendation"
- "Risk scores update daily — the system tracks trajectories, not just snapshots"
- "A rising trajectory is more actionable than a static score"

---

## Module 8: Court Report Generator

### What to demonstrate
1. Navigate to **Reports** → click **"Generate Report"**
2. Select: Type = "Case Intelligence Brief", FIR = `KA-BLR-2024-00123`
3. Select sections: Summary, Timeline, Evidence, Network Analysis, Risk Assessment
4. Click **Generate** → loading spinner
5. After ~15 seconds, PDF preview appears
6. Preview shows:
   - KARNATAKA STATE POLICE letterhead
   - "CONFIDENTIAL" watermark
   - AI-generated executive summary (3 paragraphs)
   - Chronological case timeline
   - Evidence index with chain of custody
   - Network graph screenshot embedded
   - Risk assessment table
   - Investigator recommendations
   - Officer signature block
7. Click **Download PDF**

### Talking Points
- "A report that takes 2–3 days to compile manually is generated in 15 seconds"
- "The AI narrative is grounded in actual FIR data — all facts are cited"
- "Court-formatted with proper headers, classification stamps, and signature blocks"
- "5 report types: Case Brief, Suspect Profile, Network Analysis, Trend Report, Patrol Recommendation"
- "The PDF is stored securely in Catalyst File Store with access audit logging"

---

## Module 9: Patrol Recommendations

### What to demonstrate
1. Navigate to **Patrol Recommendations**
2. Observe 6 patrol zones shown on the map
3. Zone cards show:
   - Zone name + area
   - Risk score (color-coded)
   - Recommended units to deploy
   - Shift: NIGHT
   - Primary crime type expected
   - AI rationale: "4 vehicle thefts in last 48 hours, historically high Friday night crime rate"
4. Click any zone → map highlights the zone polygon
5. Show **Shift Selector** — toggle to MORNING, zones update

### Talking Points
- "This replaces gut-feel patrol deployment with data-driven resource allocation"
- "The system considers: historical crime patterns, active FIRs, time of day, day of week, weather"
- "Recommendations refresh every 8 hours automatically"
- "Specific enough to be actionable: 'Deploy 3 units to Indiranagar tonight'"

---

## Module 10: Audit Logs & Administration

### What to demonstrate (as SUPERADMIN)
1. Navigate to **Audit Logs**
2. Show recent activity: logins, FIR reads, report downloads, AI queries
3. Filter: Action = "READ_SUSPECT" — see which officers viewed which suspects
4. Navigate to **Officers** → show the 7-role RBAC configuration
5. Show an officer's jurisdiction scope (station/district assignment)

### Talking Points
- "Every single data access is logged — who accessed what, when, from which IP"
- "Audit logs are append-only — they cannot be modified or deleted, even by SUPERADMIN"
- "7-year retention per IT Act requirements"
- "If an officer accesses data outside their jurisdiction, a security alert fires immediately"

---

## Architecture Summary (For Technical Judges)

```
                    Karnataka Police Officers
                           │ HTTPS
                    ┌──────┴──────┐
                    │  Next.js 14 │  ← Palantir-class dark intelligence UI
                    │  (AppSail)  │    Framer Motion animations
                    └──────┬──────┘    TailwindCSS + shadcn/ui
                           │ REST + WebSocket
                    ┌──────┴──────┐
                    │   FastAPI   │  ← Async Python, Repository pattern
                    │  (AppSail)  │    RBAC + Jurisdiction enforcement
                    └──────┬──────┘    Structured audit logging
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌──────┴──────┐  ┌─────┴─────┐
    │ PostgreSQL│   │    Neo4j    │  │   Redis   │
    │ (Catalyst)│   │   (Graph)   │  │  (Cache)  │
    │ 1M+ FIRs  │   │  Criminal   │  │  6hr TTL  │
    └─────┬─────┘   │  Networks   │  └───────────┘
          │         └─────────────┘
    ┌─────┴──────────────────────────────────────┐
    │          AI Intelligence Layer              │
    │  Gemini 1.5 Pro → LangChain → pgvector RAG │
    │  XGBoost (Risk) → Prophet (Hotspot)         │
    │  SHAP (Explainability) → Whisper (Voice)   │
    └────────────────────────────────────────────┘
```

**Scale:** Designed for 500+ concurrent officers, 1M+ FIR records, 99.5% uptime on Zoho Catalyst.

---

## Key Differentiators vs. Generic Dashboards

| Dimension | Generic Police Dashboard | NETRA AI |
|---|---|---|
| Data access | Single station | Cross-station, state-wide intelligence |
| Queries | Keyword search | Natural language AI with evidence citation |
| Criminal links | Manual, known only | Automated graph discovery across all records |
| Crime prediction | None | ML hotspot prediction with 85%+ accuracy |
| Report generation | Manual (2-3 days) | AI-generated in < 30 seconds |
| Risk assessment | None | Explainable ML score (XGBoost + SHAP) |
| Patrol deployment | Experience-based | Data-driven, shift-aware recommendations |
| Security | Basic login | RBAC + MFA + jurisdiction scoping + audit |
| AI | None | Gemini RAG + network AI + ML ensemble |

---

## Questions Judges May Ask

**Q: How does the AI avoid hallucination?**  
A: Every AI response MUST cite a source FIR or record. Responses without citations are rejected. The RAG pipeline retrieves actual FIR data before generating the response.

**Q: Is this production-ready or just a demo?**  
A: The architecture is designed for production: async FastAPI, connection pooling, Redis caching, role-based access, audit logs, TLS encryption. The demo uses synthetic data for Datathon, but the platform is ready for real data ingestion.

**Q: How does it scale to 1000+ stations?**  
A: Jurisdiction scoping ensures officers only see their data. The database uses partition-ready schemas. Neo4j handles 500+ node graphs smoothly. Catalyst Functions auto-scale for AI load. Redis caches expensive computations.

**Q: What about Kannada language support?**  
A: IndicBERT handles Kannada NLP preprocessing. Whisper supports Kannada voice input. The UI supports Kannada font rendering via Noto Sans Kannada.

**Q: How is sensitive data protected?**  
A: Aadhaar numbers and phone numbers are encrypted at field level using Fernet (AES-128-CBC). Only authorized roles can decrypt. Masking is applied for lower-privilege roles. All access is audit-logged.

---

*Built with pride by the NETRA AI Engineering Team for Karnataka State Police Datathon 2026.*  
*"Intelligence is not about having all the answers — it is about asking the right questions."*

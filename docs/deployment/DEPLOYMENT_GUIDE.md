# NETRA AI — Deployment Guide (Zoho Catalyst)
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** DevOps Agent | NETRA AI Engineering Team

---

## 1. Deployment Overview

NETRA AI is designed to run entirely on **Zoho Catalyst** — Karnataka Police's approved cloud infrastructure. The deployment spans multiple Catalyst services working together as a unified platform.

```
Catalyst Service Map:

┌─────────────────────────────────────────────────────────────┐
│                  Zoho Catalyst Project: NETRA-AI             │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   AppSail #1     │  │   AppSail #2     │                 │
│  │   Next.js FE     │  │   FastAPI BE     │                 │
│  │   Port: 3000     │  │   Port: 8000     │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Catalyst Functions│  │  Catalyst Cache  │                 │
│  │ (AI Serverless)  │  │  (Redis-compat)  │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Catalyst Data    │  │  Catalyst File   │                 │
│  │ Store (Primary)  │  │  Store (Docs)    │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Catalyst Search  │  │  Catalyst Cron   │                 │
│  │ (FIR Full-text)  │  │  (ML updates)    │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Catalyst Auth    │  │  Catalyst Logs   │                 │
│  │ (JWT + MFA)      │  │  (Audit trail)   │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘

External Services (managed separately):
  ├── Neo4j Aura (graph database)
  └── Google Gemini API
```

---

## 2. Pre-Deployment Checklist

### 2.1 Account & Access
- [ ] Zoho Catalyst account created with NETRA-AI project
- [ ] Team members added with appropriate Catalyst roles
- [ ] Catalyst CLI installed (`npm install -g @zohocrm/catalyst-cli`)
- [ ] `catalyst init` completed in project root
- [ ] Neo4j Aura instance provisioned (free tier for Datathon)
- [ ] Google Gemini API key obtained

### 2.2 Environment Variables (Catalyst Console)
Navigate to: Catalyst Console → NETRA-AI → Configurations → Environment Variables

**Required variables:**
```
JWT_PRIVATE_KEY_BASE64     = <generated RSA private key>
JWT_PUBLIC_KEY_BASE64      = <generated RSA public key>
NEO4J_URI                  = neo4j+s://<your-aura-uri>
NEO4J_USER                 = neo4j
NEO4J_PASSWORD             = <neo4j password>
GEMINI_API_KEY             = <google ai api key>
FIELD_ENCRYPTION_KEY       = <fernet key>
OPENAI_API_KEY             = <openai key for whisper>
CORS_ORIGINS               = https://<your-appsail-url>
```

### 2.3 Generate RSA Keys
```bash
# Run this script once to generate JWT signing keys
node scripts/deploy/generate-keys.js

# Output: BASE64-encoded RSA-2048 private and public keys
# Copy to Catalyst Environment Variables
```

---

## 3. Database Deployment

### 3.1 Catalyst Data Store (PostgreSQL)
```bash
# Run migrations against Catalyst Data Store
python scripts/migrations/run.py up

# Verify all tables created
python scripts/migrations/verify.py
```

### 3.2 Neo4j Aura Setup
```bash
# Apply Neo4j constraints and indexes
python scripts/migrations/neo4j_setup.py

# Verify graph schema
python scripts/migrations/neo4j_verify.py
```

### 3.3 Seed Demo Data
```bash
# Seed all demo data (districts, stations, officers, FIRs, suspects, network)
node scripts/seed/index.js --environment=production

# Verify seed data
node scripts/seed/verify.js
```

---

## 4. Frontend Deployment (AppSail)

### 4.1 Build Configuration
```yaml
# catalyst-appsail.yml (frontend)
name: netra-ai-frontend
runtime: nodejs20
build_command: pnpm run build --filter=@netra/frontend
start_command: node apps/frontend/.next/standalone/server.js
port: 3000
environment_variables:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_MAPTILER_KEY
```

### 4.2 Deploy Command
```bash
# From project root
catalyst deploy --service=frontend --environment=production

# Verify
catalyst logs --service=frontend --tail=50
```

---

## 5. Backend Deployment (AppSail)

### 5.1 Build Configuration
```yaml
# catalyst-appsail.yml (backend)
name: netra-ai-backend
runtime: python311
build_command: pip install -r apps/backend/requirements.txt
start_command: uvicorn apps.backend.main:app --host 0.0.0.0 --port 8000 --workers 4
port: 8000
health_check: /health
```

### 5.2 Deploy Command
```bash
catalyst deploy --service=backend --environment=production

# Verify API health
curl https://<backend-url>/health
```

---

## 6. Catalyst Functions Deployment (AI Services)

### 6.1 Function Configuration
```yaml
# functions to deploy:
- ai-intelligence-query     # POST /intelligence/query (streaming)
- report-generator          # POST /reports/generate (async)
- risk-score-updater        # Daily risk score recalculation
- embedding-generator       # On FIR create/update
```

### 6.2 Deploy Functions
```bash
catalyst function deploy --name=ai-intelligence-query
catalyst function deploy --name=report-generator
catalyst function deploy --name=risk-score-updater
catalyst function deploy --name=embedding-generator
```

---

## 7. Catalyst Cron Job Setup

Configure in: Catalyst Console → NETRA-AI → Cron

| Job Name | Schedule | Function | Description |
|---|---|---|---|
| daily-risk-update | `0 2 * * *` | risk-score-updater | 2 AM daily risk recalc |
| hotspot-prediction | `0 6 * * *` | hotspot-predictor | 6 AM hotspot refresh |
| anomaly-detection | `0 * * * *` | anomaly-detector | Hourly anomaly scan |
| cache-warmup | `55 5 * * *` | cache-warmer | Pre-warm before peak hours |
| model-retrain | `0 1 * * 0` | model-trainer | Weekly model retrain (Sunday 1 AM) |

---

## 8. Catalyst Search Configuration

```bash
# Index FIR text for full-text search
catalyst search create-index \
  --name=fir-search \
  --fields=description,location_text,crime_type,ipc_sections

# Index suspect names/aliases
catalyst search create-index \
  --name=suspect-search \
  --fields=name,aliases,gang_affiliation
```

---

## 9. Monitoring Setup

### 9.1 Catalyst Monitoring Alerts
Configure in: Catalyst Console → NETRA-AI → Monitoring

| Metric | Threshold | Alert Recipient |
|---|---|---|
| API error rate | > 1% | DevOps team |
| API response time P95 | > 1000ms | DevOps team |
| Memory usage | > 80% | DevOps team |
| CPU usage | > 70% sustained | DevOps team |
| Disk usage | > 85% | DevOps team |
| Failed logins (rate) | > 10/min | Security team |

### 9.2 Custom Application Alerts
```python
# Configured in apps/backend/core/monitoring.py
ALERT_RULES = {
    "JURISDICTION_VIOLATION": "immediate",    # Security alert
    "AUTH_BRUTE_FORCE": "immediate",          # Security alert
    "AI_ERROR_RATE": "if > 5% in 5 min",     # Ops alert
    "DB_SLOW_QUERY": "if > 2000ms",           # Performance alert
}
```

---

## 10. Production Verification Checklist

### Post-Deployment
- [ ] Frontend loads at production URL
- [ ] Login flow works with demo credentials
- [ ] MFA enrollment works
- [ ] Dashboard loads within 3 seconds
- [ ] FIR search returns results
- [ ] AI assistant responds within 5 seconds
- [ ] Graph visualization renders
- [ ] Heatmap loads with data
- [ ] Report generation produces PDF
- [ ] Audit logs recording events
- [ ] Cron jobs scheduled and next-run shown
- [ ] All Catalyst Functions responding (check function logs)
- [ ] Neo4j connection healthy (check backend logs)

---

## 11. Rollback Procedure

```bash
# If deployment causes issues, rollback to previous version
catalyst deploy rollback --service=frontend
catalyst deploy rollback --service=backend

# Check previous deployment ID
catalyst deploy list --service=backend --limit=5
catalyst deploy rollback --service=backend --deployment-id=<id>
```

---

## 12. Support

| Issue | Contact |
|---|---|
| Catalyst platform issues | Zoho Catalyst Support |
| Application bugs | NETRA AI Engineering Team |
| Database issues | Database Architect Agent |
| AI/ML issues | AI Agent + ML Agent |
| Security incidents | Security Agent (immediate escalation) |

# NETRA AI — API Specification Document
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Backend Agent | NETRA AI Engineering Team  
**Status:** 🔒 FROZEN — DO NOT MODIFY  
**Base URL:** `https://netra-ai.catalyst.zoho.com/api/v1`

> [!CAUTION]
> **API SPEC FROZEN** — 2026-07-22T11:08:13+05:30  
> Endpoint changes require explicit user instruction. All backend implementation must conform to this specification.

---

## 1. API Design Principles

- **RESTful** design with consistent resource naming
- **Versioned** endpoints (`/api/v1/`)
- **JWT Bearer** authentication on all protected endpoints
- **Consistent response envelope** for all responses
- **Pagination** on all list endpoints
- **OpenAPI 3.0** spec auto-generated via FastAPI

---

## 2. Standard Response Envelope

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 1250,
    "total_pages": 63
  },
  "timestamp": "2026-07-22T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "Your session has expired. Please log in again.",
    "details": {}
  },
  "timestamp": "2026-07-22T10:30:00Z"
}
```

---

## 3. Authentication APIs

### POST /auth/login
Login with badge number and password.
```json
Request:
{
  "badge_number": "KA-BLR-001234",
  "password": "hashed_password",
  "device_fingerprint": "optional-device-id"
}

Response 200:
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "officer": {
      "id": "uuid",
      "name": "Inspector Rajesh Kumar",
      "badge_number": "KA-BLR-001234",
      "role": "INSPECTOR",
      "station": { "id": "uuid", "name": "Shivajinagar Police Station" },
      "district": { "id": "uuid", "name": "Bengaluru Urban" },
      "permissions": ["READ_FIRS", "WRITE_FIRS", "VIEW_SUSPECTS", ...]
    },
    "mfa_required": false
  }
}
```

### POST /auth/mfa/verify
Verify MFA token (for INSPECTOR and above).
```json
Request: { "otp": "123456", "temp_token": "eyJ..." }
Response 200: { "access_token": "eyJ...", "refresh_token": "eyJ..." }
```

### POST /auth/refresh
Refresh access token using refresh token.

### POST /auth/logout
Invalidate current session, log audit entry.

---

## 4. FIR APIs

### GET /firs
List FIRs with filters (scoped to officer's jurisdiction).
```
Query Params:
  page           int      Page number (default: 1)
  per_page       int      Items per page (max: 100, default: 20)
  status         string   OPEN|CLOSED|CHARGE_SHEET|COURT
  crime_type     string   Filter by crime type
  district_id    uuid     Filter by district
  station_id     uuid     Filter by station
  date_from      date     Incident date range start
  date_to        date     Incident date range end
  priority       string   LOW|NORMAL|HIGH|CRITICAL
  search         string   Full-text search
  sort_by        string   date_incident|risk_score|priority
  sort_dir       string   asc|desc

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "fir_number": "KA-BLR-2024-00123",
      "station": { "name": "Shivajinagar PS" },
      "crime_type": "THEFT",
      "crime_subtype": "Vehicle Theft",
      "ipc_sections": ["379", "411"],
      "status": "OPEN",
      "priority": "HIGH",
      "date_incident": "2024-01-15T20:30:00Z",
      "location_text": "MG Road, Bengaluru",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "victim_count": 1,
      "accused_count": 2,
      "risk_score": 72.5,
      "summary_ai": "Vehicle theft case involving a Honda City...",
      "investigating_officer": { "name": "SI Mohan Kumar" }
    }
  ]
}
```

### GET /firs/{fir_id}
Get detailed FIR with all associated data.

### POST /firs
Create new FIR entry.

### PATCH /firs/{fir_id}
Update FIR status, assigned officer, add notes.

### GET /firs/{fir_id}/suspects
List all suspects linked to this FIR.

### GET /firs/{fir_id}/evidence
List all evidence items for this FIR.

### GET /firs/{fir_id}/timeline
Get chronological case timeline events.

### GET /firs/{fir_id}/related
AI-powered: Find related FIRs (same suspects, MO, location).
```json
Response 200:
{
  "data": {
    "related_firs": [...],
    "relationship_explanation": "3 FIRs share suspect KA-SUSP-001, same vehicle registration KA-01-AB-1234 appears in 2 others",
    "confidence_score": 0.87
  }
}
```

---

## 5. Suspect APIs

### GET /suspects
List suspects with filters and risk scoring.

### GET /suspects/{suspect_id}
Get full suspect profile with risk score, case history, graph connections.

### GET /suspects/{suspect_id}/network
Get the criminal network around this suspect (graph data for visualization).
```json
Response 200:
{
  "data": {
    "nodes": [
      { "id": "uuid", "type": "Person", "label": "Raju Naik", "risk_score": 85.2, "properties": {...} },
      { "id": "uuid", "type": "Vehicle", "label": "KA-01-AB-1234", "properties": {...} }
    ],
    "edges": [
      { "from": "uuid1", "to": "uuid2", "type": "CO_ACCUSED", "label": "FIR-2024-123", "properties": {...} }
    ],
    "communities": [
      { "id": 1, "label": "Vehicle Theft Ring", "member_count": 12, "members": ["uuid1", "uuid2"] }
    ],
    "centrality_scores": { "uuid1": 0.92, "uuid2": 0.45 }
  }
}
```

### GET /suspects/{suspect_id}/risk
Get detailed risk score with SHAP explanations.
```json
Response 200:
{
  "data": {
    "suspect_id": "uuid",
    "name": "Raju Naik",
    "risk_score": 85.2,
    "risk_level": "HIGH",
    "components": {
      "prior_convictions": { "score": 0.88, "weight": 0.25, "detail": "4 prior convictions" },
      "gang_affiliation": { "score": 0.92, "weight": 0.20, "detail": "Member of 'Bommanahalli Gang'" },
      "recidivism": { "score": 0.79, "weight": 0.25, "detail": "79% probability of reoffending within 6 months" },
      "network_centrality": { "score": 0.71, "weight": 0.15, "detail": "Top 5% of network connectors" },
      "activity_recency": { "score": 0.82, "weight": 0.15, "detail": "Active in last 30 days" }
    },
    "trend": "INCREASING",
    "history": [{ "date": "2024-01", "score": 72.0 }],
    "recommendations": ["Increase surveillance", "Cross-reference FIR KA-BLR-2024-00089"]
  }
}
```

### GET /suspects/{suspect_id}/digital-twin
Get AI-generated digital twin profile.

---

## 6. AI Intelligence APIs

### POST /intelligence/query
Send a query to the AI Crime Intelligence Assistant.
```json
Request:
{
  "conversation_id": "uuid",        // null for new conversation
  "query": "Who are the known associates of Raju Naik?",
  "context": {
    "fir_id": "uuid",              // optional context
    "suspect_id": "uuid"
  },
  "voice_audio_url": "string"       // optional, for voice queries
}

Response 200 (streaming):
{
  "data": {
    "conversation_id": "uuid",
    "message_id": "uuid",
    "response": "Based on criminal network analysis, Raju Naik has 7 known associates...",
    "citations": [
      {
        "type": "FIR",
        "id": "uuid",
        "fir_number": "KA-BLR-2024-00045",
        "excerpt": "Both accused appeared as co-accused in this case"
      },
      {
        "type": "SUSPECT",
        "id": "uuid",
        "name": "Suresh Kumar",
        "relationship": "CO_ACCUSED"
      }
    ],
    "suggested_questions": [
      "What crime types are they associated with?",
      "Show me their network graph",
      "What is Suresh Kumar's risk score?"
    ],
    "confidence": 0.91
  }
}
```

### GET /intelligence/conversations
List officer's conversation history.

### GET /intelligence/conversations/{conversation_id}
Get all messages in a conversation.

### DELETE /intelligence/conversations/{conversation_id}
Delete (archive) a conversation.

### POST /intelligence/conversations/{conversation_id}/export
Export conversation as PDF.

---

## 7. Graph APIs

### GET /graph/network
Get the full crime network for a jurisdiction (paginated for large graphs).

### POST /graph/path
Find shortest path between two suspects.
```json
Request: { "suspect1_id": "uuid", "suspect2_id": "uuid" }
Response: { "path": [...nodes...], "relationship_chain": "...", "degrees_of_separation": 3 }
```

### GET /graph/communities
Get all detected criminal communities/gangs in jurisdiction.

### GET /graph/centrality
Get top centrality suspects (network connectors/influencers).

---

## 8. Heatmap & Hotspot APIs

### GET /heatmap/data
Get crime density data for map rendering.
```
Query Params:
  district_id    uuid
  crime_type     string
  date_from      date
  date_to        date
  granularity    string  STATION|BEAT|STREET

Response: GeoJSON FeatureCollection with crime density weights
```

### GET /hotspots/predictions
Get ML-predicted crime hotspots.
```
Query Params:
  district_id    uuid
  days_ahead     int     1-7 (default: 7)
  crime_type     string

Response: GeoJSON FeatureCollection with hotspot polygons and risk scores
```

### GET /hotspots/history
Get historical hotspot accuracy data.

---

## 9. Analytics APIs

### GET /analytics/dashboard
Get aggregated KPI data for the dashboard.
```json
Response:
{
  "data": {
    "active_firs": { "count": 1250, "trend": +5.2, "trend_direction": "UP" },
    "closed_this_month": { "count": 340, "trend": -2.1 },
    "high_risk_suspects": { "count": 47, "trend": +3 },
    "hotspots_active": { "count": 12 },
    "ai_insights_today": { "count": 89 },
    "crime_by_type": [{ "type": "THEFT", "count": 450, "percentage": 36 }],
    "crime_trend_7d": [{ "date": "2026-07-15", "count": 42 }],
    "top_crime_areas": [{ "station": "Shivajinagar PS", "count": 89 }]
  }
}
```

### GET /analytics/trends
Get crime trend data with configurable time windows.

### GET /analytics/risk-matrix
Get risk matrix data (probability vs. impact grid for crime types).

---

## 10. Reports APIs

### POST /reports/generate
Generate a court-ready intelligence report.
```json
Request:
{
  "type": "CASE_BRIEF",       // CASE_BRIEF|SUSPECT_PROFILE|NETWORK_ANALYSIS|TREND_REPORT
  "fir_id": "uuid",
  "suspect_id": "uuid",
  "include_sections": ["summary", "timeline", "evidence", "network", "risk"],
  "format": "PDF"
}

Response 202:
{
  "data": {
    "report_id": "uuid",
    "status": "GENERATING",
    "estimated_seconds": 20,
    "poll_url": "/reports/uuid/status"
  }
}
```

### GET /reports/{report_id}/status
Poll report generation status.

### GET /reports/{report_id}/download
Download generated report PDF.

### GET /reports
List generated reports for current officer.

---

## 11. Patrol & Alerts APIs

### GET /patrol/recommendations
Get AI-powered patrol deployment recommendations.
```json
Response:
{
  "data": {
    "zones": [
      {
        "zone_id": "uuid",
        "name": "MG Road Area",
        "priority": "HIGH",
        "risk_score": 82.3,
        "recommended_units": 3,
        "shift": "NIGHT",
        "crime_types": ["THEFT", "ASSAULT"],
        "rationale": "3 vehicle thefts in last 48 hours, historically high night crime rate"
      }
    ],
    "generated_at": "2026-07-22T08:00:00Z",
    "valid_until": "2026-07-22T20:00:00Z"
  }
}
```

### GET /alerts
Get active alerts for officer's jurisdiction.

### PATCH /alerts/{alert_id}/acknowledge
Acknowledge an alert.

---

## 12. Administration APIs

### GET /admin/officers
List all officers (SUPERADMIN only).

### POST /admin/officers
Create new officer account.

### PATCH /admin/officers/{officer_id}
Update officer details, role, or station.

### DELETE /admin/officers/{officer_id}
Deactivate officer account.

### GET /admin/audit-logs
Get paginated audit logs with filters.

---

## 13. Error Codes

| Code | HTTP | Description |
|---|---|---|
| AUTH_INVALID_CREDENTIALS | 401 | Wrong badge/password |
| AUTH_TOKEN_EXPIRED | 401 | JWT has expired |
| AUTH_MFA_REQUIRED | 403 | MFA verification required |
| AUTH_INSUFFICIENT_PERMISSIONS | 403 | Role doesn't have permission |
| AUTH_JURISDICTION_VIOLATION | 403 | Resource outside officer's jurisdiction |
| RESOURCE_NOT_FOUND | 404 | FIR/Suspect not found |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| AI_SERVICE_UNAVAILABLE | 503 | Gemini/AI service down |
| GRAPH_QUERY_TIMEOUT | 504 | Neo4j query timed out |

---

## 14. Rate Limits

| Role | Limit | Window |
|---|---|---|
| SUPERADMIN | 1000 req | per minute |
| COMMISSIONER | 500 req | per minute |
| DySP/INSPECTOR | 200 req | per minute |
| CONSTABLE | 60 req | per minute |
| AI endpoint | 20 req | per minute (all roles) |

---

## 15. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Backend Agent | Initial API spec — Phase 1 |

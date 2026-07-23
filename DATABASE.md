# NETRA AI — Database Architecture Document
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Database Architect Agent | NETRA AI Engineering Team  
**Status:** 🔒 FROZEN — DO NOT MODIFY

> [!CAUTION]
> **DATABASE SCHEMA FROZEN** — 2026-07-22T11:08:13+05:30  
> Schema changes require explicit user instruction. All implementation must follow this schema as written.

---

## 1. Database Strategy

NETRA AI employs a **polyglot persistence** strategy — using the right database for each data type and access pattern:

| Database | Use Case | Technology |
|---|---|---|
| Primary relational data | FIRs, officers, cases, suspects | Catalyst Data Store (PostgreSQL-compatible) |
| Graph relationships | Criminal networks, associations | Neo4j Aura |
| Caching + sessions | API responses, sessions, real-time | Redis (Catalyst Cache) |
| Vector embeddings | Semantic search, RAG | pgvector (in Catalyst) or Pinecone |
| Full-text search | FIR keyword search | Catalyst Search |
| File storage | Evidence, reports, documents | Catalyst File Store |

---

## 2. Primary Database Schema (Catalyst Data Store)

### Table: officers
```sql
CREATE TABLE officers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_number    VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    phone           VARCHAR(15),
    role            VARCHAR(30) NOT NULL,       -- ENUM: roles
    rank            VARCHAR(50) NOT NULL,
    station_id      UUID REFERENCES stations(id),
    district_id     UUID REFERENCES districts(id),
    is_active       BOOLEAN DEFAULT true,
    mfa_enabled     BOOLEAN DEFAULT false,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    created_by      UUID REFERENCES officers(id)
);
CREATE INDEX idx_officers_station ON officers(station_id);
CREATE INDEX idx_officers_role ON officers(role);
```

### Table: districts
```sql
CREATE TABLE districts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(10) UNIQUE NOT NULL,
    region          VARCHAR(50),               -- North/South/Central Karnataka
    boundary_geojson JSONB,                    -- District boundary polygon
    population      INTEGER,
    area_sq_km      DECIMAL(10,2),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: stations
```sql
CREATE TABLE stations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20) UNIQUE NOT NULL,
    district_id     UUID NOT NULL REFERENCES districts(id),
    address         TEXT,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    jurisdiction_geojson JSONB,               -- Station jurisdiction polygon
    phone           VARCHAR(15),
    officer_count   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stations_district ON stations(district_id);
CREATE INDEX idx_stations_geo ON stations USING GIST(ST_Point(longitude, latitude));
```

### Table: firs (First Information Reports)
```sql
CREATE TABLE firs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number      VARCHAR(50) UNIQUE NOT NULL,  -- KA-BLR-2024-00123
    station_id      UUID NOT NULL REFERENCES stations(id),
    district_id     UUID NOT NULL REFERENCES districts(id),
    date_filed      TIMESTAMPTZ NOT NULL,
    date_incident   TIMESTAMPTZ NOT NULL,
    crime_type      VARCHAR(50) NOT NULL,           -- ENUM: crime types
    crime_subtype   VARCHAR(100),
    ipc_sections    VARCHAR(200)[],                 -- Array of IPC sections
    status          VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    priority        VARCHAR(20) DEFAULT 'NORMAL',   -- LOW/NORMAL/HIGH/CRITICAL
    description     TEXT NOT NULL,
    location_text   TEXT,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    victim_count    INTEGER DEFAULT 0,
    accused_count   INTEGER DEFAULT 0,
    property_value  DECIMAL(15,2),
    reporting_officer_id UUID REFERENCES officers(id),
    investigating_officer_id UUID REFERENCES officers(id),
    summary_ai      TEXT,                           -- AI-generated summary
    risk_score      DECIMAL(5,2),                   -- 0-100
    embedding_vector vector(1536),                  -- For semantic search
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_firs_station ON firs(station_id);
CREATE INDEX idx_firs_district ON firs(district_id);
CREATE INDEX idx_firs_crime_type ON firs(crime_type);
CREATE INDEX idx_firs_status ON firs(status);
CREATE INDEX idx_firs_date ON firs(date_incident DESC);
CREATE INDEX idx_firs_geo ON firs USING GIST(ST_Point(longitude, latitude));
CREATE INDEX idx_firs_vector ON firs USING ivfflat (embedding_vector vector_cosine_ops);
```

### Table: suspects
```sql
CREATE TABLE suspects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    aliases         VARCHAR(100)[],                 -- Known aliases/nicknames
    dob             DATE,
    gender          VARCHAR(10),
    national_id     VARCHAR(20),                    -- Aadhaar (encrypted)
    phone           VARCHAR(15)[],                  -- Multiple phones
    address_current TEXT,
    address_permanent TEXT,
    photo_url       VARCHAR(500),                   -- Catalyst File Store URL
    fingerprint_id  VARCHAR(100),
    criminal_history JSONB,
    gang_affiliation VARCHAR(100),
    risk_score      DECIMAL(5,2) DEFAULT 0,
    risk_level      VARCHAR(20) DEFAULT 'LOW',      -- LOW/MEDIUM/HIGH/CRITICAL
    risk_factors    JSONB,                          -- SHAP explanations
    is_wanted       BOOLEAN DEFAULT false,
    is_incarcerated BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_suspects_risk ON suspects(risk_score DESC);
CREATE INDEX idx_suspects_gang ON suspects(gang_affiliation);
CREATE INDEX idx_suspects_wanted ON suspects(is_wanted) WHERE is_wanted = true;
```

### Table: fir_suspects (Junction)
```sql
CREATE TABLE fir_suspects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id          UUID NOT NULL REFERENCES firs(id),
    suspect_id      UUID NOT NULL REFERENCES suspects(id),
    role            VARCHAR(30),                    -- ACCUSED/WITNESS/VICTIM/INFORMANT
    arrest_date     DATE,
    bail_status     VARCHAR(30),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(fir_id, suspect_id)
);
CREATE INDEX idx_fir_suspects_fir ON fir_suspects(fir_id);
CREATE INDEX idx_fir_suspects_suspect ON fir_suspects(suspect_id);
```

### Table: evidence
```sql
CREATE TABLE evidence (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id          UUID NOT NULL REFERENCES firs(id),
    type            VARCHAR(50) NOT NULL,           -- DOCUMENT/PHOTO/VIDEO/FORENSIC/WITNESS
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    file_url        VARCHAR(500),                   -- Catalyst File Store URL
    collected_by    UUID REFERENCES officers(id),
    collected_at    TIMESTAMPTZ,
    chain_of_custody JSONB,
    is_verified     BOOLEAN DEFAULT false,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_evidence_fir ON evidence(fir_id);
CREATE INDEX idx_evidence_type ON evidence(type);
```

### Table: vehicles
```sql
CREATE TABLE vehicles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_no VARCHAR(20) UNIQUE,
    make            VARCHAR(50),
    model           VARCHAR(50),
    color           VARCHAR(30),
    year            INTEGER,
    owner_suspect_id UUID REFERENCES suspects(id),
    is_stolen       BOOLEAN DEFAULT false,
    stolen_fir_id   UUID REFERENCES firs(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: phone_records
```sql
CREATE TABLE phone_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number          VARCHAR(15) NOT NULL,
    suspect_id      UUID REFERENCES suspects(id),
    carrier         VARCHAR(50),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: locations
```sql
CREATE TABLE locations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    type            VARCHAR(50),                    -- RESIDENCE/BUSINESS/LANDMARK/HIDEOUT
    address         TEXT,
    latitude        DECIMAL(10,8) NOT NULL,
    longitude       DECIMAL(11,8) NOT NULL,
    station_id      UUID REFERENCES stations(id),
    crime_count     INTEGER DEFAULT 0,
    last_incident   TIMESTAMPTZ,
    risk_score      DECIMAL(5,2) DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_locations_geo ON locations USING GIST(ST_Point(longitude, latitude));
```

### Table: crime_hotspots
```sql
CREATE TABLE crime_hotspots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id     UUID NOT NULL REFERENCES districts(id),
    station_id      UUID REFERENCES stations(id),
    prediction_date DATE NOT NULL,
    crime_type      VARCHAR(50),
    confidence      DECIMAL(5,4),                   -- 0.0-1.0
    risk_level      VARCHAR(20),                    -- LOW/MEDIUM/HIGH/CRITICAL
    center_lat      DECIMAL(10,8) NOT NULL,
    center_lon      DECIMAL(11,8) NOT NULL,
    radius_km       DECIMAL(6,3),
    polygon_geojson JSONB,
    model_version   VARCHAR(30),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ
);
CREATE INDEX idx_hotspots_district ON crime_hotspots(district_id);
CREATE INDEX idx_hotspots_date ON crime_hotspots(prediction_date);
```

### Table: ai_conversations
```sql
CREATE TABLE ai_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id      UUID NOT NULL REFERENCES officers(id),
    title           VARCHAR(200),
    summary         TEXT,
    message_count   INTEGER DEFAULT 0,
    is_archived     BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_conversations_officer ON ai_conversations(officer_id);
```

### Table: ai_messages
```sql
CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id),
    role            VARCHAR(20) NOT NULL,            -- USER/ASSISTANT/SYSTEM
    content         TEXT NOT NULL,
    citations       JSONB,                           -- [{fir_id, suspect_id, excerpt}]
    model_used      VARCHAR(50),
    tokens_used     INTEGER,
    latency_ms      INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON ai_messages(conversation_id);
```

### Table: audit_logs
```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id      UUID REFERENCES officers(id),
    action          VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(50),
    resource_id     VARCHAR(100),
    details         JSONB,
    ip_address      INET,
    user_agent      TEXT,
    status          VARCHAR(20),                    -- SUCCESS/FAILURE
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_officer ON audit_logs(officer_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

### Table: alerts
```sql
CREATE TABLE alerts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            VARCHAR(50) NOT NULL,           -- HOTSPOT/SUSPECT/ANOMALY/GANG/NETWORK
    severity        VARCHAR(20) NOT NULL,           -- INFO/WARNING/HIGH/CRITICAL
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    district_id     UUID REFERENCES districts(id),
    station_id      UUID REFERENCES stations(id),
    related_fir_id  UUID REFERENCES firs(id),
    related_suspect_id UUID REFERENCES suspects(id),
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES officers(id),
    acknowledged_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ
);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_district ON alerts(district_id);
CREATE INDEX idx_alerts_acknowledged ON alerts(is_acknowledged) WHERE is_acknowledged = false;
```

### Table: court_reports
```sql
CREATE TABLE court_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            VARCHAR(50) NOT NULL,
    fir_id          UUID REFERENCES firs(id),
    suspect_id      UUID REFERENCES suspects(id),
    generated_by    UUID NOT NULL REFERENCES officers(id),
    title           VARCHAR(300) NOT NULL,
    content_json    JSONB,                          -- Structured report data
    file_url        VARCHAR(500),                   -- PDF in Catalyst File Store
    status          VARCHAR(30) DEFAULT 'DRAFT',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reports_fir ON court_reports(fir_id);
CREATE INDEX idx_reports_officer ON court_reports(generated_by);
```

---

## 3. Neo4j Graph Schema

### Node Types
```cypher
// PERSON node
CREATE CONSTRAINT person_id FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE (p:Person {
    id: "uuid",
    name: "string",
    suspectId: "uuid",      // Reference to PostgreSQL
    riskScore: 0.0,
    riskLevel: "string",
    isWanted: false,
    gangAffiliation: "string"
})

// FIR node
CREATE CONSTRAINT fir_id FOR (f:FIR) REQUIRE f.id IS UNIQUE;
CREATE (f:FIR {
    id: "uuid",
    firNumber: "string",
    crimeType: "string",
    dateIncident: "datetime",
    status: "string",
    riskScore: 0.0
})

// LOCATION node
CREATE CONSTRAINT location_id FOR (l:Location) REQUIRE l.id IS UNIQUE;
CREATE (l:Location {
    id: "uuid",
    name: "string",
    latitude: 0.0,
    longitude: 0.0,
    type: "string",
    crimeCount: 0
})

// VEHICLE node
CREATE CONSTRAINT vehicle_id FOR (v:Vehicle) REQUIRE v.id IS UNIQUE;
CREATE (v:Vehicle {
    id: "uuid",
    registrationNo: "string",
    make: "string",
    model: "string",
    isStolen: false
})

// PHONE node
CREATE CONSTRAINT phone_id FOR (ph:Phone) REQUIRE ph.number IS UNIQUE;
CREATE (ph:Phone {
    number: "string",
    isActive: true
})

// ORGANIZATION node (Gangs, criminal organizations)
CREATE (o:Organization {
    id: "uuid",
    name: "string",
    type: "string",         // GANG/CARTEL/NETWORK
    memberCount: 0,
    riskLevel: "string"
})
```

### Relationship Types
```cypher
// Co-accused relationship
(p1:Person)-[:CO_ACCUSED {firId: "uuid", date: datetime()}]->(p2:Person)

// Gang membership
(p:Person)-[:MEMBER_OF {since: date, role: "string"}]->(o:Organization)

// Vehicle ownership
(p:Person)-[:OWNS {since: date}]->(v:Vehicle)

// Phone ownership
(p:Person)-[:USES {since: date, isPrimary: bool}]->(ph:Phone)

// Location frequency
(p:Person)-[:FREQUENTS {count: int, lastSeen: datetime}]->(l:Location)

// Suspect in FIR
(p:Person)-[:ACCUSED_IN {role: "string", arrestDate: date}]->(f:FIR)

// FIR at location
(f:FIR)-[:OCCURRED_AT]->(l:Location)

// Vehicle used in FIR
(v:Vehicle)-[:USED_IN {firId: "uuid"}]->(f:FIR)

// Phone called
(ph1:Phone)-[:CALLED {count: int, lastCall: datetime}]->(ph2:Phone)

// Associate relationship
(p1:Person)-[:ASSOCIATES_WITH {strength: float}]->(p2:Person)
```

### Key Graph Queries (Cypher)
```cypher
-- Find all associates of a suspect (2 hops)
MATCH (p:Person {id: $suspectId})-[*1..2]-(connected)
RETURN p, connected

-- Find gang community
MATCH (p:Person)-[:MEMBER_OF]->(o:Organization {id: $gangId})
RETURN p, o

-- Find shortest path between two suspects
MATCH path = shortestPath(
    (p1:Person {id: $suspect1Id})-[*..6]-(p2:Person {id: $suspect2Id})
)
RETURN path

-- Top betweenness centrality (key connectors)
CALL gds.betweenness.stream('crimeNetwork')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name, score
ORDER BY score DESC LIMIT 20

-- Community detection (Louvain)
CALL gds.louvain.stream('crimeNetwork')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name, communityId
ORDER BY communityId
```

---

## 4. Redis Cache Schema

```
# Session data
session:{userId} → JSON (officer profile, permissions) TTL: 60min

# API response cache
firs:list:{stationId}:{page} → JSON TTL: 5min
suspects:profile:{suspectId} → JSON TTL: 15min
analytics:dashboard:{districtId} → JSON TTL: 10min
hotspots:active:{districtId} → JSON TTL: 6hr

# Conversation context
conversation:context:{conversationId} → JSON (message history) TTL: 24hr

# Rate limiting
ratelimit:{userId}:{endpoint} → count TTL: 1min

# Real-time alerts
alerts:pending:{districtId} → List TTL: 24hr
```

---

## 5. Vector Database Schema

```
Collection: fir_embeddings
Fields:
  - id: UUID
  - fir_id: UUID (reference)
  - text: string (FIR description)
  - embedding: float[1536] (text-embedding-3-small)
  - metadata: {crime_type, date, district, station, status}

Collection: suspect_embeddings
Fields:
  - id: UUID
  - suspect_id: UUID
  - text: string (profile description)
  - embedding: float[1536]
  - metadata: {risk_level, gang, district}
```

---

## 6. Indexing Strategy

| Table | Index | Type | Reason |
|---|---|---|---|
| firs | date_incident | BTREE | Date range queries |
| firs | crime_type | BTREE | Filter queries |
| firs | (lat, lon) | GIST | Geospatial queries |
| firs | embedding_vector | IVFFlat | Semantic search |
| suspects | risk_score | BTREE DESC | Top-risk queries |
| audit_logs | created_at | BTREE DESC | Recent activity |
| crime_hotspots | prediction_date | BTREE | Date-based prediction lookup |

---

## 7. Data Retention Policy

| Data Type | Retention | Archive |
|---|---|---|
| Active FIRs | Indefinite | N/A |
| Closed FIRs | 30 years | Cold storage after 5 years |
| Audit Logs | 7 years | Cold storage after 2 years |
| AI Conversations | 2 years | Export on request |
| Court Reports | 30 years | Catalyst File Store |
| ML Predictions | 1 year | Rolling delete |
| Cache entries | Per TTL | Auto-evicted |

---

## 8. Migration Strategy

```
migrations/
├── 001_initial_schema.sql
├── 002_fir_indexes.sql
├── 003_vector_extension.sql
├── 004_neo4j_constraints.cypher
└── 005_seed_data.sql
```

---

## 9. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Database Architect Agent | Initial schema — Phase 1 |

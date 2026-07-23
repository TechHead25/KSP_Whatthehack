# NETRA AI — Security Architecture Document
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Security Agent | NETRA AI Engineering Team  
**Status:** 🔒 FROZEN — DO NOT MODIFY

> [!CAUTION]
> **SECURITY ARCHITECTURE FROZEN** — 2026-07-22T11:08:13+05:30  
> Security model changes require explicit user instruction. All authentication, RBAC, and encryption implementation must follow this document.

---

## 1. Security Philosophy

NETRA AI handles sensitive law enforcement data including suspect profiles, FIRs, criminal networks, and evidence. Security is not a feature — it is a foundational principle embedded at every layer of the architecture.

**Security Axioms:**
1. Zero-trust: Every request must be authenticated and authorized
2. Least privilege: Officers access only what their role and jurisdiction permits
3. Defense in depth: Multiple independent security layers
4. Audit everything: All data access logged and immutable
5. Fail secure: System defaults to deny on errors

---

## 2. Threat Model

### 2.1 Threat Actors
| Actor | Description | Risk Level |
|---|---|---|
| External Attacker | Unknown actor attempting unauthorized access | HIGH |
| Compromised Officer | Legitimate officer with stolen credentials | HIGH |
| Insider Threat | Rogue officer accessing unauthorized records | CRITICAL |
| Data Exfiltration | Bulk download of sensitive intelligence | CRITICAL |
| API Abuse | Automated scraping or brute-force | MEDIUM |
| Supply Chain | Compromised third-party library | MEDIUM |

### 2.2 Attack Vectors
- Credential theft (phishing, brute force)
- JWT token theft (session hijacking)
- SQL/Cypher injection via malformed queries
- Unauthorized jurisdiction access (IDOR)
- Excessive data extraction (enumeration attacks)
- AI prompt injection

---

## 3. Authentication Architecture

### 3.1 Catalyst Authentication Integration
```
Primary Auth Provider: Zoho Catalyst Authentication
Fallback: Internal JWT (during Catalyst outage)
MFA: TOTP (Google Authenticator compatible) for INSPECTOR+
Session: JWT (access: 60min, refresh: 24hr, hard limit: 8hr)
```

### 3.2 Authentication Flow
```
1. Officer submits badge_number + password
2. Catalyst Auth verifies credentials
3. System checks officer is_active status
4. System loads RBAC role and permissions
5. System checks MFA requirement (role-based)
   a. If MFA required → issue temp_token, redirect to MFA
   b. MFA pass → issue full access+refresh tokens
6. JWT generated with claims:
   {
     sub: officer_id,
     role: "INSPECTOR",
     station_id: "uuid",
     district_id: "uuid",
     permissions: ["READ_FIRS", "WRITE_FIRS", ...],
     iat: timestamp,
     exp: timestamp + 3600
   }
7. Audit log: LOGIN_SUCCESS event
8. Rate limit bucket initialized
```

### 3.3 JWT Security
```python
# Token configuration
ALGORITHM = "RS256"           # Asymmetric signing
ACCESS_TOKEN_EXPIRE = 3600    # 60 minutes
REFRESH_TOKEN_EXPIRE = 86400  # 24 hours
HARD_SESSION_LIMIT = 28800    # 8 hours maximum

# JWT header (DO NOT store in localStorage)
# Use: httpOnly + secure cookie
# CSRF protection via double-submit cookie pattern
```

### 3.4 Account Security
```
Max failed attempts:   5 (then 15-minute lockout)
Password requirements: min 12 chars, uppercase, lowercase, digit, special
Password reset:        OTP to registered police email only
Session invalidation:  On role change, password reset, manual logout
Concurrent sessions:   Maximum 3 per officer
```

---

## 4. Authorization Architecture (RBAC)

### 4.1 Role Definitions
```python
class Role(Enum):
    SUPERADMIN   = "SUPERADMIN"
    COMMISSIONER = "COMMISSIONER"
    DYSP         = "DYSP"
    INSPECTOR    = "INSPECTOR"
    CONSTABLE    = "CONSTABLE"
    PROSECUTOR   = "PROSECUTOR"
    ANALYST      = "ANALYST"
```

### 4.2 Permission Matrix
```
Permission               SUPER  COMM   DySP   INSP   CONS   PROS   ANAL
─────────────────────────────────────────────────────────────────────────
READ_ALL_FIRS              ✓      ✓      -      -      -      -      -
READ_DISTRICT_FIRS         ✓      ✓      ✓      -      -      -      -
READ_STATION_FIRS          ✓      ✓      ✓      ✓      ✓      ✓      ✓
WRITE_FIRS                 ✓      -      ✓      ✓      -      -      -
READ_ALL_SUSPECTS          ✓      ✓      -      -      -      -      -
READ_DISTRICT_SUSPECTS     ✓      ✓      ✓      -      -      -      -
READ_STATION_SUSPECTS      ✓      ✓      ✓      ✓      ✓      ✓      ✓
WRITE_SUSPECTS             ✓      -      ✓      ✓      -      -      -
VIEW_CRIMINAL_NETWORK      ✓      ✓      ✓      ✓      -      ✓      ✓
VIEW_HEATMAP               ✓      ✓      ✓      ✓      ✓      -      ✓
VIEW_ANALYTICS             ✓      ✓      ✓      ✓      -      -      ✓
GENERATE_REPORTS           ✓      ✓      ✓      ✓      -      ✓      ✓
USE_AI_ASSISTANT           ✓      ✓      ✓      ✓      -      ✓      ✓
MANAGE_OFFICERS            ✓      -      -      -      -      -      -
VIEW_AUDIT_LOGS            ✓      ✓      ✓      -      -      -      -
MANAGE_ALERTS              ✓      ✓      ✓      ✓      ✓      -      -
VIEW_EVIDENCE              ✓      ✓      ✓      ✓      -      ✓      -
MANAGE_PATROL              ✓      ✓      ✓      ✓      -      -      -
```

### 4.3 Jurisdiction Scoping
```python
# All data queries MUST be filtered by jurisdiction
# This is enforced at the service layer, not just the API layer

class JurisdictionScope:
    NATIONAL   = "NATIONAL"    # SUPERADMIN, COMMISSIONER
    DISTRICT   = "DISTRICT"    # DySP (own district only)
    STATION    = "STATION"     # INSPECTOR, CONSTABLE (own station)
    
def apply_jurisdiction_filter(query, officer: Officer):
    if officer.role in [Role.SUPERADMIN, Role.COMMISSIONER]:
        return query  # No filter
    elif officer.role == Role.DYSP:
        return query.filter(district_id=officer.district_id)
    else:
        return query.filter(station_id=officer.station_id)
```

---

## 5. Data Security

### 5.1 Encryption
```
At Rest:    AES-256-GCM (Catalyst Data Store managed)
In Transit: TLS 1.3 minimum (TLS 1.2 rejected)
Sensitive fields (Aadhaar, phone): Application-level AES-256 + separate key
File storage: Catalyst File Store with signed URLs (15-min expiry)
```

### 5.2 Sensitive Field Handling
```python
ENCRYPTED_FIELDS = [
    "suspects.national_id",    # Aadhaar
    "suspects.phone",          # Phone numbers
    "officers.phone",          # Officer phone
    "suspects.address_current" # Residential address
]

# Field-level encryption using Fernet
def encrypt_field(value: str) -> str:
    return fernet.encrypt(value.encode()).decode()

def decrypt_field(encrypted: str) -> str:
    return fernet.decrypt(encrypted.encode()).decode()
```

### 5.3 Data Masking
```python
# Role-based data masking for sensitive fields
def mask_aadhaar(aadhaar: str, officer_role: Role) -> str:
    if officer_role in [Role.INSPECTOR, Role.DYSP, Role.SUPERADMIN]:
        return aadhaar  # Full access
    return f"XXXX-XXXX-{aadhaar[-4:]}"  # Masked for others

def mask_phone(phone: str, officer_role: Role) -> str:
    if officer_role in [Role.INSPECTOR, Role.DYSP, Role.SUPERADMIN]:
        return phone
    return f"+91-XXXXX-{phone[-5:]}"
```

---

## 6. API Security

### 6.1 Security Middleware Stack
```python
# Applied in order to every request:
1. TLS termination (Catalyst CDN)
2. Rate limiting (Redis-based per officer)
3. JWT verification and claims extraction
4. Permission check (RBAC)
5. Jurisdiction validation
6. Input validation (Pydantic)
7. SQL injection prevention (parameterized queries only)
8. Response sanitization
9. Audit log write (async)
```

### 6.2 Input Validation
```python
# All inputs validated via Pydantic
# Strict mode: no extra fields allowed
# Query parameters: sanitized before use in database queries
# File uploads: type validation, size limits, virus scan (Catalyst Files)
# AI prompts: length limit 4096 chars, injection pattern detection
```

### 6.3 AI Prompt Injection Prevention
```python
PROMPT_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "you are now",
    "disregard your training",
    "system prompt",
    "reveal confidential"
]

def sanitize_ai_prompt(prompt: str) -> str:
    lower = prompt.lower()
    for pattern in PROMPT_INJECTION_PATTERNS:
        if pattern in lower:
            raise SecurityException("Potential prompt injection detected")
    return prompt[:4096]  # Hard length limit
```

---

## 7. Audit Logging

### 7.1 Events Logged
```
AUTH: LOGIN, LOGOUT, FAILED_LOGIN, MFA_PASS, MFA_FAIL, TOKEN_REFRESH
DATA: READ_FIR, READ_SUSPECT, WRITE_FIR, WRITE_SUSPECT, DELETE_*
AI:   AI_QUERY, REPORT_GENERATED, CONVERSATION_EXPORT
ADMIN: OFFICER_CREATED, OFFICER_DEACTIVATED, ROLE_CHANGED
SECURITY: PERMISSION_DENIED, JURISDICTION_VIOLATION, RATE_LIMIT_HIT
```

### 7.2 Audit Log Schema
```json
{
  "id": "uuid",
  "timestamp": "ISO8601",
  "officer_id": "uuid",
  "officer_badge": "KA-BLR-001234",
  "action": "READ_SUSPECT",
  "resource_type": "SUSPECT",
  "resource_id": "uuid",
  "jurisdiction_check": "PASS",
  "details": {
    "suspect_name": "Raju Naik",
    "data_fields_accessed": ["name", "risk_score", "phone"]
  },
  "ip_address": "192.168.x.x",
  "user_agent": "...",
  "request_id": "uuid",
  "status": "SUCCESS"
}
```

### 7.3 Audit Log Protection
- Audit logs are **append-only** (no UPDATE/DELETE)
- Stored in separate read-only table
- Replicated to Catalyst Logs (external)
- Tamper-evident (each record hashes previous record)
- Retention: 7 years per IT Act requirements

---

## 8. Infrastructure Security

### 8.1 Catalyst Security Configuration
```yaml
# Environment Variables (Catalyst Env Vars - never in code)
CATALYST_AUTH_SECRET: [managed by Catalyst]
JWT_PRIVATE_KEY: [base64 encoded RSA key]
JWT_PUBLIC_KEY: [base64 encoded RSA public]
NEO4J_URI: [encrypted]
NEO4J_PASSWORD: [encrypted]
GEMINI_API_KEY: [encrypted]
FIELD_ENCRYPTION_KEY: [Fernet key]
DB_CONNECTION_STRING: [Catalyst managed]
```

### 8.2 Network Security
```
- All traffic over HTTPS (TLS 1.3)
- API endpoints not exposed publicly (Catalyst private networking)
- Neo4j accessible only from backend service
- Redis accessible only from backend service
- No direct database access from frontend
- All external API calls via backend proxy
```

### 8.3 CORS Configuration
```python
ALLOWED_ORIGINS = [
    "https://netra-ai.catalyst.zoho.com",
    "https://netra.ksp.gov.in"  # Production domain
]
# Credentials: true (for cookie-based auth)
# Methods: GET, POST, PATCH, DELETE
# Headers: Authorization, Content-Type, X-Request-ID
```

---

## 9. Incident Response

### Severity Levels
| Level | Example | Response Time | Escalation |
|---|---|---|---|
| P1 CRITICAL | Data breach, auth bypass | 15 minutes | CISO + Commissioner |
| P2 HIGH | Brute force attack, data leak | 1 hour | Security team |
| P3 MEDIUM | Repeated permission violations | 4 hours | Station commander |
| P4 LOW | Minor policy violations | 24 hours | Station SHO |

### Automated Responses
- 5+ failed logins → Account lockout (15 min)
- 10+ failed logins in 1 hr → Permanent lock + admin alert
- Jurisdiction violation detected → Alert security team immediately
- Unusual bulk data export → Flag for review, slow-down response
- AI prompt injection detected → Block request, log incident

---

## 10. Compliance

| Standard | Requirement | Implementation |
|---|---|---|
| IT Act 2000 | Data protection | Encryption, access control |
| PDPB 2023 | Personal data protection | Minimization, consent, retention |
| Police Act | Audit trail | Immutable audit logs |
| Evidence Act | Chain of custody | Signed evidence records |
| RTI Act | Information transparency | Controlled data disclosure |

---

## 11. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Security Agent | Initial security architecture — Phase 1 |

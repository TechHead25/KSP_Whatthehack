# NETRA AI — Coding Standards & Engineering Guidelines
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** Chief Architect Agent | NETRA AI Engineering Team  
**Status:** APPROVED — Phase 1

---

## 1. General Principles

All code written for NETRA AI must adhere to the following non-negotiable principles:

### SOLID Principles
- **S** — Single Responsibility: Every class/function has one reason to change
- **O** — Open/Closed: Open for extension, closed for modification
- **L** — Liskov Substitution: Subtypes must be substitutable for base types
- **I** — Interface Segregation: No class forced to depend on unused interfaces
- **D** — Dependency Inversion: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Extract repeated logic into shared utilities
- Reuse components from `packages/ui` always before creating new ones
- Shared types live in `packages/types`
- Common config in `packages/config`

### Repository Pattern
- ALL database access goes through a Repository class
- Controllers/routes NEVER access the database directly
- Services NEVER import database drivers directly
- All queries tested independently of business logic

### Feature-First Architecture
```
# BAD - Layer-first
/components/SuspectCard.tsx
/components/FIRCard.tsx

# GOOD - Feature-first
/features/suspects/components/SuspectCard.tsx
/features/fir/components/FIRCard.tsx
```

---

## 2. TypeScript Standards (Frontend)

### Strict Configuration
```json
// tsconfig.json — MANDATORY settings
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions
```typescript
// ALWAYS define explicit types — no 'any'
// NEVER use 'any'. Use 'unknown' + type guards if needed.

// Good
interface FIR {
  id: string;
  firNumber: string;
  crimeType: CrimeType;
  status: FIRStatus;
  riskScore: number;
  location: {
    lat: number;
    lon: number;
    text: string;
  };
  createdAt: Date;
}

// Bad
const fir: any = { ... }

// Enums for all finite sets
enum CrimeType {
  THEFT = "THEFT",
  ASSAULT = "ASSAULT",
  DRUG = "DRUG",
  GANG = "GANG",
  TRAFFIC = "TRAFFIC",
  MURDER = "MURDER",
  FRAUD = "FRAUD",
}

enum FIRStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CHARGE_SHEET = "CHARGE_SHEET",
  COURT = "COURT",
}
```

### Component Standards
```typescript
// All components: typed props, no implicit children
interface SuspectCardProps {
  suspect: Suspect;
  onViewProfile: (id: string) => void;
  onViewNetwork: (id: string) => void;
  showRiskScore?: boolean;
  className?: string;
}

// Use React.FC ONLY when necessary. Prefer plain function components.
function SuspectCard({ suspect, onViewProfile, showRiskScore = true }: SuspectCardProps) {
  // Component logic
}

// Always export types alongside components
export type { SuspectCardProps };
export { SuspectCard };
```

### Hooks Standards
```typescript
// Custom hooks: prefix with 'use', return typed objects
function useFIRList(filters: FIRFilters) {
  const { data, isLoading, error } = useQuery<FIRListResponse>({
    queryKey: ['firs', filters],
    queryFn: () => firApi.list(filters),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });

  return { firs: data?.data ?? [], isLoading, error };
}
```

### State Management (Zustand)
```typescript
// Zustand store: typed, no side effects in store
interface DashboardStore {
  selectedDistrict: string | null;
  activeAlerts: Alert[];
  setSelectedDistrict: (id: string | null) => void;
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  selectedDistrict: null,
  activeAlerts: [],
  setSelectedDistrict: (id) => set({ selectedDistrict: id }),
  addAlert: (alert) => set((state) => ({ activeAlerts: [...state.activeAlerts, alert] })),
  clearAlerts: () => set({ activeAlerts: [] }),
}));
```

---

## 3. Python Standards (Backend)

### Type Hints (Mandatory)
```python
# ALL functions must have complete type annotations
from typing import Optional, List, Dict, Any
from uuid import UUID

async def get_fir_by_id(
    fir_id: UUID,
    officer: Officer,
    include_suspects: bool = False
) -> Optional[FIRDetail]:
    ...

# Use Pydantic for all request/response models
class FIRCreateRequest(BaseModel):
    fir_number: str = Field(..., regex=r'^KA-[A-Z]{3}-\d{4}-\d{5}$')
    crime_type: CrimeType
    description: str = Field(..., min_length=50, max_length=5000)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    ipc_sections: List[str] = Field(default_factory=list)
```

### Repository Pattern (Backend)
```python
# ALWAYS use Repository pattern
class FIRRepository:
    def __init__(self, db: AsyncSession):
        self._db = db
    
    async def find_by_id(self, fir_id: UUID) -> Optional[FIR]:
        result = await self._db.execute(
            select(FIR).where(FIR.id == fir_id)
        )
        return result.scalar_one_or_none()
    
    async def list_by_station(
        self,
        station_id: UUID,
        filters: FIRFilters,
        page: int,
        per_page: int
    ) -> tuple[List[FIR], int]:
        ...

# Service uses repository, never DB directly
class FIRService:
    def __init__(self, repo: FIRRepository, ai_service: AIService):
        self._repo = repo
        self._ai = ai_service
    
    async def get_fir_detail(self, fir_id: UUID, officer: Officer) -> FIRDetail:
        fir = await self._repo.find_by_id(fir_id)
        if not fir:
            raise FIRNotFoundError(fir_id)
        self._check_jurisdiction(fir, officer)
        return self._build_detail(fir)
```

### Error Handling
```python
# Custom exception hierarchy
class NETRABaseException(Exception):
    code: str
    message: str
    http_status: int

class AuthException(NETRABaseException):
    http_status = 401

class PermissionException(NETRABaseException):
    http_status = 403

class JurisdictionViolationException(PermissionException):
    code = "AUTH_JURISDICTION_VIOLATION"

class ResourceNotFoundException(NETRABaseException):
    http_status = 404

# Global exception handler in FastAPI
@app.exception_handler(NETRABaseException)
async def netra_exception_handler(request: Request, exc: NETRABaseException):
    return JSONResponse(
        status_code=exc.http_status,
        content={
            "success": False,
            "error": { "code": exc.code, "message": exc.message }
        }
    )
```

### Async Standards
```python
# ALL database and I/O operations must be async
# Never use blocking calls in async functions

# GOOD
async def fetch_suspect_data(suspect_id: UUID) -> SuspectDetail:
    suspect = await repo.find_by_id(suspect_id)
    risk = await risk_service.calculate(suspect_id)
    network = await graph_service.get_network(suspect_id)
    return SuspectDetail(suspect=suspect, risk=risk, network=network)

# BAD
def fetch_suspect_data(suspect_id: UUID) -> SuspectDetail:
    suspect = repo.find_by_id(suspect_id)  # Blocking!
    ...
```

### Logging Standards
```python
import structlog
log = structlog.get_logger()

# Structured logging with context
log.info(
    "fir_retrieved",
    fir_id=str(fir_id),
    officer_id=str(officer.id),
    station_id=str(officer.station_id),
    duration_ms=elapsed_ms
)

# NEVER log sensitive data
# NEVER log: passwords, tokens, Aadhaar, phone numbers
```

---

## 4. File Naming Conventions

### Frontend
```
# Pages:      kebab-case directories
/fir-search/page.tsx
/criminal-network/page.tsx

# Components: PascalCase
SuspectCard.tsx
FIRListItem.tsx
CrimeHeatmap.tsx

# Hooks:      camelCase, prefix 'use'
useFIRSearch.ts
useSuspectNetwork.ts

# Stores:     camelCase, suffix 'Store' or 'slice'
dashboardStore.ts
alertStore.ts

# Types:      PascalCase
types/fir.types.ts
types/suspect.types.ts

# API:        camelCase, suffix 'Api'
api/firApi.ts
api/suspectApi.ts
```

### Backend
```
# Routes:     snake_case
api/v1/routers/fir.py

# Services:   snake_case
domain/fir/service.py

# Models:     snake_case
domain/fir/models.py

# Tests:      prefix 'test_'
tests/test_fir_service.py
tests/test_fir_repository.py
```

---

## 5. Git & Version Control

### Branch Strategy
```
main           → Production (protected, no direct push)
develop        → Integration branch
feature/*      → New features (from develop)
fix/*          → Bug fixes (from develop)
hotfix/*       → Critical prod fixes (from main)
release/*      → Release preparation
```

### Commit Message Format (Conventional Commits)
```
<type>(<scope>): <description>

Types:
  feat      New feature
  fix       Bug fix
  docs      Documentation
  style     Code style (no logic change)
  refactor  Code restructure (no feature/fix)
  test      Test additions/changes
  chore     Build/CI/infrastructure

Examples:
  feat(fir): add AI-powered related FIR discovery
  fix(auth): fix JWT refresh race condition
  feat(graph): implement Louvain community detection
  docs(api): update suspect network endpoint spec
```

### Pull Request Rules
- Minimum 1 reviewer required
- All CI checks must pass
- No failing tests
- No TypeScript errors
- Security scan must pass
- Documentation updated if API changed

---

## 6. Testing Standards

### Test Coverage Targets
| Layer | Minimum Coverage |
|---|---|
| Backend Services | 90% |
| Backend Repositories | 85% |
| Backend API Routes | 80% |
| Frontend Components | 75% |
| Frontend Hooks | 85% |
| ML Models | 80% |

### Test Naming
```python
# Pattern: test_[unit]_[scenario]_[expected_outcome]
def test_fir_service_get_by_id_returns_fir_when_exists()
def test_fir_service_get_by_id_raises_not_found_when_missing()
def test_fir_service_get_by_id_raises_jurisdiction_error_when_wrong_station()
```

### Test Types Required
- **Unit tests:** Pure business logic (no DB, no network)
- **Integration tests:** Service + Repository + DB (test DB)
- **API tests:** End-to-end HTTP tests (TestClient)
- **Security tests:** Auth, permissions, input validation
- **Performance tests:** Load testing key endpoints

---

## 7. Code Review Checklist

Before approving any PR, verify:

**Security:**
- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated via Pydantic
- [ ] Jurisdiction check present on all data access
- [ ] Sensitive data not logged
- [ ] Audit log written for all data mutations

**Architecture:**
- [ ] Repository pattern followed (no direct DB in service/route)
- [ ] Feature-first folder structure
- [ ] No circular dependencies
- [ ] Shared types in packages/types (not duplicated)

**Quality:**
- [ ] No TypeScript `any` types
- [ ] No Python functions without type hints
- [ ] Error boundaries for all async operations
- [ ] Loading and error states handled in UI
- [ ] No console.log in production code

**Performance:**
- [ ] N+1 queries avoided (use joins/batch loading)
- [ ] Expensive operations cached in Redis
- [ ] Pagination on all list endpoints
- [ ] Async/await correctly used (no blocking)

---

## 8. Environment Configuration

```bash
# Development
ENVIRONMENT=development
LOG_LEVEL=DEBUG
CORS_ORIGINS=http://localhost:3000
CACHE_TTL_SECONDS=60

# Production
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://netra-ai.catalyst.zoho.com
CACHE_TTL_SECONDS=300

# NEVER commit .env files
# ALWAYS use Catalyst Environment Variables for secrets
```

---

## 9. Documentation Requirements

- Every public API function: JSDoc/docstring with params and return type
- Every React component: Storybook story (packages/ui components)
- Every API endpoint: OpenAPI spec (auto-generated via FastAPI)
- Every ML model: model card (inputs, outputs, metrics, training data)
- Every database migration: numbered, reversible, documented

---

## 10. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | Chief Architect Agent | Initial coding standards — Phase 1 |

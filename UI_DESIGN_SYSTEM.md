# NETRA AI — UI Design System
**Version:** 1.0.0  
**Date:** 2026-07-22  
**Author:** UI/UX Design Agent | NETRA AI Engineering Team  
**Status:** 🔒 FROZEN — DO NOT MODIFY

> [!CAUTION]
> **DESIGN SYSTEM FROZEN** — 2026-07-22T11:08:13+05:30  
> Design token and component changes require explicit user instruction. All frontend implementation must use this design system as written.

---

## 1. Design Philosophy

NETRA AI's design language is inspired by **mission-critical intelligence platforms**: Palantir Gotham, Microsoft Sentinel, IBM Watson, and Splunk Enterprise. The interface must communicate:

- **Authority** — This is government law enforcement
- **Intelligence** — Data-dense but comprehensible
- **Trust** — Reliable, consistent, professional
- **Precision** — Every element has purpose

**Design Pillars:**
1. **Dark Intelligence** — Deep dark backgrounds, high-contrast data
2. **Structured Density** — Maximum data, zero clutter
3. **Purposeful Motion** — Animation communicates state, not decoration
4. **Layered Glass** — Depth through glassmorphism, not flat cards
5. **Signal Color** — Color only for status and priority signals

---

## 2. Color System

### Base Palette (Dark Theme)
```css
/* Background Layers */
--color-bg-base:        #050A14;   /* Deepest background */
--color-bg-surface:     #0A1628;   /* Primary surface */
--color-bg-elevated:    #0F1F3D;   /* Elevated cards */
--color-bg-overlay:     #162845;   /* Modal/drawer backdrop */
--color-bg-glass:       rgba(15, 31, 61, 0.6);  /* Glassmorphism */

/* Border & Dividers */
--color-border-subtle:  rgba(56, 97, 170, 0.20);
--color-border-default: rgba(56, 97, 170, 0.35);
--color-border-strong:  rgba(56, 97, 170, 0.60);

/* Text Hierarchy */
--color-text-primary:   #E8EDF7;   /* Headings, primary content */
--color-text-secondary: #8FA8CC;   /* Labels, supporting text */
--color-text-tertiary:  #4A6A99;   /* Placeholder, disabled */
--color-text-inverse:   #050A14;   /* On bright surfaces */

/* Brand Blue (NETRA AI) */
--color-brand-50:       #EFF6FF;
--color-brand-100:      #DBEAFE;
--color-brand-200:      #BFDBFE;
--color-brand-300:      #93C5FD;
--color-brand-400:      #60A5FA;
--color-brand-500:      #3B82F6;   /* Primary brand */
--color-brand-600:      #2563EB;
--color-brand-700:      #1D4ED8;
--color-brand-800:      #1E40AF;
--color-brand-900:      #1E3A8A;

/* Cyan Accent (Intelligence) */
--color-accent-cyan:    #06B6D4;
--color-accent-cyan-dim: rgba(6, 182, 212, 0.15);

/* Status & Priority Colors */
--color-status-critical: #EF4444;
--color-status-high:     #F97316;
--color-status-medium:   #EAB308;
--color-status-low:      #22C55E;
--color-status-info:     #3B82F6;
--color-status-neutral:  #6B7280;

/* Risk Level Colors */
--color-risk-critical:   #DC2626;
--color-risk-high:       #EA580C;
--color-risk-medium:     #CA8A04;
--color-risk-low:        #16A34A;

/* Chart & Visualization Palette */
--color-viz-1: #3B82F6;    /* Blue */
--color-viz-2: #06B6D4;    /* Cyan */
--color-viz-3: #8B5CF6;    /* Purple */
--color-viz-4: #F59E0B;    /* Amber */
--color-viz-5: #EF4444;    /* Red */
--color-viz-6: #10B981;    /* Emerald */
--color-viz-7: #F97316;    /* Orange */
--color-viz-8: #EC4899;    /* Pink */
```

### Light Mode (Limited - Print/Report)
```css
/* Used only for PDF report generation */
--color-print-bg:     #FFFFFF;
--color-print-text:   #1A1A2E;
--color-print-border: #CBD5E1;
--color-print-accent: #1E40AF;
```

---

## 3. Typography System

### Font Stack
```css
/* Primary: Headlines, Navigation, Badges */
--font-primary: 'Inter', 'IBM Plex Sans', system-ui, sans-serif;

/* Data/Mono: Badge numbers, FIR IDs, Codes */
--font-mono: 'IBM Plex Mono', 'Fira Code', 'Courier New', monospace;

/* Kannada/Hindi Support */
--font-regional: 'Noto Sans Kannada', 'Noto Sans Devanagari', sans-serif;
```

### Type Scale
```css
/* Display — Commissioner level headings */
--text-display-xl:  clamp(2.5rem, 5vw, 4rem);    /* 64px */
--text-display-lg:  clamp(2rem, 4vw, 3rem);       /* 48px */

/* Headings */
--text-heading-xl:  1.875rem;   /* 30px — Page titles */
--text-heading-lg:  1.5rem;     /* 24px — Section titles */
--text-heading-md:  1.25rem;    /* 20px — Card titles */
--text-heading-sm:  1.125rem;   /* 18px — Widget titles */

/* Body */
--text-body-xl:     1.125rem;   /* 18px — Lead text */
--text-body-lg:     1rem;       /* 16px — Primary body */
--text-body-md:     0.875rem;   /* 14px — Secondary body */
--text-body-sm:     0.75rem;    /* 12px — Labels, captions */
--text-body-xs:     0.625rem;   /* 10px — Micro labels */

/* Font Weights */
--font-weight-light:   300;
--font-weight-regular: 400;
--font-weight-medium:  500;
--font-weight-semibold: 600;
--font-weight-bold:    700;
--font-weight-black:   900;

/* Line Heights */
--leading-tight:    1.25;
--leading-snug:     1.375;
--leading-normal:   1.5;
--leading-relaxed:  1.625;
```

---

## 4. Spacing System

```css
/* Base unit: 4px */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 5. Layout System

### Application Shell
```
┌────────────────────────────────────────────────────────┐
│                    TOP BAR (64px)                       │
│  [NETRA Logo] [Search] [Alerts] [Profile] [Settings]   │
├──────────────┬─────────────────────────────────────────┤
│              │                                          │
│   SIDEBAR    │         MAIN CONTENT AREA               │
│   (240px)    │         (fluid width)                   │
│              │                                          │
│  Navigation  │   ┌──────────────────────────────────┐  │
│  Context     │   │         Page Content              │  │
│  Quick Stats │   │                                   │  │
│              │   └──────────────────────────────────┘  │
│              │                                          │
├──────────────┴─────────────────────────────────────────┤
│               CONTEXT PANEL (360px — collapsible)       │
│           [AI Assistant | Case Details | Evidence]      │
└────────────────────────────────────────────────────────┘
```

### Grid System
```css
/* 12-column grid with 24px gutters */
--grid-columns: 12;
--grid-gutter:  1.5rem;  /* 24px */
--grid-margin:  2rem;    /* 32px */

/* Breakpoints */
--bp-sm:   640px;   /* Tablet landscape */
--bp-md:   768px;   /* Small desktop */
--bp-lg:   1024px;  /* Standard desktop */
--bp-xl:   1280px;  /* Large desktop */
--bp-2xl:  1536px;  /* 4K/ultra-wide */
```

---

## 6. Component Library

### 6.1 KPI Card
```
┌────────────────────────────────┐
│ ┌──────┐  Active FIRs          │
│ │ ICON │  1,250                │
│ └──────┘  ↑ 5.2% from last mo │
│ ████████████░░░░░░ 72%        │
└────────────────────────────────┘
```
- Glass background with border
- Icon with brand tint
- Large metric number (bold)
- Trend indicator (↑↓ colored)
- Progress bar (optional)
- Hover: subtle glow + scale(1.02)

### 6.2 Risk Badge
```
[ ■ CRITICAL ]  [ ▲ HIGH ]  [ ● MEDIUM ]  [ ○ LOW ]
```
- Small pill with status color
- Icon prefix
- Animate pulse for CRITICAL

### 6.3 FIR List Item
```
┌─────────────────────────────────────────────────────┐
│ ● KA-BLR-2024-00123   THEFT · §379,411    [HIGH]   │
│   MG Road, Bengaluru · 15 Jan 2024                  │
│   SI Mohan Kumar · 2 accused · Open                 │
└─────────────────────────────────────────────────────┘
```

### 6.4 Suspect Card
```
┌──────────────────────────────────┐
│ [Photo]  Raju Naik               │
│          Risk Score: 85.2 ████  │
│          Gang: Bommanahalli Ring │
│          Wanted: YES             │
│ [View Profile] [Network] [Alert] │
└──────────────────────────────────┘
```

### 6.5 AI Chat Message
```
[Officer]  Who are the associates of suspect Raju Naik?

[NETRA]    Based on analysis of 23 FIRs and criminal network
           data, Raju Naik has 7 known associates:
           
           1. Suresh Kumar [MEDIUM Risk] — Co-accused in 
              FIR KA-BLR-2024-00045 ↗
           2. Mohammed Ali [HIGH Risk] — Linked via vehicle
              KA-01-AB-1234 in 3 cases ↗
           ...
           
           📎 Sources: FIR-0045, FIR-0089, FIR-0123
           💡 Suggested: "Show network graph for Raju Naik"
```

### 6.6 Alert Toast
```
┌─────────────────────────────────────────────┐
│ 🔴 CRITICAL ALERT                   [×]     │
│ Vehicle theft spike detected in Indiranagar │
│ 4 incidents in last 2 hours — Zone KA-03   │
│ [View Details]              [Acknowledge]   │
└─────────────────────────────────────────────┘
```

### 6.7 Action Tooltip
```
┌──────────────────────────────────────────┐
│ Filters locked in Demo Environment       │
│                                      ▼   │
└──────────────────────────────────────────┘
```
- Used strictly to wrap disabled/mock UI elements
- Explains why the feature is locked (e.g. Demo Mode, permissions)
- Black/elevated background with high contrast text

---

## 7. Animation System

### Principles
- **Duration:** 150ms (micro), 300ms (transition), 500ms (complex)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (ease out expo)
- **Purpose:** Every animation communicates state change, not decoration

### Motion Tokens
```css
--motion-duration-micro:  150ms;
--motion-duration-quick:  300ms;
--motion-duration-normal: 500ms;
--motion-duration-slow:   800ms;

--motion-ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
--motion-ease-enter:      cubic-bezier(0.16, 1, 0.3, 1);
--motion-ease-exit:       cubic-bezier(0.4, 0, 1, 1);
--motion-ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Key Animations
1. **Page transition:** Fade + slide Y (−8px → 0) 300ms
2. **Card hover:** Scale(1.02) + glow shadow 200ms
3. **Risk badge CRITICAL:** Pulse animation (opacity 1→0.6 loop 1s)
4. **Graph node appear:** Scale(0 → 1) + opacity stagger
5. **Dashboard KPI update:** Number count-up animation
6. **Alert entrance:** Slide from right + shake on CRITICAL
7. **AI typing:** Blinking cursor + fade text appear
8. **Heatmap render:** Gradient fade in 800ms
9. **Sidebar expand/collapse:** Width transition 300ms ease

---

## 8. Icon System

Use **Lucide React** as primary icon library + custom intelligence icons.

### Key Icons
| Context | Icon |
|---|---|
| Dashboard | LayoutDashboard |
| FIR | FileText |
| Suspects | Users |
| Network Graph | GitBranch |
| Heatmap | Map |
| AI Assistant | BrainCircuit |
| Evidence | Search |
| Reports | ClipboardList |
| Patrol | Navigation |
| Alerts | AlertTriangle |
| Risk CRITICAL | AlertOctagon |
| Analytics | BarChart3 |
| Admin | Settings2 |
| Audit | Shield |

---

## 9. Navigation Structure

### Sidebar Navigation
```
NETRA AI [Logo]

INTELLIGENCE
  ├── Dashboard
  ├── AI Assistant          [NEW]
  └── Early Warning

INVESTIGATION
  ├── FIR Search
  ├── Suspects
  ├── Evidence Explorer
  └── Case Timeline

ANALYSIS
  ├── Criminal Network
  ├── Crime Heatmap
  ├── Risk Analytics
  └── Analytics

OPERATIONS
  ├── Patrol Recommendations
  └── Court Reports

ADMINISTRATION            [ADMIN only]
  ├── Officers
  ├── Audit Logs
  └── Settings
```

---

## 10. Responsive Design

### Priority Breakpoints
| Viewport | Layout Adjustment |
|---|---|
| 1536px+ | Full layout, expanded panels |
| 1280px | Standard government laptop |
| 1024px | Collapsed sidebar (icon only) |
| 768px | Mobile-first stacked layout |
| 640px | Simplified view, key data only |

---

## 11. Accessibility Standards

- **WCAG 2.1 Level AA** compliance required
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for UI components
- All interactive elements keyboard navigable
- Focus indicators visible (2px solid cyan ring)
- Screen reader ARIA labels on all icons and chart elements
- Skip-to-main navigation link
- Alert announcements via aria-live regions

---

## 12. Design Tokens File Structure

```
packages/ui/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── motion.ts
│   └── breakpoints.ts
├── components/
│   ├── KPICard/
│   ├── RiskBadge/
│   ├── AlertToast/
│   ├── SuspectCard/
│   ├── FIRListItem/
│   ├── NetworkGraph/
│   ├── Heatmap/
│   ├── AIChat/
│   ├── Timeline/
│   └── DataTable/
└── theme/
    ├── dark.ts
    └── print.ts
```

---

## 13. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.1.0 | 2026-07-22 | UI/UX Design Agent | Added Tooltip component — Phase 5 |
| 1.0.0 | 2026-07-22 | UI/UX Design Agent | Initial design system — Phase 1 |

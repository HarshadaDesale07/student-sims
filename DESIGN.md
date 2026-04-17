# Design Brief

**Purpose**: Student Information Management System—educational administrative platform requiring clarity, trustworthiness, and efficient form/data workflows.

**Tone**: Professional, institutional, minimal decoration. Emphasis on readability and accessible information hierarchy.

**Palette**

| Role | OKLCH Light | OKLCH Dark | Usage |
|------|-------------|-----------|-------|
| Primary | 0.55 0.18 193 | 0.65 0.22 193 | Buttons, interactive states, links (teal—education signal) |
| Destructive | 0.58 0.2 27 | 0.65 0.22 27 | Delete actions, alerts |
| Secondary | 0.92 0 0 | 0.2 0 0 | Subtle backgrounds, form sections |
| Success | 0.65 0.18 140 | 0.7 0.22 140 | Validation, positive feedback |
| Foreground | 0.18 0 0 | 0.93 0 0 | Body text (high contrast) |
| Border | 0.88 0 0 | 0.26 0 0 | Dividers, form inputs |

**Typography**

| Role | Font | Sizes |
|------|------|-------|
| Display | Plus Jakarta Sans | 28px H1, 24px H2, 20px H3 |
| Body | DM Sans | 16px body, 14px labels |
| Mono | System monospace | Form inputs, PRN fields |

**Shape & Elevation**

| Element | Treatment |
|---------|-----------|
| Buttons, inputs, cards | `rounded-md` (6–8px) |
| Cards | 1px border + soft shadow (0 2px 8px rgba) |
| Form inputs | Light grey background, clear border focus |
| Data tables | Subtle row dividers, hover state lightening |

**Structural Zones**

| Zone | Treatment |
|------|-----------|
| Header | `bg-card border-b border-border`, nav links teal hover |
| Student Dashboard | `bg-background`, welcome card elevated on `bg-card`, profile section in bordered card |
| Admin Panel | Sidebar `bg-sidebar`, main content grid table with row striping, bulk actions bar |
| Forms | Label-input stacks, clear error states (red foreground), success checkmarks |
| Footer | `bg-muted/20 border-t`, small text, links |

**Component Patterns**

- **Forms**: Label + input stack, button at bottom, inline validation messages.
- **Data tables**: Sortable headers, row hover, delete/edit action buttons right-aligned.
- **Cards**: Title + content + optional actions footer.
- **Buttons**: Primary (teal fill), secondary (light background), destructive (red fill).
- **Sidebar nav**: Active item background teal, icon + label, clear hover.

**Motion**

- Smooth fade/slide on modal open/close (0.2s).
- Button hover opacity shift (0.3s).
- Form field focus ring glow (no animation, instant 2px ring).

**Constraints**

- No gradients beyond subtle underlay (background transparency).
- No animations on page load; reserve motion for user interactions.
- Max two font families (display + body).
- All interactive elements keyboard-accessible, focus rings visible.

**Signature Detail**: Clean border + shadow combo on cards creates depth without decoration; teal primary paired with neutral greys signals professionalism and trust.

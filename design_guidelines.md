# Sports Betting Management Platform - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Material Design) with productivity app influences
**Justification**: This is a data-heavy, utility-focused application where users need to efficiently track bets, manage bankroll, and analyze performance. Clean, functional design prioritizes usability over visual flair.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 91% 45% (Professional blue for trust and reliability)
- Surface: 0 0% 98% (Clean white backgrounds)
- Text: 220 15% 25% (Dark gray for readability)

**Dark Mode:**
- Primary: 220 91% 65% (Lighter blue for contrast)
- Surface: 220 15% 8% (Rich dark background)
- Text: 220 15% 85% (Light gray text)

**Semantic Colors:**
- Success (Wins): 142 76% 36% (Green)
- Error (Losses): 0 84% 60% (Red)
- Warning (Pending): 45 93% 47% (Amber)

### B. Typography
- **Primary Font**: Inter (Google Fonts) - Clean, readable sans-serif
- **Accent Font**: JetBrains Mono (Google Fonts) - For odds, stakes, and numerical data
- **Hierarchy**: h1(2xl), h2(xl), h3(lg), body(base), caption(sm)

### C. Layout System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16
- **Micro spacing**: p-2, gap-2 (form elements, small components)
- **Standard spacing**: p-4, m-4, gap-4 (cards, sections)
- **Large spacing**: p-8, m-8 (page margins, major sections)

### D. Component Library

**Navigation:**
- Sidebar navigation with collapsible sections
- Clean icons from Heroicons
- Active state indicators with primary color

**Data Display:**
- Card-based layouts for bet entries and summaries
- Data tables with alternating row colors
- Metric cards with large numbers and trend indicators

**Forms:**
- Floating labels for bet registration
- Grouped form sections (Event Details, Bet Details, etc.)
- Clear validation states

**Charts & Analytics:**
- Simple line charts for profit/loss trends
- Donut charts for win rate visualization
- Color-coded performance indicators

**Overlays:**
- Modal dialogs for bet editing
- Toast notifications for actions
- Confirmation dialogs for deletions

### E. Key Design Principles
1. **Data First**: Numbers and metrics are prominently displayed
2. **Scanning Efficiency**: Information hierarchy supports quick data scanning
3. **Trust Indicators**: Professional appearance builds confidence in financial data
4. **Mobile Responsive**: Optimized for bet tracking on-the-go

### F. Page-Specific Treatments

**Dashboard:**
- Grid layout with metric cards
- Quick action buttons for common tasks
- Recent bets list with status indicators

**Bet Registration:**
- Step-by-step form with clear sections
- Real-time odds formatting
- Success confirmation with bet summary

**Analytics:**
- Clean charts with minimal decoration
- Filter controls prominently placed
- Export functionality clearly marked

**Images:**
No hero images or decorative graphics needed. This is a utility-focused application where data visualization (charts, graphs) provides the primary visual interest. Any icons should come from Heroicons library for consistency.
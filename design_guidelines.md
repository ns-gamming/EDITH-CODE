# EDITH Design Guidelines
**3D AI-Powered Visual Coding Platform by Nishant Sarkar**

## Design Approach

**Hybrid Approach: Productivity Tool with Gaming Aesthetics**

EDITH combines the functional clarity of modern IDEs (VS Code, Linear) with the immersive visual appeal of gaming interfaces. Reference Lovable's 3D coding interface for spatial depth, while maintaining the precision and usability of JetBrains IDEs.

**Core Principle**: Form follows function, but function is enhanced by thoughtful visual design.

---

## Typography System

**Primary Font Stack**:
- Code/Monospace: JetBrains Mono (primary), Fira Code (fallback)
- UI Text: Inter (clean, modern, highly legible)

**Hierarchy**:
- Hero/Branding: 4xl to 6xl, font-bold (Inter)
- Section Headers: 2xl to 3xl, font-semibold
- UI Labels: sm to base, font-medium
- Code Editor: base (14-16px), JetBrains Mono
- Body Text: sm to base, font-normal

---

## Layout & Spacing System

**Spatial Units**: Use Tailwind spacing: 2, 4, 6, 8, 12, 16, 24, 32
- Component padding: p-4 to p-8
- Section spacing: gap-6 to gap-12
- Panel margins: m-4 to m-8

**Grid Structure**:
- Dashboard: 12-column responsive grid
- IDE Layout: Flex-based with resizable panels (sidebar: 240-320px, editor: flex-1, terminal: 200-400px height)
- Cards/Projects: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

---

## Core Components

### Authentication Pages
- Animated sliding panels inspired by attached login reference
- Split-screen layout with toggle animation
- Social auth icons in circular containers (w-10 h-10)
- Glassmorphic form containers with backdrop-blur-lg
- Branding footer: "Created by NISHANT SARKAR" (text-xs, opacity-70)

### Navigation & Header
- Top navbar: h-16, backdrop-blur-md, border-b
- Logo area: "EDITH" with subtle glow effect
- Theme switcher: Segmented control (Gaming/White/Dark)
- User profile dropdown with avatar (w-10 h-10, rounded-full)
- API key status indicator with badge

### IDE Interface Layout
**Three-Panel System**:
1. **Left Sidebar** (w-64): File tree, project navigator, collapsible
2. **Center Editor** (flex-1): Monaco editor with tabs, breadcrumbs
3. **Right Panel** (w-80): AI chat, context, prompt enhancer

**Bottom Panel** (h-48 to h-80, resizable):
- Tabbed interface: Terminal, Console, Problems, Output
- Split view support for multi-pane debugging

### Monaco Editor Integration
- Dark theme integration matching chosen theme
- Tab bar: h-10, horizontal scroll for multiple files
- Minimap on right edge (optional toggle)
- Line numbers, code folding, syntax highlighting
- Status bar: line/col, language, encoding (h-6, text-xs)

### AI Interaction Panel
- Floating card design with subtle shadow and border
- Prompt input: Expandable textarea, min-h-24, max-h-96
- Model selector dropdown: Gemini, OpenAI, Anthropic with icons
- System prompt editor: Collapsible section, monospace font
- Send button: Large, prominent (px-8 py-3, rounded-lg)
- Response streaming with typing animation
- Code blocks with copy button overlay

### Project Dashboard
- Card-based grid layout with hover elevation
- Project cards: Thumbnail preview (16:9 aspect), title, metadata
- Quick actions: Open, Delete, Share (icon buttons)
- "New Project" card with dashed border, centered icon
- Search bar and filter dropdowns at top
- Recently accessed section with horizontal scroll

### File Upload Zone
- Drag-and-drop area with dashed border (border-2, border-dashed)
- File type icons and size display
- Progress bars for uploads (h-2, rounded-full)
- Image previews in thumbnail grid (w-20 h-20)
- AI analysis results in expandable cards

### Modals & Overlays
- API Key Request Modal: Centered, max-w-lg, backdrop-blur-xl
- Settings Panel: Slide-in from right, w-96
- Confirmation dialogs: max-w-md, rounded-xl
- All overlays: Semi-transparent backdrop (bg-black/50)

---

## 3D & Animation Guidelines

**Use Sparingly for Impact**:
- **Landing Page**: Three.js particle background with gentle float
- **Panel Depth**: Subtle box-shadow layering, no transform-3d unless purposeful
- **Transitions**: duration-200 to duration-300 for UI interactions
- **Hover States**: scale-[1.02], shadow-lg transitions
- **Theme Switching**: Smooth color transitions (transition-colors duration-500)

**Avoid**:
- Continuous spinning/rotating elements
- Parallax scrolling in IDE
- Distracting background animations during coding

---

## Theme Implementation

**Gaming Theme** (Primary):
- Neon green (#00FF41) for primary actions, success states
- Hot pink (#FF0080) for accents, highlights, warnings
- Medium slate blue (#7B68EE) for links, info states
- Dark backgrounds with subtle gradients
- Glow effects on active elements (box-shadow with theme colors)

**White Theme**:
- Blue (#2563EB) primary, Slate (#64748B) secondary
- Clean white backgrounds (#FFFFFF)
- Subtle gray borders and dividers
- High contrast for readability

**Dark Theme**:
- Emerald (#10B981) primary, Indigo (#6366F1) secondary
- Slate-900 (#0F172A) background
- Reduced eye strain with muted contrasts

**Consistent Across Themes**:
- Border radius: rounded-lg (0.5rem) for cards, rounded-md for inputs
- Shadow system: shadow-sm, shadow-md, shadow-lg, shadow-xl
- Focus rings: ring-2, ring-offset-2, ring-primary

---

## Responsive Behavior

- **Desktop (lg+)**: Full three-panel IDE layout
- **Tablet (md)**: Collapsible sidebar, stacked panels
- **Mobile (base)**: Single-column, drawer navigation, simplified editor

---

## Branding Elements

- EDITH logo: Futuristic sans-serif with subtle glow
- Tagline: "Even Dead I Am The Hero"
- Footer credit: "Created by NISHANT SARKAR" on all pages
- Loading states: Animated EDITH logo with progress indicator

---

## Accessibility

- Keyboard navigation for all IDE functions
- ARIA labels on icon-only buttons
- High contrast modes available
- Focus visible states on all interactive elements
- Screen reader announcements for AI responses

---

## Images

**Hero Section** (Landing Page):
- Large abstract coding/AI visualization background (full viewport)
- Holographic grid overlay effect
- Foreground: EDITH branding with glassmorphic card containing CTA

**Dashboard Thumbnails**:
- Project preview screenshots (automatically generated from last edit)
- Placeholder for new projects: Abstract code pattern

**Empty States**:
- Friendly illustrations for "no projects", "no files"
- Consistent illustration style matching theme
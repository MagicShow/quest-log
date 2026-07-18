# QuestLog — Personal Command Center

## Concept & Vision

A video game-inspired personal command center for someone juggling an overwhelming season of life — kids, house sale, divorce paperwork, multiple app projects. QuestLog treats daily tasks as quests, projects as campaigns, and personal progress as leveling up. The goal: make productivity feel like winning a game, not doing homework. Dark cyberpunk/neon aesthetic with the energy of a game HUD — not a cheerful todo app, a *command center for a life operating at high intensity*.

---

## Design Language

### Aesthetic Direction
Cyberpunk command terminal — dark, sharp, glowing. Think: game HUD meets mission control. Every element feels like it has a purpose and energy.

### Color Palette
```
--bg-deep:       #0A0A0F      /* near-black base */
--bg-surface:    #12121A      /* card surfaces */
--bg-elevated:   #1A1A2E      /* modals, dropdowns */
--primary:       #00E5FF      /* cyan glow — energy, focus */
--accent:        #FF2D78      /* hot pink — urgency, achievements */
--gold:          #FFD700      /* XP, level, rewards */
--success:       #00FF88      /* quest complete, streaks */
--warning:       #FF9500      /* low energy, warnings */
--danger:        #FF3B3B      /* missed, overdue */
--text-primary:  #F0F0F5
--text-muted:   #6B6B8A
```

### Typography
- **Headings:** Orbitron (Google Font) — futuristic, game-like
- **Body:** Space Grotesk — clean, modern, readable
- **Mono/data:** JetBrains Mono — stats, numbers, counters

### Motion Philosophy
- XP gains: pop + glow animation (scale 1.2, gold flash, settle)
- Quest completion: checkmark sweep + confetti burst
- Level up: full-screen flash + achievement banner slide-in
- Energy drain: smooth bar decrease with pulse when low
- All transitions: 200-300ms ease-out, no sluggishness

### Visual Assets
- Custom SVG icons (sword = task, shield = project, star = achievement)
- Glowing borders on active elements (`box-shadow: 0 0 20px var(--primary)`)
- Subtle scan-line overlay on header for retro CRT feel
- Progress bars with gradient fills and glow

---

## Layout & Structure

### Main Dashboard (Single Page App)
```
┌─────────────────────────────────────────────────────┐
│  QUESTLOG          [Player Name]  Lv.12  ⚡85/100  │
│  ═══════════════   Streak: 🔥14  Gold: 2,450     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌─────────────────────────────┐ │
│  │ ACTIVE QUESTS │  │   QUEST BOARD (MAIN)        │ │
│  │ (task list)  │  │   Today's Missions         │ │
│  │              │  │   [+ New Quest]             │ │
│  │ □ Quest 1    │  │                             │ │
│  │ □ Quest 2    │  │   □ Sub-quest A    +15 XP   │ │
│  │ □ Quest 3    │  │   □ Sub-quest B    +25 XP   │ │
│  │              │  │   □ Sub-quest C    +10 XP   │ │
│  └──────────────┘  └─────────────────────────────┘ │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐ ┌────────────┐ │
│  │ PROJECTS    │  │  ACHIEVEMENTS│ │ NIGHT AGENT│ │
│  │ ⚔ Campaign  │  │  🏆 5/20     │ │ Optimize!  │ │
│  │ 🛡 Home      │  │  🔓 Locked   │ │            │ │
│  │ 🎯 Apps      │  │              │ │            │ │
│  └──────────────┘  └──────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Responsive Strategy
- Desktop: 3-column layout as above
- Tablet: 2-column (quests + board, projects below)
- Mobile: single column, sticky header with player stats

---

## Features & Interactions

### 1. Quest System (Tasks)
- Quest = single task or checklist item
- **Difficulty levels:**
  - Easy: +10 XP
  - Medium: +25 XP
  - Hard: +50 XP
  - Epic: +100 XP
- **Quest types:**
  - `[!]` Urgent — pink accent, counts toward daily focus
  - `[*]` Important — cyan accent
  - `[~]` Optional — muted, no penalty
- **Interactions:**
  - Click quest → toggle complete (strikethrough + XP animation)
  - Swipe left → archive
  - Long press → edit/priority
  - Drag → reorder

### 2. Energy System
- **Focus Energy:** 0-100, depletes as you complete quests
  - Each Easy quest: -5 energy
  - Each Medium: -10
  - Each Hard: -20
  - Each Epic: -35
- **Overnight recovery:** Energy refills to 100 while you sleep
- **Low energy warning:** Bar turns orange <30, red <15, pulses
- **No negative for low energy** — just a signal to rest

### 3. Leveling System
- XP required per level: `level * 100`
- Lv.1 = 0 XP, Lv.2 = 100 XP, Lv.12 = 1,200 XP
- Level up: full animation, +1 permanent level, achievement badge
- Displayed prominently in header

### 4. Streak System
- Daily check-in = maintain streak
- If no quests completed in 24h = streak resets
- Streak milestones: 3, 7, 14, 30, 60, 100 days
- Visual: flame icon with day count

### 5. Project/Campaign System
- Projects = collections of quests
- Default projects:
  - ⚔️ **Life Admin** (house, paperwork, divorce)
  - 🏠 **Home** (selling, buying, moving)
  - 🚀 **Apps** (ContractorHub, other builds)
  - 👨‍👧‍👦 **Family** (kids, parenting)
  - 💪 **Self** (health, fitness, mindset)
- Add custom projects anytime

### 6. Achievement System
- Unlock badges for milestones
- Examples:
  - "First Blood" — complete first quest
  - "Hot Streak" — 7-day streak
  - "Epic Win" — complete an Epic quest
  - "Zero Day" — complete 10 quests in one day
  - "Battle Tested" — 100 quests completed total
  - "Decision Speed" — complete a quest within 5 min of creation
- Locked achievements shown as silhouettes
- Unlocked: full color + glow

### 7. Night Agent (Cron Job)
- Runs nightly via OpenClaw cron
- Analyzes:
  - Quests completed vs. created (completion rate)
  - Time of day patterns
  - Streak status
  - Energy levels throughout the day
  - Overdue quests
- Outputs:
  - Tomorrow's recommended focus (1-3 priority quests)
  - Optimization tip (actionable, specific)
  - "You crushed X today" positive signal
- Delivered as a message in the daily check-in

### 8. Daily Check-In Flow
- Morning: "Good morning [Name]. Your streak is 🔥14. Energy: 100/100. What quests are you taking on today?"
- Evening: "What did you complete today?" — user reports, XP calculated, achievements checked
- Night: Agent runs, optimization tip generated, ready for next morning

---

## Component Inventory

### Header Bar
- Logo "QUESTLOG" in Orbitron, cyan glow
- Player name (editable)
- Level badge with XP bar beneath
- Energy bar (cyan → orange → red as it depletes)
- Streak counter with flame
- Gold/XP counter
- States: normal, low-energy (pulse), level-up (flash)

### Quest Card
- Checkbox (custom styled, glows cyan on hover)
- Quest title (Orbitron)
- Difficulty badge (color-coded pill)
- XP reward badge (gold)
- Project tag (color-coded)
- States: default, hover (lift + glow), complete (strikethrough + fade), overdue (red border)

### New Quest Form
- Inline expand on "+ New Quest" click
- Text input (auto-focus)
- Difficulty selector (4 buttons)
- Project selector (dropdown)
- Quest type selector (!, *, ~)
- "Add Quest" button (cyan glow)
- ESC to cancel

### Project Sidebar Item
- Icon + name
- Quest count badge
- Color indicator
- States: default, active/selected (cyan left border), hover (lift)

### Achievement Badge
- Circular icon
- Name tooltip on hover
- States: locked (grayscale, silhouette), unlocked (full color + glow)

### Level Up Modal
- Full-screen dark overlay
- "LEVEL UP" text flies in
- New level number with glow
- Achievement badges earned this level
- "Continue" button

### Energy Bar
- Horizontal bar, gradient fill (cyan → purple when full)
- Numeric display (85/100)
- Glow effect when full
- Pulse animation when low
- States: full, normal, low (<30 orange), critical (<15 red + pulse)

---

## Technical Approach

### Stack
- **Frontend:** React 18 + Vite (SPA, no backend for MVP)
- **Styling:** Plain CSS with CSS variables (no Tailwind, matches ContractorHub)
- **State:** React Context + useReducer (game state manager)
- **Persistence:** localStorage (JSON serialization)
- **Deploy:** Vercel (same as ContractorHub)

### Data Model
```js
{
  player: {
    name: "MagicShow",
    level: 1,
    xp: 0,
    energy: 100,
    maxEnergy: 100,
    streak: 0,
    lastCheckIn: null,       // ISO date string
    gold: 0,
    achievements: [],        // array of achievement IDs
    createdAt: null,
  },
  quests: [
    {
      id: "uuid",
      title: "Review divorce paperwork",
      difficulty: "hard",   // easy | medium | hard | epic
      type: "urgent",        // urgent | important | optional
      project: "life-admin", // project ID
      completed: false,
      xpReward: 50,
      energyCost: 20,
      createdAt: null,
      completedAt: null,
    }
  ],
  projects: [
    { id: "life-admin", name: "Life Admin", icon: "⚔️", color: "#FF2D78" },
    { id: "home", name: "Home", icon: "🏠", color: "#00E5FF" },
    { id: "apps", name: "Apps", icon: "🚀", color: "#00FF88" },
    { id: "family", name: "Family", icon: "👨‍👧‍👦", color: "#FFD700" },
    { id: "self", name: "Self", icon: "💪", color: "#FF9500" },
  ],
  achievements: [
    { id: "first-blood", name: "First Blood", description: "Complete your first quest", icon: "⚔️", unlocked: false },
    // ...20+ achievements
  ],
  dailyStats: {
    // keyed by ISO date string
    "2026-07-18": { completed: 5, xpGained: 125, energySpent: 50 }
  },
  nightAgentTips: [
    // array of { date, tip, completedQuests }
  ]
}
```

### Key Files
```
src/
  main.jsx
  App.jsx
  context/
    GameContext.jsx    # All state + reducers
  components/
    Header.jsx
    QuestBoard.jsx
    QuestCard.jsx
    NewQuestForm.jsx
    ProjectSidebar.jsx
    AchievementPanel.jsx
    EnergyBar.jsx
    LevelBadge.jsx
    NightAgentCard.jsx
    LevelUpModal.jsx
  utils/
    gameLogic.js       # XP calc, level calc, energy calc
    storage.js         # localStorage read/write
  styles/
    index.css          # All styles, CSS variables
```

### OpenClaw Cron — Night Agent
- Cron: `0 22 * * *` (10 PM daily)
- Payload: agentTurn that reads today's quest data, generates optimization tip
- Delivers tip to be ready for next morning's check-in
- Stored in `nightAgentTips` array in localStorage

### MVP Scope
- Build core quest board, energy, XP, leveling, streaks, projects
- Basic achievements (5-10 unlocked)
- localStorage persistence
- Night agent cron (tip generation)
- NOT building: backend auth, multi-device sync, shared projects

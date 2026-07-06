<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?logo=next.js&logoColor=white" alt="Next.js 15"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5"/>
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?logo=google&logoColor=white" alt="Gemini 2.5 Flash"/>
  <img src="https://img.shields.io/badge/Zustand-6B3D00?logo=react&logoColor=white" alt="Zustand"/>
  <br/>
  <img src="https://img.shields.io/badge/Monaco_Editor-007ACC?logo=visualstudiocode&logoColor=white" alt="Monaco Editor"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" alt="Zod"/>
  <img src="https://img.shields.io/badge/Radix_UI-FF4B4B?logo=radixui&logoColor=white" alt="Radix UI"/>
</div>

<h1 align="center">🧠 SQLMind AI</h1>
<p align="center">
  <strong>AI-Powered SQL Generation &amp; Optimization Platform</strong>
  <br/>
  <em>Turn plain English into optimized, explained, and dialect-aware SQL queries — in seconds</em>
</p>

---

## ✨ Features at a Glance

| Category | Features |
|---|---|
| **🤖 AI SQL Generation** | Natural language → SQL via Gemini 2.5 Flash, strict JSON-only output, 7 database dialects, prompt-injection guardrails |
| **📖 Query Insights** | Line-by-line explanation, optimization suggestions, complexity scoring (difficulty/time/cost), cross-dialect compatibility, inline warnings |
| **💬 AI Chat Assistant** | Follow-up Q&A about generated queries, natural conversation, SQL conversion requests, execution plan explanations |
| **📚 History & Favorites** | Full generation history with search, star-and-folder favorites system, categorized example library (8 categories, 24 prompts) |
| **✏️ SQL Editor** | Monaco-based editor with syntax highlighting, copy/download/print, fullscreen mode, regenerate, inline editing |
| **🔐 Security** | Server-side-only API keys, Zod input validation, in-memory rate limiting (20 req/min), prompt-injection filter, strict system prompt isolation |
| **🎨 UI/UX** | Dark theme, glassmorphism, Tailwind CSS, Framer Motion animations, keyboard shortcuts, responsive layout, skeleton/empty/error states |
| **📦 Export** | Copy to clipboard, download as `.sql` / `.txt`, print formatted output |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- A **Google Gemini API key** (or OpenAI key for alternative provider)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sqlmind-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your API key

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

> If `npm install` fails with an `ERESOLVE` peer-dependency error, the project ships with `.npmrc` set to `legacy-peer-deps=true`. If still blocked, run `npm install --legacy-peer-deps` once.

### Environment Variables (`.env.local`)

```env
# Required — pick at least one AI provider

# Option A: Google Gemini (default)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option B: OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional overrides
AI_PROVIDER=gemini              # "openai" or "gemini" (default: gemini)
AI_MODEL=gemini-2.5-flash       # Preferred model (falls back through list on 429)
RATE_LIMIT_PER_MINUTE=20        # Requests per minute per IP (default: 20)
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🧠 AI Features

All AI features are powered by **Google Gemini** via the Gemini SDK (with OpenAI as an alternative). The API key is loaded server-side from environment variables.

### Models Used

| Model | Used For |
|---|---|
| `gemini-2.5-flash` (preferred) | SQL generation, chat responses |
| `gemini-2.0-flash` (fallback) | Auto-fallback on rate limit |
| `gemini-1.5-flash` (fallback) | Last-resort fallback |
| `gpt-4o-mini` (OpenAI) | Alternative provider |

### Smart Model Fallback

The system tries models in order of preference. If the first model returns a 429 (rate limited), it automatically retries with exponential backoff (2s → 4s → 8s, capped at 30s) before falling through to the next model. All models are exhausted before returning an error.

### ✍️ AI SQL Generator

Describe your query in plain English — the AI returns a strict JSON response with:
- **SQL** — Formatted, syntax-highlighted query with proper indentation
- **Explanation** — Clause-by-clause breakdown in plain English
- **Optimization** — Concrete suggestions (indexes, join restructuring, CTE rewrites)
- **Complexity** — Difficulty (Easy/Medium/Hard), time complexity (Big-O), estimated cost, notes
- **Compatibility** — Cross-dialect portability notes (PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MariaDB, MongoDB)
- **Warnings** — Assumptions made, potential pitfalls, caveats

**Example:** *"Find all customers from India who ordered in the last 30 days."*

```sql
SELECT c.customer_name, COUNT(o.id) AS order_count
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE c.country = 'India'
  AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.customer_name
ORDER BY order_count DESC;
```

### 🤖 AI Chat Assistant

A full-featured chat interface with:
- **Context-aware** — knows the current SQL query and can answer questions about it
- **General knowledge** — answers non-SQL questions too
- **Session management** — create, rename, pin, archive, duplicate, delete conversations
- **Message editing** — edit user messages and regenerate AI responses
- **Markdown rendering** — formatted responses with code blocks, bold, lists
- **Search** — full-text search across chat titles and messages
- **Export** — download entire conversations as markdown

### 🗺️ Workspace Overview

| Area | Component | Description |
|---|---|---|
| **Prompt** | `PromptInput` | Textarea with character count, Ctrl+Enter shortcut, dialect selector |
| **SQL Output** | `SqlOutput` | Monaco editor, copy/download/print/regenerate/favorite/fullscreen |
| **Insights** | `InsightPanels` | Tabbed view: explanation, optimization, complexity, compatibility |
| **Sidebar** | `Sidebar` | History (search + delete), favorites (star + folder), curated examples |
| **Chat** | `ChatWorkspace` | Full chat panel with sessions, messages, editing, context menus |
| **Warning** | Inline banner | AI-generated warnings about assumptions or pitfalls |

### 📚 Example Library

Jumpstart with 24 curated prompts across 8 categories:

| Category | Examples |
|---|---|
| **Sales** | Top customers, monthly revenue, missed quotas |
| **HR** | Tenure > 5 years, avg salary by dept, direct reports |
| **Finance** | MRR calculation, overdue invoices, expense breakdown |
| **Inventory** | Low stock alerts, warehouse value, dead stock |
| **E-commerce** | Indian customers, cart abandonment, returned products |
| **Healthcare** | Upcoming appointments, avg wait time, overdue follow-ups |
| **Education** | High GPA students, attendance rates, low-enrollment courses |
| **Analytics** | Daily active users, conversion funnel, retention cohorts |

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript 5 (strict, noUncheckedIndexedAccess) |
| **AI** | Google Gemini API (OpenAI fallback), server-side only |
| **State** | Zustand 5 with `persist` middleware (localStorage) |
| **Editor** | Monaco Editor (@monaco-editor/react, dynamic import) |
| **Styling** | Tailwind CSS 3, custom theme (dark mode, glassmorphism) |
| **Animations** | Framer Motion 11 |
| **Validation** | Zod 3 (request + response schemas) |
| **Notifications** | Sonner (toast notifications) |
| **UI Primitives** | Radix UI (Select, Tabs, Dialog, ScrollArea, Tooltip) |
| **Icons** | Lucide React |
| **CSS Utilities** | clsx, tailwind-merge |
| **Linting** | ESLint (next/core-web-vitals) |

### Data Flow

```
User Input (Browser)
      ↕
Next.js App Router (client component)
      ↕
API Route (server-side: app/api/generate | app/api/chat)
  ├── Rate Limiter (in-memory, 20 req/min/IP)
  ├── Zod Validation (request body)
  ├── Prompt Sanitizer (injection guardrail)
  ├── AI Service (Google Gemini / OpenAI)
  │     ├── System prompt (strict JSON-only or chat)
  │     └── Model fallback chain (3 models with retry)
  └── Zod Validation (response shape)
      ↕
Client State (Zustand + localStorage)
  ├── History (capped at 100 items)
  ├── Favorites (with folder tags)
  └── Chat Sessions (full message persistence)
      ↕
UI Components
  ├── PromptInput → SqlOutput → InsightPanels
  ├── Sidebar (History / Favorites / Examples)
  └── ChatWorkspace (session list + messages)
```

### Project Structure

```
sqlmind-ai/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, sonner toaster
│   ├── page.tsx                # Landing page (Hero, Features, Databases)
│   ├── globals.css             # Global styles, custom utilities, scrollbar
│   ├── sitemap.ts              # Dynamic XML sitemap
│   └── generator/
│       └── page.tsx            # Main generator workspace (203 lines)
├── app/api/
│   ├── generate/route.ts       # POST /api/generate — SQL generation endpoint
│   └── chat/route.ts           # POST /api/chat — follow-up chat endpoint
├── components/
│   ├── landing/                # Navbar, Hero, TypingDemo, Features, DatabaseLogos, Footer
│   ├── generator/              # PromptInput, SqlOutput, InsightPanels, Sidebar, ChatWorkspace, ChatPanel, States, DatabaseSelector
│   └── ui/                     # button, card, badge, select, tabs, dialog, textarea, scroll-area
├── lib/
│   ├── ai.ts                   # Provider-agnostic model caller (Gemini/OpenAI)
│   ├── prompt.ts               # System prompt builders with injection guardrails
│   ├── types.ts                # TypeScript types (GenerateResult, ChatMessage, etc.)
│   ├── utils.ts                # cn(), generateId(), formatRelativeTime(), downloadFile()
│   ├── examples.ts             # 24 curated example queries (8 categories)
│   └── rateLimit.ts            # In-memory sliding-window rate limiter
├── store/
│   └── useAppStore.ts          # Zustand store — history, favorites, chat sessions (persisted)
├── hooks/
│   └── useKeyboardShortcuts.ts  # Ctrl+Enter, Ctrl+/, Ctrl+L
├── public/
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind theme (colors, shadows, animations)
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json                # Dependencies and scripts
```

---

## 🔌 API Endpoints

### Web Pages

| Route | Method | Description |
|---|---|---|
| `/` | GET | Landing page with hero, features, typing demo |
| `/generator` | GET | Main SQL generation workspace |
| `/generator?demo=1` | GET | Opens generator pre-filled with demo prompt |

### REST API

| Endpoint | Method | Request Body | Response | Description |
|---|---|---|---|---|
| `/api/generate` | POST | `{ prompt: string, dialect: DatabaseDialect }` | `{ result: GenerateResult }` | Generate SQL from natural language |
| `/api/chat` | POST | `{ sql: string, dialect: DatabaseDialect, messages: ChatTurn[] }` | `{ reply: string }` | Follow-up chat about a query |

---

## 🗄️ Database (Client-Side State)

All state is persisted client-side via **Zustand** with `localStorage` middleware.

| Slice | Key Fields | Capacity | Purpose |
|---|---|---|---|
| `history[]` | id, prompt, dialect, result (GenerateResult), createdAt | 100 items | Generation history |
| `favorites[]` | id, prompt, dialect, result, createdAt, folder | Unlimited | Starred queries with folder organization |
| `chatSessions[]` | id, title, messages[], createdAt, updatedAt | Unlimited | AI chat conversation groups |
| `activeChatId` | string \| null | — | Currently selected chat session |
| `pinnedChatIds` | string[] | — | Pinned chat sessions |
| `archivedChatIds` | string[] | — | Archived chat sessions |

### Data Persistence

| Data | Storage | Persistence |
|---|---|---|
| History | Zustand → localStorage (key: `sqlmind-storage`) | Survives page refresh |
| Favorites | Zustand → localStorage | Survives page refresh |
| Chat Sessions | Zustand → localStorage | Survives page refresh |
| Generated SQL | Zustand (in-memory) | Lost on refresh (regenerate or save as favorite) |
| API Keys | Server-side env vars only | Never sent to browser |

---

## 🔒 Security

- **API keys** — stored in server-side environment variables only, never sent to the browser
- **Rate limiting** — in-memory sliding window (default 20 requests/minute/IP); swap for Upstash Redis in multi-instance deployments
- **Input validation** — Zod schema validation on every API request (prompt length, dialect enum, message count limits)
- **Response validation** — Zod schema validation on every AI response; malformed model output never reaches the UI
- **Prompt injection** — server-side regex filter strips `"ignore all/previous/the instructions"` patterns; system prompt explicitly instructs the model to ignore embedded instruction overrides
- **XSS prevention** — all AI-generated content is rendered through React's built-in JSX escaping; markdown parsing is manual and scoped
- **SQL injection** — mitigated at the application level by generating parameterized queries; database execution is user-managed
- **CORS** — API routes are internal (same-origin) in the Next.js App Router

---

## 🛠️ Technical Details

### Key Implementation Notes

- **Strict JSON-only prompt** — the system prompt instructs the model to return raw JSON without markdown fences, backticks, or commentary. Malformed responses are caught by Zod validation.
- **Prompt-injection defense in depth** — regex filter on the server + explicit system prompt instruction to ignore embedded commands, ensuring the model treats injection attempts as text to query about.
- **Sliding-window rate limiter** — `lib/rateLimit.ts` tracks timestamps per IP with configurable limit. Keys with expired windows are naturally garbage-collected (old timestamps filtered out).
- **Model fallback chain** — up to 3 models tried sequentially with 429 retry (2s/4s/8s exponential backoff, capped at 30s). Set `AI_MODEL` env var to pin a preferred model.
- **Provider-agnostic design** — `lib/ai.ts` abstracts the AI provider. Currently supports Google Gemini (default) and OpenAI. Add a new provider by implementing a `tryModel` variant.
- **Monaco dynamic import** — the SQL editor is dynamically imported with `ssr: false` and a shimmer loading state, saving ~2-3MB from the initial bundle.
- **Zustand persist** — the store uses `zustand/middleware/persist` to sync to localStorage. History is capped at 100 items to prevent storage bloat.
- **Zod enum validation** — `DatabaseDialect` is validated at both request and response boundaries, ensuring only the 7 supported dialects pass through.
- **Responsive layout** — the sidebar collapses into a Radix UI dialog on mobile (`lg:hidden` breakpoint). The chat workspace uses fixed positioning with a spring animation.
- **Dark-first design** — all styles assume a dark theme. The `globals.css` sets `background-color: #121212` and scrollbar styles. Tailwind uses `darkMode: "class"` for future light-mode support.

### Performance Optimizations

| Technique | Where |
|---|---|
| Dynamic import (Monaco Editor) | `SqlOutput.tsx` — saves ~2-3MB initial bundle |
| Narrow Zustand selectors | All components — prevents unnecessary re-renders |
| `useCallback` on handlers | `page.tsx` — stops cascading re-renders |
| `useMemo` on parsed message content | `ChatWorkspace.tsx:MessageBubble` — skips markdown re-parsing |
| Stable keyboard shortcut references | `page.tsx` — prevents re-registration |
| `AnimatePresence` with exit animations | `ChatWorkspace.tsx` — clean unmount transitions |
| CSS `will-change` / `transform` animations | Framer Motion — GPU-accelerated spring animation |

---

## 🚢 Deployment

### Recommended Platforms

| Platform | Notes |
|---|---|
| **Vercel** | Zero-config deployment, auto HTTPS, edge-ready |
| **Netlify** | Next.js plugin required |
| **Railway** | Easy env var management |
| **Docker** | Build with `next build`, run with `next start` |

### Production Checklist

- [ ] Set `GEMINI_API_KEY` (or `OPENAI_API_KEY`) as environment variables
- [ ] Set `RATE_LIMIT_PER_MINUTE` to an appropriate value for your traffic
- [ ] Replace in-memory rate limiter with Redis/Vercel KV for multi-instance deployments
- [ ] Configure custom domain and SSL
- [ ] Add favicon and PWA icons to `/public/`
- [ ] Update `metadataBase` URL in `app/layout.tsx`
- [ ] Update sitemap URLs in `app/sitemap.ts`

```bash
npm run build
npm run start
```

---

## 📄 License

MIT

---

<div align="center">
  <sub>Built with Next.js 15, React 19, and Google Gemini</sub>
  <br/>
  <sub>© 2026 SQLMind AI</sub>
</div>

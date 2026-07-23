<h1 align="center">SQLMind AI</h1>
<p align="center">
  <strong>AI-Powered SQL Generation & Optimization Platform</strong>
  <br/>
  <em>Turn plain English into optimized, explained, and dialect-aware SQL queries in seconds.</em>
</p>

<div align="center">
  <img src="img/SQL image.png" alt="SQLMind AI Preview" width="100%"/>
</div>

---

## Overview

SQLMind AI bridges the gap between natural language and database queries. Describe what you need in plain English, and the platform generates production-ready SQL, complete with line-by-line explanations, optimization suggestions, and cross-dialect compatibility notes.

It was built for developers, analysts, and anyone who writes SQL regularly but wants to move faster. Instead of manually crafting complex joins, subqueries, or aggregations, you describe your intent and receive a fully formed query along with insights that help you understand and refine it.

---

## Key Features

**Natural Language to SQL**
Describe your data needs in everyday language. The AI generates accurate, formatted SQL queries tailored to your chosen database dialect.

**Query Explanation**
Every generated query comes with a clause-by-clause breakdown, making it easy to understand what each part does and why it is there.

**Optimization Suggestions**
Receive concrete recommendations for improving query performance, including index suggestions, join restructuring, and CTE rewrites.

**Complexity Analysis**
Each query is scored for difficulty, time complexity, and estimated execution cost, helping you gauge performance before running it.

**Cross-Dialect Support**
Generate queries for PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MariaDB, or MongoDB, with compatibility notes for each.

**AI Chat Assistant**
Ask follow-up questions about any generated query. The assistant understands your current context and can explain, modify, or convert queries in real time.

**History and Favorites**
Every generation is saved automatically. Star your best queries, organize them into folders, and revisit them anytime.

**Curated Example Library**
Start immediately with 24 pre-built prompts across eight categories including Sales, HR, Finance, Healthcare, and Analytics.

---

## How It Works

1. Open the application and navigate to the generator workspace.
2. Type a description of the SQL query you need in the prompt input.
3. Select your target database dialect from the available options.
4. Submit your prompt and wait for the AI to process it.
5. Review the generated SQL in the code editor, complete with syntax highlighting.
6. Read the explanation, optimization tips, and complexity analysis in the insight panels.
7. Use the chat assistant to ask follow-up questions or request modifications.
8. Save important queries to your favorites or browse your generation history.

---

## Installation

**Prerequisites**

- Node.js 18 or higher
- npm 9 or higher
- A Google Gemini API key (or OpenAI key as an alternative)

**Setup**

Clone the repository and navigate into the project directory.

```bash
git clone <your-repo-url>
cd sqlmind-ai
```

Install the dependencies.

```bash
npm install
```

Create your environment configuration file and add your API key.

```bash
cp .env.example .env.local
```

Open `.env.local` and add one of the following:

```env
# Google Gemini (default)
GEMINI_API_KEY=your-api-key-here

# or OpenAI
OPENAI_API_KEY=your-api-key-here
```

Start the development server.

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## Usage

Once the application is running, you will see the landing page with an overview of what SQLMind AI offers. Navigate to the generator workspace to begin creating queries.

Type a natural language description of the data you want to retrieve. Be as specific or as general as you like. Select your target database dialect, then submit. Within seconds, you will receive a formatted SQL query along with a full explanation, optimization suggestions, and complexity analysis.

Use the sidebar to browse your generation history, access saved favorites, or explore the curated example library. Open the chat assistant to ask follow-up questions about any query, request modifications, or convert it to a different dialect.

---

## License

MIT

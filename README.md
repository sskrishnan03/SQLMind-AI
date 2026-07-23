<div align="center">
  <img src="img/SQL%20image.png" alt="SQLMind AI" width="100%"/>
</div>

<h1 align="center">SQLMind AI</h1>

<p align="center">
  <strong>AI-Powered SQL Generation &amp; Optimization Platform</strong>
</p>

<p align="center">
  <em>Turn plain English into optimized, explained, and dialect-aware SQL queries in seconds.</em>
</p>

<br/>

## Introduction

SQLMind AI is an intelligent platform that converts natural language descriptions into production-ready SQL queries. It was built to eliminate the friction between thinking about data and writing the code to retrieve it.

Whether you are a developer speeding up your workflow, an analyst exploring complex datasets, or a student learning SQL, the platform gives you accurate queries, clear explanations, and actionable optimization advice without leaving your browser.

<br/>

## Overview

The application provides a complete workspace for generating, understanding, and refining SQL queries. You describe what you need in plain English. The AI generates the query, breaks it down clause by clause, suggests performance improvements, and scores its complexity.

Beyond generation, SQLMind AI includes a context-aware chat assistant that can answer follow-up questions, modify existing queries, or convert them between database dialects. Your entire history is preserved automatically, and you can organize your best queries into favorites for quick access.

The experience is designed to feel fast, intuitive, and reliable from the moment you open the application.

<br/>

## Key Features

**Natural Language to SQL**
Describe your data needs in everyday language. The AI produces accurate, formatted SQL queries tailored to your chosen database dialect.

**Query Explanation**
Every generated query includes a clause-by-clause breakdown so you understand exactly what each part does and why it is structured that way.

**Optimization Suggestions**
Receive concrete recommendations for improving query performance, including index creation, join restructuring, and CTE rewrites.

**Complexity Analysis**
Each query is scored for difficulty, time complexity, and estimated execution cost, helping you evaluate performance before running it against a live database.

**Cross-Dialect Support**
Generate queries for PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MariaDB, or MongoDB, with compatibility notes specific to each dialect.

**AI Chat Assistant**
Ask follow-up questions about any generated query. The assistant understands your current context and can explain, modify, or convert queries in real time.

**History and Favorites**
Every generation is saved automatically. Star your best queries, organize them into folders, and revisit them whenever you need.

**Curated Example Library**
Start immediately with 24 pre-built prompts across eight categories including Sales, HR, Finance, Healthcare, and Analytics.

<br/>

## How It Works

1. Open the application and navigate to the generator workspace.
2. Type a description of the SQL query you need in the prompt input.
3. Select your target database dialect from the available options.
4. Submit your prompt and wait for the AI to process it.
5. Review the generated SQL in the code editor with full syntax highlighting.
6. Read the explanation, optimization tips, and complexity analysis in the insight panels.
7. Use the chat assistant to ask follow-up questions or request modifications.
8. Save important queries to your favorites or browse your generation history.

<br/>

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

<br/>

## Usage

Once the application is running, you will see the landing page with an overview of what SQLMind AI offers. Navigate to the generator workspace to begin creating queries.

Type a natural language description of the data you want to retrieve. Be as specific or as general as you like. Select your target database dialect, then submit. Within seconds, you will receive a formatted SQL query along with a full explanation, optimization suggestions, and complexity analysis.

Use the sidebar to browse your generation history, access saved favorites, or explore the curated example library. Open the chat assistant to ask follow-up questions about any query, request modifications, or convert it to a different dialect.

<br/>

## License

MIT

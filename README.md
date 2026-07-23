<p align="center">
  <img src="img/SQL%20image.png" alt="SQLMind AI" width="100%" />
</p>

<h1 align="center">SQLMind AI</h1>

<p align="center">
  A modern, AI-powered SQL generation and optimization platform designed to help you write, understand, and refine database queries — all from a single, beautifully crafted interface.
</p>

<p align="center">
  <a href="#overview">Overview</a> &nbsp;&middot;&nbsp;
  <a href="#key-features">Features</a> &nbsp;&middot;&nbsp;
  <a href="#how-it-works">How It Works</a> &nbsp;&middot;&nbsp;
  <a href="#installation">Installation</a> &nbsp;&middot;&nbsp;
  <a href="#usage">Usage</a> &nbsp;&middot;&nbsp;
  <a href="#license">License</a>
</p>

## Overview

SQLMind AI is a browser-based application built to eliminate the gap between thinking about data and writing the code to retrieve it. There are no accounts, no server-side storage, and no setup beyond a single API key — everything runs in your browser with AI processing happening through secure, server-side API calls.

The application takes a natural language description and produces a complete, formatted SQL query along with a clause-by-clause explanation, performance optimization suggestions, and a complexity analysis. It supports seven major database dialects and adapts its output to match your chosen target.

Beyond generation, SQLMind AI includes a context-aware chat assistant that can answer follow-up questions, modify existing queries, convert them between dialects, or explain execution plans in plain English. Your entire history is preserved locally, and you can organize your best queries into folders for quick access. The result is a workspace that makes working with SQL faster, clearer, and more accessible for developers, analysts, and learners alike.

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

## How It Works

**1. Open the Application**

Launch the app in your browser and navigate to the generator workspace. The interface is clean and focused, with a prompt input, dialect selector, and output panels ready to go.

**2. Write Your Prompt**

Type a description of the SQL query you need. Be as specific or as general as you like. For example, you could write "Find all customers from India who ordered in the last 30 days."

**3. Select a Database Dialect**

Choose your target database from the available options. This determines the SQL syntax, functions, and conventions the AI will use when generating your query.

**4. Generate the Query**

Submit your prompt. Within seconds, the AI returns a formatted SQL query displayed in a syntax-highlighted editor, ready to copy, download, or print.

**5. Review the Insights**

Below the query, read a full explanation of what each clause does, along with optimization suggestions, a complexity score, and compatibility notes for other dialects.

**6. Continue with the Chat Assistant**

Ask follow-up questions like "Can you add pagination to this?" or "How would this look in MySQL?" The assistant maintains full context and modifies the query conversationally.

**7. Save and Revisit**

Star any query to add it to your favorites, organize it into folders, or simply browse your generation history to find previous work.

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

The application will be available at `http://localhost:3000`.

## Usage

Once the application is running, you will land on the landing page with an overview of what SQLMind AI offers. Navigate to the generator workspace to begin creating queries.

**Generate a query** by typing a natural language description of the data you want to retrieve. Select your target database dialect, then submit. Within seconds, you will receive a formatted SQL query along with a full explanation, optimization suggestions, and complexity analysis.

**Explore the insights** by reading the tabbed panels below the generated query. Each tab provides a different perspective — clause-by-clause explanation, performance optimization tips, complexity scoring, and cross-dialect compatibility notes.

**Chat with the AI** to refine your query further. Ask it to add filtering, change the sort order, convert to a different dialect, or explain a specific part of the logic in more detail.

**Browse your history** using the sidebar to revisit previous generations. Star your best queries and organize them into folders for quick access later.

**Use the example library** to jumpstart your workflow. Choose from 24 curated prompts across eight categories to see how the AI handles different types of queries.

## License

MIT

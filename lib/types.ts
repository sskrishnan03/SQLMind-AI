export type DatabaseDialect =
  | "postgresql"
  | "mysql"
  | "sqlite"
  | "oracle"
  | "sqlserver"
  | "mariadb"
  | "mongodb";

export const DIALECTS: { value: DatabaseDialect; label: string }[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "oracle", label: "Oracle" },
  { value: "sqlserver", label: "SQL Server" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mongodb", label: "MongoDB" },
];

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ComplexityInfo {
  difficulty: Difficulty;
  timeComplexity: string;
  estimatedCost: string;
  notes: string;
}

export interface GenerateResult {
  sql: string;
  explanation: string;
  optimization: string;
  complexity: ComplexityInfo;
  compatibility: string;
  warnings: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  dialect: DatabaseDialect;
  result: GenerateResult;
  createdAt: number;
}

export interface FavoriteItem extends HistoryItem {
  folder: string;
}

export interface ExampleQuery {
  id: string;
  category:
    | "Sales"
    | "HR"
    | "Finance"
    | "Inventory"
    | "E-commerce"
    | "Healthcare"
    | "Education"
    | "Analytics";
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

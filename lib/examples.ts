import type { ExampleQuery } from "./types";

export const EXAMPLE_QUERIES: ExampleQuery[] = [
  // Sales
  { id: "sales-1", category: "Sales", prompt: "Show the top 10 customers who spent the most this year." },
  { id: "sales-2", category: "Sales", prompt: "Find total revenue by month for the last 12 months." },
  { id: "sales-3", category: "Sales", prompt: "List sales reps who missed their quarterly quota." },

  // HR
  { id: "hr-1", category: "HR", prompt: "Find all employees who have been with the company for more than 5 years." },
  { id: "hr-2", category: "HR", prompt: "Show the average salary by department." },
  { id: "hr-3", category: "HR", prompt: "List employees who report directly to a given manager." },

  // Finance
  { id: "finance-1", category: "Finance", prompt: "Calculate monthly recurring revenue for the current fiscal year." },
  { id: "finance-2", category: "Finance", prompt: "Find all invoices that are overdue by more than 30 days." },
  { id: "finance-3", category: "Finance", prompt: "Show total expenses grouped by category for Q1." },

  // Inventory
  { id: "inventory-1", category: "Inventory", prompt: "Find products with stock levels below their reorder threshold." },
  { id: "inventory-2", category: "Inventory", prompt: "Show the top 5 warehouses by total inventory value." },
  { id: "inventory-3", category: "Inventory", prompt: "List products that haven't sold in the last 90 days." },

  // E-commerce
  { id: "ecommerce-1", category: "E-commerce", prompt: "Find all customers from India who ordered in the last 30 days." },
  { id: "ecommerce-2", category: "E-commerce", prompt: "Show the cart abandonment rate by week." },
  { id: "ecommerce-3", category: "E-commerce", prompt: "List the 20 most frequently returned products." },

  // Healthcare
  { id: "healthcare-1", category: "Healthcare", prompt: "Find patients with upcoming appointments in the next 7 days." },
  { id: "healthcare-2", category: "Healthcare", prompt: "Show the average wait time per department last month." },
  { id: "healthcare-3", category: "Healthcare", prompt: "List patients overdue for a follow-up visit." },

  // Education
  { id: "education-1", category: "Education", prompt: "Find students with a GPA above 3.5 in the current semester." },
  { id: "education-2", category: "Education", prompt: "Show average attendance rate by course." },
  { id: "education-3", category: "Education", prompt: "List courses with enrollment below minimum capacity." },

  // Analytics
  { id: "analytics-1", category: "Analytics", prompt: "Calculate daily active users for the past 30 days." },
  { id: "analytics-2", category: "Analytics", prompt: "Find the conversion rate from signup to first purchase by channel." },
  { id: "analytics-3", category: "Analytics", prompt: "Show retention rate by weekly cohort." },
];

export const CATEGORIES = Array.from(
  new Set(EXAMPLE_QUERIES.map((e) => e.category))
);

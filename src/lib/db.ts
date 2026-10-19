import { Pool } from "pg";

// One pool per server process (reused across requests and hot reloads).
const g = globalThis as unknown as { pool?: Pool };
export const db = g.pool ?? (g.pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }));

export type Todo = { id: number; title: string; done: boolean; created_at: Date };

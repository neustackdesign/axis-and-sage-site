// Applies db/schema.sql to DATABASE_URL (Neon). Idempotent: every statement uses IF NOT EXISTS.
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL is not set."); process.exit(1); }
const sql = neon(url);
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const statements = schema.split(/;\s*$/m).map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean);
for (const statement of statements) await sql.query(statement);
console.log(`Applied ${statements.length} statements.`);

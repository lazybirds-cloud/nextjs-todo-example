// Release command: `node migrate.js` (runs after every build, with DATABASE_URL).
const { Client } = require("pg");

(async () => {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  await db.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id         serial PRIMARY KEY,
      title      text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
      done       boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  console.log("todos: schema ok");
  await db.end();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { Suspense } from "react";
import { connection } from "next/server";
import { db, type Todo } from "@/lib/db";
import { addTodo, clearDone, deleteTodo, toggleTodo } from "./actions";
import styles from "./page.module.css";

async function TodoList() {
  await connection(); // always read fresh from Postgres
  const { rows } = await db.query<Todo>(
    "SELECT id, title, done, created_at FROM todos ORDER BY done, created_at DESC",
  );
  const open = rows.filter((t) => !t.done).length;

  if (rows.length === 0) {
    return <p className={styles.empty}>Nada por aqui. Adicione sua primeira tarefa ☝️</p>;
  }
  return (
    <>
      <ul className={styles.list}>
        {rows.map((t) => (
          <li key={t.id} className={t.done ? styles.done : undefined}>
            <form action={toggleTodo.bind(null, t.id)}>
              <button className={styles.check} aria-label={t.done ? "Reabrir" : "Concluir"}>
                {t.done ? "✓" : ""}
              </button>
            </form>
            <span className={styles.title}>{t.title}</span>
            <form action={deleteTodo.bind(null, t.id)}>
              <button className={styles.delete} aria-label="Apagar">×</button>
            </form>
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
        <span>{open} pendente{open === 1 ? "" : "s"}</span>
        {rows.length > open && (
          <form action={clearDone}>
            <button className={styles.link}>Limpar concluídas</button>
          </form>
        )}
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Tarefas</h1>
      <p className={styles.sub}>Next.js + Postgres, hospedado no LazyHost</p>
      <form action={addTodo} className={styles.add}>
        <input name="title" placeholder="O que precisa ser feito?" maxLength={200} required autoFocus />
        <button>Adicionar</button>
      </form>
      <Suspense fallback={<p className={styles.empty}>Carregando…</p>}>
        <TodoList />
      </Suspense>
    </main>
  );
}

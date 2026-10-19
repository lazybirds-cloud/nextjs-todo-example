"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  if (!title) return;
  await db.query("INSERT INTO todos (title) VALUES ($1)", [title]);
  revalidatePath("/");
}

export async function toggleTodo(id: number) {
  await db.query("UPDATE todos SET done = NOT done WHERE id = $1", [id]);
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await db.query("DELETE FROM todos WHERE id = $1", [id]);
  revalidatePath("/");
}

export async function clearDone() {
  await db.query("DELETE FROM todos WHERE done");
  revalidatePath("/");
}

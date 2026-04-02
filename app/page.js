"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "novatech_tasks_v1";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setTasks(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      remaining: tasks.length - completed,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Please add a short task title before saving.");
      return;
    }
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const task = {
      id,
      title: trimmed,
      description: details.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    setTitle("");
    setDetails("");
    setError("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="clean-bg flex min-h-screen w-full flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12 lg:px-10">
        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--ink-muted)]">
            NovaTech Solutions
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                NovaTask Tracker
              </h1>
              <p className="mt-3 max-w-2xl text-base text-[var(--ink-muted)] sm:text-lg">
                A minimal workspace for daily priorities. Add tasks, check them
                off, and keep focus with local-only persistence.
              </p>
            </div>
            
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(15,17,21,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">New task</h2>
                <p className="text-sm text-[var(--ink-muted)]">
                  Titles are required.
                </p>
              </div>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                {stats.remaining} open
              </span>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Task title
                </label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Finalize sprint retro notes"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[rgba(47,107,255,0.16)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Description
                </label>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Optional details or links."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[rgba(47,107,255,0.16)]"
                />
              </div>
              {error ? (
                <p className="rounded-xl border border-[rgba(47,107,255,0.2)] bg-[rgba(47,107,255,0.08)] px-4 py-3 text-sm text-[var(--accent-strong)]">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Save task
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold">Status</h2>
            <div className="grid gap-3">
              {[
                { label: "Total tasks", value: stats.total },
                { label: "Completed", value: stats.completed },
                { label: "Remaining", value: stats.remaining },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
           
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(15,17,21,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Task board</h2>
             
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "completed", label: "Completed" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                    filter === item.key
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-6 py-10 text-center text-sm text-[var(--ink-muted)]">
                No tasks yet. Add one above to start tracking progress.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article
                  key={task.id}
                  className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                        task.completed
                          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-[var(--border)] text-transparent hover:border-[var(--accent)]"
                      }`}
                      aria-label={
                        task.completed
                          ? "Mark task as not completed"
                          : "Mark task as completed"
                      }
                    >
                      <span className="text-xs">✓</span>
                    </button>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          task.completed
                            ? "text-[var(--ink-muted)] line-through"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description ? (
                        <p className="text-sm text-[var(--ink-muted)]">
                          {task.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                      {task.completed ? "Done" : "Open"}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-full border border-transparent bg-[rgba(47,107,255,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-strong)] transition hover:border-[var(--accent-strong)]"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--ink-muted)]">
          <p>Bulit and designed by Mr santi.</p>
         
        </footer>
      </main>
    </div>
  );
}

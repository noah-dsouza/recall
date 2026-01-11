export type CreateProjectResponse = {
  ok: true;
  thread: { thread_id: string };
};

export type AskResponse = {
  ok: true;
  threadId: string;
  message: { content: string };
};

export async function createProjectThread(): Promise<string> {
  const res = await fetch("/api/projects", { method: "POST" });
  if (!res.ok) throw new Error(`createProjectThread failed: ${res.status}`);
  const data = (await res.json()) as CreateProjectResponse;
  return data.thread.thread_id;
}

export async function askThread(threadId: string, content: string): Promise<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId, content }),
  });
  if (!res.ok) throw new Error(`askThread failed: ${res.status}`);
  const data = (await res.json()) as AskResponse;
  return data.message.content;
}

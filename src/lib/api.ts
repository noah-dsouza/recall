export async function createProject() {
  const res = await fetch("/api/projects", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}

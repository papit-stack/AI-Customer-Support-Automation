const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };
  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  return response.json();
}

export function fetchStats() {
  return request("/stats");
}

export function fetchDrafts({ status, intent, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (intent) params.set("intent", intent);
  if (search) params.set("search", search);
  const qs = params.toString();
  return request(`/drafts${qs ? `?${qs}` : ""}`);
}

export function fetchDraft(id) {
  return request(`/drafts/${id}`);
}

export function approveDraft(id) {
  return request(`/drafts/${id}/approve`, { method: "PUT" });
}

export function rejectDraft(id) {
  return request(`/drafts/${id}/reject`, { method: "PUT" });
}

export function editDraft(id, ai_reply) {
  return request(`/drafts/${id}/edit`, {
    method: "PUT",
    body: JSON.stringify({ ai_reply }),
  });
}

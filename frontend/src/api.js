const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getEntries: () => request("/journal"),
  addEntry: (text) => request("/journal", { method: "POST", body: JSON.stringify({ text }) }),
  deleteEntry: (id) => request(`/journal/${id}`, { method: "DELETE" }),
  getQuote: (ticker) => request(`/finnhub/quote/${ticker}`),
  getProfile: (ticker) => request(`/finnhub/profile/${ticker}`),
  getNews: (ticker) => request(`/finnhub/news/${ticker}`),
  getTrendInterest: (brand) => request(`/trends/interest/${encodeURIComponent(brand)}`)
};

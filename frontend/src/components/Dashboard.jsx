import { useEffect, useState } from "react";
import { api } from "../api.js";

function groupByBrand(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry.brand || "Unmatched";
    if (!groups.has(key)) {
      groups.set(key, { brand: key, company: entry.company, ticker: entry.ticker, isPublic: entry.isPublic, entries: [] });
    }
    groups.get(key).entries.push(entry);
  }
  return Array.from(groups.values()).sort((a, b) => b.entries.length - a.entries.length);
}

function BrandCard({ group }) {
  const [quote, setQuote] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api.getTrendInterest(group.brand).then((data) => {
      if (!cancelled) setTrend(data);
    }).catch(() => {});

    if (group.ticker) {
      api.getQuote(group.ticker).then((data) => {
        if (!cancelled) setQuote(data);
      }).catch(() => {
        if (!cancelled) setLoadError(true);
      });
    }

    return () => { cancelled = true; };
  }, [group.brand, group.ticker]);

  const lastDate = new Date(
    group.entries.reduce((latest, e) => (e.createdAt > latest ? e.createdAt : latest), group.entries[0].createdAt)
  ).toLocaleDateString();

  const changePct = quote && quote.dp !== undefined ? quote.dp.toFixed(1) : null;

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{group.brand}</div>
          <div className="muted" style={{ marginTop: 2 }}>
            {group.entries.length} observation{group.entries.length !== 1 ? "s" : ""} · last on {lastDate}
          </div>
        </div>
        {!group.isPublic && <span className="pill pill-neutral">Private</span>}
        {group.isPublic && changePct !== null && (
          <span className={`pill ${changePct >= 0 ? "pill-positive" : "pill-negative"}`}>
            {group.ticker} {changePct >= 0 ? "+" : ""}{changePct}%
          </span>
        )}
        {group.isPublic && loadError && <span className="pill pill-neutral">Data unavailable</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #e2e0d8" }}>
        <div>
          <div className="muted">Search interest</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{trend ? trend.label : "Loading..."}</div>
        </div>
        <div>
          <div className="muted">Latest thought</div>
          <div style={{ fontSize: 14 }}>{group.entries[0].text.slice(0, 60)}{group.entries[0].text.length > 60 ? "..." : ""}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getEntries()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p className="muted">Loading your journal...</p>;
  if (entries.length === 0) {
    return <p className="muted">Nothing here yet. Log a hunch on the Capture tab to get started.</p>;
  }

  const groups = groupByBrand(entries);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Brands you've noticed</h3>
        <span className="muted">{groups.length} tracked</span>
      </div>
      <p className="muted" style={{ marginBottom: 16 }}>Sorted by how often you've mentioned them</p>
      {groups.map((group) => (
        <BrandCard key={group.brand} group={group} />
      ))}
    </div>
  );
}

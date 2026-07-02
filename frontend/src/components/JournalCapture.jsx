import { useState } from "react";
import { api } from "../api.js";

function SentimentPill({ sentiment }) {
  const label = sentiment === "positive" ? "Positive" : sentiment === "negative" ? "Negative" : "Neutral";
  return <span className={`pill pill-${sentiment}`}>{label}</span>;
}

export default function JournalCapture({ onSaved }) {
  const [text, setText] = useState("");
  const [lastEntry, setLastEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const entry = await api.addEntry(text);
      setLastEntry(entry);
      setText("");
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: 8 }}>What have you noticed?</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="This sold out at Target again, third time this month"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, marginBottom: 20 }}>
        <button onClick={handleSave} disabled={saving || !text.trim()}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && <p style={{ color: "#a32d2d", fontSize: 13 }}>{error}</p>}

      {lastEntry && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{lastEntry.brand || "No brand matched"}</div>
              {lastEntry.company && <div className="muted">{lastEntry.company}</div>}
            </div>
            <SentimentPill sentiment={lastEntry.sentiment} />
          </div>
          {lastEntry.brand && !lastEntry.isPublic && (
            <p className="muted" style={{ marginTop: 10 }}>No public ticker found for this brand yet</p>
          )}
          {!lastEntry.brand && (
            <p className="muted" style={{ marginTop: 10 }}>
              We couldn't match this to a brand we know about yet. It's still saved in your journal.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

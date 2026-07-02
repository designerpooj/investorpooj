import { useState } from "react";
import JournalCapture from "./components/JournalCapture.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [tab, setTab] = useState("capture");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app-shell">
      <h2 style={{ marginBottom: 4 }}>Brand Sense</h2>
      <p className="muted" style={{ marginBottom: 20 }}>Invest based on what you already know</p>

      <div className="tabs">
        <button className={tab === "capture" ? "active" : ""} onClick={() => setTab("capture")}>
          Capture
        </button>
        <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
          Research
        </button>
      </div>

      {tab === "capture" && <JournalCapture onSaved={() => setRefreshKey((k) => k + 1)} />}
      {tab === "dashboard" && <Dashboard refreshKey={refreshKey} />}
    </div>
  );
}

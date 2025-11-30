import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import SearchBar from "./components/SearchBar";
import StatCards from "./components/StatCards";
import Charts from "./components/Charts";
import Demographics from "./components/Demographics";

import { parseCsv, CrimeRecord } from "./utils/parseCsv.tsx";
import { communityAreas, CommunityArea } from "./utils/lookup.tsx";

function findCommunityArea(query: string): CommunityArea | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // Community number
  const num = Number(q);
  if (!isNaN(num)) {
    const byNum = communityAreas.find((a) => a.number === num);
    if (byNum) return byNum;
  }

  // ZIP
  const byZip = communityAreas.find((a) =>
    a.zipCodes.some((z) => z === q)
  );
  if (byZip) return byZip;

  // Community name
  const byName = communityAreas.find((a) =>
    a.name.toLowerCase().includes(q)
  );
  if (byName) return byName;

  // Neighborhood name
  const byNbh = communityAreas.find((a) =>
    a.neighborhoods.some((n) => n.toLowerCase().includes(q))
  );
  if (byNbh) return byNbh;

  return null;
}

export default function App() {
  const [allRecords, setAllRecords] = useState<CrimeRecord[]>([]);
  const [records, setRecords] = useState<CrimeRecord[]>([]);
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<CommunityArea | null>(null);

  useEffect(() => {
    fetch("crime_summary_by_community.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCsv(text);
        setAllRecords(parsed);
        setRecords(parsed);
      })
      .catch((err) => console.error("CSV load error:", err));
  }, []);

  const handleSearch = () => {
    const area = findCommunityArea(query);
    setSelectedArea(area);

    if (!area) {
      // no match → show citywide
      setRecords(allRecords);
      return;
    }

    const filtered = allRecords.filter(
      (r) => r.communityArea === area.number
    );
    setRecords(filtered);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.95)), url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2613&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          padding: "24px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#fff",
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>
          ChiCrimeWatch — Development Build
        </h1>
        <p style={{ opacity: 0.8, marginBottom: "16px", fontSize: "14px" }}>
          Search by ZIP, community name, neighborhood, or area number to see
          crime stats and how the area compares to the rest of Chicago.
        </p>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />

        {selectedArea && (
          <div
            style={{
              fontSize: "13px",
              marginBottom: "16px",
              opacity: 0.9,
            }}
          >
            Showing results for{" "}
            <strong>
              Area {selectedArea.number} — {selectedArea.name}
            </strong>
          </div>
        )}

        <Demographics selectedArea={selectedArea} />

        <h2 style={{ marginTop: "20px" }}>Dataset Overview</h2>
        <StatCards
          records={records}
          allRecords={allRecords}
          selectedArea={selectedArea}
        />

        <Charts
          records={records}
          allRecords={allRecords}
          selectedArea={selectedArea}
        />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);

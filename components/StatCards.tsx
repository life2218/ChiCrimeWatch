import React from "react";
import { CrimeRecord } from "../utils/parseCsv.tsx";
import { CommunityArea } from "../utils/lookup.tsx";

interface StatCardsProps {
  records: CrimeRecord[];
  allRecords: CrimeRecord[];
  selectedArea: CommunityArea | null;
}

function sumCounts(list: CrimeRecord[]) {
  return list.reduce((acc, r) => acc + r.count, 0);
}

function buildAreaTotals(list: CrimeRecord[]): Record<number, number> {
  const map: Record<number, number> = {};
  list.forEach((r) => {
    map[r.communityArea] = (map[r.communityArea] || 0) + r.count;
  });
  return map;
}

// Six-pointed star resembling the Chicago Flag star
const ChicagoStar = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    style={{ marginBottom: "12px", display: "block" }}
  >
    <path
      fill="#E31D2B" // Official Chicago Flag Red
      d="M12 0 L14.5 8 L24 8 L17 13.5 L19.5 22 L12 16.5 L4.5 22 L7 13.5 L0 8 L9.5 8 Z"
    />
  </svg>
);

export default function StatCards({
  records,
  allRecords,
  selectedArea,
}: StatCardsProps) {
  const totalCityCrimes = sumCounts(allRecords);
  const totalAreaCrimes = sumCounts(records);

  const cityAreaTotals = buildAreaTotals(allRecords);
  const areaValues = Object.values(cityAreaTotals);
  const min = areaValues.length ? Math.min(...areaValues) : 0;
  const max = areaValues.length ? Math.max(...areaValues) : 0;

  let areaScore: number | null = null;
  let areaScoreLabel = "Citywide baseline";

  if (selectedArea && max > min) {
    const totalForArea = cityAreaTotals[selectedArea.number] || 0;
    const raw = (totalForArea - min) / (max - min);
    const scaled = Math.round(raw * 100);
    areaScore = scaled;

    if (scaled < 33) {
      areaScoreLabel = "Below city average (safer)";
    } else if (scaled < 66) {
      areaScoreLabel = "Around city average";
    } else {
      areaScoreLabel = "Above city average (more crime)";
    }
  }

  const cityCrimeTypes = new Set(allRecords.map((r) => r.crimeCategory));
  const areaCrimeTypes = new Set(records.map((r) => r.crimeCategory));

  const cardBase: React.CSSProperties = {
    flex: 1,
    minWidth: "180px",
    background: "rgba(15,15,15,0.95)",
    borderRadius: "14px",
    padding: "14px 16px",
    border: "1px solid #333",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
    position: "relative",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    opacity: 0.7,
    marginBottom: "6px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "4px",
  };

  const subStyle: React.CSSProperties = {
    fontSize: "11px",
    opacity: 0.75,
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px",
        marginTop: "10px",
      }}
    >
      <div style={cardBase}>
        <ChicagoStar />
        <div style={labelStyle}>Total Crimes (Area)</div>
        <div style={valueStyle}>{totalAreaCrimes.toLocaleString()}</div>
        <div style={subStyle}>
          Citywide: {totalCityCrimes.toLocaleString()}
        </div>
      </div>

      <div style={cardBase}>
        <ChicagoStar />
        <div style={labelStyle}>Crime Types (Area)</div>
        <div style={valueStyle}>{areaCrimeTypes.size}</div>
        <div style={subStyle}>
          Citywide types: {cityCrimeTypes.size}
        </div>
      </div>

      <div style={cardBase}>
        <ChicagoStar />
        <div style={labelStyle}>Community Areas in Dataset</div>
        <div style={valueStyle}>{Object.keys(cityAreaTotals).length}</div>
        <div style={subStyle}>Based on CSV summary file</div>
      </div>

      <div style={cardBase}>
        <ChicagoStar />
        <div style={labelStyle}>Area Score (Crime Rank)</div>
        <div style={valueStyle}>
          {areaScore === null ? "—" : `${areaScore}/100`}
        </div>
        <div style={subStyle}>{areaScoreLabel}</div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import { CrimeRecord } from "../utils/parseCsv.tsx";
import { CommunityArea } from "../utils/lookup.tsx";

interface ChartsProps {
  records: CrimeRecord[];
  allRecords: CrimeRecord[];
  selectedArea: CommunityArea | null;
}

declare global {
  interface Window {
    Chart: any;
  }
}

const chartJsUrl =
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";

function aggregateByCategory(list: CrimeRecord[]): Record<string, number> {
  const map: Record<string, number> = {};
  list.forEach((r) => {
    map[r.crimeCategory] = (map[r.crimeCategory] || 0) + r.count;
  });
  return map;
}

export default function Charts({
  records,
  allRecords,
  selectedArea,
}: ChartsProps) {
  const areaVsCityRef = useRef<HTMLCanvasElement | null>(null);
  const categoryRef = useRef<HTMLCanvasElement | null>(null);
  const areaVsCityChart = useRef<any | null>(null);
  const categoryChart = useRef<any | null>(null);

  useEffect(() => {
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = chartJsUrl;
      script.onload = () => renderCharts();
      document.body.appendChild(script);
    } else {
      renderCharts();
    }

    return () => {
      if (areaVsCityChart.current) {
        areaVsCityChart.current.destroy();
        areaVsCityChart.current = null;
      }
      if (categoryChart.current) {
        categoryChart.current.destroy();
        categoryChart.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, allRecords, selectedArea]);

  function renderCharts() {
    if (!window.Chart) return;

    const totalCity = allRecords.reduce((acc, r) => acc + r.count, 0);
    const totalArea = records.reduce((acc, r) => acc + r.count, 0);

    const numAreas = new Set(allRecords.map((r) => r.communityArea)).size;
    const avgPerArea = numAreas ? totalCity / numAreas : 0;

    // ------- AREA VS CITY TOTAL (SMALL BAR) -------
    if (areaVsCityRef.current) {
      if (areaVsCityChart.current) {
        areaVsCityChart.current.destroy();
      }

      const ctx = areaVsCityRef.current.getContext("2d");
      if (!ctx) return;

      const areaLabel = selectedArea
        ? `Area ${selectedArea.number}`
        : "Current selection";

      areaVsCityChart.current = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: [areaLabel, "City Avg per Area"],
          datasets: [
            {
              label: "Crimes",
              data: [totalArea, avgPerArea],
              backgroundColor: ["#4f8cff", "#ff9f40"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: "#fff" },
            },
            y: {
              ticks: { color: "#fff" },
            },
          },
        },
      });
    }

    // ------- CATEGORY COMPARISON (STACKED SMALL BARS) -------
    if (categoryRef.current) {
      if (categoryChart.current) {
        categoryChart.current.destroy();
      }

      const ctx = categoryRef.current.getContext("2d");
      if (!ctx) return;

      const cityByCat = aggregateByCategory(allRecords);
      const areaByCat = aggregateByCategory(records);
      const labels = Object.keys(cityByCat);

      const cityValues = labels.map((k) => cityByCat[k] || 0);
      const avgCityPerArea = numAreas
        ? cityValues.map((v) => v / numAreas)
        : cityValues;

      const areaValues = labels.map((k) => areaByCat[k] || 0);

      categoryChart.current = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Area",
              data: areaValues,
              backgroundColor: "#4f8cff",
            },
            {
              label: "City Avg per Area",
              data: avgCityPerArea,
              backgroundColor: "#8884d8",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#fff" },
            },
          },
          scales: {
            x: {
              ticks: { color: "#fff", font: { size: 11 } },
            },
            y: {
              ticks: { color: "#fff", font: { size: 11 } },
            },
          },
        },
      });
    }
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <h2>Area vs City Comparison</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            flex: "1 1 260px",
            maxWidth: "360px",
            background: "rgba(15,15,15,0.95)",
            padding: "12px",
            borderRadius: "14px",
            border: "1px solid #333",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              opacity: 0.7,
              marginBottom: "6px",
            }}
          >
            Total Crimes
          </div>
          <canvas
            ref={areaVsCityRef}
            style={{ width: "100%", height: "180px" }}
          />
        </div>

        <div
          style={{
            flex: "1 1 360px",
            minWidth: "320px",
            background: "rgba(15,15,15,0.95)",
            padding: "12px",
            borderRadius: "14px",
            border: "1px solid #333",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              opacity: 0.7,
              marginBottom: "6px",
            }}
          >
            Crime Types — Area vs City Avg
          </div>
          <canvas
            ref={categoryRef}
            style={{ width: "100%", height: "220px" }}
          />
        </div>
      </div>
    </div>
  );
}

export interface CrimeRecord {
  communityArea: number;
  crimeCategory: string;
  count: number;
}

export function parseCsv(csv: string): CrimeRecord[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim());

  const idxArea = header.findIndex(
    (h) => h.toLowerCase().includes("community") && h.toLowerCase().includes("area")
  );
  const idxCategory = header.findIndex((h) =>
    h.toLowerCase().includes("crime")
  );
  const idxCount = header.findIndex((h) =>
    h.toLowerCase().includes("count")
  );

  const results: CrimeRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].trim();
    if (!row) continue;

    const cols = row.split(",").map((c) => c.trim());

    const area = Number(cols[idxArea]);
    const category = cols[idxCategory];
    const count = Number(cols[idxCount]);

    if (!Number.isNaN(area) && category && !Number.isNaN(count)) {
      results.push({
        communityArea: area,
        crimeCategory: category,
        count,
      });
    }
  }

  return results;
}

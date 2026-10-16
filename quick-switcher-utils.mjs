function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase();
}

export function filterQuickSwitcherEntries(entries, query, limit = 30) {
  const list = Array.isArray(entries) ? entries : [];
  const q = normalize(query).replace(/^[@#]/, "").trim();
  const max = Number.isInteger(limit) ? Math.max(0, limit) : 30;
  if (!q) return list.slice(0, max);

  return list.map((entry, index) => {
    const label = normalize(entry.label);
    const searchable = normalize(`${entry.search || ""} ${entry.detail || ""}`);
    const score = label === q ? 0
      : label.startsWith(q) ? 1
        : label.includes(q) ? 2
          : searchable.includes(q) ? 3 : Number.POSITIVE_INFINITY;
    return { entry, index, score };
  }).filter((item) => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, max)
    .map((item) => item.entry);
}

export function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export function getPolicyStatus(days) {
  if (days <= 10) return { key: "critical", label: "Critical", color: "#e0524d" };
  if (days <= 30) return { key: "expiring", label: "Expiring", color: "#d6890c" };
  return { key: "active", label: "Active", color: "#10976a" };
}

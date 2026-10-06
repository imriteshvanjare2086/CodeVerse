// CodeChef star bands are based on the current contest rating.
export function codechefStars(rating) {
  const value = Number(rating);
  if (!Number.isFinite(value) || value <= 0) return '0★';
  const thresholds = [1400, 1600, 1800, 2000, 2200, 2500];
  return `${1 + thresholds.filter(threshold => value >= threshold).length}★`;
}

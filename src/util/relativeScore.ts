export function relativeScore(
  value: number,
  min: number,
  max: number,
  maxScore: number,
) {
  if (min === max) return maxScore;
  return Math.round((maxScore * (value - min)) / (max - min));
}

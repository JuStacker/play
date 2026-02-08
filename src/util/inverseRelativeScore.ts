export function inverseRelativeScore(
  value: number,
  min: number,
  max: number,
  maxScore: number
) {
  if (min === max) return maxScore
  return Math.round(maxScore * (max - value) / (max - min))
}
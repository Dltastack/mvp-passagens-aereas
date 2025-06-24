export function getAvailabilityStatus(seats: number) {
  if (seats === 0) return { text: "Esgotado", color: "text-red-600", bg: "bg-red-50" }
  if (seats <= 2)
    return { text: `${seats} restante${seats > 1 ? "s" : ""}`, color: "text-orange-600", bg: "bg-orange-50" }
  if (seats <= 5) return { text: `${seats} disponíveis`, color: "text-yellow-600", bg: "bg-yellow-50" }
  return { text: "Disponível", color: "text-green-600", bg: "bg-green-50" }
}
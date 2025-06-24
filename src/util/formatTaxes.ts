export function formatTaxes(taxes: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "CAD",
  }).format(taxes)
}
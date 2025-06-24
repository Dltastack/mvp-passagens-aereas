export function formatPrice(price: number) {
  // Formata como moeda e remove o símbolo "R$" do início
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(price)
    .replace(/^R\$\s?/, "");
};
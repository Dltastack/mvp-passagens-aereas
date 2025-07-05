export async function getExchangeRateToBRL(from: string): Promise<number> {
  const base = from?.toUpperCase();
  if (!base || base === "BRL") return 1;

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=BRL`);
    const data = await res.json();
    return data?.rates?.BRL ?? 1;
  } catch (err) {
    console.error(`Erro ao buscar taxa para ${base} → BRL`, err);
    return 1;
  }
}
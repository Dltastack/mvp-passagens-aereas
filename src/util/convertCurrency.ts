export async function getExchangeRate(from: string, to: string = "BRL"): Promise<number | null> {
    try {
        if (from === to) return 1;
        const res = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
        const data = await res.json();
        return data?.rates?.[to] || null;
    } catch (err) {
        console.error("Erro ao buscar câmbio:", err);
        return null;
    }
}

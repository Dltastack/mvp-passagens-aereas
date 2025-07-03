// import axios from "axios";

// export const aeroportosBrasileiros = [
//     "GRU", "CGH", "VCP", "GIG", "SDU", "CNF", "BSB", "SSA", "REC", "POA",
//     "FOR", "CWB", "MAO", "BEL", "FLN", "MCZ", "NAT", "CGB", "IGU"
// ];

// // ✅ Carrega a URL e a chave da API do arquivo .env
// const SEATS_API_URL = process.env.BASE_URL; // ex: https://seats.aero/partnerapi
// const SEATS_API_KEY = process.env.SEATS_AERO_API_KEY; // ex: pro_2ygoSQ...

// if (!SEATS_API_URL || !SEATS_API_KEY) {
//     throw new Error("SEATS_API_URL ou SEATS_API_KEY não está definida no .env");
// }

// const AUTH_HEADER = {
//     headers: {
//         Authorization: `Bearer ${SEATS_API_KEY}`,
//     },
// };

// export async function getDestinosDisponiveis(): Promise<string[]> {
//     const destinosSet = new Set<string>();

//     for (const origin of aeroportosBrasileiros) {
//         try {
//             const res = await axios.get(`${SEATS_API_URL}/routes?origin_airport=${origin}`, AUTH_HEADER);
//             const destinos = res.data as { origin: string; destination: string }[];
//             destinos.forEach((r) => destinosSet.add(r.destination));
//         } catch (err) {
//             console.error(`Erro ao consultar rotas para ${origin}:`, err);
//         }
//     }

//     return Array.from(destinosSet);
// }

// // Instância reutilizável do axios com baseURL e cabeçalhos
// export const seatsApi = axios.create({
//     baseURL: SEATS_API_URL,
//     headers: AUTH_HEADER.headers,
// });

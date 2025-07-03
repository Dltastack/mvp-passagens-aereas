"use server"

import { AvailabilityData } from "@/@types/flight";
import { api } from "@/services/axios";

export async function searchFlights(params: {
  source?: string,
  cabin?: string,
  start_date?: string, // ex: "2024-07-01"
  end_date?: string,   // ex: "2025-12-31" ou REMOVA
  take?: number,       // ex: 2000
  skip?: number,       // para paginação
}) {
  const aeroportosBrasileiros = [
    "GRU", "CGH", "VCP", "GIG", "SDU", "CNF", "BSB", "SSA", "REC", "POA",
    "FOR", "CWB", "MAO", "BEL", "FLN", "MCZ", "NAT", "CGB", "IGU"
  ];

  const origin_airport = aeroportosBrasileiros.join(",");

  const queryParams: Record<string, string> = {
    origin_airport,
    destination_airport: "FRA,LIS,MAD,LHR,CDG,AMS,DXB,PTY,JFK,MIA", // ou a lista completa
    take: params.take?.toString() || "2000", // aumente o limite
    include_trips: "false",
    only_direct_flights: "false",
    include_filtered: "false",
  };

  if (params.cabin) queryParams.cabin = params.cabin;
  if (params.start_date) queryParams.start_date = params.start_date;
  // ❌ Remova ou defina end_date futura
  if (params.end_date) queryParams.end_date = params.end_date;
  if (params.skip) queryParams.skip = params.skip.toString();

  const query = new URLSearchParams(queryParams).toString();

  try {
    const response = await api.get(`/search?${query}`);
    const { data } = response.data as { data: AvailabilityData[] };
    const available = data.filter((flight) => flight.YMileageCostRaw > 0);
    const sorted = available.sort((a, b) => a.YMileageCostRaw - b.YMileageCostRaw);
    return { data: sorted };
  } catch (err) {
    console.error("Erro ao buscar voos:", err);
    return { data: [] };
  }
}

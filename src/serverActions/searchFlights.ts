"use server"

import { AvailabilityData } from "@/@types/flight";
import type { SearchParamsProps } from "@/@types/searchParams";
import { api } from "@/services/axios";

const BRAZILIAN_AIRPORTS = new Set([
  "GRU", "CGH", "VCP", "GIG", "SDU", "CNF", "BSB", "SSA", "REC", "POA",
  "FOR", "CWB", "MAO", "BEL", "FLN", "MCZ", "NAT", "CGB", "IGU"
]);

export async function searchFlights(params: SearchParamsProps) {
  const {
    cabin,
    start_date,
    end_date,
    continent,
    destination,
    skip,
    take,
    source
  } = params;

  const queryParams = {
    origin_region: "South America",
    ...(cabin && { cabin }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(continent && { destination_region: continent }),
    ...(typeof skip === "number" && { skip: skip.toString() }),
    ...(typeof take === "number" && { take: take.toString() }),
    ...(source && { source }),
  };

  const query = new URLSearchParams(queryParams).toString().replace(/\+/g, "%20");

  try {
    const response = await api.get(`/availability?${query}`);
    const flights = (response.data?.data || []) as AvailabilityData[];

    const filtered = flights.filter((flight) =>
      flight.YMileageCostRaw > 0 &&
      BRAZILIAN_AIRPORTS.has(flight.Route.OriginAirport) &&
      Array.isArray(destination) &&
      destination.includes(flight.Route.DestinationAirport)
    );

    if (filtered.length <= 1) return { data: filtered };

    const sorted = filtered.sort((a, b) => a.YMileageCostRaw - b.YMileageCostRaw);
    return { data: sorted };
  } catch (err) {
    console.error("Erro ao buscar voos:", err);
    return { data: [] };
  }
}

'use server'

import type { AvailabilityData } from "@/@types/flight";
import { api } from "@/services/axios"

export async function searchFlights(params: {
  source?: string,
  cabin?: string,
  start_date?: string,
  end_date?: string,
  origin_region?: string,
  destination_region?: string,
  take?: number,
  cursor?: number,
  skip?: number
}) {
  const queryParams: Record<string, string> = {};

  if (params.source) queryParams.source = params.source;
  if (params.cabin) queryParams.cabin = params.cabin;
  if (params.start_date) queryParams.start_date = params.start_date;
  if (params.end_date) queryParams.end_date = params.end_date;
  if (params.origin_region) queryParams.origin_region = params.origin_region;
  if (params.destination_region) queryParams.destination_region = params.destination_region;
  if (params.take) queryParams.take = params.take.toString();
  if (params.cursor) queryParams.cursor = params.cursor.toString();
  if (params.skip) queryParams.skip = params.skip.toString();

  const query = new URLSearchParams(queryParams).toString();

  const response = await api.get(`/availability?${query}`);
  const { data } = response.data as { data: AvailabilityData[] }

  const available = data
    .filter((flight) => flight.YMileageCostRaw > 0)
    .sort((a, b) => a.YMileageCostRaw - b.YMileageCostRaw)

  return { data: available };
}


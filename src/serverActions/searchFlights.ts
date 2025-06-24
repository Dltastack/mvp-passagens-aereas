'use server'

import { api } from "@/services/axios"

export async function searchFlights(params: {
  source: string,
  cabin?: string,
  start_date?: string,
  end_date?: string,
  origin_region?: string,
  destination_region?: string,
  take?: number,
  cursor?: number,
  skip?: number
}) {
  const query = new URLSearchParams({
    source: params.source,
    ...(params.cabin && { cabin: params.cabin }),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
    ...(params.origin_region && { origin_region: params.origin_region }),
    ...(params.destination_region && { destination_region: params.destination_region }),
    ...(params.take && { take: params.take.toString() }),
    ...(params.cursor && { cursor: params.cursor.toString() }),
    ...(params.skip && { skip: params.skip.toString() }),
  }).toString();

  const response = await api.get(`/availability?${query}`);
  const { data } = response.data;

  const available = data
    .filter((flight: any) => flight.YMileageCost > 0)
    .sort((a: any, b: any) => a.YMileageCostRaw - b.YMileageCostRaw);

  return { data: available };
}


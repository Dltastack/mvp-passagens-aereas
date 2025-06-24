'use server'

import { api } from "@/services/axios"

export async function searchFlights() {
  const response = await api.get('/availability?take=500&skip=0')

  const { data } = response.data

  const available = data
    .filter((flight: any) => flight.YMileageCost > 0)
    .sort((a: any, b: any) => a.YMileageCostRaw - b.YMileageCostRaw)

  return { data: available }
}


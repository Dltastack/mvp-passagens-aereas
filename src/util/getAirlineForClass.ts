import type { AvailabilityData } from "@/@types/flight"
import { AIRLINE_INFO } from "@/CONSTANTS/AIRLINE_INFO"

export function getAirlineForClass(flight: AvailabilityData, classCode: string) {
  let airlineCode = ''
  switch (classCode) {
    case 'Y':
      airlineCode = flight.YAirlines || flight.YAirlinesRaw || ''
      break
    case 'W':
      airlineCode = flight.WAirlines || flight.WAirlinesRaw || ''
      break
    case 'J':
      airlineCode = flight.JAirlines || flight.JAirlinesRaw || ''
      break
    case 'F':
      airlineCode = flight.FAirlines || flight.FAirlinesRaw || ''
      break
    default:
      return "N/A"
  }

  if (airlineCode && AIRLINE_INFO[airlineCode]) {
    return AIRLINE_INFO[airlineCode]
  }

  return airlineCode || "N/A"
}

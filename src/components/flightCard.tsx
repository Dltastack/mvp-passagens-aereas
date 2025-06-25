
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import type { AvailabilityData } from "@/@types/flight"
import type { SearchParamsProps } from "@/@types/searchParams"
import { AIRPORT_INFO } from "@/CONSTANTS/AIRPORT_INFO"
import { FlightStatus } from "./flightStatus"
import { ClassSelectButton, type ClassInfo } from "./classSelectButton"
import { RouteHeader } from "./routerHeader"
import { PricingSection } from "./pricingSection"
import { getAvailabilityStatus } from "@/util/getAvailabilityStatus"

interface FlightCardProps {
  flight: AvailabilityData
  params: SearchParamsProps
}

export function FlightCard({ flight, params }: FlightCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>("Y")

  const origin = flight.Route.OriginAirport
  const destination = flight.Route.DestinationAirport
  const originCity = AIRPORT_INFO[origin]?.city || flight.Route.OriginRegion
  const destinationCity = AIRPORT_INFO[destination]?.city || flight.Route.DestinationRegion
  const date = new Date(flight.Date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
  const distance = flight.Route.Distance
  const currency = flight.TaxesCurrency

  const classes: ClassInfo[] = [
    {
      name: "Econômica",
      shortName: "Econ",
      code: "Y",
      available: flight.YAvailable,
      remainingSeats: flight.YRemainingSeats,
      mileageCost: flight.YMileageCost,
      mileageCostRaw: flight.YMileageCostRaw,
      totalTaxes: flight.YTotalTaxes,
      airlines: flight.YAirlines,
      isDirect: flight.YDirect,
      icon: "💺",
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      name: "Premium Economy",
      shortName: "Prem",
      code: "W",
      available: flight.WAvailable,
      remainingSeats: flight.WRemainingSeats,
      mileageCost: flight.WMileageCost,
      mileageCostRaw: flight.WMileageCostRaw,
      totalTaxes: flight.WTotalTaxes,
      airlines: flight.WAirlines,
      isDirect: flight.WDirect,
      icon: "🛋️",
      color: "text-purple-700",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      name: "Executiva",
      shortName: "Exec",
      code: "J",
      available: flight.JAvailable,
      remainingSeats: flight.JRemainingSeats,
      mileageCost: flight.JMileageCost,
      mileageCostRaw: flight.JMileageCostRaw,
      totalTaxes: flight.JTotalTaxes,
      airlines: flight.JAirlines,
      isDirect: flight.JDirect,
      icon: "✈️",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      name: "Primeira",
      shortName: "1ª",
      code: "F",
      available: flight.FAvailable,
      remainingSeats: flight.FRemainingSeats,
      mileageCost: flight.FMileageCost,
      mileageCostRaw: flight.FMileageCostRaw,
      totalTaxes: flight.FTotalTaxes,
      airlines: flight.FAirlines,
      isDirect: flight.FDirect,
      icon: "👑",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
    },
  ]

  const selectedClassInfo = classes.find((c) => c.code === selectedClass) || classes[0]
  const availableClasses = classes.filter((c) => c.available && c.mileageCostRaw > 0)
  const bestPrice = Math.min(...availableClasses.map((c) => c.mileageCostRaw))
  const isSelectedBestPrice = selectedClassInfo.mileageCostRaw === bestPrice
  const availabilityStatus = getAvailabilityStatus(selectedClassInfo.remainingSeats)

  async function handlePurchaseFlight() {
    setIsLoading(true)
    try {
      console.log("GUSTAVO GAY <3")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 border border-gray-200/60 bg-white/80 backdrop-blur-sm hover:bg-white h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center justify-center">
            <RouteHeader
              origin={origin}
              originCity={originCity}
              destination={destination}
              destinationCity={destinationCity}
              distance={distance}
            />
          </div>
          <FlightStatus
            date={date}
            isDirect={selectedClassInfo.isDirect}
            availabilityStatus={availabilityStatus}
          />
        </div>
        <div className="mb-4">
          <div className="text-xs text-gray-600 font-medium mb-2">Classes:</div>
          <div className="grid grid-cols-2 gap-1">
            {classes.map((classInfo) => (
              <ClassSelectButton
                key={classInfo.code}
                classInfo={classInfo}
                isSelected={selectedClass === classInfo.code}
                onClick={() => setSelectedClass(classInfo.code)}
              />
            ))}
          </div>
        </div>
        <PricingSection
          selectedClassInfo={selectedClassInfo}
          isSelectedBestPrice={isSelectedBestPrice}
          currency={currency}
          params={params}
          isLoading={isLoading}
          handlePurchaseFlight={handlePurchaseFlight}
        />
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import type { AvailabilityData } from "@/@types/flight"
import type { SearchParamsProps } from "@/@types/searchParams"
import { AIRPORT_INFO } from "@/CONSTANTS/AIRPORT_INFO"
import Image from "next/image"
import { MapPinIcon, StarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface FlightCardProps {
  flight: AvailabilityData
  params: SearchParamsProps
}

interface ClassInfo {
  name: string
  shortName: string
  code: string
  available: boolean
  remainingSeats: number
  mileageCost: string
  mileageCostRaw: number
  totalTaxes: number
  airlines: string
  isDirect: boolean
}

export function FlightCard({ flight, params }: FlightCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>("Y")
  const [imageError, setImageError] = useState(false)

  const origin = flight.Route.OriginAirport
  const destination = flight.Route.DestinationAirport
  const originCity = AIRPORT_INFO[origin]?.city || flight.Route.OriginRegion
  const destinationCity = AIRPORT_INFO[destination]?.city || flight.Route.DestinationRegion
  const date = new Date(flight.Date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
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
    },
  ]

  const selectedClassInfo = classes.find((c) => c.code === selectedClass) || classes[0]
  const availableClasses = classes.filter((c) => c.available && c.mileageCostRaw > 0)
  const bestPrice = Math.min(...availableClasses.map((c) => c.mileageCostRaw))
  const isSelectedBestPrice = selectedClassInfo.mileageCostRaw === bestPrice

  function formatTaxes(taxes: number, currency: string) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "CAD",
    }).format(taxes)
  }

  function formatMileageCost(mileageCost: string, mileageCostRaw: number) {
    if (mileageCost && mileageCost !== "0") {
      return mileageCost
    }
    return mileageCostRaw.toLocaleString()
  }

  async function handlePurchaseFlight() {
    setIsLoading(true)
    try {
      console.log("Selecionando voo...")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 pt-0 bg-white h-full flex flex-col overflow-hidden">
      {/* Imagem do Destino */}
      <CardHeader className="relative h-40 w-full overflow-hidden p-0">
        {!imageError ? (
          <Image
            src={`/airports/${destination}.png`}
            fill
            alt={`${destinationCity} - ${destination}`}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-blue-700">{destinationCity}</p>
              <p className="text-sm text-blue-600">{destination}</p>
            </div>
          </div>
        )}

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all h-full" />

        {/* Informações do destino */}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-lg font-bold drop-shadow-lg">{destinationCity}</h3>
          <p className="text-sm opacity-90 drop-shadow-lg">{destination}</p>
        </div>

        {/* Data */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <p className="text-sm font-medium text-gray-800">{date}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Seleção de Classes */}
        <div className="mb-4">
          <div className="flex gap-2">
            {classes.map((classInfo) => {
              const isSelected = selectedClass === classInfo.code
              const isAvailable = classInfo.available && classInfo.mileageCostRaw > 0

              return (
                <button
                  key={classInfo.code}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                    ${isSelected
                      ? isAvailable
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                      : isAvailable
                        ? "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                    }
                  `}
                  onClick={() => setSelectedClass(classInfo.code)}
                  disabled={!isAvailable}
                >
                  {classInfo.shortName}
                </button>
              )
            })}
          </div>
        </div>

        {/* Informações da Classe Selecionada */}
        <div className="flex-1 flex flex-col">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{selectedClassInfo.name}</h4>
              {isSelectedBestPrice && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Melhor preço
                </Badge>
              )}
            </div>

            {selectedClassInfo.available && selectedClassInfo.mileageCostRaw > 0 ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatMileageCost(selectedClassInfo.mileageCost, selectedClassInfo.mileageCostRaw)}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">milhas</span>
                </div>
                <p className="text-sm text-gray-600">
                  + {formatTaxes(selectedClassInfo.totalTaxes, currency)} para {params.passengers} passageiro
                  {Number(params.passengers) > 1 ? "s" : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Indisponível</p>
            )}
          </div>

          {/* Botão de Seleção */}
          <Button
            onClick={handlePurchaseFlight}
            disabled={isLoading || !selectedClassInfo.available || selectedClassInfo.mileageCostRaw === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 mt-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando...</span>
              </div>
            ) : (
              "Selecionar"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

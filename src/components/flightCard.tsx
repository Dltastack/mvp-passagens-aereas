"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { PlaneIcon, CheckIcon, MinusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import type { AvailabilityData } from "@/@types/flight"
import { Badge } from "./ui/badge"
import type { SearchParamsProps } from "@/@types/searchParams"
import { AIRPORT_INFO } from "@/CONSTANTS/AIRPORT_INFO"
import { formatPrice } from "@/util/formatPrice"

interface FlightCardProps {
  flight: AvailabilityData
  params: SearchParamsProps
}

interface ClassInfo {
  name: string
  code: string
  available: boolean
  remainingSeats: number
  mileageCost: string
  mileageCostRaw: number
  totalTaxes: number
  airlines: string
  isDirect: boolean
  icon: string
}

export function FlightCard({ flight, params }: FlightCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>("Y")

  const origin = flight.Route.OriginAirport
  const destination = flight.Route.DestinationAirport
  const originRegion = flight.Route.OriginRegion
  const destinationRegion = flight.Route.DestinationRegion
  const date = new Date(flight.Date).toLocaleDateString("pt-BR")
  const distance = flight.Route.Distance
  const currency = flight.TaxesCurrency

  const classes: ClassInfo[] = [
    {
      name: "Econômica",
      code: "Y",
      available: flight.YAvailable,
      remainingSeats: flight.YRemainingSeats,
      mileageCost: flight.YMileageCost,
      mileageCostRaw: flight.YMileageCostRaw,
      totalTaxes: flight.YTotalTaxes,
      airlines: flight.YAirlines,
      isDirect: flight.YDirect,
      icon: "💺",
    },
    {
      name: "Premium Economy",
      code: "W",
      available: flight.WAvailable,
      remainingSeats: flight.WRemainingSeats,
      mileageCost: flight.WMileageCost,
      mileageCostRaw: flight.WMileageCostRaw,
      totalTaxes: flight.WTotalTaxes,
      airlines: flight.WAirlines,
      isDirect: flight.WDirect,
      icon: "🛋️",
    },
    {
      name: "Executiva",
      code: "J",
      available: flight.JAvailable,
      remainingSeats: flight.JRemainingSeats,
      mileageCost: flight.JMileageCost,
      mileageCostRaw: flight.JMileageCostRaw,
      totalTaxes: flight.JTotalTaxes,
      airlines: flight.JAirlines,
      isDirect: flight.JDirect,
      icon: "✈️",
    },
    {
      name: "Primeira",
      code: "F",
      available: flight.FAvailable,
      remainingSeats: flight.FRemainingSeats,
      mileageCost: flight.FMileageCost,
      mileageCostRaw: flight.FMileageCostRaw,
      totalTaxes: flight.FTotalTaxes,
      airlines: flight.FAirlines,
      isDirect: flight.FDirect,
      icon: "👑",
    },
  ]

  function getAvailabilityColor(classInfo: ClassInfo) {
    if (!classInfo.available || classInfo.remainingSeats <= 1) {
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-500",
        indicator: "bg-gray-400",
      }
    }
    if (classInfo.remainingSeats >= 2 && classInfo.remainingSeats <= 4) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        indicator: "bg-amber-500",
      }
    }
    return {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      indicator: "bg-emerald-500",
    }
  }

  function formatTaxes(taxes: number, currency: string) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "CAD",
    }).format(taxes)
  }

  function formatSeats(seats: number, available: boolean) {
    if (!available) return "Indisponível"
    if (seats === 0 && available) return "Disponível"
    if (seats >= 5) return "5+"
    return seats.toString()
  }

  // Função para formatar custo em milhas
  function formatMileageCost(mileageCost: string, mileageCostRaw: number) {
    if (mileageCost && mileageCost !== "0") {
      return mileageCost
    }
    return formatPrice(mileageCostRaw)
  }

  const selectedClassInfo = classes.find((c) => c.code === selectedClass) || classes[0]

  async function handlePurchaseFlight() {
    setIsLoading(true)
    const flightWithClass = {
      ...flight,
      selectedClass: selectedClassInfo,
    }
    localStorage.setItem("flight", JSON.stringify(flightWithClass))
    await new Promise((resolve) => setTimeout(resolve, 800))
    window.location.href = "/purchase"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
      {/* Header com informações básicas do voo */}
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <PlaneIcon className="h-4 w-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {selectedClassInfo.airlines || "Múltiplas Companhias"}
              </h3>
              <p className="text-xs text-gray-500">{distance} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {date}
            </Badge>
            {selectedClassInfo.isDirect && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Direto
              </Badge>
            )}
          </div>
        </div>

        {/* Rota compacta */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-900">{origin}</p>
            <p className="text-xs text-gray-500">{AIRPORT_INFO[origin]?.city || originRegion}</p>
          </div>

          <div className="flex items-center px-3">
            <div className="h-px bg-gray-300 w-12"></div>
            <PlaneIcon className="h-3 w-3 text-gray-400 mx-2 transform rotate-90" />
            <div className="h-px bg-gray-300 w-12"></div>
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-900">{destination}</p>
            <p className="text-xs text-gray-500">{AIRPORT_INFO[destination]?.city || destinationRegion}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Grid de classes mais compacto */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Disponibilidade por Classe</h4>

          <div className="grid grid-cols-2 gap-2">
            {classes.map((classInfo) => {
              const colors = getAvailabilityColor(classInfo)
              const isSelected = selectedClass === classInfo.code
              const isAvailable = classInfo.available && classInfo.mileageCostRaw > 0

              return (
                <div
                  key={classInfo.code}
                  className={`
                    relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${isSelected
                      ? `${colors.bg} ${colors.border} ring-1 ring-gray-400`
                      : `${colors.bg} ${colors.border} hover:ring-1 hover:ring-gray-300`
                    }
                    ${!isAvailable ? "opacity-60" : ""}
                  `}
                  onClick={() => setSelectedClass(classInfo.code)}
                >
                  {/* Header da classe */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{classInfo.icon}</span>
                      <span className="font-medium text-gray-900 text-xs">{classInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.indicator}`}></div>
                      {isAvailable ? (
                        <CheckIcon className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <MinusIcon className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Informações compactas */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Assentos:</span>
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {formatSeats(classInfo.remainingSeats, classInfo.available)}
                      </span>
                    </div>

                    {isAvailable && (
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Milhas:</span>
                          <span className="text-xs font-medium text-gray-900">
                            {formatMileageCost(classInfo.mileageCost, classInfo.mileageCostRaw)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Taxas:</span>
                          <span className="text-xs font-medium text-gray-900">
                            {formatTaxes(classInfo.totalTaxes, currency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Indicador de seleção */}
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-3 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-2 w-2 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Separator className="my-3" />

          {/* Resumo da classe selecionada mais compacto */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900 text-sm mb-1">{selectedClassInfo.name} Selecionada</h5>
              {selectedClassInfo.available && selectedClassInfo.mileageCostRaw > 0 ? (
                <div className="space-y-0.5">
                  <p className="text-base font-bold text-gray-900">
                    {formatMileageCost(selectedClassInfo.mileageCost, selectedClassInfo.mileageCostRaw)} milhas
                  </p>
                  <p className="text-xs text-gray-600">
                    + {formatTaxes(selectedClassInfo.totalTaxes, currency)} em taxas
                  </p>
                  <p className="text-xs text-gray-500">
                    para {params.passengers} passageiro{Number(params.passengers) > 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MinusIcon className="h-3 w-3" />
                  Classe não disponível
                </p>
              )}
            </div>

            <Button
              onClick={handlePurchaseFlight}
              disabled={isLoading || !selectedClassInfo.available || selectedClassInfo.mileageCostRaw === 0}
              className="w-full sm:w-auto min-w-28 h-9 text-sm hover:cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </div>
              ) : (
                "Selecionar"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

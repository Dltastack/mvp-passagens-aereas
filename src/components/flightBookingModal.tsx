"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Label } from "./ui/label"
import { ArrowRightIcon, PlusIcon, MinusIcon, UsersIcon, BabyIcon, UserIcon } from "lucide-react"
import type { AvailabilityData } from "@/@types/flight"
import { AIRPORT_INFO } from "@/CONSTANTS/AIRPORT_INFO"
import { AIRLINE_INFO } from "@/CONSTANTS/AIRLINE_INFO"

interface FlightBookingModalProps {
  isOpen: boolean
  onClose: () => void
  flight: AvailabilityData
  selectedClass: {
    name: string
    code: string
    mileageCost: string
    mileageCostRaw: number
    totalTaxes: number
  }
  currency: string
}

interface PassengerCounts {
  adults: number
  children: number
  babies: number
}

export function FlightBookingModal({ isOpen, onClose, flight, selectedClass, currency }: FlightBookingModalProps) {
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    babies: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!flight) return null

  const origin = flight.Route.OriginAirport
  const destination = flight.Route.DestinationAirport
  const originCity = AIRPORT_INFO[origin]?.city || flight.Route.OriginRegion
  const destinationCity = AIRPORT_INFO[destination]?.city || flight.Route.DestinationRegion

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

  // Função para obter a companhia aérea baseada na classe selecionada
  const getAirlineForClass = (classCode: string) => {
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
        return 'N/A'
    }

    if (airlineCode && AIRLINE_INFO[airlineCode]) {
      return AIRLINE_INFO[airlineCode]
    }

    return airlineCode || 'N/A'
  }

  const airline = getAirlineForClass(selectedClass.code)

  const updatePassengerCount = (type: keyof PassengerCounts, increment: boolean) => {
    setPassengers((prev) => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)

      if (type === "adults") {
        return { ...prev, [type]: Math.max(1, Math.min(9, newCount)) }
      }

      return { ...prev, [type]: Math.max(0, Math.min(9, newCount)) }
    })
  }

  const totalPassengers = passengers.adults + passengers.children + passengers.babies
  const payingPassengers = passengers.adults + passengers.children

  const totalMiles = selectedClass.mileageCostRaw * payingPassengers

  const totalTaxes = selectedClass.totalTaxes * payingPassengers

  const handleBooking = async () => {
    setIsLoading(true)
    try {
      // Aqui você faria a reserva
      console.log("Reservando voo:", { flight, selectedClass, passengers })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Informações de voo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Classe e Tipo de Viagem */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Classe:</span>
              <Badge className="bg-blue-600 text-white px-3 py-1">{selectedClass.name}</Badge>
            </div>
            <span className="text-sm text-gray-600">Ida</span>
          </div>

          {/* Informações da Rota */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">ORIGEM</div>
                  <div className="text-2xl font-bold text-gray-900">{origin}</div>
                  <div className="text-sm text-gray-600">{originCity}</div>
                  <div className="text-xs text-gray-500">Brasil</div>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRightIcon className="h-6 w-6 text-gray-400 mb-2" />
                  <div className="font-medium flex flex-col gap-1">
                    {airline
                      .split(',')
                      .map(code => code.trim())
                      .map((airlineCode, idx) => (
                        <span key={airlineCode + idx} className="flex items-center gap-1">
                          <span className="text-blue-500">✈️</span>
                          {AIRLINE_INFO[airlineCode] || airlineCode}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">DESTINO</div>
                  <div className="text-2xl font-bold text-gray-900">{destination}</div>
                  <div className="text-sm text-gray-600">{destinationCity}</div>
                  <div className="text-xs text-gray-500">Internacional</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Passageiros */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Passageiros
              </h3>

              <div className="space-y-4">
                {/* Adultos */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-sm font-medium">Adultos</Label>
                      <p className="text-xs text-gray-500">12+ anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("adults", false)}
                      disabled={passengers.adults <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{passengers.adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("adults", true)}
                      disabled={passengers.adults >= 9}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Crianças */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-sm font-medium">Crianças</Label>
                      <p className="text-xs text-gray-500">2-12 anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("children", false)}
                      disabled={passengers.children <= 0}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{passengers.children}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("children", true)}
                      disabled={passengers.children >= 9}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Bebês */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BabyIcon className="h-5 w-5 text-pink-600" />
                    <div>
                      <Label className="text-sm font-medium">Bebês</Label>
                      <p className="text-xs text-gray-500">0-2 anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("babies", false)}
                      disabled={passengers.babies <= 0}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{passengers.babies}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updatePassengerCount("babies", true)}
                      disabled={passengers.babies >= 9}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milhas e Taxas */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Milhas e taxas</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ida:</span>
                  <span className="font-medium">
                    {formatMileageCost(selectedClass.mileageCost, selectedClass.mileageCostRaw)} milhas + taxas
                  </span>
                </div>

                {totalPassengers > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Total para {totalPassengers} passageiro{totalPassengers > 1 ? "s" : ""}:
                    </span>
                    <span className="font-medium">{totalMiles.toLocaleString()} milhas + taxas</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <div className="text-right">
                      <div>{totalMiles.toLocaleString()} milhas</div>
                      <div className="text-sm font-normal text-gray-600">+ {formatTaxes(totalTaxes, currency)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleBooking} disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Reservando...</span>
                </div>
              ) : (
                "Reservar Voo"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

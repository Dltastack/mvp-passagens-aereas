"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { PlaneIcon } from "lucide-react"
import type { AvailabilityData } from "@/@types/flight"
import { AIRPORT_INFO } from "@/CONSTANTS/AIRPORT_INFO"
import { formatMileageCost } from "@/util/formatMileageCost"
import { formatTaxes } from "@/util/formatTaxes"
import { getAirlineForClass } from "@/util/getAirlineForClass"
import { PassengerSelector } from "./passengerSelector"
import { ModalFlightStatus } from "./modalFlightStatus"

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
    airlines: string
    available: boolean
    bgColor: string
    color: string
    icon: string
    isDirect: boolean
    remainingSeats: number
    shortName: string
  }
  currency: string
}

interface PassengerCounts {
  adults: number
  children: number
  babies: number
}

// ✅ Função para buscar taxa de câmbio
async function getExchangeRateToBRL(from: string): Promise<number> {
  const base = from?.toUpperCase();
  if (!base || base === "BRL") return 1;

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=BRL`);
    const data = await res.json();
    return data?.rates?.BRL ?? 1;
  } catch (err) {
    console.error(`Erro ao buscar taxa para ${base} → BRL`, err);
    return 1;
  }
}

export function FlightBookingModal({ isOpen, onClose, flight, selectedClass, currency }: FlightBookingModalProps) {
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    babies: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [convertedTaxes, setConvertedTaxes] = useState<number | null>(null)

  if (!flight) return null

  const origin = flight.Route.OriginAirport
  const destination = flight.Route.DestinationAirport
  const originCity = AIRPORT_INFO[origin]?.city || flight.Route.OriginRegion
  const destinationCity = AIRPORT_INFO[destination]?.city || flight.Route.DestinationRegion
  const airline = getAirlineForClass(flight, selectedClass.code)

  const payingPassengers = passengers.adults + passengers.children
  const totalMiles = selectedClass.mileageCostRaw * payingPassengers
  const totalTaxes = selectedClass.totalTaxes * payingPassengers

  // ✅ Converter taxas assim que a classe ou moeda mudar
  useEffect(() => {
    async function convertTaxes() {
      const isAvailable = selectedClass.available && selectedClass.totalTaxes > 0;
      if (!isAvailable) return;

      if (currency.toUpperCase() === "BRL") {
        setConvertedTaxes(selectedClass.totalTaxes);
      } else {
        const rate = await getExchangeRateToBRL(currency);
        setConvertedTaxes(selectedClass.totalTaxes * rate);
      }
    }

    convertTaxes();
  }, [selectedClass, currency]);

  async function handleBooking() {
    setIsLoading(true)
    try {
      console.log("Reservando voo:", { flight, selectedClass, passengers })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle hidden>Informações de voo</DialogTitle>

        <div className="p-6 space-y-6">
          {/* Adiciona um título simples no topo da modal */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlaneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Informações do Voo</h2>
              <p className="text-gray-600">
                {originCity} → {destinationCity}
              </p>
            </div>
          </div>

          {/* Informações da Rota */}
          <ModalFlightStatus
            airline={airline}
            destination={destination}
            destinationCity={destinationCity}
            origin={origin}
            originCity={originCity}
            selectedClass={selectedClass}
          />

          {/* Seleção de Passageiros */}
          <PassengerSelector setPassengers={setPassengers} passengers={passengers} />

          {/* Milhas e Taxas */}
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Milhas e taxas</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Ida:</span>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">
                        {formatMileageCost(selectedClass.mileageCost, selectedClass.mileageCostRaw)}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">milhas</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      OU {convertedTaxes != null
                        ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(convertedTaxes)
                        : "Carregando..."}
                    </div>
                  </div>
                </div>

                {payingPassengers > 1 && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Total para {payingPassengers} passageiro{payingPassengers > 1 ? "s" : ""} que pagam:
                    </span>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-blue-600">
                          {totalMiles.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">milhas</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        OU {convertedTaxes != null
                          ? new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(convertedTaxes * payingPassengers)
                          : "Carregando..."}
                      </div>
                    </div>
                  </div>
                )}

                {passengers.babies > 0 && (
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Bebês ({passengers.babies}):</span>
                    <span className="font-medium text-green-600">Gratuito (apenas taxas)</span>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-xl lg:text-2xl font-bold text-gray-900">TOTAL:</span>
                    <div className="text-right">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                        {totalMiles.toLocaleString()} milhas
                      </div>
                      <div className="text-lg lg:text-xl font-semibold text-gray-700">
                        OU {convertedTaxes != null
                          ? new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(convertedTaxes * payingPassengers)
                          : "Carregando..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 lg:h-14 text-base lg:text-lg font-medium border-2 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBooking}
              disabled={isLoading}
              className="flex-1 h-12 lg:h-14 text-base lg:text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

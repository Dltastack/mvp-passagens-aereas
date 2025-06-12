"use client"

import { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Info,
  Luggage,
  Plane,
  ShoppingBag,
  Timer,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Flight } from "@/@types/flight"

const airlineNames: Record<string, string> = {
  AD: "Azul Linhas Aéreas",
  G3: "Gol Linhas Aéreas",
  LA: "LATAM Airlines",
  AA: "American Airlines",
  DL: "Delta Air Lines",
  UA: "United Airlines",
}

const airportCities: Record<string, string> = {
  SMT: "Sorriso",
  CNF: "Belo Horizonte",
  GRU: "São Paulo",
}

function formatDuration(isoDuration: string): string {
  const hourMatch = isoDuration.match(/(\d+)H/)
  const minuteMatch = isoDuration.match(/(\d+)M/)

  const hours = hourMatch ? Number.parseInt(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number.parseInt(minuteMatch[1]) : 0

  return `${hours}h ${minutes}m`
}

// Função para formatar valores monetários
function formatCurrency(value: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.parseFloat(value))
}

export default function PurchasePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [flightOffer, setFlightOffer] = useState<Flight | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const loadFlightData = () => {
      try {
        const savedFlight = localStorage.getItem("flight")
        if (savedFlight) {
          const parsedFlight = JSON.parse(savedFlight)
          setFlightOffer(parsedFlight)
          console.log({ parsedFlight })
        } else {
          router.push("/")
          return
        }
      } catch (error) {
        console.error("Erro ao carregar dados do voo:", error)
        router.push("/")
        return
      }
      setDataLoading(false)
    }

    loadFlightData()
  }, [router])

  if (dataLoading || !flightOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900">Carregando detalhes do voo</h2>
          <p className="text-gray-600">Aguarde enquanto buscamos as informações da sua passagem...</p>
        </div>
      </div>
    )
  }

  const hasCheckedBaggage = flightOffer.fullOffer.travelerPricings[0].fareDetailsBySegment.some(
    (segment: any) => segment.includedCheckedBags.quantity > 0,
  )

  const formattedLastTicketingDate = format(parseISO(flightOffer.lastTicketingDate), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  const handlePurchase = () => {
    setIsLoading(true)
    setTimeout(() => {
      alert("Compra processada com sucesso!")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar à Busca
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revisar e Comprar</h1>
            <p className="text-gray-600">Confira os detalhes da sua passagem antes de finalizar a compra</p>
          </div>
        </div>

        {/* Resumo da Viagem */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Detalhes do Voo</CardTitle>
                <CardDescription>
                  {flightOffer.fullOffer.itineraries[0].segments.length > 1
                    ? `${flightOffer.fullOffer.itineraries[0].segments.length} trechos`
                    : "Voo direto"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(flightOffer.fullOffer.itineraries[0].duration)}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(parseISO(flightOffer.fullOffer.itineraries[0].segments[0].departure.at), "dd/MM/yyyy")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {flightOffer.fullOffer.itineraries[0].segments.map((segment, index) => {
              const departureTime = parseISO(segment.departure.at)
              const arrivalTime = parseISO(segment.arrival.at)
              const airlineName = airlineNames[segment.carrierCode] || segment.carrierCode
              const isLastSegment = index === flightOffer.fullOffer.itineraries[0].segments.length - 1
              return (
                <div key={index}>
                  <div className="flex items-start">
                    {/* Linha do tempo */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      {!isLastSegment && <div className="w-0.5 h-24 bg-gray-200"></div>}
                    </div>

                    {/* Detalhes do segmento */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-lg">
                            {airlineName} {segment.carrierCode}
                            {segment.number}
                          </p>
                          <p className="text-sm text-gray-500">Aeronave: {segment.aircraft.code}</p>
                        </div>
                        <Badge className="self-start md:self-center mt-2 md:mt-0">
                          {formatDuration(segment.duration)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Partida */}
                        <div>
                          <p className="text-sm text-gray-500">Partida</p>
                          <p className="text-xl font-bold">{format(departureTime, "HH:mm")}</p>
                          <p className="font-medium">
                            {segment.departure.iataCode} - {airportCities[segment.departure.iataCode] || ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(departureTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>

                        {/* Chegada */}
                        <div>
                          <p className="text-sm text-gray-500">Chegada</p>
                          <p className="text-xl font-bold">
                            {format(arrivalTime, "HH:mm")}
                            {segment.arrival.terminal && ` · Terminal ${segment.arrival.terminal}`}
                          </p>
                          <p className="font-medium">
                            {segment.arrival.iataCode} - {airportCities[segment.arrival.iataCode] || ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(arrivalTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isLastSegment && (
                    <div className="ml-12 my-4">
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                        <Timer className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Conexão em {airportCities[segment.arrival.iataCode]}</p>
                          <p className="text-xs text-gray-500">
                            {formatDuration(
                              `PT${Math.floor((parseISO(flightOffer.fullOffer.itineraries[0].segments[index + 1].departure.at).getTime() - arrivalTime.getTime()) / 60000)}M`,
                            )}{" "}
                            de espera
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLastSegment && <div className="mb-4"></div>}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Detalhes da Tarifa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Detalhes da Tarifa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flightOffer.fullOffer.travelerPricings[0].fareDetailsBySegment.map((fareDetail: any, index: number) => {
                  const segment = flightOffer.fullOffer.itineraries[0].segments[index]
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">
                            {segment.departure.iataCode} → {segment.arrival.iataCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {airlineNames[segment.carrierCode]} {segment.carrierCode}
                            {segment.number}
                          </p>
                        </div>
                        <Badge variant="outline">{fareDetail.brandedFare}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Classe</p>
                          <p className="font-medium">{fareDetail.cabin}</p>
                          <p className="text-xs text-gray-500">Classe {fareDetail.class}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Bagagem de Mão</p>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-gray-700" />
                            <p className="font-medium">{fareDetail.includedCabinBags.quantity} item</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Bagagem Despachada</p>
                          <div className="flex items-center gap-1">
                            <Luggage className="h-4 w-4 text-gray-700" />
                            <p className="font-medium">
                              {fareDetail.includedCheckedBags.quantity > 0
                                ? `${fareDetail.includedCheckedBags.quantity} mala(s)`
                                : "Não incluída"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {!hasCheckedBaggage && (
                <Alert variant="default" className="mt-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Esta tarifa não inclui bagagem despachada. Você precisará pagar separadamente caso necessite
                    despachar malas.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Resumo de Preços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Resumo de Preços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Tarifa base</p>
                  <p>{formatCurrency(String(flightOffer.price))}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Taxas e encargos</p>
                  <p>
                    {formatCurrency(
                      (
                        Number.parseFloat(flightOffer.price.toString()) - Number.parseFloat(flightOffer.price.toString())
                      ).toString(),
                    )}
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p className="text-xl">{formatCurrency(flightOffer.price.toString())}</p>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Preço por passageiro: {flightOffer.fullOffer.travelerPricings[0].travelerType}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full" size="lg" onClick={handlePurchase} disabled={isLoading}>
                {isLoading ? "Processando..." : "Comprar Agora"}
              </Button>

              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <Info className="h-3 w-3" />
                <p>Data limite para emissão: {formattedLastTicketingDate}</p>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Companhia Emissora</p>
                  <p className="text-gray-600">
                    {airlineNames[flightOffer.fullOffer.validatingAirlineCodes[0]] || flightOffer.fullOffer.validatingAirlineCodes[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Assentos Disponíveis</p>
                  <p className="text-gray-600">{flightOffer.fullOffer.numberOfBookableSeats}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Tipo de Tarifa</p>
                  <p className="text-gray-600">{flightOffer.fullOffer.travelerPricings[0].fareOption}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Fonte da Oferta</p>
                  <p className="text-gray-600">{flightOffer.fullOffer.source}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { Separator } from "@radix-ui/react-separator";
import { PlaneIcon, ClockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Flight } from "@/@types/flight";
import { Badge } from "./ui/badge";
import { formatPrice } from "@/util/formatPrice";
import type { SearchParamsProps } from "@/@types/searchParams";

interface FlightCardProps {
  flight: Flight
  params: SearchParamsProps
}

export function FlightCard({ flight, params }: FlightCardProps) {
  async function handlePurchaseFlight() {
    localStorage.setItem('flight', JSON.stringify(flight))
    window.location.href = '/purchase'
  }
  console.log({ flight })
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <PlaneIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{flight.airline}</p>
                  <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                </div>
              </div>
              {flight.stops === 0 ? (
                <Badge variant="secondary">Direto</Badge>
              ) : (
                <Badge variant="outline">
                  {flight.stops} parada{flight.stops > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.departure.time}</p>
                <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                <p className="text-sm text-gray-600">{flight.departure.city}</p>
              </div>

              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{flight.duration}</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">{flight.arrival.time}</p>
                <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                <p className="text-sm text-gray-600">{flight.arrival.city}</p>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-24" />

          <div className="text-center lg:text-right space-y-2">
            <div>
              <p className="text-3xl font-bold text-green-600">{formatPrice(flight.price)}</p>
              <p className="text-sm text-gray-600">por {params.passengers} pessoa</p>
            </div>
            <Button onClick={handlePurchaseFlight} className="w-full lg:w-auto">Selecionar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaneIcon } from "lucide-react";
import { api } from "@/services/axios";
import { Header } from "@/components/header";
import { SearchForm } from "@/components/searchForm";
import type { SearchParamsProps } from "@/@types/searchParams";
import type { Flight } from "@/@types/flight";
import { mapFlightData } from "@/util/mapFlightData";
import { Loading } from "@/components/loading";
import { FlightCard } from "@/components/flightCard";

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useState<SearchParamsProps>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    fareOption: "",
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = buildSearchBody(searchParams);
      const apiData = await fetchFlightData(params);
      const mappedFlights = mapFlightData(apiData);

      mappedFlights.sort((a, b) => a.price - b.price);
      setFlights(mappedFlights);
    } catch (error: any) {
      console.error("Erro ao buscar voos:", error.response ?? error.message);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  }

  function buildSearchBody(params: SearchParamsProps) {
    return {
      currencyCode: "BRL",
      originDestinations: [
        {
          id: "1",
          originLocationCode: params.origin.toUpperCase(),
          destinationLocationCode: params.destination.toUpperCase(),
          departureDateTimeRange: {
            date: params.departureDate,
          },
        }
      ],
      travelers: [
        {
          id: "1",
          travelerType: "ADULT"
        }
      ],
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 50
      },
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: params.fareOption,
          travelerType: "ADULT"
        }
      ]
    };
  }


  async function fetchFlightData(params: Record<string, any>) {
    const response = await api.post("/flight-offers", params);
    return response.data;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <SearchForm isLoading={isLoading} handleSearch={handleSearch} searchParams={searchParams} setSearchParams={setSearchParams} />

        {isLoading && (
          <Loading />
        )}

        {hasSearched && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {flights.length > 0
                  ? `${flights.length} voos encontrados`
                  : "Nenhum voo encontrado"}
              </h2>
              {flights.length > 0 && <Badge variant="default">Ordenado por menor preço</Badge>}
            </div>

            {flights.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum voo encontrado</h3>
                  <p className="text-gray-600">Tente ajustar seus critérios de busca.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <FlightCard params={searchParams} key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

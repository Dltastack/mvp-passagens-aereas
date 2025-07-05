"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaneIcon } from "lucide-react"
import { Header } from "@/components/header"
import { SearchForm } from "@/components/searchForm"
import type { SearchParamsProps } from "@/@types/searchParams"
import type { AvailabilityData } from "@/@types/flight"
import { Loading } from "@/components/loading"
import { FlightCard } from "@/components/flightCard"
import { searchFlights } from "@/serverActions/searchFlights"

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useState<SearchParamsProps>({
    destination: [],
    continent: ''
  })
  const [flights, setFlights] = useState<AvailabilityData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setHasSearched(true)

    try {
      const { data } = await searchFlights(searchParams)
      setFlights(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchStart = () => {
    setIsLoading(true)
    setHasSearched(true)
  }

  const handleSearchComplete = (searchResults: AvailabilityData[]) => {
    setFlights(searchResults)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <SearchForm
          isLoading={isLoading}
          handleSearch={handleSearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearchComplete={handleSearchComplete}
          onSearchStart={handleSearchStart}
        />

        {isLoading && <Loading />}

        {hasSearched && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {flights.length > 0 ? `${flights.length} voos encontrados` : "Nenhum voo encontrado"}
              </h2>
              {flights.length > 0 && (
                <div className="flex items-center gap-3">
                  <Badge variant="default">Ordenado por menor preço</Badge>
                  <div className="text-sm text-gray-600">
                    {flights.length} resultado{flights.length > 1 ? "s" : ""}
                  </div>
                </div>
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {flights.map((flight) => (
                  <FlightCard params={searchParams} key={flight.ID} flight={flight} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { PlaneIcon, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import type { SearchParamsProps } from "@/@types/searchParams"
import type { Dispatch, FormEvent, SetStateAction } from "react"
import { DestinationSelector } from "./destinationSelector"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SearchFormProps {
  handleSearch: (e: FormEvent) => Promise<void>
  setSearchParams: Dispatch<SetStateAction<SearchParamsProps>>
  searchParams: SearchParamsProps
  isLoading: boolean
  onSearchComplete?: (flights: any[]) => void
  onSearchStart?: () => void
}

export function SearchForm({ handleSearch, setSearchParams, isLoading, onSearchComplete, onSearchStart }: SearchFormProps) {
  const [selectedDestination, setSelectedDestination] = useState<{
    code: string[]
    city: string
    country: string
    continent: string
  } | null>(null)

  const handleDestinationSelect = (destination: {
    code: string[]
    city: string
    country: string
    continent: string
  }) => {
    setSelectedDestination(destination)
    setSearchParams((prev) => ({ ...prev, destination: destination.code, continent: destination.continent }))
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-none bg-white">
        <CardContent className="p-4">
          {/* Header compacto */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <PlaneIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Buscar Voos</h2>
            </div>
            <Badge variant="outline" className="text-xs px-2 py-1 text-blue-600 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Melhores Preços
            </Badge>
          </div>

          <p className="text-gray-600 text-sm mb-4">Encontre as melhores ofertas de voos para o seu destino</p>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Seletor de Destino - Sempre Visível */}
            <Card className="bg-zinc-50">
              <CardContent className="p-0">
                <DestinationSelector
                  onDestinationSelect={handleDestinationSelect}
                  onClose={() => { }}
                  onSearchComplete={onSearchComplete}
                  onSearchStart={onSearchStart}
                />
              </CardContent>
            </Card>

            {/* Footer compacto */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Busca em tempo real nas melhores companhias aéreas</span>
              </div>


              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      type="submit"
                      className="px-4 h-9 text-sm bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Buscando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <PlaneIcon className="h-3 w-3" />
                          <span>Buscar Voos</span>
                        </div>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {(isLoading || !selectedDestination) && (
                  <TooltipContent>
                    {isLoading
                      ? "Aguarde, estamos buscando os voos..."
                      : "Selecione um destino para buscar voos"}
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

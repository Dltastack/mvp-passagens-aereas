"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { PlaneIcon, CalendarIcon, TicketIcon, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import type { SearchParamsProps } from "@/@types/searchParams"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { SOURCE_MILES } from "@/CONSTANTS/SOURCE_MILES"

interface SearchFormProps {
  handleSearch: (e: React.FormEvent) => Promise<void>
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>
  searchParams: SearchParamsProps
  isLoading: boolean
}

export function SearchForm({ handleSearch, searchParams, setSearchParams, isLoading }: SearchFormProps) {
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <Card className="mb-6 border border-gray-200 shadow-none bg-white">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <TicketIcon className="h-3 w-3 text-purple-500" />
                Programa de Milhas
              </Label>
              <Select
                value={searchParams.source}
                onValueChange={(value) => setSearchParams((prev) => ({ ...prev, source: value }))}
              >
                <SelectTrigger className="h-9 text-sm border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <SelectValue placeholder="Selecione o programa" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_MILES.map((mile) => (
                    <SelectItem key={mile} value={mile} className="text-sm">
                      {mile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Escolha seu programa de fidelidade</p>
            </div>

            {/* <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Origem
              </Label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <Input
                  placeholder="Ex: GRU, SAO"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, origin: e.target.value.toUpperCase() }))}
                  className="pl-6 h-9 text-sm border-gray-200"
                  required
                  maxLength={3}
                />
              </div>
              <p className="text-xs text-gray-500">Código IATA do aeroporto</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Destino
              </Label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
                <Input
                  placeholder="Ex: RIO, GIG"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, destination: e.target.value.toUpperCase() }))}
                  className="pl-6 h-9 text-sm border-gray-200"
                  required
                  maxLength={3}
                />
              </div>
              <p className="text-xs text-gray-500">Código IATA do aeroporto</p>
            </div> */}

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-purple-500" />
                Data de Ida
              </Label>
              <Input
                type="date"
                min={getMinDate()}
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, departureDate: e.target.value }))}
                className="h-9 text-sm border-gray-200"
                required={false}
              />
              <p className="text-xs text-gray-500">Selecione a data de partida</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-purple-500" />
                Data de Volta
              </Label>
              <Input
                type="date"
                min={getMinDate()}
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, returnDate: e.target.value }))}
                className="h-9 text-sm border-gray-200"
                required={false}
              />
              <p className="text-xs text-gray-500">Selecione a data de volta</p>
            </div>
          </div>

          {/* Footer compacto */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>Busca em tempo real nas melhores companhias aéreas</span>
            </div>

            <Button type="submit" className="px-4 h-9 text-sm bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
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
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

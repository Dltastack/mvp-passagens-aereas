"use client"

import type React from "react"
import { PlaneIcon, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import type { SearchParamsProps } from "@/@types/searchParams"


interface SearchFormProps {
  handleSearch: (e: React.FormEvent) => Promise<void>
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>
  searchParams: SearchParamsProps
  isLoading: boolean
}

export function SearchForm({ handleSearch, isLoading }: SearchFormProps) {

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
            {/* ADICIONAR OS FILTROS AQUI */}
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

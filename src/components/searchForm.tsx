import { Label } from "@radix-ui/react-label";
import { PlaneIcon, MapPinIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import type { SearchParamsProps } from "@/@types/searchParams";

interface SearchFormProps {
  handleSearch: (e: React.FormEvent) => Promise<void>
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>
  searchParams: SearchParamsProps
  isLoading: boolean
}

export function SearchForm({ handleSearch, searchParams, setSearchParams, isLoading }: SearchFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlaneIcon className="h-5 w-5" />
          Buscar Voos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origem (IATA)</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="origin"
                  placeholder="Ex: GRU"
                  value={searchParams.origin}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, origin: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino (IATA)</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="Ex: OPS"
                  value={searchParams.destination}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, destination: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure">Data de Ida</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="departure"
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, departureDate: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers">Passageiros</Label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, passengers: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fareOption">Tipo de Tarifa</Label>
              <select
                id="fareOption"
                value={searchParams.fareOption}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, fareOption: e.target.value }))
                }
                className="w-full pl-3 pr-10 py-2 border rounded-md bg-white text-sm text-gray-900"
              >
                <option value="STANDARD">Padrão</option>
                <option value="INCLUSIVE_TOUR">Tour Incluso</option>
                <option value="COMPANION">Acompanhante</option>
                <option value="AIR_FRANCE_FAMILY">Família (Air France)</option>
                {/* adicione outras se quiser */}
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading ? "Buscando..." : "Buscar Voos"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
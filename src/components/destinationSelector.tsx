"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MapPinIcon, GlobeIcon, ChevronRightIcon } from "lucide-react"
import { cities, continents, countries } from "@/CONSTANTS/DESTINATIONS"

interface DestinationSelectorProps {
  onDestinationSelect: (destination: { code: string[]; city: string; country: string; continent: string }) => void
  onClose: () => void
}

export function DestinationSelector({ onDestinationSelect }: DestinationSelectorProps) {
  const [selectedContinent, setSelectedContinent] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [step, setStep] = useState<"continent" | "country" | "city">("continent")

  const handleContinentSelect = (continentId: string) => {
    setSelectedContinent(continentId)
    setStep("country")
  }

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId)
    setStep("city")
  }

  const handleCitySelect = (city: { code: string[]; name: string }) => {
    const continent = continents.find((c) => c.id === selectedContinent)
    const country = countries[selectedContinent as keyof typeof countries]?.find((c) => c.id === selectedCountry)

    onDestinationSelect({
      code: city.code,
      city: city.name,
      country: country?.name || "",
      continent: continent?.id || "",
    })

    // Reset para permitir nova seleção
    setStep("continent")
    setSelectedContinent("")
    setSelectedCountry("")
  }

  const handleBack = () => {
    if (step === "city") {
      setStep("country")
      setSelectedCountry("")
    } else if (step === "country") {
      setStep("continent")
      setSelectedContinent("")
    }
  }

  return (
    <div className="w-full p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      {/* Header sem botão de fechar */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
            <GlobeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
            Selecione o destino que deseja viajar em 3 cliques
          </h3>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Badge
          variant={step === "continent" ? "default" : "secondary"}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
        >
          1. Continente
        </Badge>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        <Badge
          variant={step === "country" ? "default" : "secondary"}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
        >
          2. País
        </Badge>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        <Badge
          variant={step === "city" ? "default" : "secondary"}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium"
        >
          3. Cidade
        </Badge>
      </div>

      {/* Back Button */}
      {step !== "continent" && (
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button
            variant="outline"
            type="button"
            onClick={handleBack}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-transparent"
          >
            ← Voltar
          </Button>
        </div>
      )}

      {/* Step 1: Continents */}
      {step === "continent" && (
        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-base sm:text-lg font-semibold text-center text-gray-800">Selecione o continente</h4>

          {/* Mobile: Grid 2 colunas */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              {continents.map((continent) => (
                <Button
                  key={continent.id}
                  onClick={() => handleContinentSelect(continent.id)}
                  className={`${continent.color} text-white font-semibold h-16 text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg`}
                >
                  <span className="text-center leading-tight break-words">{continent.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop: Flex centralizado */}
          <div className="hidden sm:flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
              {continents.map((continent) => (
                <Button
                  key={continent.id}
                  onClick={() => handleContinentSelect(continent.id)}
                  className={`${continent.color} text-white font-semibold h-16 text-sm px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg min-w-[140px]`}
                >
                  <span className="text-center leading-tight break-words">{continent.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Countries */}
      {step === "country" && selectedContinent && (
        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-base sm:text-lg font-semibold text-center text-gray-800">Selecione o país</h4>

          {/* Mobile: Grid 2 colunas */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              {countries[selectedContinent as keyof typeof countries]?.map((country: { id: string; name: string }) => (
                <Button
                  key={country.id}
                  onClick={() => handleCountrySelect(country.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold h-14 text-sm rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <span className="break-words text-center">{country.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop: Flex centralizado */}
          <div className="hidden sm:flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
              {countries[selectedContinent as keyof typeof countries]?.map((country: { id: string; name: string }) => (
                <Button
                  key={country.id}
                  onClick={() => handleCountrySelect(country.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold h-12 text-sm rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg min-w-[120px]"
                >
                  <span className="break-words text-center">{country.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Cities */}
      {step === "city" && selectedCountry && (
        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-base sm:text-lg font-semibold text-center text-gray-800">Selecione a cidade</h4>

          {/* Mobile: Grid 1 coluna */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {cities[selectedCountry as keyof typeof cities]?.map((city) => (
                <Button
                  key={city.code[0]}
                  onClick={() => handleCitySelect(city)}
                  variant="ghost"
                  className="justify-start h-12 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300 rounded-lg"
                >
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="font-medium break-words text-left">{city.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop: Grid centralizado */}
          <div className="hidden sm:block">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-80 overflow-y-auto max-w-5xl w-full">
                {cities[selectedCountry as keyof typeof cities]?.map((city) => (
                  <Button
                    key={city.code[0]}
                    onClick={() => handleCitySelect(city)}
                    variant="ghost"
                    className="justify-start h-12 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300 rounded-lg"
                  >
                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="font-medium break-words text-left">{city.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

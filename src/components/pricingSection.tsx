import type { SearchParamsProps } from "@/@types/searchParams"
import type { ClassInfo } from "./classSelectButton"
import { StarIcon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { formatMileageCost } from "@/util/formatMileageCost"
import { formatTaxes } from "@/util/formatTaxes"

interface PricingSectionProps {
  selectedClassInfo: ClassInfo,
  isSelectedBestPrice: boolean,
  currency: string,
  params: SearchParamsProps,
  isLoading: boolean,
  handlePurchaseFlight: () => void,
}

export function PricingSection({ selectedClassInfo, isSelectedBestPrice, currency, params, isLoading, handlePurchaseFlight }: PricingSectionProps) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-lg p-3 border border-gray-100 mt-auto">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">{selectedClassInfo.name}</span>
          {isSelectedBestPrice && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <StarIcon className="h-2.5 w-2.5 fill-current" />
              <span>Melhor preço</span>
            </div>
          )}
        </div>
        {selectedClassInfo.available && selectedClassInfo.mileageCostRaw > 0 ? (
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900">
                {formatMileageCost(selectedClassInfo.mileageCost, selectedClassInfo.mileageCostRaw)}
              </span>
              <span className="text-xs text-gray-600 font-medium">milhas</span>
            </div>
            <div className="text-xs text-gray-500">+ {formatTaxes(selectedClassInfo.totalTaxes, currency)}</div>
            <div className="text-xs text-gray-500">
              para {params.passengers} passageiro{Number(params.passengers) > 1 ? "s" : ""}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-medium">Indisponível</span>
            <XIcon className="h-3 w-3 text-gray-400" />
          </div>
        )}
        <Button
          onClick={handlePurchaseFlight}
          disabled={isLoading || !selectedClassInfo.available || selectedClassInfo.mileageCostRaw === 0}
          className="w-full h-8 text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>...</span>
            </div>
          ) : (
            "Selecionar"
          )}
        </Button>
      </div>
    </div>
  )
}
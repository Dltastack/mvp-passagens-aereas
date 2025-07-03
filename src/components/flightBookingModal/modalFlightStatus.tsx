import { AIRLINE_INFO } from "@/CONSTANTS/AIRLINE_INFO";
import { ArrowRightIcon, PlaneIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from '@/components/ui/badge'
interface FlightStatusProps {
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  airline: string
  selectedClass: {
    name: string
    code: string
    mileageCost: string
    mileageCostRaw: number
    totalTaxes: number
    airlines: string
    available: boolean
    bgColor: string
    color: string
    icon: string
    isDirect: boolean
    remainingSeats: number
    shortName: string
  }
}

export function ModalFlightStatus({ airline, destination, destinationCity, origin, originCity, selectedClass }: FlightStatusProps) {
  return (
    <Card className="border-2 border-gray-100 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Origem */}
          <div className="text-center flex-1 p-6">
            <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">ORIGEM</div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{origin}</div>
            <div className="text-lg lg:text-xl text-gray-700 font-semibold">{originCity}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Brasil</div>
          </div>

          {/* Companhias Aéreas - Seção Central Melhorada */}
          <div className="flex flex-col items-center border px-6 lg:px-8 py-6 flex-2 bg-gradient-to-b from-blue-50/50 to-indigo-50/50">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRightIcon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Classe Selecionada */}
            <div className="mb-4 flex flex-col items-center">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-semibold w-fit mx-auto">
                Classe: {selectedClass.name}
              </Badge>
            </div>

            <div className="text-center space-y-3 w-full max-w-xs">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Companhias Aéreas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {airline
                  .split(",")
                  .map((code) => code.trim())
                  .slice(0, 4)
                  .map((airlineCode, idx) => (
                    <div
                      key={airlineCode + idx}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <PlaneIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">
                          {AIRLINE_INFO[airlineCode] || airlineCode}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{airlineCode}</div>
                      </div>
                    </div>
                  ))}
              </div>

              {airline.split(",").length > 4 && (
                <div className="text-xs text-gray-500 font-medium mt-2">
                  +{airline.split(",").length - 4} outras companhias
                </div>
              )}
            </div>
          </div>

          {/* Destino */}
          <div className="text-center flex-1 p-6">
            <div className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">DESTINO</div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{destination}</div>
            <div className="text-lg lg:text-xl text-gray-700 font-semibold">{destinationCity}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Internacional</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
import { PlaneIcon } from "lucide-react"

interface RouterHeaderProps {
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  distance: number
}

export function RouteHeader({ origin, originCity, destination, destinationCity, distance }: RouterHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <div className="font-bold text-lg text-gray-900">{origin}</div>
        <div className="text-xs text-gray-500 truncate max-w-[60px]">{originCity}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
          <PlaneIcon className="h-4 w-4 text-white transform rotate-45" />
        </div>
        <div className="text-xs text-gray-400 font-medium">{distance}km</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-lg text-gray-900">{destination}</div>
        <div className="text-xs text-gray-500 truncate max-w-[60px]">{destinationCity}</div>
      </div>
    </div>
  )
}

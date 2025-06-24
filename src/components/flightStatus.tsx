import { ClockIcon } from "lucide-react"
import { Badge } from "./ui/badge"

interface FlightStatusProps {
  date: string
  isDirect: boolean
  availabilityStatus: {
    text: string
    color: string
    bg: string
  }
}

export function FlightStatus({ date, isDirect, availabilityStatus }: FlightStatusProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-gray-600">
        <ClockIcon className="h-3 w-3" />
        <span className="font-medium">{date}</span>
      </div>
      <div className="flex gap-1">
        {isDirect && (
          <Badge
            variant="secondary"
            className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200"
          >
            Direto
          </Badge>
        )}
        <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${availabilityStatus.bg} ${availabilityStatus.color}`}>
          {availabilityStatus.text}
        </div>
      </div>
    </div>
  )
}

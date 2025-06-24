import { CheckIcon, XIcon } from "lucide-react"

export interface ClassInfo {
  name: string
  shortName: string
  code: string
  available: boolean
  remainingSeats: number
  mileageCost: string
  mileageCostRaw: number
  totalTaxes: number
  airlines: string
  isDirect: boolean
  icon: string
  color: string
  bgColor: string
}

interface ClassSelectButtonProps {
  classInfo: ClassInfo
  isSelected: boolean
  onClick: () => void
}

export function ClassSelectButton({ classInfo, isSelected, onClick }: ClassSelectButtonProps) {
  const isAvailable = classInfo.available && classInfo.mileageCostRaw > 0
  return (
    <button
      className={`
        relative px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
        ${isSelected
          ? isAvailable
            ? `${classInfo.bgColor} ${classInfo.color} border-current shadow-sm`
            : "bg-gray-100 text-gray-500 border-gray-300"
          : isAvailable
            ? "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm"
            : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
        }
      `}
      onClick={onClick}
      disabled={!isAvailable}
    >
      <div className="flex items-center justify-center gap-1">
        <span className="text-xs">{classInfo.icon}</span>
        <span className="truncate">{classInfo.shortName}</span>
        {isAvailable ? <CheckIcon className="h-2.5 w-2.5" /> : <XIcon className="h-2.5 w-2.5" />}
      </div>
    </button>
  )
}
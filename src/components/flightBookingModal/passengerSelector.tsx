import { UserIcon, UsersIcon, MinusIcon, PlusIcon, BabyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import type { Dispatch, SetStateAction } from "react";

interface PassengerCounts {
  adults: number
  children: number
  babies: number
}

interface PassengerSelectorProps {
  setPassengers: Dispatch<SetStateAction<PassengerCounts>>
  passengers: PassengerCounts
}

export function PassengerSelector({ setPassengers, passengers }: PassengerSelectorProps) {
  const updatePassengerCount = (type: keyof PassengerCounts, increment: boolean) => {
    setPassengers((prev) => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)

      if (type === "adults") {
        return { ...prev, [type]: Math.max(1, Math.min(9, newCount)) }
      }

      return { ...prev, [type]: Math.max(0, Math.min(9, newCount)) }
    })
  }

  return (
    <Card className="border-2 border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-blue-600" />
          </div>
          Passageiros
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Adultos */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900">Adultos</Label>
                <p className="text-sm text-gray-600">12+ anos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("adults", false)}
                disabled={passengers.adults <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold text-lg">{passengers.adults}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("adults", true)}
                disabled={passengers.adults >= 9}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Crianças */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900">Crianças</Label>
                <p className="text-sm text-gray-600">2-12 anos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("children", false)}
                disabled={passengers.children <= 0}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold text-lg">{passengers.children}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("children", true)}
                disabled={passengers.children >= 9}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bebês */}
          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <BabyIcon className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900">Bebês</Label>
                <p className="text-sm text-gray-600">0-2 anos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("babies", false)}
                disabled={passengers.babies <= 0}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold text-lg">{passengers.babies}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 bg-transparent"
                onClick={() => updatePassengerCount("babies", true)}
                disabled={passengers.babies >= 9}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
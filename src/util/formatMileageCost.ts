export function formatMileageCost(mileageCost: string, mileageCostRaw: number) {
  if (mileageCost && mileageCost !== "0") {
    return mileageCost
  }
  return mileageCostRaw.toLocaleString()
}
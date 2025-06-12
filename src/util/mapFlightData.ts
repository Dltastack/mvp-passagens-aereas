import type { Flight } from "@/@types/flight";
import { formatDuration } from "./formatDuration";

export function mapFlightData(apiData: any): Flight[] {
  const { data: offers, dictionaries } = apiData;
  const { carriers: dictCarriers, aircraft: dictAircraft, locations: dictLocations } = dictionaries;

  return offers.map((offer: any) => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    const [depDate, depTime] = String(firstSegment.departure.at).split("T");
    const [arrDate, arrTime] = String(lastSegment.arrival.at).split("T");
    const stopsCount = segments.length - 1;

    const travelerPricing = offer.travelerPricings?.[0];
    const fareDetails = travelerPricing?.fareDetailsBySegment?.map((fd: any) => ({
      segmentId: fd.segmentId,
      cabin: fd.cabin,
      class: fd.class,
      brandedFare: fd.brandedFare,
      fareBasis: fd.fareBasis,
      includedCabinBags: fd.includedCabinBags?.quantity ?? 0,
      includedCheckedBags: fd.includedCheckedBags?.quantity ?? 0
    })) ?? [];

    return {
      id: offer.id,
      validatingAirlineCode: offer.validatingAirlineCodes?.[0],
      airline: dictCarriers[offer.validatingAirlineCodes?.[0]] || offer.validatingAirlineCodes?.[0],
      flightNumber: segments.map((seg: any) => `${seg.carrierCode}${seg.number}`).join(" / "),
      departure: {
        airport: firstSegment.departure.iataCode,
        city: dictLocations[firstSegment.departure.iataCode]?.cityCode || firstSegment.departure.iataCode,
        time: depTime.slice(0, 5),
        date: depDate,
      },
      arrival: {
        airport: lastSegment.arrival.iataCode,
        city: dictLocations[lastSegment.arrival.iataCode]?.cityCode || lastSegment.arrival.iataCode,
        time: arrTime.slice(0, 5),
        date: arrDate,
      },
      duration: formatDuration(itinerary.duration),
      price: parseFloat(offer.price.grandTotal),
      currency: offer.price.currency,
      stops: stopsCount,
      aircraft: segments.map((seg: any) => dictAircraft[seg.aircraft.code] || seg.aircraft.code).join(", "),
      lastTicketingDate: offer.lastTicketingDate,
      fareDetails,
      fullOffer: offer // salva a oferta inteira para usar depois na compra
    };
  });
}

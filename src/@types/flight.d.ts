export type Currency = 'BRL' | 'USD' | 'EUR';

export type FareType = 'PUBLISHED' | 'NEGOTIATED' | 'CORPORATE';

export type TravelerType = 'ADULT' | 'CHILD' | 'SENIOR' | 'YOUNG' | 'DISABLED' | 'DISABLED_CHILD' | 'HELPER' | 'SEATED_INFANT' | 'STUDENT';

export interface Location {
  iataCode: string;
  at: string;
  terminal?: string;
  airport: string
  city: string
  date: Date
  time: string
}

export interface Aircraft {
  code: string;
}

export interface OperatingCarrier {
  carrierCode: string;
}

export interface Fee {
  amount: string;
  type: 'SUPPLIER' | 'TICKETING';
}

export interface Money {
  currency: Currency;
  total: string;
  base: string;
  grandTotal?: string;
  fees?: Fee[];
}

export interface BaggageAllowance {
  quantity: number;
}

export interface FareDetailsSegment {
  segmentId: string;
  cabin: string;
  class: string;
  brandedFare: string;
  brandedFareLabel?: string;
  fareBasis: string;
  includedCabinBags?: BaggageAllowance;
  includedCheckedBags?: BaggageAllowance;
}

export interface Segment {
  id: string;
  departure: Location;
  arrival: Location;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: OperatingCarrier;
  duration: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface PricingOptions {
  fareType: FareType[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: TravelerType;
  price: Money;
  fareDetailsBySegment: FareDetailsSegment[];
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Money;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Flight {
  id: string;
  airline: string;
  validatingAirlineCode: string;
  flightNumber: string;
  departure: Location;
  arrival: Location;
  duration: string;
  price: number;
  currency: Currency;
  stops: number;
  aircraft: string;
  lastTicketingDate: string;
  fareDetails: FareDetailsSegment[];
  fullOffer: FlightOffer;
}
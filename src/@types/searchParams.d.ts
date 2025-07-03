export interface SearchParamsProps {
  cabin?: string;
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  passengers: string
  fareOption: string;
  source: string;
  start_date?: string;
  end_date?: string;
  take?: number;
  skip?: number;
}
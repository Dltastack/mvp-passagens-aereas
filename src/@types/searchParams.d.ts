export interface SearchParamsProps {
  cabin?: string;
  origin: string
  destination: string[]
  source?: string;
  start_date?: string;
  end_date?: string;
  take?: number;
  skip?: number;
  continent: string;
}
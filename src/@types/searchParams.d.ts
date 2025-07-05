export interface SearchParamsProps {
  cabin?: string;
  destination: string[]
  source?: string;
  start_date?: string;
  end_date?: string;
  take?: number;
  skip?: number;
  continent: string;
}
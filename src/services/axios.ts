import axios from "axios";
import { getAccessToken } from "./amadeusAuth";

const BASE_URL = process.env.NEXT_PUBLIC_AMADEUS_API_URL
  ? process.env.NEXT_PUBLIC_AMADEUS_API_URL.replace("/v1/shopping", "/v2/shopping")
  : "https://test.api.amadeus.com/v2/shopping";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;

async function ensureTokenValid() {
  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt && now < tokenExpiresAt - 60 * 1000) {
    return cachedAccessToken;
  }
  const newToken = await getAccessToken();
  cachedAccessToken = newToken;
  tokenExpiresAt = now + 3600 * 1000;
  return newToken;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/vnd.amadeus+json",
    Accept: "application/vnd.amadeus+json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await ensureTokenValid();
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


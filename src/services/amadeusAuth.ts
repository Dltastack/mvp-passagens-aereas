import axios from "axios";

const authClient = axios.create({
  baseURL: "https://test.api.amadeus.com",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});
export async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.NEXT_PUBLIC_AMADEUS_API_KEY!);
  params.append("client_secret", process.env.NEXT_PUBLIC_AMADEUS_API_SECRET!);

  const response = await authClient.post("/v1/security/oauth2/token", params);
  return response.data.access_token;
}

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    accept: 'application/json',
    'Partner-Authorization': process.env.SEATS_AERO_API_KEY
  },
});
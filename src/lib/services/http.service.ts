import axios from "axios";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public"
import { setupCache } from "axios-cache-interceptor";

export const genius = setupCache(
  axios.create({
    baseURL: `${browser ? "/api/proxy?endpoint=" : ""}https://api.genius.com`,
    headers: {
      Authorization: `Bearer ${env.PUBLIC_GENIUS_CLIENT_ACCESS_TOKEN}`,
    },
  })
);

export const audio = axios.create({
  baseURL: `/api/audio`,
});


import axios from "axios";
import type { PhotosResponse } from "../hooks/usePhotos";
import { mockFetchPhotos } from "../mocks/flickrAdapter";
import { toast } from "sonner";

declare global {
  interface Window {
    __env__?: Record<string, string>;
  }
}

function getEnv(key: string): string {
  return window.__env__?.[key] ?? (import.meta.env[key] as string) ?? "";
}

export const api = axios.create({
  baseURL: getEnv("VITE_JOB_SERVICE_URL") ?? "/",
});

export { getEnv };

// MOCK MODE — to test front-end indendently from backend

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export async function fetchPhotosCompat(
  offset: number,
  limit: number,
): Promise<PhotosResponse> {
  if (USE_MOCK) {
    return mockFetchPhotos(offset, limit);
  }

  const { data } = await api.get<PhotosResponse>("/photos", {
    params: { limit, offset },
  });

  if (!data?.photos) {
    toast.info("Réponse du serveur invalide, vérifiez l'url de l'API");
    return {
      photos: [],
      total: 0,
    };
  }

  return data;
}

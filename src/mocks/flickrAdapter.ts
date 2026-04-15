import type { PhotosResponse } from '../hooks/usePhotos'

const PHOTO_URL =
  'https://live.staticflickr.com/65535/55204653200_b136eb8c2f_c.jpg'

const ALL_PHOTOS = Array.from({ length: 100 }, (_, i) => ({
  key: `low/mock-photo-${i.toString().padStart(3, '0')}.jpg`,
  url: PHOTO_URL,
}))

export async function mockFetchPhotos(
  offset: number,
  limit: number
): Promise<PhotosResponse> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 300))
  return {
    photos: ALL_PHOTOS.slice(offset, offset + limit),
    total: ALL_PHOTOS.length,
  }
}
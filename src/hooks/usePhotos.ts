import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export const BATCH_SIZE = 20

export interface Photo {
  key: string
  url: string
}

export interface PhotosResponse {
  photos: Photo[]
  total: number
}

export async function fetchPhotos(offset: number): Promise<PhotosResponse> {
  const { data } = await api.get<PhotosResponse>('/photos', {
    params: { limit: BATCH_SIZE, offset },
  })
  return data
}

export function useInfinitePhotos() {
  return useInfiniteQuery({
    queryKey: ['photos'],
    queryFn: ({ pageParam = 0 }) => fetchPhotos(pageParam as number),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(p => p.photos).length
      return loaded < lastPage.total ? loaded : undefined
    },
  })
}
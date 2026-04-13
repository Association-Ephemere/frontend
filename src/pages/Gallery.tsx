import { useEffect, useRef, useCallback, useState } from 'react'
import { useInfinitePhotos, fetchPhotos, type Photo } from '../hooks/usePhotos'

import PhotoCard from '../components/PhotoCard'
import { useTicket } from '../hooks/useTicket'

function dedup(photos: Photo[]): Photo[] {
  const seen = new Set<string>()
  return photos.filter(p => {
    if (seen.has(p.key)) return false
    seen.add(p.key)
    return true
  })
}

export default function Gallery() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfinitePhotos()
  const { increment, decrement, getQty } = useTicket()

  // All photos: polled top + infinite scroll pages
  const [topPhotos, setTopPhotos] = useState<Photo[]>([])
  const scrollPages = data?.pages.flatMap(p => p.photos) ?? []

  // Merged and deduped list: top-polled first, then pages
  const allPhotos = dedup([...topPhotos, ...scrollPages])

  // Polling: prepend new photos without scroll jump
  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await fetchPhotos(0)
      setTopPhotos(prev => {
        const existingKeys = new Set(allPhotos.map(p => p.key))
        const newOnes = fresh.photos.filter(p => !existingKeys.has(p.key))
        return newOnes.length > 0 ? [...newOnes, ...prev] : prev
      })
    }, Number(import.meta.env.VITE_PHOTO_REFRESH_INTERVAL) || 10000)
    return () => clearInterval(interval)
  }, [allPhotos])

  const observer = useRef<IntersectionObserver | null>(null)

  const handleSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect()
      if (!node) return
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }, { rootMargin: '200px' })
      observer.current.observe(node)
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  if (status === 'pending') {
    return (
      <main className="p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-stone-200 animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="p-6 text-red-500">
        Error. Cannot load photos. Try refreshing? If the problem persists, check the console for details.
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {allPhotos.map(photo => (
          <PhotoCard
            key={photo.key}
            photo={photo}
            qty={getQty(photo.key)}
            onIncrement={() => increment(photo.key)}
            onDecrement={() => decrement(photo.key)}
            onClick={() => {/* Issue #3: open preview modal */}}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={handleSentinel} className="h-10 mt-4 flex items-center justify-center">
        {isFetchingNextPage && (
          <span className="text-stone-400 text-sm animate-pulse">Loading more photos…</span>
        )}
        {!hasNextPage && allPhotos.length > 0 && (
          <span className="text-stone-300 text-sm">All photos loaded.</span>
        )}
      </div>
    </main>
  )
}
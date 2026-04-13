import { useEffect, useCallback } from 'react'
import { type Photo } from '../hooks/usePhotos'

interface Props {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function PhotoModal({ photos, currentIndex, onClose, onNavigate }: Readonly<Props>) {
  const photo = photos[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
    if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
  }, [currentIndex, hasPrev, hasNext, onClose, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
          className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <img
        src={photo.url}
        alt={photo.key}
        onClick={e => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg select-none"
      />

      {/* Next button */}
      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
          className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          aria-label="Next photo"
        >
          ›
        </button>
      )}
    </div>
  )
}
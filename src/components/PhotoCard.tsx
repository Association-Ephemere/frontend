import { type Photo } from '../hooks/usePhotos'

interface Props {
  photo: Photo
  qty: number
  onIncrement: () => void
  onDecrement: () => void
  onClick: () => void
}

export default function PhotoCard({ photo, qty, onIncrement, onDecrement, onClick }: Readonly<Props>) {
  return (
    <div className="relative group aspect-square overflow-hidden rounded-lg bg-stone-200 cursor-pointer">
      {/* Image */}
      <img
        src={photo.url}
        alt={photo.key}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onClick={onClick}
      />

      {/* Blue badge */}
      {qty > 0 && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md pointer-events-none">
          {qty}
        </div>
      )}

      {/* +/- buttons */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {qty > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onDecrement() }}
            className="w-7 h-7 rounded-full bg-white/90 text-stone-800 font-bold text-lg flex items-center justify-center shadow hover:bg-red-100 transition-colors"
          >
            −
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onIncrement() }}
          className="w-7 h-7 rounded-full bg-white/90 text-stone-800 font-bold text-lg flex items-center justify-center shadow hover:bg-blue-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
  
}
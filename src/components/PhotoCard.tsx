import { type Photo } from "../hooks/usePhotos";
import QuantityButtons from "./QuantityButtons";

interface Props {
  photo: Photo;
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onClick: () => void;
}

export default function PhotoCard({ photo, qty, onClick }: Readonly<Props>) {
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

      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <QuantityButtons displayQuantity={false} photoKey={photo.key} />
      </div>
    </div>
  );
}

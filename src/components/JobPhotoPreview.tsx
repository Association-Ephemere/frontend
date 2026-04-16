import { useJob } from "@/hooks/useJob";
import PhotoModal from "./PhotoModal";
import { useState } from "react";

export default function JobPhotoPreview({
  jobId,
}: Readonly<{ jobId: string }>) {
  const { data, isPending, isError } = useJob(jobId);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const total = data?.photos.reduce((sum, p) => sum + p.copies, 0) || 0;

  if (isPending) {
    return (
      <div className="flex gap-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-25 h-40 rounded bg-stone-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.photos || data?.photos.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-red-400">
        Impossible de charger les photos (job introuvable ou erreur serveur).
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-3">
      {data.photos.map((p, i) => (
        <div
          key={`${p.photoStorageKey}-${i}`}
          className="relative cursor-pointer"
          onClick={() => setModalIndex(i)}
        >
          <img
            src={p.url}
            alt={`photo-${i}`}
            className="max-w-60 h-40 rounded object-contain bg-stone-700"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md pointer-events-none">
            {p.copies}
          </div>
        </div>
      ))}
      <p>{`${total} photos`}</p>
      {modalIndex !== null && (
        <PhotoModal
          photos={data.photos.map((p) => ({
            url: p.url,
            key: p.photoStorageKey,
            copies: p.copies,
          }))}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
        />
      )}
    </div>
  );
}

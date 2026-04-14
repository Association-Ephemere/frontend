import { useEffect, useRef, useCallback, useState } from "react";
import { useInfinitePhotos, fetchPhotos, type Photo } from "../hooks/usePhotos";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";
import TicketSidebar from "../components/TicketSidebar";
import { useTicket } from "../context/ticket/TicketProvider";

function dedup(photos: Photo[]): Photo[] {
  const seen = new Set<string>();
  return photos.filter((p) => {
    if (seen.has(p.key)) return false;
    seen.add(p.key);
    return true;
  });
}

export default function Gallery() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinitePhotos();
  const { increment, decrement, getQty } = useTicket();

  const [topPhotos, setTopPhotos] = useState<Photo[]>([]);
  const scrollPages = data?.pages.flatMap((p) => p.photos) ?? [];
  const allPhotos = dedup([...topPhotos, ...scrollPages]);

  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(
      async () => {
        const fresh = await fetchPhotos(0);
        setTopPhotos((prev) => {
          const existingKeys = new Set(allPhotos.map((p) => p.key));
          const newOnes = fresh.photos.filter((p) => !existingKeys.has(p.key));
          return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
        });
      },
      Number(import.meta.env.VITE_PHOTO_REFRESH_INTERVAL) || 10000,
    );
    return () => clearInterval(interval);
  }, [allPhotos]);

  const observer = useRef<IntersectionObserver | null>(null);
  const handleSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
            fetchNextPage();
        },
        { rootMargin: "200px" },
      );
      observer.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-48px)]">
        <p className="text-red-500">
          Une erreur est survenue lors du chargement des photos
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-48px)]">
        <span className="text-stone-400 text-sm animate-pulse">
          Chargement…
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-48px)]">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {allPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.key}
              photo={photo}
              qty={getQty(photo.key)}
              onIncrement={() => increment(photo.key)}
              onDecrement={() => decrement(photo.key)}
              onClick={() => setModalIndex(index)}
            />
          ))}
        </div>
        <div
          ref={handleSentinel}
          className="h-10 mt-4 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <span className="text-stone-400 text-sm animate-pulse">
              Chargement des photos…
            </span>
          )}
          {!hasNextPage && allPhotos.length > 0 && (
            <span className="text-stone-300 text-sm">
              Toutes les photos sont chargées ({allPhotos.length})
            </span>
          )}
        </div>
      </main>

      <TicketSidebar
        photos={allPhotos}
        onClick={(index: number) => setModalIndex(index)}
      />

      {modalIndex !== null && (
        <PhotoModal
          photos={allPhotos}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
        />
      )}
    </div>
  );
}

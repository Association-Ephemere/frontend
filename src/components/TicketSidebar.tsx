import { useTicket } from "../context/ticket/TicketProvider";
import { type Photo } from "../hooks/usePhotos";

interface Props {
  photos: Photo[];
  onImprimer: () => void;
}

function filenameFromKey(key: string): string {
  // "low/stand-001-abc.jpg" -> "stand-001-abc.jpg"
  const name = key.split("/").pop() ?? key;
  // truncate if too long
  return name.length > 24 ? name.slice(0, 21) + "…" : name;
}

export default function TicketSidebar({ photos, onImprimer }: Readonly<Props>) {
  const { ticket, clear } = useTicket();

  console.log("ticket", ticket);
  const selectedEntries = Object.entries(ticket).filter(([, qty]) => qty > 0);
  const photoMap = new Map(photos.map((p) => [p.key, p]));

  const totalPhotos = selectedEntries.length;
  const totalPrints = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const isEmpty = selectedEntries.length === 0;

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-stone-200 bg-white h-[calc(100vh-48px)] sticky top-12 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-200">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">
          Ticket
        </p>
        {isEmpty ? (
          <p className="text-sm text-stone-400">Aucune photo sélectionnée</p>
        ) : (
          <p className="text-sm text-stone-600">
            <span className="font-semibold text-stone-900">{totalPhotos}</span>{" "}
            photo{totalPhotos > 1 ? "s" : ""} ·{" "}
            <span className="font-semibold text-stone-900">{totalPrints}</span>{" "}
            impression{totalPrints > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Photo list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-300 text-sm pb-8">
            Aucune photo sélectionnée
          </div>
        ) : (
          selectedEntries.map(([key, qty]) => {
            const photo = photoMap.get(key);
            return (
              <div
                key={key}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                {/* Thumbnail */}
                {photo ? (
                  <img
                    src={photo.url}
                    alt={key}
                    className="w-10 h-10 rounded object-cover shrink-0 bg-stone-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-stone-100 shrink-0" />
                )}

                {/* Filename */}
                <span className="flex-1 text-xs text-stone-600 truncate">
                  {filenameFromKey(key)}
                </span>

                {/* Qty badge */}
                <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                  {qty}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-3 border-t border-stone-200 space-y-2">
        <button className="w-full py-2 px-4 rounded-lg text-sm font-medium border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
          Paramètres
        </button>
        <button
          onClick={onImprimer}
          disabled={isEmpty}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Imprimer
        </button>
        <button
          onClick={clear}
          disabled={isEmpty}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Annuler le ticket
        </button>
      </div>
    </aside>
  );
}

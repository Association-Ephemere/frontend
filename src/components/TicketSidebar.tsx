import { useSubmitJob } from "@/hooks/useSumbitJob";
import { useTicket } from "../context/ticket/TicketProvider";
import { type Photo } from "../hooks/usePhotos";
import { Button } from "./ui/button";
import QuantityButtons from "./QuantityButtons";

interface Props {
  photos: Photo[];
}

export default function TicketSidebar({ photos }: Readonly<Props>) {
  const { ticket, clear, ticketNumber } = useTicket();
  const { submit, isPending } = useSubmitJob();

  const selectedEntries = Object.entries(ticket).filter(([, qty]) => qty > 0);
  const photoMap = new Map(photos.map((p) => [p.key, p]));

  const totalPhotos = selectedEntries.length;
  const totalPrints = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const isEmpty = selectedEntries.length === 0;

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-stone-20 h-[calc(100vh-48px)] sticky top-12 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-t-muted-foreground">
        <p className="text-lg text-accent-foreground uppercase tracking-wide font-bold mb-0.5">
          {`Ticket #${ticketNumber}`}
        </p>
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">
            Aucune photo sélectionnée
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-accent-foreground">
              {totalPhotos}
            </span>{" "}
            photo{totalPhotos > 1 ? "s" : ""} ·{" "}
            <span className="font-semibold text-accent-foreground">
              {totalPrints}
            </span>{" "}
            impression{totalPrints > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Photo list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm pb-8">
            Aucune photo sélectionnée
          </div>
        ) : (
          selectedEntries.map(([key]) => {
            const photo = photoMap.get(key);
            return (
              <div
                key={key}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors w-full"
              >
                {/* Thumbnail */}
                {photo ? (
                  <img
                    src={photo.url}
                    alt={key}
                    className="w-20 h-20 rounded object-cover shrink-0 bg-stone-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-stone-100 shrink-0 animate-pulse" />
                )}

                <div className="flex items-center justify-center w-full">
                  <QuantityButtons displayQuantity photoKey={key} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-3 border-t space-y-5">
        <Button
          onClick={submit}
          disabled={isEmpty || isPending}
          className="w-full py-5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Envoi…" : `Imprimer #${ticketNumber}`}
        </Button>
        <Button
          onClick={clear}
          disabled={isEmpty}
          variant="outline"
          className="w-full py-5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Annuler le ticket
        </Button>
      </div>
    </aside>
  );
}

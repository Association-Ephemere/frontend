import { useTicket } from "@/context/ticket/TicketProvider";
import { useState } from "react";

export default function Parameters() {
  const { ticketNumber, setTicketNumber } = useTicket();
  const [input, setInput] = useState(String(ticketNumber));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed)) {
      setTicketNumber(parsed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <main className="p-6 p-x-12">
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Paramètres</h1>

      <div className="border border-muted rounded-xl p-4 gap-4 flex flex-col w-full items-start">
        <label className="text-sm font-medium text-foreground">
          Numéro de ticket actuel
        </label>
        <p className="text-xs text-muted-foreground text-left">
          S'incrémente automatiquement après chaque impression. Modifiez-le lors
          d'un changement de carnet.
        </p>
        <div className="flex gap-2 w-full">
          <input
            type="number"
            min={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSaved(false);
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 shrink"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm bg-foreground text-background hover:bg-muted-foreground transition-colors"
          >
            {saved ? "Enregistré" : "Enregistrer"}
          </button>
        </div>
      </div>
    </main>
  );
}

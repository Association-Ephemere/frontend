import { useTicket } from "@/context/ticket/TicketProvider";
import { useState } from "react";
import { toast } from "sonner";

export default function Parameters() {
  const { ticketNumber, setTicketNumber, maxTicketNumber, setMaxTicketNumber } =
    useTicket();
  const [input, setInput] = useState(String(ticketNumber));
  const [inputMax, setInputMax] = useState(String(maxTicketNumber));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const parsed = parseInt(input, 10);
    const maxParsed = parseInt(inputMax, 10);

    if (isNaN(parsed) || isNaN(maxParsed)) {
      toast.error("Veuillez entrer des nombres valides pour les deux champs.");
      return;
    }

    if (parsed > maxParsed) {
      toast.error(
        "Le numéro de ticket actuel ne peut pas être supérieur au numéro de ticket max.",
      );
      return;
    }

    setTicketNumber(parsed);

    setMaxTicketNumber(parsed);
    setSaved(true);
    toast.success("Paramètres enregistrés avec succès !");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="p-6 p-x-12">
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Paramètres</h1>

      <div className="border border-muted rounded-xl p-4 gap-5 flex flex-col w-full items-start text-left">
        <div className="flex gap-1 w-full flex-col">
          <label className="text-sm font-medium text-foreground">
            Numéro de ticket actuel
          </label>
          <p className="text-xs text-muted-foreground text-left">
            S'incrémente automatiquement après chaque impression. Modifiez-le
            lors d'un changement de carnet.
          </p>
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
        </div>
        <div className="flex gap-1 w-full flex-col">
          <label className="text-sm font-medium text-foreground">
            Ticket Max
          </label>
          <p className="text-xs text-muted-foreground text-left">
            Numéro du dernier ticket du carnet. Modifiez-le lors d'un changement
            de carnet.
          </p>
          <input
            type="number"
            min={1}
            value={inputMax}
            onChange={(e) => {
              setInputMax(e.target.value);
              setSaved(false);
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 shrink"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 w-full rounded-lg text-sm bg-foreground text-background hover:bg-muted-foreground transition-colors"
        >
          {saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
    </main>
  );
}

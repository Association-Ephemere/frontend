import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { useTicket } from "@/context/ticket/TicketProvider";

interface JobResponse {
  jobId: string;
  status: string;
  createdAt: string;
}

export function useSubmitJob() {
  const {
    ticket,
    clear,
    ticketNumber,
    maxTicketNumber,
    incrementTicketNumber,
  } = useTicket();
  const [isPending, setIsPending] = useState(false);

  async function submit() {
    const photos = Object.entries(ticket)
      .filter(([, copies]) => copies > 0)
      .map(([key, copies]) => ({
        photoStorageKey: key.replace(/^low\//, "full/"),
        copies,
      }));

    if (photos.length === 0) {
      toast.error(
        "Votre ticket est vide. Ajoutez des photos avant de soumettre.",
      );
      return;
    }

    if (ticketNumber > maxTicketNumber) {
      toast.error(
        "Le numéro de ticket actuel dépasse le numéro de ticket max. Veuillez ajuster les paramètres avant de soumettre.",
      );
      return;
    }

    setIsPending(true);
    try {
      await api.post<JobResponse>("/jobs", {
        photos,
        ticketNumber,
      });
      clear();
      toast.success(`Ticket #${ticketNumber} envoyé à l'impression`);
      incrementTicketNumber();
    } catch {
      toast.error("Erreur lors de l'envoi du ticket. Réessayez.");
    } finally {
      setIsPending(false);
    }
  }

  return { submit, isPending };
}

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
  const { ticket, clear } = useTicket();
  const [isPending, setIsPending] = useState(false);

  async function submit() {
    const photos = Object.entries(ticket)
      .filter(([, copies]) => copies > 0)
      .map(([key, copies]) => ({
        photoStorageKey: key.replace(/^low\//, "full/"),
        copies,
      }));

    if (photos.length === 0) return;
    setIsPending(true);
    try {
      const { data } = await api.post<JobResponse>("/jobs", { photos });
      clear();
      toast.success(`Ticket #${data.jobId} envoyé à l'impression`);
    } catch {
      toast.error("Erreur lors de l'envoi du ticket. Réessayez.");
    } finally {
      setIsPending(false);
    }
  }

  return { submit, isPending };
}

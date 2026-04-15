import { toast } from "sonner";
import { api } from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

export default function useArchiveJob(jobId: string) {
  return useMutation({
    mutationFn: async () => {
      await api.patch(`/jobs/${jobId}/archive`);
    },
    onError: () => {
      toast.error(`Erreur lors de l'archivage du job. Réessayez.`);
      console.error(`Failed to archive job ${jobId}`);
    },
    onSuccess: () => {
      toast.success(`Job archivé avec succès.`);
    },
    throwOnError: false,
  });
}

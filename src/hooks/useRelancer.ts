import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/axios";
import type { Job, JobDetail, PostJobResponse } from "@/types/job";

export function useRelancer(
  onNewJob: (oldId: string, newJob: Job) => void,
  onNewPrintingId: (id: string) => void,
) {
  const [pending, setPending] = useState<Set<string>>(new Set());

  async function relancer(oldId: string) {
    setPending((p) => new Set(p).add(oldId));
    try {
      const { data: detail } = await api.get<JobDetail>(`/jobs/${oldId}`);
      const { data: created } = await api.post<PostJobResponse>("/jobs", {
        photos: detail.photos,
      });
      const newJob: Job = {
        id: created.jobId,
        status: "queued",
        total: detail.total,
        printed: 0,
        retryCount: detail.retryCount + 1,
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
        ticketNumber: detail.ticketNumber,
      };
      onNewJob(oldId, newJob);
      onNewPrintingId(created.jobId);
      toast.success("Ticket relancé");
    } catch {
      toast.error("Erreur lors du relancement.");
    } finally {
      setPending((p) => {
        const s = new Set(p);
        s.delete(oldId);
        return s;
      });
    }
  }

  return { relancer, pending };
}

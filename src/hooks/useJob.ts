import { useQuery } from "@tanstack/react-query";
import { api, USE_MOCK } from "../lib/axios";
import type { JobDetail } from "@/types/job";
import { mockFetchedJobDetail } from "@/mocks/mockFetchedJobs";

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async (): Promise<JobDetail> => {
      if (USE_MOCK) return mockFetchedJobDetail(jobId);

      const { data } = await api.get<JobDetail>(`/jobs/${jobId}`);

      if (!data?.photos) {
        return {
          photos: [],
          id: jobId,
          status: "error",
          total: 0,
          printed: 0,
          ticketNumber: 0,
          retryCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return data;
    },
    retry: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { api, USE_MOCK } from "../lib/axios";
import type { JobDetail } from "@/types/job";

const MOCK_JOB: JobDetail = {
  id: "mock-job-1",
  status: "printing",
  total: 2,
  printed: 1,
  ticketNumber: 1234,
  retryCount: 0,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  photos: [
    {
      photoStorageKey:
        "https://live.staticflickr.com/65535/55204653200_b136eb8c2f_c.jpg",
      copies: 1,
    },
  ],
};

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async (): Promise<JobDetail> => {
      if (USE_MOCK) return MOCK_JOB;
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

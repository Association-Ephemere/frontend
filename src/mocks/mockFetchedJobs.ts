import type { JobDetail, JobsResponse } from "@/types/job";

const PHOTO_URL =
  "https://live.staticflickr.com/65535/55204653200_b136eb8c2f_c.jpg";

const jobs: JobsResponse["jobs"] = [
  {
    id: "ss",
    status: "printing",
    total: 2,
    printed: 1,
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ticketNumber: 2,
  },
  {
    id: "ssszdfze",
    status: "printing",
    total: 5,
    printed: 1,
    retryCount: 0,
    createdAt: new Date("03/04/2025").toISOString(),
    updatedAt: new Date().toISOString(),
    ticketNumber: 2,
  },
  {
    id: "ssfzevzg",
    status: "requeued",
    total: 2,
    printed: 1,
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ticketNumber: 2,
  },
  {
    id: "sezfzs",
    status: "error",
    total: 7,
    printed: 6,
    retryCount: 0,
    createdAt: new Date("09/04/2025").toISOString(),
    updatedAt: new Date().toISOString(),
    ticketNumber: 2,
  },
  {
    id: "sfzgzefrvs",
    status: "done",
    total: 20,
    printed: 12,
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ticketNumber: 456,
  },
];

const detailedJobs: JobDetail[] = jobs.map((job) => ({
  ...job,
  photos: [
    {
      photoStorageKey: "low/mock-photo-001.jpg",
      copies: job.total - 1,
      url: PHOTO_URL,
    },
    { photoStorageKey: "low/mock-photo-002.jpg", copies: 1, url: PHOTO_URL },
  ],
}));

export async function mockFetchedJobs(): Promise<JobsResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return {
    jobs,
    total: jobs.length,
  };
}

export async function mockFetchedJobDetail(jobId: string): Promise<JobDetail> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return detailedJobs.find((job) => job.id === jobId) ?? detailedJobs[0];
}

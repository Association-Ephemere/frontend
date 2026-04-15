export type JobStatus = "printing" | "requeued" | "queued" | "error" | "done";

export interface Job {
  id: string;
  status: JobStatus;
  total: number;
  printed: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  ticketNumber: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
}

export interface JobDetail extends Job {
  photos: { photoStorageKey: string; copies: number; url: string }[];
}

export interface PostJobResponse {
  jobId: string;
  status: string;
  createdAt: string;
}

export interface JobSSEEvent {
  jobId: string;
  status: string;
  printed: number;
  total: number;
  error?: string;
}

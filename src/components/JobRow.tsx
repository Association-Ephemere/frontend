import type { Job, JobStatus } from "@/types/job";
import JobPhotoPreview from "./JobPhotoPreview";
import JobActions from "./JobActions";

const STATUS_LABEL: Record<JobStatus, string> = {
  printing: "Impression",
  requeued: "En attente",
  queued: "En file",
  error: "Erreur",
  done: "Terminé",
};

const STATUS_CLASS: Record<JobStatus, string> = {
  printing: "bg-blue-900 text-blue-100",
  requeued: "bg-orange-900 text-orange-100",
  queued: "bg-stone-900 text-stone-600",
  error: "bg-red-900 text-red-100",
  done: "bg-green-900 text-green-100",
};

interface Props {
  job: Job;
  onRelancer: (id: string) => void;
  relancerPending: boolean;
}

export default function JobRow({
  job,
  onRelancer,
  relancerPending,
}: Readonly<Props>) {
  const date = new Date(job.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const progress =
    job.total > 0 ? Math.round((job.printed / job.total) * 100) : 0;

  return (
    <>
      <tr className="border-b border-stone-800 ">
        <td className="px-4 py-3 font-mono text-xs text-stone-500">
          {`#${job.ticketNumber}`}
        </td>

        <td className="px-4 py-3">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[job.status]}`}
          >
            {STATUS_LABEL[job.status]}
          </span>
        </td>

        <td className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap">
          {date}
        </td>

        <td className="px-4 py-3">
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 tabular-nums">
              {job.printed} / {job.total}
            </p>
          </div>
        </td>
      </tr>

      <tr className="border-b border-stone-800 bg-stone-900">
        <td colSpan={3}>
          <JobPhotoPreview jobId={job.id} />
        </td>
        <td colSpan={2}>
          <JobActions
            job={job}
            onRelancer={onRelancer}
            relancerPending={relancerPending}
          />
        </td>
      </tr>
    </>
  );
}

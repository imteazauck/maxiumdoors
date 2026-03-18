import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { JobDetails } from "../data/job";

interface CalculatorPageProps {
  jobs: JobDetails[];
}

export default function CalculatorPage({ jobs }: CalculatorPageProps) {
  const { jobId } = useParams();

  const job = useMemo(
    () => jobs.find((item) => item.id === jobId),
    [jobs, jobId]
  );

  if (!job) {
    return (
      <div className="page-shell">
        <div className="panel">
          <h1>Job not found</h1>
          <p>The selected job could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="eyebrow">Door Calculator</p>
        <h1>{job.jobRef}</h1>
        <p className="page-description">
          {job.siteAddress} • {job.contactName || "No contact"}
        </p>
      </div>

<div className="panel">
  <CalculatorPage jobs={jobs} />
</div>

    </div>
  );
}
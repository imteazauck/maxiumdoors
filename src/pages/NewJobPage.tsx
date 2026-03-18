import { useNavigate } from "react-router-dom";
import JobDetailsForm, { type JobDetailsFormValues} from "../components/JobDetailsForm";
import type { JobDetails, UserRole } from "../data/job";

interface NewJobPageProps {
  role: UserRole;
  onCreateJob: (job: JobDetails) => void;
}

export default function NewJobPage({ role, onCreateJob }: NewJobPageProps) {
  const navigate = useNavigate();

  const buildJob = (
    values: JobDetailsFormValues,
    status: JobDetails["status"]
  ): JobDetails => {
    return {
      id: crypto.randomUUID(),
      jobRef: values.jobRef,
      siteAddress: values.siteAddress,
      customerName: values.customerName,
      companyName: values.companyName,
      contactName: values.contactName,
      phone: values.phone,
      email: values.email,
      estimatorAssigned: values.estimatorAssigned,
      notes: values.notes,
      status,
      createdAt: new Date().toISOString(),
      createdByRole: role,
    };
  };

  const handleSaveDraft = (values: JobDetailsFormValues) => {
    const draftJob = buildJob(values, "draft");
    onCreateJob(draftJob);
    navigate("/dashboard");
  };

  const handleContinue = (values: JobDetailsFormValues) => {
    const inProgressJob = buildJob(values, "in_progress");
    onCreateJob(inProgressJob);
    navigate(`/calculator/${inProgressJob.id}`);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="eyebrow">Project Setup</p>
        <h1>Create New Job</h1>
        <p className="page-description">
          Capture the project details before entering the door calculator.
        </p>
      </div>

      <div className="panel">
        <JobDetailsForm
          role={role}
          onSaveDraft={handleSaveDraft}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
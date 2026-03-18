export type UserRole = "client" | "estimator";

export type JobStatus = "draft" | "in_progress" | "quoted" | "approved";

export interface JobDetails {
  id: string;
  jobRef: string;
  siteAddress: string;
  customerName: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  estimatorAssigned: string;
  notes: string;
  status: JobStatus;
  createdAt: string;
  createdByRole: UserRole;
}
import { Link } from "react-router-dom";
import type { JobDetails, UserRole } from "../data/job";

interface DashboardPageProps {
  jobs: JobDetails[];
  role: UserRole;
}

export default function DashboardPage({
  jobs,
  role,
}: DashboardPageProps) {
  return (
    <div className="page-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            {role === "client" ? "Client Portal" : "Estimator Portal"}
          </p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Manage jobs and continue existing door calculations.
          </p>
        </div>

        <Link to="/jobs/new" className="primary-btn link-btn">
          + New Job
        </Link>
      </div>

      <div className="panel">
        <h2>Recent Jobs</h2>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs yet.</p>
            <p>Create your first job to begin a door calculation.</p>
          </div>
        ) : (
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Ref</th>
                  <th>Contact</th>
                  <th>Site Address</th>
                  <th>Status</th>
                  <th>Estimator</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.jobRef}</td>
                    <td>{job.contactName || "-"}</td>
                    <td>{job.siteAddress}</td>
                    <td>
                      <span className={`status-badge status-${job.status}`}>
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{job.estimatorAssigned || "-"}</td>
                    <td>
                      <Link
                        to={`/calculator/${job.id}`}
                        className="table-link"
                      >
                        Open Calculator
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
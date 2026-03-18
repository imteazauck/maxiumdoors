import type { UserRole } from "../data/job";

interface LoginPageProps {
  onSelectRole: (role: UserRole) => void;
}

export default function LoginPage({ onSelectRole }: LoginPageProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Ian Rayner Door System</p>
        <h1>Welcome</h1>
        <p className="page-description">
          Choose how you want to enter the system.
        </p>

        <div className="role-grid">
          <button
            className="role-card"
            onClick={() => onSelectRole("client")}
          >
            <h2>Client Login</h2>
            <p>Create jobs, enter site details, and track progress.</p>
          </button>

          <button
            className="role-card"
            onClick={() => onSelectRole("estimator")}
          >
            <h2>Estimator Login</h2>
            <p>Manage job records and complete door calculations.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
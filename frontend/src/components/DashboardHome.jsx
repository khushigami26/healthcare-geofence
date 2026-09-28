import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Activity,
  Bell,
  ArrowUpRight,
  HeartPulse,
} from "lucide-react";
import api from "../services/api";

function DashboardHome({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const activePatients = patients.filter(
    (patient) => patient.status === "Active",
  );

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">HEALTHCARE OVERVIEW</span>

          <h1>Good morning, {user?.name?.split(" ")[0] || "Admin"} 👋</h1>

          <p>
            Here's what's happening with your healthcare management system
            today.
          </p>
        </div>

        <div className="dashboard-date">
          <Activity size={17} />
          System operational
        </div>
      </div>

      {/* STATISTICS */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users />
          </div>

          <div className="stat-content">
            <span>Total Patients</span>

            <strong>{loading ? "..." : patients.length}</strong>

            <small>
              <ArrowUpRight size={13} />
              Patient records
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <HeartPulse />
          </div>

          <div className="stat-content">
            <span>Active Patients</span>

            <strong>{loading ? "..." : activePatients.length}</strong>

            <small>
              <ArrowUpRight size={13} />
              Currently active
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <MapPin />
          </div>

          <div className="stat-content">
            <span>Geo-Fence Monitoring</span>

            <strong>Active</strong>

            <small>
              <Activity size={13} />
              Monitoring enabled
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Bell />
          </div>

          <div className="stat-content">
            <span>Alerts</span>

            <strong>3</strong>

            <small>
              <Bell size={13} />
              Requires attention
            </small>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Patients</h3>
              <span>Latest patient records</span>
            </div>

            <button className="panel-action">
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          {patients.length === 0 ? (
            <div className="dashboard-empty">
              <Users size={30} />
              <p>No patients available.</p>
            </div>
          ) : (
            <div className="recent-patients">
              {patients.slice(0, 5).map((patient) => (
                <div className="recent-patient" key={patient.id}>
                  <div className="recent-avatar">
                    {patient.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="recent-patient-info">
                    <strong>{patient.name}</strong>
                    <span>{patient.mobile_number}</span>
                  </div>

                  <span
                    className={
                      patient.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {patient.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Monitoring Status</h3>
              <span>Geo-fence system</span>
            </div>

            <Activity size={21} />
          </div>

          <div className="monitoring-card">
            <div className="monitoring-icon">
              <MapPin size={25} />
            </div>

            <div>
              <strong>Geo-Fence Monitoring</strong>

              <p>Patient location monitoring is currently available.</p>
            </div>
          </div>

          <div className="monitoring-row">
            <span>API Status</span>
            <strong className="online-status">● Online</strong>
          </div>

          <div className="monitoring-row">
            <span>Database</span>
            <strong className="online-status">● Connected</strong>
          </div>

          <div className="monitoring-row">
            <span>Alert System</span>
            <strong className="online-status">● Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;

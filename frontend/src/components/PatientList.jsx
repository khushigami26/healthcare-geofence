import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  UserRound,
} from "lucide-react";
import api from "../services/api";
import ActionButton from "./ActionButton";
import ConfirmDialog from "./ConfirmDialog";

function PatientList({ onAddPatient }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // LOAD PATIENTS
  // =========================

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patients");

      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Failed to load patients:", error);

      setError(error.response?.data?.detail || "Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  useEffect(() => {
    let result = [...patients];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchValue) ||
          patient.mobile_number?.toLowerCase().includes(searchValue) ||
          String(patient.id).includes(searchValue),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((patient) => patient.status === statusFilter);
    }

    setFilteredPatients(result);
  }, [search, statusFilter, patients]);

  // =========================
  // DELETE PATIENT
  // =========================

  const openDeleteDialog = (patient) => {
    setDeleteTarget({ id: patient.id, name: patient.name });
  };

  const closeDeleteDialog = () => {
    if (!deleting) {
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/patients/${deleteTarget.id}`);

      setPatients((previous) =>
        previous.filter((patient) => patient.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete patient:", error);

      setError(error.response?.data?.detail || "Failed to delete patient.");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // VIEW PATIENT
  // =========================

  const handleView = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="card">
        <div className="patients-loading">
          <RefreshCw size={24} className="loading-icon" />

          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">PATIENT MANAGEMENT</span>

          <h1>Patients</h1>

          <p>Manage patient records, information and healthcare details.</p>
        </div>

        <ActionButton variant="primary" icon={Plus} onClick={onAddPatient}>
          Add patient
        </ActionButton>
      </div>

      {/* STAT CARDS */}

      <div className="patient-summary">
        <div className="patient-summary-card">
          <div className="patient-summary-icon blue">
            <Users size={20} />
          </div>

          <div>
            <span>Total Patients</span>

            <strong>{patients.length}</strong>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="patient-summary-icon green">
            <UserRound size={20} />
          </div>

          <div>
            <span>Active Patients</span>

            <strong>
              {patients.filter((patient) => patient.status === "Active").length}
            </strong>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="patient-summary-icon gray">
            <UserRound size={20} />
          </div>

          <div>
            <span>Inactive Patients</span>

            <strong>
              {patients.filter((patient) => patient.status !== "Active").length}
            </strong>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && <div className="error-message">{error}</div>}

      {/* PATIENT TABLE */}

      <div className="card">
        {/* TABLE HEADER */}

        <div className="patients-toolbar">
          <div>
            <h3>Patient Records</h3>

            <span>
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""} found
            </span>
          </div>

          <div className="patients-actions">
            {/* SEARCH */}

            <div className="patient-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="patient-status-filter"
            >
              <option value="All">All Status</option>

              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>

            {/* REFRESH */}

            <button
              className="refresh-button"
              onClick={loadPatients}
              title="Refresh patients"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {/* TABLE */}

        {filteredPatients.length === 0 ? (
          <div className="patients-empty">
            <div className="patients-empty-icon">
              <Users size={28} />
            </div>

            <h3>No patients found</h3>

            <p>
              {search || statusFilter !== "All"
                ? "Try changing your search or filter."
                : "Start by adding your first patient."}
            </p>

            {!search && statusFilter === "All" && (
              <ActionButton variant="primary" size="sm" icon={Plus} onClick={onAddPatient}>
                Add patient
              </ActionButton>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Mobile Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    {/* PATIENT */}

                    <td>
                      <div className="patient-name-cell">
                        <div className="patient-avatar">
                          {patient.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <strong>{patient.name}</strong>

                          <span>Healthcare Patient</span>
                        </div>
                      </div>
                    </td>

                    {/* ID */}

                    <td>
                      <span className="patient-id">
                        #{String(patient.id).padStart(4, "0")}
                      </span>
                    </td>

                    {/* MOBILE */}

                    <td>{patient.mobile_number}</td>

                    {/* STATUS */}

                    <td>
                      {patient.status === "Active" ? (
                        <span className="status-active">Active</span>
                      ) : (
                        <span className="status-inactive">
                          {patient.status}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="patient-table-actions">
                        <button
                          className="table-action view"
                          onClick={() => handleView(patient.id)}
                          title="View patient"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="table-action edit"
                          onClick={() => handleView(patient.id)}
                          title="View / Edit patient"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="table-action delete"
                          onClick={() => openDeleteDialog(patient)}
                          title="Delete patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete patient?"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This will also remove their family members and locations. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete patient"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}

export default PatientList;

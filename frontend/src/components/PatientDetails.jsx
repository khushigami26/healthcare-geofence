import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, CheckCircle2, X, Phone, UserRound, Save } from "lucide-react";

import api from "../services/api";
import ActionButton from "./ActionButton";
import GeoFenceCheck from "./GeoFenceCheck";
import FamilyMemberList from "./FamilyMemberList";
import LocationList from "./LocationList";
import { validateName, validateMobile, sanitizeDigits } from "../utils/validation";

function PatientDetails({ patient, onBack }) {
  const [patientDetails, setPatientDetails] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Patient State
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    mobile_number: "",
    status: "Active",
  });
  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState("");

  const loadPatientDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientResponse, familyResponse, locationResponse] =
        await Promise.all([
          api.get(`/patients/${patient.id}`),
          api.get(`/patients/${patient.id}/family-members`),
          api.get(`/patients/${patient.id}/locations`),
        ]);

      setPatientDetails(patientResponse.data);
      setFamilyMembers(familyResponse.data);
      setLocations(locationResponse.data);
    } catch (loadError) {
      console.error("Failed to load patient details:", loadError);

      setError(
        loadError.response?.data?.detail || "Failed to load patient details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientDetails();
  }, [patient.id]);

  const handleStartEdit = () => {
    if (patientDetails) {
      setEditForm({
        name: patientDetails.name || "",
        mobile_number: patientDetails.mobile_number || "",
        status: patientDetails.status || "Active",
      });
      setEditErrors({});
      setIsEditing(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      const digitsOnly = sanitizeDigits(value, 15);
      setEditForm((prev) => ({ ...prev, mobile_number: digitsOnly }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const errors = {};

    const nameErr = validateName(editForm.name, "Patient name");
    if (nameErr) errors.name = nameErr;

    const mobileErr = validateMobile(editForm.mobile_number);
    if (mobileErr) errors.mobile_number = mobileErr;

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      setSavingEdit(true);
      const response = await api.put(`/patients/${patient.id}`, {
        name: editForm.name.trim(),
        mobile_number: editForm.mobile_number,
        status: editForm.status,
      });

      setPatientDetails(response.data);
      setIsEditing(false);
      setEditSuccess("Patient details updated successfully!");
      setTimeout(() => setEditSuccess(""), 4000);
    } catch (saveErr) {
      console.error("Failed to update patient:", saveErr);
      setError(saveErr.response?.data?.detail || "Failed to update patient details.");
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="empty-message">Loading patient details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">{error}</div>
        <ActionButton variant="ghost" icon={ArrowLeft} onClick={onBack}>
          Back to patients
        </ActionButton>
      </div>
    );
  }

  return (
    <div>
      {/* SEPARATE TOP NAVIGATION BAR (Prevents overlap with title) */}
      <div className="details-top-nav">
        <ActionButton
          variant="ghost"
          icon={ArrowLeft}
          className="back-to-patients-btn"
          onClick={onBack}
        >
          Back to patients
        </ActionButton>
      </div>

      {/* DASHBOARD PAGE HEADER */}
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">PATIENT DETAILS</span>
          <h1 className="patient-details-header-title">
            {patientDetails?.name || "Patient"}
          </h1>
          <p>Manage family, locations, and geo-fence for this patient.</p>
        </div>

        <ActionButton
          variant="secondary"
          icon={Pencil}
          onClick={handleStartEdit}
        >
          Edit Patient
        </ActionButton>
      </div>

      {editSuccess && (
        <div className="alert-toast success-toast" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={18} />
          <span>{editSuccess}</span>
        </div>
      )}

      {/* EDIT PATIENT INLINE MODAL / CARD */}
      {isEditing && (
        <div className="card patient-edit-card" style={{ marginBottom: 24, border: "2px solid #087f8c" }}>
          <div className="card-header-flex">
            <div>
              <h3 style={{ color: "#087f8c", display: "flex", alignItems: "center", gap: 8 }}>
                <Pencil size={18} /> Edit Patient Record
              </h3>
              <p>Update patient personal details and status.</p>
            </div>
            <button className="icon-close-btn" onClick={() => setIsEditing(false)}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveEdit} className="patient-form">
            <div className="form-grid-2">
              <div className="input-group">
                <label>Patient Name *</label>
                <div className="patient-form-input-wrap">
                  <UserRound size={18} className="patient-form-input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Patient full name"
                    className={editErrors.name ? "input-error" : ""}
                  />
                </div>
                {editErrors.name && <span className="field-error-text">{editErrors.name}</span>}
              </div>

              <div className="input-group">
                <label>Mobile Number (Min 10 Digits) *</label>
                <div className="patient-form-input-wrap">
                  <Phone size={18} className="patient-form-input-icon" />
                  <input
                    type="tel"
                    name="mobile_number"
                    value={editForm.mobile_number}
                    onChange={handleEditChange}
                    placeholder="e.g. 9876543210"
                    maxLength={15}
                    className={editErrors.mobile_number ? "input-error" : ""}
                  />
                </div>
                {editErrors.mobile_number && (
                  <span className="field-error-text">{editErrors.mobile_number}</span>
                )}
              </div>

              <div className="input-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="patient-form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="action-button secondary"
                onClick={() => setIsEditing(false)}
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="action-button primary"
                disabled={savingEdit}
              >
                <Save size={16} /> {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PATIENT SUMMARY CARD */}
      {patientDetails && (
        <div className="card patient-summary-card" style={{ marginBottom: 20 }}>
          <div className="patient-name-cell">
            <div className="patient-avatar">
              {patientDetails.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <strong>{patientDetails.name}</strong>
              <span>{patientDetails.mobile_number}</span>
              <span>
                {patientDetails.status === "Active" ? (
                  <span className="status-active">Active</span>
                ) : (
                  <span className="status-inactive">{patientDetails.status}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      <FamilyMemberList
        patientId={patient.id}
        familyMembers={familyMembers}
        onFamilyMembersChange={loadPatientDetails}
      />

      <LocationList
        patientId={patient.id}
        locations={locations}
        onLocationsChange={loadPatientDetails}
      />

      <GeoFenceCheck
        patientId={patient.id}
        activeLocation={locations.find((location) => location.is_active)}
      />
    </div>
  );
}

export default PatientDetails;

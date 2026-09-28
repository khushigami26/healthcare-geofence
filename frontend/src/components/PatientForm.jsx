import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  UserPlus,
  UserRound,
} from "lucide-react";
import api from "../services/api";
import ActionButton from "./ActionButton";
import { validateName, validateMobile } from "../utils/validation";

function PatientForm({ onPatientCreated, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    mobile_number: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleMobileChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    setForm((previousForm) => ({
      ...previousForm,
      mobile_number: digitsOnly,
    }));
  };

  const getErrorMessage = (submitError) => {
    const detail = submitError.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          typeof item === "string" ? item : item.msg || "Invalid input",
        )
        .join(", ");
    }

    if (typeof detail === "string") {
      return detail;
    }

    return "Failed to create patient.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const nameError = validateName(form.name, "Patient name");
    if (nameError) {
      setError(nameError);
      return;
    }

    const mobileError = validateMobile(form.mobile_number);
    if (mobileError) {
      setError(mobileError);
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("/patients", {
        ...form,
        name: form.name.trim(),
      });

      onPatientCreated(response.data);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="patient-form-page">
      <div className="details-top-nav">
        <ActionButton
          variant="ghost"
          icon={ArrowLeft}
          className="back-to-patients-btn"
          onClick={onCancel}
          disabled={saving}
        >
          Back to patients
        </ActionButton>
      </div>

      <div className="dashboard-page-header patient-form-header">
        <div>
          <span className="dashboard-eyebrow">PATIENT MANAGEMENT</span>

          <h1>Add Patient</h1>

          <p>
            Register a new patient record. You can add family members and
            locations after saving.
          </p>
        </div>
      </div>

      <div className="card patient-form-card">
        <div className="patient-form-card-intro">
          <div className="patient-form-icon">
            <UserPlus size={22} />
          </div>
          <div>
            <h2>Patient details</h2>
            <p>All fields marked below are required to create the record.</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="patient-name">Patient name</label>
            <div className="patient-form-input-wrap">
              <UserRound size={18} className="patient-form-input-icon" />
              <input
                id="patient-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                maxLength={100}
                disabled={saving}
                autoComplete="name"
              />
            </div>
            <span className="input-hint">At least 2 characters</span>
          </div>

          <div className="input-group">
            <label htmlFor="patient-mobile">Mobile number</label>
            <div className="patient-form-input-wrap">
              <Phone size={18} className="patient-form-input-icon" />
              <input
                id="patient-mobile"
                name="mobile_number"
                type="tel"
                inputMode="numeric"
                value={form.mobile_number}
                onChange={handleMobileChange}
                placeholder="e.g. 9876543210"
                maxLength={20}
                disabled={saving}
                autoComplete="tel"
              />
            </div>
            <span className="input-hint">10–20 digits, numbers only</span>
          </div>

          <div className="input-group">
            <label htmlFor="patient-status">Status</label>
            <select
              id="patient-status"
              name="status"
              className="patient-form-select"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="input-hint">
              Active patients appear in monitoring and lists by default.
            </span>
          </div>

          <div className="form-actions patient-form-actions">
            <ActionButton
              type="submit"
              variant="primary"
              icon={UserPlus}
              loading={saving}
              className="patient-form-submit"
            >
              Save patient
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;

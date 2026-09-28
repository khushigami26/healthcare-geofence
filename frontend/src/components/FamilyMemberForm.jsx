import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import api from "../services/api";
import ActionButton from "./ActionButton";
import { validateFamilyMemberForm } from "../utils/validation";

function FamilyMemberForm({ patientId, familyMember, onComplete, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    relationship_with_patient: "",
    mobile_number: "",
    email: "",
    notification_preference: "Enabled",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (familyMember) {
      setForm({
        name: familyMember.name,
        relationship_with_patient: familyMember.relationship_with_patient,
        mobile_number: familyMember.mobile_number,
        email: familyMember.email,
        notification_preference: familyMember.notification_preference,
      });
    }
  }, [familyMember]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const { isValid, firstError } = validateFamilyMemberForm(form);
    if (!isValid) {
      setError(firstError);
      return;
    }

    try {
      setSaving(true);

      if (familyMember) {
        await api.put(`/family-members/${familyMember.id}`, form);
      } else {
        await api.post(`/patients/${patientId}/family-members`, form);
      }

      onComplete();
    } catch (submitError) {
      console.error("Failed to save family member:", submitError);

      setError(
        submitError.response?.data?.detail || "Failed to save family member.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card family-member-form">
      <h4>{familyMember ? "Edit family member" : "Add family member"}</h4>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="fm-name">Name</label>
          <input
            id="fm-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            disabled={saving}
          />
        </div>

        <div className="input-group">
          <label htmlFor="fm-relationship">Relationship</label>
          <input
            id="fm-relationship"
            name="relationship_with_patient"
            value={form.relationship_with_patient}
            onChange={handleChange}
            placeholder="e.g. Spouse, Son"
            required
            disabled={saving}
          />
        </div>

        <div className="input-group">
          <label htmlFor="fm-mobile">Mobile number</label>
          <input
            id="fm-mobile"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
            placeholder="Mobile number"
            required
            disabled={saving}
          />
        </div>

        <div className="input-group">
          <label htmlFor="fm-email">Email</label>
          <input
            id="fm-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            disabled={saving}
          />
        </div>

        <div className="input-group">
          <label htmlFor="fm-notification">Notifications</label>
          <select
            id="fm-notification"
            name="notification_preference"
            className="patient-form-select"
            value={form.notification_preference}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div className="form-actions">
          <ActionButton
            type="submit"
            variant="primary"
            icon={Save}
            loading={saving}
          >
            {familyMember ? "Update member" : "Save member"}
          </ActionButton>

          <ActionButton
            variant="secondary"
            icon={X}
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

export default FamilyMemberForm;

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Bell,
  CheckCircle2,
  Lock,
  Edit2,
  Save,
  ShieldAlert,
  Building,
} from "lucide-react";
import {
  validateName,
  validateEmail,
  validateMobile,
  validatePassword,
  sanitizeDigits,
} from "../utils/validation";

function ProfilePage({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Real Admin Profile State
  const [formData, setFormData] = useState({
    name: user?.name || "Administrator",
    email: user?.email || "admin@healthcare.com",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  // Security Form State
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [passMessage, setPassMessage] = useState({ type: "", text: "" });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    desktopPush: true,
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthcareUser");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          department: parsed.department || prev.department,
        }));
      } catch (err) {
        console.error("Error loading profile from localStorage:", err);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = sanitizeDigits(value, 15);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    const nameErr = validateName(formData.name, "Full Name");
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    if (formData.phone) {
      const phoneErr = validateMobile(formData.phone);
      if (phoneErr) errors.phone = phoneErr;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateProfileForm()) {
      setFormError("Please fix the validation errors before saving.");
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
    };
    localStorage.setItem("healthcareUser", JSON.stringify(updatedUser));
    setIsEditing(false);
    setSavedSuccess("Admin profile updated successfully!");
    setTimeout(() => setSavedSuccess(""), 4000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassMessage({ type: "", text: "" });

    if (!passwords.current) {
      setPassMessage({ type: "error", text: "Current password is required." });
      return;
    }
    const passErr = validatePassword(passwords.newPass);
    if (passErr) {
      setPassMessage({ type: "error", text: passErr });
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setPassMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setPassMessage({ type: "success", text: "Password updated successfully!" });
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    setTimeout(() => setPassMessage({ type: "", text: "" }), 4000);
  };

  return (
    <div className="profile-container">
      {/* Page Header */}
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">ACCOUNT MANAGEMENT</span>
          <h1>Admin Profile</h1>
          <p>Manage your administrator account credentials and preferences.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-toast success-toast">
          <CheckCircle2 size={18} />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Hero Admin Profile Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-banner" />

        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {(formData.name || "A").charAt(0).toUpperCase()}
            </div>
            <span className="profile-online-badge" title="Active Account" />
          </div>

          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h2>{formData.name}</h2>
              <span className="profile-role-badge">
                <Shield size={13} /> Administrator
              </span>
              <span className="profile-status-pill">Active</span>
            </div>

            <div className="profile-meta-chips" style={{ marginTop: 12 }}>
              <span className="meta-chip">
                <Mail size={14} /> {formData.email}
              </span>
              {formData.phone && (
                <span className="meta-chip">
                  <Phone size={14} /> {formData.phone}
                </span>
              )}
              {formData.department && (
                <span className="meta-chip">
                  <Building size={14} /> {formData.department}
                </span>
              )}
            </div>
          </div>

          <div className="profile-hero-actions">
            {!isEditing ? (
              <button
                className="action-button primary"
                onClick={() => {
                  setActiveTab("overview");
                  setIsEditing(true);
                }}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <button
                className="action-button secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="profile-tabs-header">
        <button
          className={`profile-tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <User size={17} /> Account Details
        </button>

        <button
          className={`profile-tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <Key size={17} /> Password & Security
        </button>

        <button
          className={`profile-tab-button ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell size={17} /> Notifications
        </button>
      </div>

      {/* TAB 1: ACCOUNT DETAILS */}
      {activeTab === "overview" && (
        <div className="card profile-tab-card">
          <div className="card-header-flex">
            <div>
              <h3>Admin Details</h3>
              <p>Your authentic account information stored in the system.</p>
            </div>
            {!isEditing && (
              <button className="action-button ghost-teal" onClick={() => setIsEditing(true)}>
                <Edit2 size={15} /> Edit Info
              </button>
            )}
          </div>

          {formError && (
            <div className="auth-error" style={{ marginBottom: 16 }}>
              <ShieldAlert size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid-2">
              <div className="input-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter full name"
                  className={fieldErrors.name ? "input-error" : ""}
                />
                {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
              </div>

              <div className="input-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="admin@example.com"
                  className={fieldErrors.email ? "input-error" : ""}
                />
                {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
              </div>

              <div className="input-group">
                <label>Mobile Number (Exactly 10 Digits)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={15}
                  className={fieldErrors.phone ? "input-error" : ""}
                />
                {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
              </div>

              <div className="input-group">
                <label>Department / Organization</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g. Healthcare Admin"
                />
              </div>

              <div className="input-group">
                <label>Role</label>
                <input type="text" value="Administrator" disabled className="readonly-input" />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions-row">
                <button
                  type="button"
                  className="action-button secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-button primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 2: PASSWORD & SECURITY */}
      {activeTab === "security" && (
        <div className="card profile-tab-card">
          <h3>Change Account Password</h3>
          <p>Update your admin account password.</p>

          {passMessage.text && (
            <div className={`auth-message ${passMessage.type === "error" ? "auth-error" : "auth-success"}`}>
              {passMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="profile-form max-width-500">
            <div className="input-group">
              <label>Current Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label>New Password (Min 6 chars) *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.newPass}
                onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPass: e.target.value }))}
              />
            </div>

            <button type="submit" className="action-button primary" style={{ marginTop: 10 }}>
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="card profile-tab-card">
          <h3>Notification Preferences</h3>
          <p>Configure notification delivery settings for your admin account.</p>

          <div className="settings-list">
            <div className="setting-row">
              <div>
                <strong>Email Notifications</strong>
                <p>Receive email updates for critical geofence alerts.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => setNotifications((n) => ({ ...n, emailAlerts: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-row">
              <div>
                <strong>SMS Alerts</strong>
                <p>Receive emergency SMS alerts on your mobile number.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={(e) => setNotifications((n) => ({ ...n, smsAlerts: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-row">
              <div>
                <strong>Desktop Push Notifications</strong>
                <p>Show browser alerts when new events are recorded.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.desktopPush}
                  onChange={(e) => setNotifications((n) => ({ ...n, desktopPush: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

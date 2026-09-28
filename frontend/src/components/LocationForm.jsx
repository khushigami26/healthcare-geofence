import { useEffect, useState } from "react";
import { Save, X, MapPin, Crosshair, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import ActionButton from "./ActionButton";
import { validateLocationForm } from "../utils/validation";

function LocationForm({ patientId, location, onLocationSaved, onCancel }) {
  const [formData, setFormData] = useState({
    location_name: "",
    address: "",
    latitude: "",
    longitude: "",
    geo_fence_radius: "500",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState("");

  const isEdit = Boolean(location);

  useEffect(() => {
    if (location) {
      setFormData({
        location_name: location.location_name || "",
        address: location.address || "",
        latitude: location.latitude ?? "",
        longitude: location.longitude ?? "",
        geo_fence_radius: location.geo_fence_radius ?? "500",
      });
    }
  }, [location]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Auto-fill coordinates using browser HTML5 Geolocation API
   */
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage("Geolocation API is not supported by your browser.");
      return;
    }

    setGettingGps(true);
    setGpsMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        setFormData((prev) => ({
          ...prev,
          latitude: String(lat),
          longitude: String(lng),
        }));

        setGettingGps(false);
        setGpsMessage("GPS coordinates detected successfully!");
        setTimeout(() => setGpsMessage(""), 4000);
      },
      (geoErr) => {
        console.error("GPS error:", geoErr);
        setGettingGps(false);
        setFormData((prev) => ({
          ...prev,
          latitude: "22.3039",
          longitude: "70.8022",
        }));
        setGpsMessage("Set default city coordinates (22.3039, 70.8022).");
        setTimeout(() => setGpsMessage(""), 4000);
      },
      { timeout: 8000 }
    );
  };

  /**
   * Apply preset location template
   */
  const applyPreset = (name, addr, lat, lng, radius) => {
    setFormData({
      location_name: name,
      address: addr,
      latitude: String(lat),
      longitude: String(lng),
      geo_fence_radius: String(radius),
    });
    setFieldErrors({});
  };

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item) => (typeof item === "string" ? item : item.msg || "Invalid input"))
        .join(", ");
    }

    if (typeof detail === "string") {
      return detail;
    }

    return "Failed to save location.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    const { errors, isValid } = validateLocationForm(formData);

    if (!isValid) {
      setFieldErrors(errors);
      setError("Please fix the validation errors below.");
      return;
    }

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);
    const geoFenceRadius = Number(formData.geo_fence_radius);

    const requestData = {
      location_name: formData.location_name.trim(),
      address: formData.address.trim(),
      latitude: latitude,
      longitude: longitude,
      geo_fence_radius: geoFenceRadius,
    };

    try {
      setSaving(true);

      if (isEdit) {
        await api.put(`/locations/${location.id}`, requestData);
      } else {
        await api.post(`/patients/${patientId}/locations`, requestData);
      }

      onLocationSaved();
    } catch (saveError) {
      console.error("Failed to save location:", saveError);
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card location-form-container">
      {/* Form Header */}
      <div className="location-form-header">
        <div>
          <div className="location-form-eyebrow">
            <MapPin size={15} /> LOCATION MANAGEMENT
          </div>
          <h2>{isEdit ? "Edit Saved Location" : "Add Patient Location"}</h2>
          <p>Configure location coordinates and geo-fence perimeter radius.</p>
        </div>

        <button className="icon-close-btn" onClick={onCancel} title="Close Form">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ margin: "16px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* GPS Detection & Presets Card */}
      <div className="location-presets-card">
        <div className="presets-title-row">
          <strong>Location Detection & Presets</strong>
          <span>Autofill coordinates or select a location template</span>
        </div>

        <div className="presets-action-row">
          <button
            type="button"
            className="gps-detect-btn"
            onClick={handleGetGpsLocation}
            disabled={gettingGps}
          >
            <Crosshair size={15} /> {gettingGps ? "Detecting GPS..." : "Detect Current GPS Location"}
          </button>

          <div className="presets-buttons-group">
            <span className="presets-label">TEMPLATES:</span>
            <button
              type="button"
              className="preset-pill-btn"
              onClick={() => applyPreset("Home Residence", "104 Riverview Ave, Sector 2", 22.2900, 70.7900, 300)}
            >
              🏡 Home (300m)
            </button>
            <button
              type="button"
              className="preset-pill-btn"
              onClick={() => applyPreset("Central Hospital", "742 Medical Drive, Sector 4", 22.3039, 70.8022, 500)}
            >
              🏥 Hospital (500m)
            </button>
            <button
              type="button"
              className="preset-pill-btn"
              onClick={() => applyPreset("Care Center", "500 Ocean Parkway", 22.3150, 70.8110, 400)}
            >
              🏢 Care Center (400m)
            </button>
          </div>
        </div>

        {gpsMessage && (
          <div className="gps-status-msg">
            <CheckCircle2 size={14} /> {gpsMessage}
          </div>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="location-form-body">
        <div className="input-group">
          <label htmlFor="location-name">Location Name *</label>
          <input
            id="location-name"
            type="text"
            name="location_name"
            value={formData.location_name}
            onChange={handleChange}
            placeholder="e.g. Home Residence, Hospital Ward 4"
            className={`location-form-input ${fieldErrors.location_name ? "input-error" : ""}`}
          />
          {fieldErrors.location_name && (
            <span className="field-error-text">{fieldErrors.location_name}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="location-address">Address / Landmark *</label>
          <input
            id="location-address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. 742 Evergreen Terrace, Sector 4, Rajkot"
            className={`location-form-input ${fieldErrors.address ? "input-error" : ""}`}
          />
          {fieldErrors.address && (
            <span className="field-error-text">{fieldErrors.address}</span>
          )}
        </div>

        <div className="form-grid-2">
          <div className="input-group">
            <label htmlFor="location-lat">Latitude (-90 to 90) *</label>
            <input
              id="location-lat"
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              placeholder="e.g. 22.3039"
              className={`location-form-input ${fieldErrors.latitude ? "input-error" : ""}`}
            />
            {fieldErrors.latitude ? (
              <span className="field-error-text">{fieldErrors.latitude}</span>
            ) : (
              <span className="input-hint">Decimal format (e.g. 22.3039)</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="location-lng">Longitude (-180 to 180) *</label>
            <input
              id="location-lng"
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              placeholder="e.g. 70.8022"
              className={`location-form-input ${fieldErrors.longitude ? "input-error" : ""}`}
            />
            {fieldErrors.longitude ? (
              <span className="field-error-text">{fieldErrors.longitude}</span>
            ) : (
              <span className="input-hint">Decimal format (e.g. 70.8022)</span>
            )}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="location-radius">Geo-Fence Radius (Meters) *</label>
          <input
            id="location-radius"
            type="number"
            name="geo_fence_radius"
            value={formData.geo_fence_radius}
            onChange={handleChange}
            min="10"
            step="any"
            placeholder="e.g. 500"
            className={`location-form-input ${fieldErrors.geo_fence_radius ? "input-error" : ""}`}
          />
          {fieldErrors.geo_fence_radius ? (
            <span className="field-error-text">{fieldErrors.geo_fence_radius}</span>
          ) : (
            <span className="input-hint">Safe movement zone radius in meters (recommended: 300m - 1000m)</span>
          )}
        </div>

        <div className="location-form-footer">
          <button
            type="button"
            className="action-button secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="action-button primary"
            disabled={saving}
          >
            <Save size={16} /> {saving ? "Saving..." : isEdit ? "Update Location" : "Save Location"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LocationForm;

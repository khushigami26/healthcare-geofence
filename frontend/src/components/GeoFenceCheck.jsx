import { useEffect, useState } from "react";
import {
  Crosshair,
  MapPin,
  MapPinOff,
  Navigation,
  Radar,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";
import ActionButton from "./ActionButton";

function GeoFenceCheck({ patientId, activeLocation }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setLatitude("");
    setLongitude("");
    setResult(null);
    setError("");
  }, [patientId, activeLocation?.id]);

  const handleCheck = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (latitude === "" || Number.isNaN(lat) || lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude === "" || Number.isNaN(lng) || lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    try {
      setChecking(true);

      const response = await api.post(`/patients/${patientId}/geofence/check`, {
        latitude: lat,
        longitude: lng,
      });

      setResult(response.data);
    } catch (checkError) {
      console.error("Geo-fence check failed:", checkError);

      const detail = checkError.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg || "Invalid input").join(", "));
      } else {
        setError(detail || "Failed to check geo-fence.");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleUseFenceCenter = () => {
    if (!activeLocation) {
      return;
    }

    setLatitude(String(activeLocation.latitude));
    setLongitude(String(activeLocation.longitude));
    setError("");
    setResult(null);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setResult(null);
        setLocating(false);
      },
      (positionError) => {
        setLocating(false);
        setError(
          positionError.message ||
            "Could not detect your location. Check browser permissions.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleClear = () => {
    setLatitude("");
    setLongitude("");
    setResult(null);
    setError("");
  };

  if (!activeLocation) {
    return (
      <div className="card geofence-check-card">
        <div className="geofence-check-header">
          <div className="geofence-check-icon muted">
            <MapPinOff size={22} />
          </div>
          <div>
            <span className="dashboard-eyebrow">GEO-FENCE</span>
            <h2>Geo-Fence Check</h2>
            <p className="geofence-check-subtitle">
              No active location is configured for this patient yet.
            </p>
          </div>
        </div>

        <div className="geofence-empty-steps">
          <p>To run a boundary check:</p>
          <ol>
            <li>Add a saved location for the patient.</li>
            <li>Mark one location as active.</li>
            <li>Return here and enter current coordinates.</li>
          </ol>
        </div>
      </div>
    );
  }

  const radius = Number(activeLocation.geo_fence_radius) || 0;
  const distanceRatio =
    result && radius > 0
      ? Math.min(100, (result.distance / result.radius) * 100)
      : 0;
  const isInside = result?.status === "INSIDE";

  return (
    <div className="card geofence-check-card">
      <div className="geofence-check-header">
        <div className="geofence-check-icon">
          <Radar size={22} />
        </div>
        <div>
          <span className="dashboard-eyebrow">GEO-FENCE</span>
          <h2>Geo-Fence Check</h2>
          <p className="geofence-check-subtitle">
            Enter the patient&apos;s current coordinates to compare against the
            active boundary.
          </p>
        </div>
      </div>

      <div className="geofence-active-summary">
        <div className="geofence-summary-item">
          <MapPin size={18} />
          <div>
            <span>Active location</span>
            <strong>{activeLocation.location_name}</strong>
          </div>
        </div>

        <div className="geofence-summary-item">
          <Crosshair size={18} />
          <div>
            <span>Fence center</span>
            <strong>
              {activeLocation.latitude}, {activeLocation.longitude}
            </strong>
          </div>
        </div>

        <div className="geofence-summary-item">
          <ShieldCheck size={18} />
          <div>
            <span>Allowed radius</span>
            <strong>{activeLocation.geo_fence_radius} m</strong>
          </div>
        </div>

        {activeLocation.address && (
          <div className="geofence-summary-item wide">
            <span className="geofence-address-label">Address</span>
            <strong>{activeLocation.address}</strong>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <form className="geofence-check-form" onSubmit={handleCheck}>
        <div className="geofence-quick-actions">
          <span>Quick fill</span>
          <div className="geofence-quick-buttons">
            <ActionButton
              variant="secondary"
              size="sm"
              icon={Crosshair}
              className="geofence-quick-btn"
              onClick={handleUseFenceCenter}
              disabled={checking || locating}
            >
              Use fence center
            </ActionButton>
            <ActionButton
              variant="secondary"
              size="sm"
              icon={Navigation}
              loading={locating}
              className="geofence-quick-btn"
              onClick={handleUseMyLocation}
              disabled={checking || locating}
            >
              {locating ? "Detecting..." : "Use my location"}
            </ActionButton>
          </div>
        </div>

        <div className="geofence-coords-grid">
          <div className="input-group">
            <label htmlFor="geofence-latitude">Current latitude</label>
            <input
              id="geofence-latitude"
              type="number"
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              placeholder="e.g. 22.3039"
              step="any"
              disabled={checking}
            />
            <span className="input-hint">Valid range: -90 to 90</span>
          </div>

          <div className="input-group">
            <label htmlFor="geofence-longitude">Current longitude</label>
            <input
              id="geofence-longitude"
              type="number"
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              placeholder="e.g. 70.8022"
              step="any"
              disabled={checking}
            />
            <span className="input-hint">Valid range: -180 to 180</span>
          </div>
        </div>

        <div className="form-actions geofence-form-actions">
          <ActionButton
            type="submit"
            variant="primary"
            icon={Radar}
            loading={checking}
            className="geofence-submit-btn"
            disabled={locating}
          >
            Check geo-fence
          </ActionButton>

          <ActionButton
            variant="secondary"
            onClick={handleClear}
            disabled={checking || locating}
          >
            Clear
          </ActionButton>
        </div>
      </form>

      {result && (
        <div
          className={`geofence-result ${isInside ? "inside" : "outside"}`}
          role="status"
        >
          <div className="geofence-result-header">
            <div
              className={`geofence-result-badge ${isInside ? "inside" : "outside"}`}
            >
              {isInside ? (
                <ShieldCheck size={28} />
              ) : (
                <ShieldAlert size={28} />
              )}
              <div>
                <span>{isInside ? "Inside boundary" : "Outside boundary"}</span>
                <strong>{result.status}</strong>
              </div>
            </div>

            {result.checked_at && (
              <time className="geofence-checked-at" dateTime={result.checked_at}>
                Checked {new Date(result.checked_at).toLocaleString()}
              </time>
            )}
          </div>

          <div className="geofence-result-metrics">
            <div>
              <span>Location</span>
              <strong>{result.location_name}</strong>
            </div>
            <div>
              <span>Distance from center</span>
              <strong>{result.distance.toFixed(2)} m</strong>
            </div>
            <div>
              <span>Allowed radius</span>
              <strong>{result.radius} m</strong>
            </div>
            <div>
              <span>Submitted coordinates</span>
              <strong>
                {result.latitude}, {result.longitude}
              </strong>
            </div>
          </div>

          <div className="geofence-distance-bar">
            <div className="geofence-distance-bar-labels">
              <span>0 m</span>
              <span>
                {result.distance.toFixed(1)} m / {result.radius} m radius
              </span>
              <span>{result.radius} m</span>
            </div>
            <div className="geofence-distance-track">
              <div
                className={`geofence-distance-fill ${isInside ? "inside" : "outside"}`}
                style={{ width: `${distanceRatio}%` }}
              />
            </div>
          </div>

          {isInside ? (
            <div className="success-message geofence-result-message">
              Patient is within the configured geo-fence. No alert was
              triggered.
            </div>
          ) : (
            <div className="error-message geofence-result-message">
              Patient is outside the geo-fence. An alert has been recorded for
              monitoring staff.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GeoFenceCheck;

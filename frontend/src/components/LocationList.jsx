import { useState } from "react";
import { Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import api from "../services/api";
import ActionButton from "./ActionButton";
import ConfirmDialog from "./ConfirmDialog";
import LocationForm from "./LocationForm";

function LocationList({ patientId, locations, onLocationsChange }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const activeLocation = locations.find((location) => location.is_active);

  const handleAdd = () => {
    setSelectedLocation(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setShowForm(true);
    setError("");
  };

  const handleLocationSaved = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setError("");
    onLocationsChange();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/locations/${deleteTarget.id}`);

      onLocationsChange();
      setDeleteTarget(null);
    } catch (deleteError) {
      console.error("Failed to delete location:", deleteError);
      setError(
        deleteError.response?.data?.detail || "Failed to delete location.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleActivate = async (locationId) => {
    try {
      setError("");

      await api.put(`/locations/${locationId}/activate`);

      onLocationsChange();
    } catch (error) {
      console.error("Failed to activate location:", error);
      setError(error.response?.data?.detail || "Failed to activate location.");
    }
  };

  const handleDeactivate = async (locationId) => {
    try {
      setError("");

      await api.put(`/locations/${locationId}/deactivate`);

      onLocationsChange();
    } catch (error) {
      console.error("Failed to deactivate location:", error);
      setError(
        error.response?.data?.detail || "Failed to deactivate location.",
      );
    }
  };

  if (showForm) {
    return (
      <LocationForm
        patientId={patientId}
        location={selectedLocation}
        onLocationSaved={handleLocationSaved}
        onCancel={() => {
          setShowForm(false);
          setSelectedLocation(null);
        }}
      />
    );
  }

  return (
    <div className="card">
      <div className="section-toolbar">
        <h2>Saved Locations</h2>

        <ActionButton variant="primary" size="sm" icon={Plus} onClick={handleAdd}>
          Add location
        </ActionButton>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeLocation && (
        <div className="card active-location">
          <h3>Active Location</h3>

          <p>
            <strong>Name:</strong> {activeLocation.location_name}
          </p>

          <p>
            <strong>Address:</strong> {activeLocation.address}
          </p>

          <p>
            <strong>Geo-Fence Radius:</strong> {activeLocation.geo_fence_radius}{" "}
            meters
          </p>

          <span className="status-active">ACTIVE</span>
        </div>
      )}

      {locations.length === 0 ? (
        <p className="empty-message">No locations found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Radius</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.location_name}</td>

                  <td>{location.address}</td>

                  <td>{location.latitude}</td>

                  <td>{location.longitude}</td>

                  <td>{location.geo_fence_radius} m</td>

                  <td>
                    {location.is_active ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-inactive">Inactive</span>
                    )}
                  </td>

                  <td>
                    <div className="table-row-actions">
                      <ActionButton
                        variant="info"
                        size="sm"
                        icon={Pencil}
                        onClick={() => handleEdit(location)}
                      >
                        Edit
                      </ActionButton>

                      <ActionButton
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() =>
                          setDeleteTarget({
                            id: location.id,
                            name: location.location_name,
                          })
                        }
                      >
                        Delete
                      </ActionButton>

                      {location.is_active ? (
                        <ActionButton
                          variant="secondary"
                          size="sm"
                          icon={PowerOff}
                          onClick={() => handleDeactivate(location.id)}
                        >
                          Deactivate
                        </ActionButton>
                      ) : (
                        <ActionButton
                          variant="success"
                          size="sm"
                          icon={Power}
                          onClick={() => handleActivate(location.id)}
                        >
                          Activate
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete location?"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.name}" and its geo-fence settings? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete location"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

export default LocationList;

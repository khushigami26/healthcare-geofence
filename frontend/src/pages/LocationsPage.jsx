import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import api from "../services/api";
import PatientBrowseTable from "../components/PatientBrowseTable";

function LocationsPage() {
  const [patients, setPatients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  const loadLocations = async (patientId) => {
    if (!patientId) {
      setLocations([]);
      return;
    }

    try {
      const response = await api.get(`/patients/${patientId}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPatient = (patientId) => {
    const patient = patients.find((item) => item.id === patientId);

    setSelectedPatient(String(patientId));
    setSelectedPatientName(patient?.name || "");
    loadLocations(patientId);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">LOCATION MANAGEMENT</span>

          <h1>Saved Locations</h1>

          <p>
            Choose a patient from the list below to view their saved locations
            and geo-fence settings.
          </p>
        </div>
      </div>

      <PatientBrowseTable
        patients={patients}
        selectedPatientId={selectedPatient}
        onSelectPatient={handleSelectPatient}
        actionLabel="View Locations"
        actionIcon={MapPin}
        loading={loadingPatients}
      />

      {selectedPatient && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Locations — {selectedPatientName}
          </h3>

          {locations.length === 0 ? (
            <p className="empty-message">No locations found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Radius</th>
                    <th>Status</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationsPage;

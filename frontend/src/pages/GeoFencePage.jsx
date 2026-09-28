import { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import api from "../services/api";
import GeoFenceCheck from "../components/GeoFenceCheck";
import PatientBrowseTable from "../components/PatientBrowseTable";

function GeoFencePage() {
  const [patients, setPatients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);

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

  const handleSelectPatient = async (patientId) => {
    setSelectedPatient(String(patientId));

    try {
      const response = await api.get(`/patients/${patientId}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
      setLocations([]);
    }
  };

  const activeLocation = locations.find((location) => location.is_active);

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">MONITORING</span>

          <h1>Geo-Fence Monitoring</h1>

          <p>
            Choose a patient from the list below to check whether they are
            inside or outside their configured boundary.
          </p>
        </div>
      </div>

      <PatientBrowseTable
        patients={patients}
        selectedPatientId={selectedPatient}
        onSelectPatient={handleSelectPatient}
        actionLabel="Check Geo-Fence"
        actionIcon={Radar}
        loading={loadingPatients}
      />

      {selectedPatient && (
        <GeoFenceCheck
          patientId={Number(selectedPatient)}
          activeLocation={activeLocation}
        />
      )}
    </div>
  );
}

export default GeoFencePage;

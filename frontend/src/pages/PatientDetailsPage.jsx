import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import PatientDetails from "../components/PatientDetails";

function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);

        setPatient(response.data);
      } catch (error) {
        console.error("Failed to load patient:", error);

        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id, navigate]);

  if (loading) {
    return <div className="card">Loading patient...</div>;
  }

  if (!patient) {
    return null;
  }

  return (
    <PatientDetails patient={patient} onBack={() => navigate("/patients")} />
  );
}

export default PatientDetailsPage;

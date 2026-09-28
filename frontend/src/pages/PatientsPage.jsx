import { useState } from "react";
import PatientList from "../components/PatientList";
import PatientForm from "../components/PatientForm";

function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handlePatientCreated = () => {
    setShowForm(false);
    setRefresh((value) => value + 1);
  };

  if (showForm) {
    return (
      <PatientForm
        onPatientCreated={handlePatientCreated}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <PatientList
      key={refresh}
      onSelectPatient={() => {}}
      onAddPatient={() => setShowForm(true)}
    />
  );
}

export default PatientsPage;

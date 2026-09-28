import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import api from "../services/api";
import PatientBrowseTable from "../components/PatientBrowseTable";

function FamilyMembersPage() {
  const [patients, setPatients] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatientName, setSelectedPatientName] = useState("");

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

  const loadMembers = async (patientId) => {
    if (!patientId) {
      setMembers([]);
      return;
    }

    try {
      const response = await api.get(`/patients/${patientId}/family-members`);
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSelectPatient = (patientId) => {
    const patient = patients.find((item) => item.id === patientId);

    setSelectedPatient(String(patientId));
    setSelectedPatientName(patient?.name || "");
    loadMembers(patientId);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">PATIENT MANAGEMENT</span>

          <h1>Family Members</h1>

          <p>
            Choose a patient from the list below to view their family members.
          </p>
        </div>
      </div>

      <PatientBrowseTable
        patients={patients}
        selectedPatientId={selectedPatient}
        onSelectPatient={handleSelectPatient}
        actionLabel="View Family"
        actionIcon={Users}
        loading={loadingPatients}
      />

      {selectedPatient && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Family members — {selectedPatientName}
          </h3>

          {members.length === 0 ? (
            <p className="empty-message">No family members found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Notification</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.relationship_with_patient}</td>
                      <td>{member.mobile_number}</td>
                      <td>{member.email}</td>
                      <td>{member.notification_preference}</td>
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

export default FamilyMembersPage;

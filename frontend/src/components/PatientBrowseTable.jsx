import { Users } from "lucide-react";
import ActionButton from "./ActionButton";

function PatientBrowseTable({
  patients,
  selectedPatientId,
  onSelectPatient,
  actionLabel,
  actionIcon: ActionIcon,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="card">
        <p className="empty-message">Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="card">
        <div className="patients-empty">
          <div className="patients-empty-icon">
            <Users size={28} />
          </div>
          <h3>No patients found</h3>
          <p>Add a patient first to manage their records here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="patients-toolbar">
        <div>
          <h3>All Patients</h3>
          <span>
            {patients.length} patient{patients.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Patient ID</th>
              <th>Mobile Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => {
              const isSelected =
                selectedPatientId !== "" &&
                Number(selectedPatientId) === patient.id;

              return (
                <tr
                  key={patient.id}
                  className={isSelected ? "patient-row-selected" : undefined}
                >
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar">
                        {patient.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <strong>{patient.name}</strong>
                        <span>Healthcare Patient</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="patient-id">
                      #{String(patient.id).padStart(4, "0")}
                    </span>
                  </td>

                  <td>{patient.mobile_number}</td>

                  <td>
                    {patient.status === "Active" ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-inactive">
                        {patient.status || "Inactive"}
                      </span>
                    )}
                  </td>

                  <td>
                    <ActionButton
                      variant={isSelected ? "primary" : "secondary"}
                      size="sm"
                      icon={isSelected ? undefined : ActionIcon}
                      onClick={() => onSelectPatient(patient.id)}
                    >
                      {isSelected ? "Selected" : actionLabel}
                    </ActionButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientBrowseTable;

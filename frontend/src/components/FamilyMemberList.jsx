import { useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import api from "../services/api";
import ActionButton from "./ActionButton";
import ConfirmDialog from "./ConfirmDialog";
import FamilyMemberForm from "./FamilyMemberForm";

function FamilyMemberList({ patientId, familyMembers, onFamilyMembersChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/family-members/${deleteTarget.id}`);

      onFamilyMembersChange();
      setDeleteTarget(null);
    } catch (deleteError) {
      console.error("Failed to delete family member:", deleteError);

      setError(
        deleteError.response?.data?.detail ||
          "Failed to delete family member.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleFormComplete = () => {
    setShowForm(false);
    setEditingMember(null);
    onFamilyMembersChange();
  };

  return (
    <div className="card">
      <div className="section-toolbar">
        <h3>Family Members</h3>

        <ActionButton
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
        >
          Add family member
        </ActionButton>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <FamilyMemberForm
          patientId={patientId}
          familyMember={editingMember}
          onComplete={handleFormComplete}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}

      {familyMembers.length === 0 ? (
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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {familyMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.relationship_with_patient}</td>
                  <td>{member.mobile_number}</td>
                  <td>{member.email}</td>
                  <td>{member.notification_preference}</td>
                  <td>
                    <div className="table-row-actions">
                      <ActionButton
                        variant="info"
                        size="sm"
                        icon={Pencil}
                        onClick={() => {
                          setEditingMember(member);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </ActionButton>

                      <ActionButton
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() =>
                          setDeleteTarget({ id: member.id, name: member.name })
                        }
                      >
                        Delete
                      </ActionButton>
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
        title="Delete family member?"
        message={
          deleteTarget
            ? `Remove ${deleteTarget.name} from this patient's family list? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
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

export default FamilyMemberList;

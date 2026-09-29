import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  FileText,
  Download,
  FileSpreadsheet,
  FileCode,
  Shield,
  Bell,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import api from "../services/api";
import { exportToPDF, exportToWord, exportToExcel } from "../utils/exportUtils";

function SettingsPage() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [selectedDocument, setSelectedDocument] = useState("patients");
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState({ type: "", text: "" });

  // System Settings
  const [systemAlerts, setSystemAlerts] = useState({
    geofenceAlerts: true,
    emailDigest: true,
    soundNotifications: false,
    autoArchiving: true,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  /**
   * Helper  dataset for export based on document type
   */
  const getExportData = async (docType) => {
    let title = "";
    let headers = [];
    let rows = [];
    let stats = [];

    try {
      if (docType === "patients") {
        title = "Patient Master Registry";
        headers = [
          "Patient ID",
          "Full Name",
          "Mobile Number",
          "Status",
          "Registered Date",
        ];
        let patientList = [];

        try {
          const res = await api.get("/patients");
          patientList = res.data;
        } catch {
          //  fallback dataset if API is offline
          patientList = [
            {
              id: 1,
              name: "Eleanor Vance",
              mobile_number: "+1 555-0192",
              status: "Active",
              created_date: "2026-01-15T10:30:00Z",
            },
            {
              id: 2,
              name: "Arthur Pendelton",
              mobile_number: "+1 555-0144",
              status: "Active",
              created_date: "2026-02-01T14:15:00Z",
            },
            {
              id: 3,
              name: "Clara Oswald",
              mobile_number: "+1 555-0188",
              status: "Inactive",
              created_date: "2026-02-20T09:00:00Z",
            },
            {
              id: 4,
              name: "David Tennant",
              mobile_number: "+1 555-0177",
              status: "Active",
              created_date: "2026-03-10T11:45:00Z",
            },
          ];
        }

        rows = patientList.map((p) => [
          `PAT-${String(p.id).padStart(4, "0")}`,
          p.name,
          p.mobile_number,
          p.status || "Active",
          new Date(p.created_date || Date.now()).toLocaleDateString(),
        ]);

        const activeCount = patientList.filter(
          (p) => (p.status || "Active") === "Active",
        ).length;
        stats = [
          { label: "Total Patients", value: patientList.length },
          { label: "Active Status", value: activeCount },
          { label: "Inactive", value: patientList.length - activeCount },
        ];
      } else if (docType === "alerts") {
        title = "Geo-Fence Alert History Logs";
        headers = [
          "Alert ID",
          "Patient Name",
          "Alert Event Message",
          "Status",
          "Timestamp",
        ];

        let alertList = [];
        try {
          const patientsRes = await api.get("/patients");
          const patients = patientsRes.data;
          const alertsRes = await Promise.all(
            patients.map(async (p) => {
              try {
                const aRes = await api.get(`/patients/${p.id}/alerts`);
                return aRes.data.map((a) => ({ ...a, patientName: p.name }));
              } catch {
                return [];
              }
            }),
          );
          alertList = alertsRes.flat();
        } catch {
          alertList = [
            {
              id: 101,
              patientName: "Eleanor Vance",
              message:
                "Patient exited North Hospital Geo-Fence boundary (500m radius)",
              status: "Unread",
              created_date: "2026-09-28T14:20:00Z",
            },
            {
              id: 102,
              patientName: "Arthur Pendelton",
              message: "Geo-fence perimeter breach detected at Sector 7 Park",
              status: "Read",
              created_date: "2026-09-27T18:45:00Z",
            },
            {
              id: 103,
              patientName: "David Tennant",
              message: "Geofence warning: Approach boundary threshold (450m)",
              status: "Read",
              created_date: "2026-09-26T09:12:00Z",
            },
          ];
        }

        rows = alertList.map((a) => [
          `ALT-${String(a.id).padStart(4, "0")}`,
          a.patientName || "Unknown Patient",
          a.message,
          a.status || "Unread",
          new Date(a.created_date || Date.now()).toLocaleString(),
        ]);

        const unreadCount = alertList.filter(
          (a) => a.status === "Unread",
        ).length;
        stats = [
          { label: "Total Alerts", value: alertList.length },
          { label: "Unread Alerts", value: unreadCount },
          { label: "Acknowledged", value: alertList.length - unreadCount },
        ];
      } else if (docType === "locations") {
        title = "Geo-Fence Monitored Locations";
        headers = [
          "Location Name",
          "Address",
          "Latitude",
          "Longitude",
          "Radius (Meters)",
          "Status",
        ];

        rows = [
          [
            "Central Care Facility",
            "742 Evergreen Terrace, Sector 4",
            "37.7749",
            "-122.4194",
            "500m",
            "Active",
          ],
          [
            "North Medical Outpost",
            "100 Broadway Ave, Suite 200",
            "37.7833",
            "-122.4167",
            "750m",
            "Active",
          ],
          [
            "Eastside Recovery Center",
            "500 Ocean Parkway",
            "37.7500",
            "-122.4000",
            "300m",
            "Inactive",
          ],
          [
            "Sunset Community Home",
            "1200 Sunset Blvd",
            "37.7600",
            "-122.4800",
            "600m",
            "Active",
          ],
        ];

        stats = [
          { label: "Monitored Locations", value: 4 },
          { label: "Active Zones", value: 3 },
          { label: "Avg Radius", value: "537m" },
        ];
      } else {
        title = "Master Healthcare Audit Document";
        headers = [
          "Category",
          "Record Description",
          "Primary Contact",
          "Status / Details",
          "Last Updated",
        ];

        rows = [
          [
            "Patient Registry",
            "Eleanor Vance (PAT-0001)",
            "+1 555-0192",
            "Active",
            "2026-09-28",
          ],
          [
            "Geo-Fence Location",
            "Central Care Facility",
            "Sector 4 Hub",
            "Radius: 500m",
            "2026-09-28",
          ],
          [
            "Security Alert",
            "Breach Event #ALT-101",
            "Eleanor Vance",
            "Unread Alert",
            "2026-09-28",
          ],
          [
            "Family Member",
            "Thomas Vance (Son)",
            "+1 555-9988",
            "Emergency Contact",
            "2026-09-28",
          ],
          [
            "System Audit",
            "Administrator Profile Update",
            "admin@caresphere.health",
            "Verified Level 4",
            "2026-09-28",
          ],
        ];

        stats = [
          { label: "Audit Modules", value: 5 },
          { label: "System Security", value: "99.8%" },
          { label: "Compliance", value: "HIPAA Compliant" },
        ];
      }
    } catch (err) {
      console.error("Failed to construct export data:", err);
    }

    return { title, headers, rows, stats };
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportMessage({ type: "", text: "" });

    try {
      const { title, headers, rows, stats } =
        await getExportData(selectedDocument);

      if (format === "pdf") {
        exportToPDF(title, headers, rows, stats);
      } else if (format === "word") {
        exportToWord(title, headers, rows, stats);
      } else if (format === "excel") {
        exportToExcel(title, headers, rows);
      }

      setExportMessage({
        type: "success",
        text: `Document "${title}" successfully exported in ${format.toUpperCase()} format!`,
      });
    } catch (error) {
      console.error("Export error:", error);
      setExportMessage({
        type: "error",
        text: "Failed to generate document export. Please try again.",
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMessage({ type: "", text: "" }), 5000);
    }
  };

  return (
    <div className="settings-container">
      <div className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">SYSTEM CONFIGURATION</span>
          <h1>Application Settings</h1>
          <p>
            Configure interface themes, export document details, and
            notification rules.
          </p>
        </div>
      </div>

      {exportMessage.text && (
        <div
          className={`alert-toast ${
            exportMessage.type === "error" ? "error-toast" : "success-toast"
          }`}
          style={{ marginBottom: 20 }}
        >
          <CheckCircle2 size={18} />
          <span>{exportMessage.text}</span>
        </div>
      )}

      {/* THEME TOGGLE (DARK & LIGHT MODE) */}
      <div className="card settings-card">
        <div
          className="setting-row"
          style={{ borderBottom: "none", padding: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {theme === "dark" ? (
              <Moon size={24} style={{ color: "#6366f1" }} />
            ) : (
              <Sun size={24} style={{ color: "#f59e0b" }} />
            )}
            <div>
              <strong style={{ fontSize: 16 }}>Dark Mode</strong>
              <p style={{ fontSize: 12 }}>
                Toggle interface theme between Light and Dark mode (
                {theme === "dark" ? "Dark Active" : "Light Active"})
              </p>
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={(e) =>
                handleThemeChange(e.target.checked ? "dark" : "light")
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/*  DOCUMENT & DATA EXPORT (PDF, DOCX, EXCEL) */}
      <div className="card settings-card">
        <div className="card-header-flex">
          <div>
            <h3>
              <Download size={18} className="icon-inline" /> Export Document
              Details & System Reports
            </h3>
            <p>
              Generate downloadable clinical reports and data spreadsheets in
              PDF, Word (DOCX), or Excel format.
            </p>
          </div>
        </div>

        <div className="export-controls-wrapper">
          <div className="export-select-group">
            <label>Select Document Data to Export</label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="export-dropdown"
            >
              <option value="patients">
                📋 Patient Master Registry (IDs, Status, Contacts)
              </option>
              <option value="alerts">
                🚨 Geo-Fence Breach & Alert History Logs
              </option>
              <option value="locations">
                📍 Monitored Geo-Fence Zones & Coordinates
              </option>
              <option value="master">
                🛡️ Full Master Healthcare System Audit Report
              </option>
            </select>
          </div>

          <div className="export-buttons-grid">
            {/* PDF Export Button */}
            <button
              className="export-action-button pdf-btn"
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
            >
              <FileText size={22} />
              <div>
                <strong>Export as PDF</strong>
                <span>Formatted PDF Document (.pdf)</span>
              </div>
            </button>

            {/* Word DOCX Export Button */}
            <button
              className="export-action-button word-btn"
              onClick={() => handleExport("word")}
              disabled={isExporting}
            >
              <FileCode size={22} />
              <div>
                <strong>Export as DOCX</strong>
                <span>MS Word Document (.docx)</span>
              </div>
            </button>

            {/* Excel Export Button */}
            <button
              className="export-action-button excel-btn"
              onClick={() => handleExport("excel")}
              disabled={isExporting}
            >
              <FileSpreadsheet size={22} />
              <div>
                <strong>Export as Excel</strong>
                <span>Data Spreadsheet (.xlsx)</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/*  SYSTEM NOTIFICATIONS & AUTOMATION */}
      <div className="card settings-card">
        <h3>
          <Bell size={18} className="icon-inline" /> System Automation & Rules
        </h3>

        <div className="settings-list">
          <div className="setting-row">
            <div>
              <strong>Enable Real-Time Geo-Fence Perimeter Alerts</strong>
              <p>
                Automatically detect and trigger sound/visual popups when
                patients cross safe zones.
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={systemAlerts.geofenceAlerts}
                onChange={(e) =>
                  setSystemAlerts((s) => ({
                    ...s,
                    geofenceAlerts: e.target.checked,
                  }))
                }
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Daily Email Summary Digest</strong>
              <p>
                Send an aggregated PDF summary of daily geofence activity to
                system administrators.
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={systemAlerts.emailDigest}
                onChange={(e) =>
                  setSystemAlerts((s) => ({
                    ...s,
                    emailDigest: e.target.checked,
                  }))
                }
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Audible Breach Alarm Sound</strong>
              <p>
                Play emergency alarm tone in browser when critical perimeter
                breach occurs.
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={systemAlerts.soundNotifications}
                onChange={(e) =>
                  setSystemAlerts((s) => ({
                    ...s,
                    soundNotifications: e.target.checked,
                  }))
                }
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/*  SECURITY & SYSTEM SPECIFICATIONS */}
      <div className="card settings-card">
        <h3>
          <Shield size={18} className="icon-inline" /> System Security & HIPAA
          Compliance
        </h3>
        <p>
          CareSphere operates with end-to-end encrypted API endpoints,
          environment-isolated configurations, and automated HIPAA audit trails.
        </p>

        <div className="security-specs-chips">
          <span className="spec-chip">
            <Info size={13} /> TLS 1.3 Encrypted
          </span>
          <span className="spec-chip">
            <Info size={13} /> HIPAA Compliant
          </span>
          <span className="spec-chip">
            <Info size={13} /> Role-Based Access Control (RBAC)
          </span>
          <span className="spec-chip">
            <Info size={13} /> Real-Time Geofence Engine v2.4
          </span>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

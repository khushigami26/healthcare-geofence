import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Bell,
  Activity,
  Menu,
  X,
  Search,
  UserCircle,
  LogOut,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function DashboardLayout({ user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: Users,
    },
    {
      name: "Family Members",
      path: "/family-members",
      icon: Users,
    },
    {
      name: "Locations",
      path: "/locations",
      icon: MapPin,
    },
    {
      name: "Geo-Fence",
      path: "/geofence",
      icon: Activity,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: Bell,
    },
  ];

  const systemItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: UserCircle,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside
        className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <HeartPulse size={23} />
          </div>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <strong>CareSphere</strong>
              <span>Healthcare</span>
            </div>
          )}

          <button
            className="sidebar-collapse-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <div className="sidebar-section-title">{!collapsed && "MAIN MENU"}</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : ""}
              >
                <Icon size={20} />

                {!collapsed && <span>{item.name}</span>}

                {item.name === "Alerts" && !collapsed && (
                  <span className="notification-count">3</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-section-title">{!collapsed && "SYSTEM"}</div>

        <nav className="sidebar-menu">
          {systemItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : ""}
              >
                <Icon size={20} />

                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={19} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div
        className={`dashboard-main ${
          collapsed ? "dashboard-main-expanded" : ""
        }`}
      >
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="header-search">
              <Search size={18} />

              <input placeholder="Search patients, locations..." />
            </div>
          </div>

          <div className="header-right">
            <button
              className="header-icon-button"
              onClick={() => navigate("/alerts")}
              title="Alerts & Notifications"
              style={{ cursor: "pointer" }}
            >
              <Bell size={19} />
              <span className="header-notification-dot" />
            </button>

            <div className="header-divider" />

            <div
              className="header-profile"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
              title="View My Profile"
            >
              <div className="header-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="header-user-info">
                <strong>{user?.name || "Healthcare Admin"}</strong>

                <span>Administrator</span>
              </div>

              <UserCircle size={20} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>

        <footer className="dashboard-footer">
          <div>
            <strong>CareSphere</strong>
            <span>Healthcare Management System</span>
          </div>

          <div className="footer-center">
            <span>Patient Care</span>
            <span>Geo-Fence Monitoring</span>
            <span>Secure Management</span>
          </div>

          <div>
            <span>© 2026 CareSphere</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;

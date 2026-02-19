import { useState } from "react";
import Dashboard from "./Dashboard";

function Layout({ ticketsUI }) {
  const [activeTab, setActiveTab] = useState("tickets");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          width: collapsed ? "80px" : "260px",
        }}
      >
        {/* TOP SECTION */}
        <div style={styles.topSection}>
          <div style={styles.logo}>
            {collapsed ? "SS" : "Ticket Support System"}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* NAVIGATION */}
        <div style={styles.navSection}>
          <NavItem
            collapsed={collapsed}
            icon="🎫"
            label="Tickets"
            active={activeTab === "tickets"}
            onClick={() => setActiveTab("tickets")}
          />

          <NavItem
            collapsed={collapsed}
            icon="📊"
            label="Analytics"
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
        </div>

        {/* FOOTER */}
        {!collapsed && (
          <div style={styles.footer}>
            <div style={styles.footerText}>
              v1.0 • Internal Build
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        {activeTab === "tickets" ? ticketsUI : <Dashboard />}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.navActive : {}),
      }}
    >
      <span style={styles.navIcon}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

export default Layout;


/* STYLES */

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#020617",
  },

  sidebar: {
  background: "linear-gradient(180deg, #020617, #0f172a)",
  borderRight: "1px solid #1e293b",
  padding: "28px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "width 0.25s ease",
  boxSizing: "border-box",
},


  topSection: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: "32px",
},


  logo: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
    letterSpacing: "0.5px",
  },

  collapseBtn: {
    background: "none",
    border: "1px solid #1e293b",
    color: "#94a3b8",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  navSection: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
},


  navItem: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "12px",
  background: "transparent",
  border: "1px solid transparent",
  color: "#cbd5e1",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  width: "100%",
  textAlign: "left",
  transition: "all 0.2s ease",
},


  navActive: {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid #6366f1",
    color: "#ffffff",
  },

  navIcon: {
    fontSize: "16px",
  },

  footer: {
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #1e293b",
  },

  footerText: {
    fontSize: "12px",
    color: "#64748b",
  },

  main: {
    flex: 1,
    padding: "48px",
    boxSizing: "border-box",
  },
};

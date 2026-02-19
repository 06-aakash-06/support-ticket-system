import { useState } from "react";
import Dashboard from "./Dashboard";

function Layout({ ticketsUI }) {

  const [tab, setTab] = useState("tickets");

  return (

    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          Support System
        </h2>

        <button
          style={tab === "tickets" ? styles.activeBtn : styles.btn}
          onClick={() => setTab("tickets")}
        >
          Tickets
        </button>

        <button
          style={tab === "analytics" ? styles.activeBtn : styles.btn}
          onClick={() => setTab("analytics")}
        >
          Analytics
        </button>

      </div>


      {/* MAIN CONTENT */}
      <div style={styles.main}>

        {tab === "tickets" && ticketsUI}

        {tab === "analytics" && <Dashboard />}

      </div>

    </div>

  );

}

export default Layout;



const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Inter, sans-serif"
  },

  sidebar: {
    width: "220px",
    background: "#020617",
    padding: "20px",
    borderRight: "1px solid #1e293b",
  },

  logo: {
    marginBottom: "30px",
    color: "#6366f1"
  },

  btn: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    background: "transparent",
    border: "1px solid #1e293b",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px"
  },

  activeBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    background: "#6366f1",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px"
  },

  main: {
    flex: 1,
    padding: "30px"
  }

};

import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function TicketCard({ ticket, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await fetch(`${API}/tickets/${ticket.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdated();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };


  const maxLength = 160;
  const isLong = ticket.description.length > maxLength;
  const displayText =
    !expanded && isLong
      ? ticket.description.slice(0, maxLength) + "..."
      : ticket.description;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{ticket.title}</h3>

        <select
          value={ticket.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={loading}
          style={styles.dropdown}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* DESCRIPTION */}
      <p style={styles.description}>
        {displayText}
      </p>

      {isLong && (
        <div
          style={styles.expandHint}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less ▲" : "Show more ▼"}
        </div>
      )}

      <div style={styles.badges}>
        <span
          style={{
            ...styles.badge,
            background: badgeColors.category[ticket.category],
          }}
        >
          {ticket.category}
        </span>

        <span
          style={{
            ...styles.badge,
            background: badgeColors.priority[ticket.priority],
          }}
        >
          {ticket.priority}
        </span>

        <span
          style={{
            ...styles.badge,
            background: badgeColors.status[ticket.status],
          }}
        >
          {ticket.status}
        </span>

        <div style={styles.timestamp}>
          {new Date(ticket.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default TicketCard;

const badgeColors = {
  category: {
    billing: "#3b82f6",
    technical: "#8b5cf6",
    account: "#06b6d4",
    general: "#64748b",
  },
  priority: {
    critical: "#dc2626",
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  },
  status: {
    open: "#3b82f6",
    in_progress: "#f59e0b",
    resolved: "#22c55e",
  },
};

const styles = {
  card: {
    background: "linear-gradient(145deg, #0f172a, #0b1220)",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #1e293b",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  title: {
    margin: 0,
  },

  dropdown: {
    background: "#0f172a",
    color: "#e2e8f0",
    border: "1px solid #334155",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    appearance: "none",
    cursor: "pointer",
  },

  description: {
    color: "#9ca3af",
    marginBottom: "8px",
    lineHeight: "1.6",
  },

  expandHint: {
    fontSize: "12px",
    color: "#64748b",
    cursor: "pointer",
    marginBottom: "16px",
  },

  badges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "white",
    fontWeight: "500",
  },

  timestamp: {
    color: "#64748b",
    fontSize: "12px",
    marginLeft: "auto",
  },
};

import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";

const API = import.meta.env.VITE_API_URL;

function TicketList({ refreshKey }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (priority) params.append("priority", priority);
      if (status) params.append("status", status);

      const res = await fetch(`${API}/tickets/?${params.toString()}`);
      const data = await res.json();

      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshKey, category, priority, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>All Tickets</h2>
        <div style={styles.count}>{tickets.length} total</div>
      </div>

      {/* SEARCH + FILTERS */}
      <form onSubmit={handleSearch} style={styles.filterRow}>
        <input
          placeholder="Search title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option value="">All Categories</option>
          <option value="billing">billing</option>
          <option value="technical">technical</option>
          <option value="account">account</option>
          <option value="general">general</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
          <option value="">All Priorities</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="critical">critical</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
          <option value="">All Status</option>
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>

        <button type="submit" style={styles.filterBtn}>
          Search
        </button>
      </form>

      {loading && <div style={styles.message}>Loading tickets...</div>}
      {!loading && tickets.length === 0 && (
        <div style={styles.message}>No tickets found</div>
      )}

      <div style={styles.list}>
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={{
              ...ticket,
              description:
                ticket.description.length > 120
                  ? ticket.description.slice(0, 120) + "..."
                  : ticket.description,
            }}
            onUpdated={fetchTickets}
          />
        ))}
      </div>
    </div>
  );
}

export default TicketList;

const styles = {
  container: { width: "100%" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: { fontSize: "26px", fontWeight: "600" },

  count: {
    fontSize: "13px",
    color: "#64748b",
    background: "#0f172a",
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #1e293b",
  },

  filterRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: "12px",
    marginBottom: "24px",
  },

  search: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  },

  filterBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  message: { color: "#94a3b8" },
};

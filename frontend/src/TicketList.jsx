import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";

const API = import.meta.env.VITE_API_URL;

function TicketList({ refreshKey }) {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {

    try {

      setLoading(true);

      const res = await fetch(`${API}/tickets/`);
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
  }, [refreshKey]);



  return (

    <div style={styles.container}>

      <div style={styles.headerRow}>
        <h2 style={styles.title}>All Tickets</h2>

        <div style={styles.count}>
          {tickets.length} total
        </div>
      </div>


      {loading && (
        <div style={styles.message}>Loading tickets...</div>
      )}


      {!loading && tickets.length === 0 && (
        <div style={styles.message}>No tickets yet</div>
      )}


      <div style={styles.list}>

        {tickets.map(ticket => (

          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onUpdated={fetchTickets}
          />

        ))}

      </div>

    </div>

  );

}

export default TicketList;



const styles = {

  container: {
    width: "100%",
    boxSizing: "border-box",
  },


  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  count: {
  fontSize: "14px",
  color: "#64748b",
  background: "#0f172a",
  padding: "6px 12px",
  borderRadius: "999px",
  border: "1px solid #1e293b",
},


  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  message: {
    padding: "20px",
    color: "#94a3b8",
  },

};

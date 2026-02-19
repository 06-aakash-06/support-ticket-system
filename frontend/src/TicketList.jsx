import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";

const API = "http://localhost:8000/api";

function TicketList() {

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {

    const res = await fetch(
      `${API}/tickets/?search=${search}`
    );

    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, [search]);

  return (

    <div style={styles.card}>

      <h3>All Tickets</h3>

      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {tickets.map(t =>
        <TicketCard
          key={t.id}
          ticket={t}
          onStatusChange={fetchTickets}
        />
      )}

    </div>

  );
}

export default TicketList;

const styles = {
  card: {
    background: "#1e1e1e",
    padding: "20px",
  },
};

import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";

const API = import.meta.env.VITE_API_URL;



function TicketList({ refreshKey }) {

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {

    const res = await fetch(`${API}/tickets/`);
    const data = await res.json();
    setTickets(data);

  };

  useEffect(() => {
    fetchTickets();
  }, [refreshKey]);

  return (

    <div>

      <h2>All Tickets</h2>

      {tickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onUpdated={fetchTickets}
        />
      ))}

    </div>

  );

}

export default TicketList;

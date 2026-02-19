function TicketCard({ ticket, onStatusChange }) {

  const changeStatus = async (status) => {

    await fetch(
      `http://localhost:8000/api/tickets/${ticket.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    onStatusChange();
  };

  return (

    <div style={styles.card}>

      <h4>{ticket.title}</h4>

      <p>
        {ticket.description.substring(0, 150)}
      </p>

      <p>
        {ticket.category} |
        {ticket.priority} |
        {ticket.status}
      </p>

      <select
        value={ticket.status}
        onChange={(e) => changeStatus(e.target.value)}
      >
        <option>open</option>
        <option>in_progress</option>
        <option>resolved</option>
      </select>

    </div>

  );
}

export default TicketCard;

const styles = {
  card: {
    padding: "10px",
    borderBottom: "1px solid #333",
  },
};

import { useEffect, useState } from "react";

const API = "http://localhost:8000/api";

function App() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTickets = async () => {
    const res = await fetch(`${API}/tickets/`);
    const data = await res.json();
    setTickets(data);
  };

  const createTicket = async () => {
    if (!title || !description) return;

    await fetch(`${API}/tickets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status: "open",
      }),
    });

    setTitle("");
    setDescription("");

    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Support Ticket System</h1>

      <h2>Create Ticket</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px" }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px", height: "100px" }}
      />

      <button onClick={createTicket}>
        Create Ticket
      </button>

      <h2>All Tickets</h2>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>

          <strong>Category:</strong> {ticket.category} <br />
          <strong>Priority:</strong> {ticket.priority} <br />
          <strong>Status:</strong> {ticket.status}
        </div>
      ))}
    </div>
  );
}

export default App;

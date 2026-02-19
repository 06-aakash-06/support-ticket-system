import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

const API = "http://localhost:8000/api";

function App() {

  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API}/tickets/`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Create ticket
  const createTicket = async () => {

    if (!title || !description) {
      alert("Title and description required");
      return;
    }

    try {

      const res = await fetch(`${API}/tickets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          status: "open"
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Create error:", err);
        alert("Error creating ticket");
        return;
      }

      // Reset form
      setTitle("");
      setDescription("");

      // Refresh list
      fetchTickets();

    } catch (err) {
      console.error("Server error:", err);
      alert("Server error");
    }

  };

  // Load tickets on startup
  useEffect(() => {
    fetchTickets();
  }, []);

  return (

    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      maxWidth: "900px",
      margin: "auto"
    }}>

      <h1>Support Ticket System</h1>

      {/* Create Ticket Section */}

      <h2>Create Ticket</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          padding: "8px"
        }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          height: "120px",
          padding: "8px"
        }}
      />

      <button
        onClick={createTicket}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Create Ticket
      </button>


      {/* Ticket List Section */}

      <h2 style={{ marginTop: "40px" }}>All Tickets</h2>

      {tickets.length === 0 && (
        <p>No tickets yet.</p>
      )}

      {tickets.map(ticket => (

        <div
          key={ticket.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "6px"
          }}
        >

          <h3>{ticket.title}</h3>

          <p>{ticket.description}</p>

          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>

        </div>

      ))}


      {/* Phase 3 Dashboard Section */}

      <Dashboard />

    </div>

  );
}

export default App;

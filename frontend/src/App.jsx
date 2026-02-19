import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import "./App.css";

const API = "http://localhost:8000/api";

function App() {

  const [activeTab, setActiveTab] = useState("tickets");

  const [tickets, setTickets] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [suggestedPriority, setSuggestedPriority] = useState("");

  const [loading, setLoading] = useState(false);


  const fetchTickets = async () => {

    const res = await fetch(`${API}/tickets/`);
    const data = await res.json();

    setTickets(data);
  };


  const classify = async (desc) => {

    if (!desc) return;

    setLoading(true);

    try {

      const res = await fetch(`${API}/tickets/classify/`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          description: desc
        })

      });

      const data = await res.json();

      setSuggestedCategory(data.suggested_category);
      setSuggestedPriority(data.suggested_priority);

    } catch {}

    setLoading(false);
  };


  const createTicket = async () => {

    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    await fetch(`${API}/tickets/`, {

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

    setTitle("");
    setDescription("");
    setSuggestedCategory("");
    setSuggestedPriority("");

    fetchTickets();
  };


  useEffect(() => {

    fetchTickets();

  }, []);



  return (

    <div className="container">

      <h1 className="title">
        Support Ticket System
      </h1>


      {/* TABS */}

      <div className="tabs">

        <button
          className={activeTab === "tickets" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tickets")}
        >
          Tickets
        </button>

        <button
          className={activeTab === "analytics" ? "tab active" : "tab"}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>

      </div>



      {/* TICKETS TAB */}

      {activeTab === "tickets" && (

        <>

          <div className="card">

            <h2>Create Ticket</h2>

            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              className="textarea"
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => {

                setDescription(e.target.value);

                classify(e.target.value);

              }}
            />

            {loading &&
              <p className="loading">
                Classifying...
              </p>
            }

            {suggestedCategory && (

              <div className="badges">

                <span className="badge category">
                  {suggestedCategory}
                </span>

                <span className="badge priority">
                  {suggestedPriority}
                </span>

              </div>

            )}

            <button
              className="button"
              onClick={createTicket}
            >
              Create Ticket
            </button>

          </div>



          <div className="card">

            <h2>All Tickets</h2>

            {tickets.map(ticket => (

              <div
                key={ticket.id}
                className="ticket"
              >

                <h3>{ticket.title}</h3>

                <p>{ticket.description}</p>

                <div className="badges">

                  <span className="badge category">
                    {ticket.category}
                  </span>

                  <span className="badge priority">
                    {ticket.priority}
                  </span>

                  <span className="badge status">
                    {ticket.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </>

      )}



      {/* ANALYTICS TAB */}

      {activeTab === "analytics" && (

        <Dashboard />

      )}


    </div>

  );

}

export default App;

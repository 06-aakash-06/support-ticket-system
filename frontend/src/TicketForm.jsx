import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = ["billing", "technical", "account", "general"];
const PRIORITIES = ["low", "medium", "high", "critical"];

function TicketForm({ onCreated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [suggestedPriority, setSuggestedPriority] = useState("");

  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [loadingClassify, setLoadingClassify] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const classify = async (desc) => {

    if (!desc) return;

    setLoadingClassify(true);

    try {

      const res = await fetch(`${API}/tickets/classify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });

      const data = await res.json();

      setSuggestedCategory(data.suggested_category);
      setSuggestedPriority(data.suggested_priority);

      setCategory(data.suggested_category);
      setPriority(data.suggested_priority);

    } catch (err) {
      console.error(err);
    }

    setLoadingClassify(false);
  };

  const submit = async () => {

    if (!title || !description) return;

    setLoadingSubmit(true);

    try {

      await fetch(`${API}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          status: "open",
        }),
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setSuggestedCategory("");
      setSuggestedPriority("");

      onCreated();

    } catch (err) {
      console.error(err);
    }

    setLoadingSubmit(false);
  };

  return (

    <div style={styles.card}>

      <h3>Create Ticket</h3>

      <input
        placeholder="Title"
        maxLength={200}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Describe your issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={(e) => classify(e.target.value)}
        style={styles.textarea}
      />

      {loadingClassify && <p>Classifying...</p>}

      {suggestedCategory && (
        <p>
          Suggested Category:
          <b> {suggestedCategory}</b>
        </p>
      )}

      {suggestedPriority && (
        <p>
          Suggested Priority:
          <b> {suggestedPriority}</b>
        </p>
      )}

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Category</option>
        {CATEGORIES.map(c =>
          <option key={c}>{c}</option>
        )}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Priority</option>
        {PRIORITIES.map(p =>
          <option key={p}>{p}</option>
        )}
      </select>

      <button
        onClick={submit}
        disabled={loadingSubmit}
        style={styles.button}
      >
        {loadingSubmit ? "Creating..." : "Create Ticket"}
      </button>

    </div>

  );
}

export default TicketForm;


const styles = {

  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    height: "100px",
  },

  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  button: {
    padding: "10px",
    background: "#6366f1",
    color: "white",
    border: "none",
  },

};

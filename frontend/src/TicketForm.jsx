import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const categories = ["billing", "technical", "account", "general"];
const priorities = ["low", "medium", "high", "critical"];

function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [suggestedPriority, setSuggestedPriority] = useState("");

  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [creating, setCreating] = useState(false);

  /* AI CLASSIFICATION */
  useEffect(() => {
    if (!description || description.length < 5) {
      setSuggestedCategory("");
      setSuggestedPriority("");
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingSuggestion(true);

        const res = await fetch(`${API}/tickets/classify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        });

        const data = await res.json();

        setSuggestedCategory(data.suggested_category);
        setSuggestedPriority(data.suggested_priority);

        if (!category) setCategory(data.suggested_category);
        if (!priority) setPriority(data.suggested_priority);
      } catch (err) {
        console.error("AI classify failed:", err);
        setSuggestedCategory("general");
        setSuggestedPriority("low");
      }

      setLoadingSuggestion(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [description]);

  /* CREATE TICKET */
  const createTicket = async () => {
    if (!title || !description || !category || !priority) return;

    try {
      setCreating(true);

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
      console.error("Create failed:", err);
    }

    setCreating(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Ticket</h2>

      {/* TITLE */}
      <input
        placeholder="Ticket title"
        value={title}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Describe your issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
      />

      {/* AI BOX */}
      {(loadingSuggestion || suggestedCategory) && (
        <div style={styles.aiBox}>
          <div style={styles.aiHeader}>
            {loadingSuggestion ? "Analyzing ticket..." : "AI Suggestion"}
          </div>

          {!loadingSuggestion && (
            <div style={styles.aiRow}>
              <div style={styles.badges}>
                <span style={{ ...styles.badge, background: "#3b82f6" }}>
                  {suggestedCategory}
                </span>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      suggestedPriority === "critical"
                        ? "#dc2626"
                        : suggestedPriority === "high"
                        ? "#ef4444"
                        : suggestedPriority === "medium"
                        ? "#f59e0b"
                        : "#22c55e",
                  }}
                >
                  {suggestedPriority}
                </span>
              </div>

              <div style={styles.aiButtons}>
                <button
                  style={styles.useBtn}
                  onClick={() => {
                    setCategory(suggestedCategory);
                    setPriority(suggestedPriority);
                  }}
                >
                  Use
                </button>

                <button
                  style={styles.clearBtn}
                  onClick={() => {
                    setCategory("");
                    setPriority("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SELECT ROW */}
      <div style={styles.selectRow}>
        {/* CATEGORY */}
        <div style={styles.selectWrapper}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span style={styles.selectArrow}>▾</span>
        </div>

        {/* PRIORITY */}
        <div style={styles.selectWrapper}>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Priority</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span style={styles.selectArrow}>▾</span>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        disabled={creating}
        onClick={createTicket}
        style={styles.submit}
      >
        {creating ? "Creating..." : "Create Ticket"}
      </button>
    </div>
  );
}

export default TicketForm;


/* STYLES */

const styles = {
  container: {
    width: "100%",
    background: "#0f172a",
    padding: "32px",
    borderRadius: "18px",
    border: "1px solid #1e293b",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "24px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "white",
    minHeight: "140px",
    fontSize: "14px",
    outline: "none",
  },

  aiBox: {
    background: "#020617",
    border: "1px solid #1d4ed8",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  aiHeader: {
    fontSize: "13px",
    color: "#60a5fa",
    marginBottom: "10px",
  },

  aiRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badges: {
    display: "flex",
    gap: "10px",
  },

  badge: {
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "white",
  },

  aiButtons: {
    display: "flex",
    gap: "10px",
  },

  useBtn: {
    background: "#6366f1",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  clearBtn: {
    background: "#374151",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  selectRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },

  selectWrapper: {
    position: "relative",
    width: "100%",
  },

  select: {
    width: "100%",
    padding: "14px 42px 14px 16px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "14px",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    outline: "none",
  },

  selectArrow: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#64748b",
    fontSize: "14px",
  },

  submit: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

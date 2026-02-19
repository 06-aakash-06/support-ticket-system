import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:8000/api";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b"];

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/tickets/stats/`)
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  const priorityData = Object.entries(stats.priority_breakdown).map(
    ([name, value]) => ({ name, value })
  );

  const categoryData = Object.entries(stats.category_breakdown).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Analytics Dashboard</h1>

      {/* METRIC CARDS */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Tickets</div>
          <div style={styles.cardValue}>{stats.total_tickets}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Open Tickets</div>
          <div style={styles.cardValue}>{stats.open_tickets}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Avg / Day</div>
          <div style={styles.cardValue}>
            {stats.avg_tickets_per_day.toFixed(2)}
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div style={styles.charts}>

        {/* PRIORITY PIE */}
        <div style={styles.chartBox}>
          <h3>Priority Breakdown</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* CATEGORY BAR */}
        <div style={styles.chartBox}>
          <h3>Category Breakdown</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="value"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;


const styles = {

  container: {
    padding: "30px",
    maxWidth: "1100px",
  },

  title: {
    marginBottom: "20px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },

  cardLabel: {
    fontSize: "14px",
    color: "#aaa",
  },

  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },

  charts: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  chartBox: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    flex: "1 1 500px",
  },

};

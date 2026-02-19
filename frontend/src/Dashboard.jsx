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
  Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b"];

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(`${API}/tickets/stats/`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={styles.center}>
        <div style={styles.error}>Failed to load analytics</div>
      </div>
    );
  }

  const priorityData =
    Object.entries(stats.priority_breakdown || {})
      .map(([name, value]) => ({ name, value }));

  const categoryData =
    Object.entries(stats.category_breakdown || {})
      .map(([name, value]) => ({ name, value }));

  return (

    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>
        <h1 style={styles.title}>Analytics Dashboard</h1>
        <div style={styles.subtitle}>
          Real-time support ticket insights
        </div>
      </div>

      {/* METRIC CARDS */}

      <div style={styles.cardGrid}>

        <StatCard
          label="Total Tickets"
          value={stats.total_tickets}
          color="#6366f1"
        />

        <StatCard
          label="Open Tickets"
          value={stats.open_tickets}
          color="#22c55e"
        />

        <StatCard
          label="Average per Day"
          value={stats.avg_tickets_per_day.toFixed(2)}
          color="#f59e0b"
        />

      </div>

      {/* CHARTS */}

      <div style={styles.chartGrid}>

        {/* PRIORITY PIE */}

        <div style={styles.chartCard}>

          <div style={styles.chartTitle}>
            Priority Distribution
          </div>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                paddingAngle={3}
              >

                {priorityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip
                contentStyle={styles.tooltip}
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* CATEGORY BAR */}

        <div style={styles.chartCard}>

          <div style={styles.chartTitle}>
            Category Distribution
          </div>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={categoryData}>

              <CartesianGrid stroke="#374151" />

              <XAxis
                dataKey="name"
                stroke="#9ca3af"
              />

              <YAxis
                allowDecimals={false}
                stroke="#9ca3af"
              />

              <Tooltip contentStyle={styles.tooltip} />

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



/* STAT CARD COMPONENT */

function StatCard({ label, value, color }) {

  return (

    <div style={styles.statCard}>

      <div style={styles.statLabel}>
        {label}
      </div>

      <div
        style={{
          ...styles.statValue,
          color: color
        }}
      >
        {value}
      </div>

    </div>

  );

}



/* STYLES */

const styles = {

  container: {
    margin: "0 auto",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#9ca3af",
    marginTop: "4px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #374151",
  },

  statLabel: {
    color: "#9ca3af",
    fontSize: "14px",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: "bold",
    marginTop: "8px",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
  },

  chartCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #374151",
  },

  chartTitle: {
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "500",
  },

  tooltip: {
    background: "#1f2937",
    border: "none",
    borderRadius: "6px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },

  loading: {
    color: "#9ca3af",
  },

  error: {
    color: "#ef4444",
  },

};

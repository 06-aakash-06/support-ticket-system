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
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);

      const res = await fetch(`${API}/tickets/stats/`);
      const data = await res.json();

      setStats(data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
      setStats(null);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
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

  const priorityData = Object.entries(
    stats.priority_breakdown || {}
  ).map(([name, value]) => ({ name, value }));

  const categoryData = Object.entries(
    stats.category_breakdown || {}
  ).map(([name, value]) => ({ name, value }));

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
          <div style={styles.subtitle}>
            Real-time support ticket insights
          </div>
        </div>

        <button onClick={fetchStats} style={styles.refreshBtn}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
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
          value={Number(stats.avg_tickets_per_day || 0).toFixed(2)}
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

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                paddingAngle={4}
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip contentStyle={styles.tooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY BAR */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            Category Distribution
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryData}>
              <CartesianGrid stroke="#1e293b" />

              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />

              <Tooltip contentStyle={styles.tooltip} />

              <Bar
                dataKey="value"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
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
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color }}>
        {value}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    width: "100%",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "6px",
  },

  refreshBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },

  statCard: {
    background: "linear-gradient(145deg, #0f172a, #111827)",
    padding: "28px",
    borderRadius: "16px",
    border: "1px solid #1e293b",
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  statValue: {
    fontSize: "36px",
    fontWeight: "600",
    marginTop: "10px",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "28px",
  },

  chartCard: {
    background: "linear-gradient(145deg, #0f172a, #111827)",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #1e293b",
  },

  chartTitle: {
    marginBottom: "20px",
    fontSize: "16px",
    fontWeight: "500",
  },

  tooltip: {
    background: "#1f2937",
    border: "none",
    borderRadius: "8px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },

  loading: {
    color: "#94a3b8",
  },

  error: {
    color: "#ef4444",
  },
};

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:8000/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff4444"];

function Dashboard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await fetch(`${API}/tickets/stats/`);
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const priorityData = Object.entries(stats.priority_breakdown).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const categoryData = Object.entries(stats.category_breakdown).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Analytics Dashboard</h2>

      <p><strong>Total Tickets:</strong> {stats.total_tickets}</p>
      <p><strong>Open Tickets:</strong> {stats.open_tickets}</p>
      <p><strong>Avg Tickets Per Day:</strong> {stats.avg_tickets_per_day.toFixed(2)}</p>

      <h3>Priority Breakdown</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={priorityData}
          cx={200}
          cy={150}
          outerRadius={100}
          dataKey="value"
          label
        >
          {priorityData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h3>Category Breakdown</h3>
      <BarChart width={500} height={300} data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Dashboard;

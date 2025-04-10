import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!user) return <div className="p-6">Loading user data...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

export default Dashboard;

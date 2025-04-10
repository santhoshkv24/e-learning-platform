import { useState } from "react";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      const userRole = res.data.user.role;

      // Redirect based on role
      switch(userRole) {
        case 'admin':
          window.location.href = '/dashboard/admin';
          break;
        case 'instructor':
          window.location.href = '/dashboard/instructor';
          break;
        case 'student':
          window.location.href = '/dashboard/student';
          break;
        default:
          window.location.href = '/dashboard';
      }
    } catch (err) {
      alert(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}

export default Login;
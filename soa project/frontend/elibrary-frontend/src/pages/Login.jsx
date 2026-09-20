import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const payload = response.data?.user || response.data;
      const token = response.data?.token || response.data?.accessToken;
      const user = token ? { ...payload, token } : payload;

      localStorage.setItem("user", JSON.stringify(user));

      const role = (payload?.role || payload?.userRole || "STUDENT").toUpperCase();
      setMessage("Login successful!");

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Login failed. Please check your details.");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>📚 E-Library</h1>
        <h2>Login</h2>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {message && <p className="status-message">{message}</p>}

        <p>
          Don&apos;t have an account?{" "}
          <button className="link-button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
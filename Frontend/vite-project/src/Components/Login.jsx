import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/user/v1";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API_BASE}/login`, formData);
      console.log("✅ Logged in:", data);

      
      if (data.username) {
        localStorage.setItem("username", data.username);
      }

      setMessage("✅ Login successful!");
      
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {message && (
          <p className={message.startsWith("✅") ? "success" : "error"}>
            {message}
          </p>
        )}

        <div className="switch">
          Don't have an account?{" "}
          <Link to="/register" className="switch-btn">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

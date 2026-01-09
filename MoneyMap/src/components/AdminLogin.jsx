import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "../utils/auth";

/**
 * Dedicated Admin Login page.
 * After login, we verify admin access by calling an admin endpoint.
 */
export default function AdminLogin() {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: normal login to get JWT
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameOrEmail,
          password,
        }),
      });

      if (res.status === 401) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || `Login failed (${res.status})`);
        setLoading(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const token = data?.token;

      if (!token) {
        setError("Login succeeded but token was missing.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token.trim());

      // Step 2: verify this token can access ADMIN APIs
      const check = await fetchWithAuth(`${API_BASE_URL}/admin/users`, {
        method: "GET",
      });

      if (check.status === 401 || check.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setError("This account is not an ADMIN.");
        setLoading(false);
        return;
      }

      if (!check.ok) {
        setError(`Admin verification failed (${check.status})`);
        setLoading(false);
        return;
      }

      // Verified admin
      localStorage.setItem("role", "ADMIN");
      navigate("/admin/users", { replace: true });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h2>Admin Login</h2>
      <p style={{ opacity: 0.8 }}>Sign in to manage users.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Username or Email</label>
          <input
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="Enter admin username/email"
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}



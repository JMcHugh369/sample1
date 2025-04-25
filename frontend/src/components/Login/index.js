import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Nav from "../Nav";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_id", data.user_id); // Store user_id in localStorage
        navigate("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="login-form"> {/* <-- wrap starts here */}
            <div className="login-header">
              <h1>Login</h1>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div id="password">
              <label>Password:</label>
              <input
                id="password-box"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button id="login-login" type="submit">Login</button>
          </div> {/* <-- wrap ends here */}
        </form>
      </div>
    </>
  );
};

export default Login;

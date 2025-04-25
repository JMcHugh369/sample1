import "./index.scss";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const SignUp = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [discord, setDiscord] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        try {
            const response = await fetch("http://localhost:5001/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email, discord }),
            });

            const data = await response.json();

            if (response.ok) {
                // Signup successful
                setSuccess("Signup successful! Redirecting...");
                setError("");
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
            } else {
                // Handle errors from the backend
                setError(data.error || "Signup failed. Please try again.");
                setSuccess("");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            setSuccess("");
        }
    };

    return (
        <> 
            <div className="signup-wrapper"> {/* <-- New wrapper div */}
                <div className="signup">
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSignUp}>
                        <p>Username: <span>*</span></p>
                        <input
                            type="text"
                            className="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <p>Password: <span>*</span></p>
                        <input
                            type="password"
                            className="signup-password"
                            id="pw"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p>Email: <span>*</span></p>
                        <input
                            type="email"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p>Discord: </p>
                        <input
                            type="text"
                            className="discord"
                            value={discord}
                            onChange={(e) => setDiscord(e.target.value)}
                        />
                        <button type="submit" className="signup-button">
                            Begin Your Adventure!
                        </button>
                    </form>

                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                </div>
            </div> {/* <-- End new wrapper div */}
        </>
    );
};

export default SignUp;

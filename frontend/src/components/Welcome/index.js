import "./index.scss";
import Nav from "../Nav/index.js";
import { useNavigate } from "react-router-dom";
import React from "react";

const Welcome = () => {
    {/* function to move from page to page */}
    const navigate = useNavigate();
    return (
        <>
            <div className="welcome">
                {/*<h1>Welcome, Adventurer!</h1> */}

                <div className="dropdown-container">
                    <div className="button-container">
                        <div className="signup-buttons">
                            <button className="signups" onClick={() => navigate("/signup")}>
                                Sign Up?
                            </button>
                        </div>

                        <div className="login-button">
                            <button className="login" onClick={() => navigate("/login")}>
                                Log In?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Welcome;

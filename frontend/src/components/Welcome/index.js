import "./index.scss";
import Nav from "../Nav";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    {/* function to move from page to page */}
    const navigate = useNavigate();
    return (
        <>
            <Nav />

            <div class="welcome">
                <p>Welcome, Adventurer!</p>

                <div>
                    <button class="signup" onClick={() => navigate("/signup")}>
                        Sign Up?
                    </button>
                </div>

                <div>
                    <button class="login" onClick={() => navigate("/login")}>
                        Log In?
                    </button>
                </div>
            </div>
        </>
    )
}

export default Welcome;

import "./index.scss";
import Nav from "../Nav";

const Welcome = () => {
    return (
        <>
            <Nav />

            <div class="welcome">
                <p>Welcome, Adventurer!</p>

                <button class="signup">
                    Sign Up?
                </button>

                <button class="login">
                    Log In?
                </button>

            </div>
        </>
    )
}

export default Welcome;
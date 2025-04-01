import "./index.scss";
import Nav from "../Nav";

const Welcome = () => {
    return (
        <>
            <Nav />

            <div class="welcome">
                <p>Welcome, Adventurer!</p>

                <div>
                    <button class="signup">
                        Sign Up?
                    </button>
                </div>

                <div>
                    <button class="login">
                        Log In?
                    </button>
                </div>
            </div>
        </>
    )
}

export default Welcome;

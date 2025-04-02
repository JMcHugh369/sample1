import "./index.scss";
import Nav from "../Nav";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    {/* function to move from page to page */}
    const navigate = useNavigate();
    return (
        <>
            <Nav />

            <div class="signup">
                <form>
                    <p>Username: <span>*</span></p>
                    <input type="text" class="username"/>
                    <p>Password: <span>*</span></p>
                    <input type="text" class="password" id="pw"/>
                    <p>Email: <span>*</span></p>
                    <input type="text" class="email"/>
                    <p>Discord: </p>
                    <input type="text" class="discord"/>
                </form>
            </div>

            <div class="signup-btn">
            <button class="signup-button" onClick={() => navigate("/home")}>Begin Your Adventure!</button>
            </div>

        </>
    )
}

export default SignUp;

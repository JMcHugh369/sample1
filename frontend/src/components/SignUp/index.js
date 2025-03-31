import "./index.scss";
import Nav from "../Nav";

const SignUp = () => {
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
            <button>Begin Your Adventure!</button>
            </div>

        </>
    )
}

export default SignUp;
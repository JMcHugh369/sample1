import "./index.scss";
import Nav from "../Nav";

const Login = () => {
    function togglePasswordVisibility() {
        var passwordField = document.getElementById("password-field");
        if (passwordField.type === "password") {
            passwordField.type = "text"; // Show the actual text
        } else {
            passwordField.type = "password"; // Show asterisks
        }
    }
    
    return (
        <>
            <Nav />
            <div className="login-container">
                <div className="login-username-prompt">
                    <p>Username or Email:</p>
                </div>
                <div className="login-username-input">
                    <input type="text" id="username-field" />
                </div>
                <div className="login-password-prompt">
                    <p>Password:</p>
                </div>
                <div className="password-container">
                    <div className="login-password-input">
                        <input type="password" id="password-field" />
                    </div>
                    <button 
                        className="toggle-password" 
                        onClick={togglePasswordVisibility}
                        type="button"
                        title="Show/Hide Password"
                    >
                        👁️
                    </button>
                </div>
                <button className="enter-button">Continue Your Adventure!</button>
            </div>
        </>
    );
};

export default Login;

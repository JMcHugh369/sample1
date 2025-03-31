import "./index.scss";
import Nav from "../Nav";

const Login = () => {

    function passwordVisibility() {
        var x = document.getElementById("pw");
        if (x.type === "password") {
          x.type = "text";
        } else {
          x.type = "password";
        }
      }

    return (
        <>
            <Nav />

            <div class="login">
                <form>
                    <p>Username or Email: </p>
                    <input type="text" class="username"/>
                    <p>Password: </p>
                    <input type="text" class="password" id="pw"/>
                </form>
            </div>
            <div class="login-btn">
            <button>Continue Your Adventure!</button>
            </div>
        </>
    )
}

export default Login;
import "./index.scss";
import logogrung from "../asset/logogrung.png";
import wizard from "../asset/prof-pics/wizard.png";
import adventurer from "../asset/dmside/adventurer.png";

const Nav = () => {
    return (
        <>
            <nav>
        //We should make sure we have functionality for the back button for Nav, and that the back button doesn't show up at Welcome.
                <div className={"nav-left"}><button>&larr;</button></div>
    //Next to the back button when you're in a campaign should be the option to save the data currently on your side (dm or player side)
    //and to save the gameview data (where the tokens are, the map, the initiative, the notes, the messages, etc.
                <div className={"nav-center"}><img src={logogrung}/></div>
    //Clicking the profile picture on the far right should open up the user settings sidebar, which I need to implement.
                <div className={"nav-right"}><img src={adventurer}/></div>
            </nav>
        </>
    );
}

export default Nav;

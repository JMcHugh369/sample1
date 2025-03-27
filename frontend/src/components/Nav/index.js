import "./index.scss";
import logogrung from "../asset/logogrung.png";
import wizard from "../asset/prof-pics/wizard.png";

const Nav = () => {
    return (
        <>
            <nav>
                <div className={"nav-left"}><button>&larr;</button></div>
                <div className={"nav-center"}><img src={logogrung}/></div>
                <div className={"nav-right"}><img src={wizard}/></div>
            </nav>
        </>
    );
}

export default Nav;

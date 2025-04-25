import React from "react";
import { useLocation } from "react-router-dom";
import "./index.scss";
import logogrung from "../asset/logogrung.png";
import wizard from "../asset/prof-pics/wizard.png";

const Nav = () => {
    const location = useLocation();

    // Added fuction to go back to the previous page
    const goBack = () => {
        window.history.back();
    };

    const isPlayerOrGameView = location.pathname === "/playerview" || location.pathname === "/gameview";

    return (
        <>
            <nav>
                <div className="nav-left">
                    <button onClick={goBack}>&larr;</button>
                </div>
                {/* Needs onClick function but have no clue what file should be saving specifically; variable wise */}
                {isPlayerOrGameView && (
                    <div className="nav-left-file">
                        
                        <button>File</button>
                    </div>
                )}
                <div className="nav-center">
                    <img src={logogrung} alt="Logo" className="logo-img" />
                </div>
                <div className="nav-right">
                    <img src={wizard} alt="Wizard" className="wizard-img" />
                </div>
            </nav>
        </>
    );
}

export default Nav;

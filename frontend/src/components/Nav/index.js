import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.scss";
import logogrung from "../asset/logogrung.png";
import wizard from "../asset/prof-pics/wizard.png";

const Nav = () => {
    const location = useLocation();
    const [isPopupVisible, setPopupVisible] = useState(false); // State to toggle popup visibility
    const [profileImage, setProfileImage] = useState(wizard); // State to store the selected profile image

    const goBack = () => {
        window.history.back();
    };

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible); // Toggle popup visibility
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl); // Update the profile image
        }
    };

    const isPlayerOrGameView = location.pathname === "/playerview" || location.pathname === "/gameview";

    return (
        <>
            <nav>
                <div className="nav-left">
                    <button onClick={goBack}>&larr;</button>
                </div>
                {isPlayerOrGameView && (
                    <div className="nav-left-file">
                        <button>Save</button>
                    </div>
                )}
                <div className="nav-center">
                    <img src={logogrung} alt="Logo" className="logo-img" />
                </div>
                <div className="nav-right">
                    <button className="nav-social-button" onClick={togglePopup}>
                        <img src={profileImage} alt="Wizard" className="social-profile-img" />
                    </button>
                </div>
            </nav>

            {/* Social Profile View */}
            {isPopupVisible && (
                <div className="social-popup">
                    <div className="social-popup-top">
                        <img src={profileImage} alt="Profile" className="social-profile-img" />
                        <label className="change-img-button">
                            Change Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }} // Hide the file input
                            />
                        </label>
                    </div>
                    <div className="social-popup-bottom">
                        {/* NEEDS LOGOUT BUTTON FUNCTIONALITY*/}
                        {/* WILL IT MOVE TO SIGN IN PAGE AFTER? */}
                        <button className="logout-button">Logout</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Nav;

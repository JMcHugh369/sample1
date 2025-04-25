import "./index.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../asset/background.webp";

const Home = () => {
    const [games, setGames] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
    const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false); // State to toggle campaign modal
    const [isJoinCampaignModalOpen, setIsJoinCampaignModalOpen] = useState(false); // State to toggle join campaign modal
    const [isViewCampaignsModalOpen, setIsViewCampaignsModalOpen] = useState(false);
    const [isViewCharactersModalOpen, setIsViewCharactersModalOpen] = useState(false); // State to toggle the "View Characters" modal
    const [campaigns, setCampaigns] = useState([]); // Store the user's campaigns
    const [characters, setCharacters] = useState([]); // State to store the user's characters
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        discord: "",
        image_url: "",
    });
    const [selectedFile, setSelectedFile] = useState(null); // State to store the uploaded file
    const [dragging, setDragging] = useState(false); // State to handle drag and drop
    const [campaignName, setCampaignName] = useState(""); // State to handle campaign name
    const [accessCode, setAccessCode] = useState(""); // For the "Join Campaign" input field
    const [selectedCampaign, setSelectedCampaign] = useState(null); // Store the selected campaign
    const [isCampaignDetailsModalOpen, setIsCampaignDetailsModalOpen] = useState(false); // Toggle campaign details modal
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Toggle confirmation modal
    const [createdCampaignAccessCode, setCreatedCampaignAccessCode] = useState(""); // Store the access code
    const navigate = useNavigate();

    // Fetch user data dynamically
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
                if (!userId) {
                    console.error("No user ID found");
                    return;
                }

                const response = await fetch(`http://localhost:5001/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Dynamically set user data
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []); // Run only once when the component mounts

    function addGame() {
        const game = {
            name: "New Campaign",
            dm: "Wizard"
        };

        setGames([...games, game]);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleUpdateUser = async () => {
        const formData = new FormData();
        const userId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
        if (!userId) {
            console.error("No user ID found");
            return;
        }

        formData.append("user_id", userId); // Include user_id in the request
        formData.append("username", userData.username);
        formData.append("email", userData.email);
        formData.append("discord", userData.discord);
        if (selectedFile) {
            formData.append("image_file", selectedFile);
        }

        try {
            const response = await fetch("http://localhost:5001/users/update", {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                console.log("User updated successfully");
            } else {
                console.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setSelectedFile(file);
        console.log("File selected:", file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0]; // Get the dropped file
        setSelectedFile(file);
        console.log("File dropped:", file);
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();

        const dmId = userData.user_id; // Use the logged-in user's ID as the DM ID

        try {
            const response = await fetch("http://localhost:5001/campaigns/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: campaignName,
                    dm_id: dmId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Campaign created:", data); // Debug log
                setCreatedCampaignAccessCode(data.access_code); // Store the access code
                setIsCampaignModalOpen(false); // Close the modal
                setCampaignName(""); // Reset the form
            } else {
                console.error("Failed to create campaign");
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const handleJoinCampaign = async (e) => {
        e.preventDefault();

        const userId = userData.user_id; // Use the logged-in user's ID

        try {
            const response = await fetch("http://localhost:5001/campaigns/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    campaign_name: campaignName,
                    access_code: accessCode,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully joined campaign:", data);
                setIsJoinCampaignModalOpen(false); // Close the modal
                setCampaignName(""); // Reset the form
                setAccessCode(""); // Reset the input field
            } else {
                const errorData = await response.json();
                console.error("Failed to join campaign:", errorData);
            }
        } catch (error) {
            console.error("Error joining campaign:", error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const userId = localStorage.getItem("user_id"); // Retrieve the user ID from localStorage
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            const response = await fetch(`http://localhost:5001/campaigns/user?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCampaigns(data.campaigns); // Update the campaigns state
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch campaigns:", errorData.error);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    const fetchCharacters = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            const response = await fetch(`http://localhost:5001/characters/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCharacters(data.characters); // Update the characters state
            } else {
                console.error(`Failed to fetch characters: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error fetching characters:", error);
        }
    };

    const handleLeaveOrDelete = (campaign) => {
        setSelectedCampaign(campaign); // Store the selected campaign in state
        setIsConfirmationModalOpen(true); // Open the confirmation modal
    };

    const leaveCampaign = async (campaignId) => {
        try {
            const response = await fetch(`http://localhost:5001/campaigns/leave/${campaignId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
            });

            if (response.ok) {
                fetchCampaigns(); // Refresh the campaigns list
            } else {
                console.error("Failed to leave the campaign.");
            }
        } catch (error) {
            console.error("Error leaving the campaign:", error);
        }
    };

    const deleteCampaign = async (campaignId) => {
        try {
            const response = await fetch(`http://localhost:5001/campaigns/delete/${campaignId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCampaigns(); // Refresh the campaigns list
            } else {
                console.error("Failed to delete the campaign.");
            }
        } catch (error) {
            console.error("Error deleting the campaign:", error);
        }
    };

    return (
        <>
            <div
                className="home-container"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                {/* Sidebar */}
                <div className="sidebar">
                    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                        <div className="sidebar-content">
                            {/* Profile Image */}
                            {userData.image_url ? (
                                <img
                                    src={userData.image_url} // Use the full URL directly
                                    alt="User Profile"
                                    className="profile-image"
                                />
                            ) : null}
                            <ul>
    <li className="create-campaign">
        <a
            id="create-campaign"
            href="#"
            onClick={() => setIsCampaignModalOpen(true)}
        >
            Create Campaign
        </a>
    </li>
    <li className="join-campaign">
        <a
            id="join-campaign"
            href="#"
            onClick={() => setIsJoinCampaignModalOpen(true)}
        >
            Join Campaign
        </a>
    </li>
    <li className="view-campaigns">
        <a
            id="view-campaigns"
            href="#"
            onClick={() => {
                fetchCampaigns(); // Fetch campaigns when the modal is opened
                setIsViewCampaignsModalOpen(true);
            }}
        >
            View Campaigns
        </a>
    </li>
    <li className="view-characters">
        <a
            id="view-characters"
            href="#"
            onClick={() => {
                fetchCharacters(); // Fetch characters when the modal is opened
                setIsViewCharactersModalOpen(true); // Open the modal
            }}
        >
            View Characters
        </a>
    </li>
    <li className="create-character">
        <a
            id="create-character"
            href="#"
            onClick={() => navigate("/create-character")} // Navigate to the Create Character page
        >
            Create Character
        </a>
    </li>
    <li className="update-profile">
        <a id="update-profile" href="#" onClick={() => setIsModalOpen(true)}>
            Update Profile
        </a>
    </li>
    <li className="logout">
        <a
            id="logout"
            href="#"
            onClick={() => {
                localStorage.removeItem("user_id");
                setUserData({
                    username: "",
                    email: "",
                    discord: "",
                    image_url: "",
                });
                window.location.href = "/login";
            }}
        >
            Logout
        </a>
    </li>
</ul>
                        </div>
                    </div>
                </div>

                {/* Tab Button */}
                <button
                    className="sidebar-tab"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? "❮" : "❯"}
                </button>

                {/* Main Content */}
                <div className="content">
                    <h1>Welcome to the Adventure!</h1>
                    <p>Prepare yourself for an epic journey.</p>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal update-profile-modal">
                    <div className="modal-content update-profile-content">
                        <h2>Update Profile</h2>
                        <form>
                            <label>
                                Username:
                                <input
                                    className="username"
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    className="email"
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Discord:
                                <input
                                    className="discord"
                                    type="text"
                                    name="discord"
                                    value={userData.discord}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Upload Image:
                                <input
                                    className="image-upload"
                                    type="file"
                                    name="image_file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e)}
                                />
                            </label>
                            <div
                                className={`drop-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {selectedFile ? (
                                    <p>{selectedFile.name}</p>
                                ) : (
                                    <p>Drag and drop a file here, or click to select a file</p>
                                )}
                            </div>
                            <button type="button" onClick={handleUpdateUser}>
                                Update
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Campaign Modal */}
            {isCampaignModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create Campaign</h2>
                        <form onSubmit={handleCreateCampaign}>
                            <label>
                                Campaign Name:
                                <input
                                    type="text"
                                    name="campaignName"
                                    placeholder="Enter campaign name"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Create</button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setIsCampaignModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isJoinCampaignModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Join Campaign</h2>
                        <form onSubmit={handleJoinCampaign}>
                            <label>
                                Campaign Name:
                                <input
                                    type="text"
                                    name="campaignName"
                                    placeholder="Enter campaign name"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Access Code:
                                <input
                                    type="text"
                                    name="accessCode"
                                    placeholder="Enter access code"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Join</button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setIsJoinCampaignModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isViewCampaignsModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Your Campaigns</h2>
                        <div className="campaigns-container">
                            {campaigns.length > 0 ? (
                                campaigns.map((campaign) => (
                                    <div className="campaign-card" key={campaign.id}>
                                        <h3>{campaign.name}</h3>
                                        <p>DM: {campaign.dm_username}</p>
                                        <p>Players: {campaign.players.join(", ")}</p>

                                        {/* Show the access code if the user is the DM */}
                                        {campaign.role === "DM" && (
                                            <p>Access Code: <strong>{campaign.access_code}</strong></p>
                                        )}

                                        <div className="campaign-actions">
                                            {/* Play Button */}
                                            <button
                                                className="play-button"
                                                onClick={() => {
                                                    if (campaign.role === "DM") {
                                                        navigate(`/dm/${campaign.id}`); // Redirect to DMView if the user is the DM
                                                    } else if (campaign.role === "Player") {
                                                        navigate(`/selectcharacter/${campaign.id}`); // Redirect to SelectCharacter if the user is a player
                                                    } else {
                                                        alert("You must be a player in this campaign to play.");
                                                    }
                                                }}
                                            >
                                                Play
                                            </button>

                                            {/* Leave/Delete Button */}
                                            <button
                                                className="delete-button"
                                                onClick={() => handleLeaveOrDelete(campaign)}
                                            >
                                                {campaign.role === "DM" ? "Delete" : "Leave"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No campaigns found.</p>
                            )}
                        </div>
                        <button
                            className="cancel-button"
                            onClick={() => setIsViewCampaignsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isViewCharactersModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Your Characters</h2>
                        <div className="characters-container">
                            {characters.length > 0 ? (
                                characters.map((character) => (
                                    <div key={character.id} className="character-card">
                                        <h3>
                                            <a href={`/character/${character.id}`}>{character.name}</a> {/* Link to character details */}
                                        </h3>
                                        <p>Class: <strong>{character.character_class}</strong></p>
                                        <p>Species: <strong>{character.species}</strong></p>
                                        <p>Background: <strong>{character.background}</strong></p>
                                    </div>
                                ))
                            ) : (
                                <p>No characters found.</p>
                            )}
                        </div>
                        <button
                            className="cancel-button"
                            onClick={() => setIsViewCharactersModalOpen(false)} // Close the modal
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isCampaignDetailsModalOpen && selectedCampaign && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedCampaign.name}</h2>
                        <p>DM: <strong>{selectedCampaign.dm_username}</strong></p>
                        <p>Players:</p>
                        <ul>
                            {selectedCampaign.players && selectedCampaign.players.length > 0 ? (
                                selectedCampaign.players.map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))
                            ) : (
                                <li>No players yet</li>
                            )}
                        </ul>
                        {selectedCampaign.role === "DM" && (
                            <p>Access Code: <strong>{selectedCampaign.access_code}</strong></p>
                        )}
                        <div className="campaign-actions">
                            <button className="play-button" disabled>
                                Play
                            </button>
                            {selectedCampaign.role === "Player" && (
                                <button className="leave-button" disabled>
                                    Leave
                                </button>
                            )}
                            {selectedCampaign.role === "DM" && (
                                <button className="delete-button" disabled>
                                    Delete
                                </button>
                            )}
                        </div>
                        <button
                            className="cancel-button"
                            onClick={() => setIsCampaignDetailsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isConfirmationModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Are you sure?</h2>
                        <p>
                            {selectedCampaign.is_dm
                                ? "This will permanently delete the campaign and remove all players."
                                : "This will remove you from the campaign."}
                        </p>
                        <div className="modal-actions">
                            <button
                                className="confirm-button"
                                onClick={() => {
                                    if (selectedCampaign.is_dm) {
                                        deleteCampaign(selectedCampaign.id); // Call delete function
                                    } else {
                                        leaveCampaign(selectedCampaign.id); // Call leave function
                                    }
                                    setIsConfirmationModalOpen(false); // Close the modal
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => setIsConfirmationModalOpen(false)} // Close the modal
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <a
                onClick={() => {
                    addGame();
                }}
            >
                +
            </a>

            {games.map((game, index) => (
                <div key={index}>
                    <input type="text" placeholder={game.name}></input>
                </div>
            ))}

            {createdCampaignAccessCode && (
                <div className="access-code-container">
                    <h2>Campaign Created Successfully!</h2>
                    <p>Your access code is:</p>
                    <p><strong>{createdCampaignAccessCode}</strong></p>
                    <button
                        className="copy-button"
                        onClick={() => {
                            navigator.clipboard.writeText(createdCampaignAccessCode); // Copy to clipboard
                        }}
                    >
                        Copy Access Code
                    </button>
                    <button
                        className="close-button"
                        onClick={() => setCreatedCampaignAccessCode("")} // Clear the access code and close the modal
                    >
                        Close
                    </button>
                </div>
            )}
        </>
    );
};

export default Home;
import "./index.scss";
import Nav from "../Nav";
import { useState, useEffect, useRef } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import mapplaceholder from "../asset/mapplaceholder.png";
import crystalball from "../asset/gameside/crystalball.png";
import minimap from "../asset/gameside/minimap.png";
import imgd4 from "../asset/gameside/d4.png";
import imgd6 from "../asset/gameside/d6.png";
import imgd8 from "../asset/gameside/d8.png";
import imgd10 from "../asset/gameside/d10.png";
import imgd12 from "../asset/gameside/d12.png";
import imgd20 from "../asset/gameside/d20.png";
import imgd100 from "../asset/gameside/d100.png";

// passing monsters as props to GameView component
const GameView = ({ monsters, npcs, maps = [], selectedMap, setSelectedMap }) => {
    console.log("Monsters prop in GameView:", monsters);

    const [showMapButton, setShowMapButton] = useState(false);
    const [showExpandedMap, setShowExpandedMap] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [placedTokens, setPlacedTokens] = useState([]);
    const [gridSize, setGridSize] = useState(10); // Default 10x10 grid
    const [showGrid, setShowGrid] = useState(true);
    const [debugInfo, setDebugInfo] = useState("");
    // Add the missing state variable for token hover
    const [hoveredToken, setHoveredToken] = useState(null);

    const gridRef = useRef(null);
    const mapRef = useRef(null);
    const smallMapRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
    // Add prop for map selected
    const [mapSrc, setMapSrc] = useState(selectedMap?.src || "");
    useEffect(() => {
        // Update the displayed map when the selectedMap prop changes
        setMapSrc(selectedMap?.src || "");
    }, [selectedMap]);

    // Debugging: Log the selected map when it changes
    useEffect(() => {
        console.log("Maps in GameView:", maps);
    }, [maps]);

    // Add state to manage initiative items
    const [initiativeItems, setInitiativeItems] = useState([]);

    // Function to handle adding a new initiative item
    const handleAddInitiativeItem = () => {
        setInitiativeItems([
            ...initiativeItems,
            { id: Date.now(), name: "", value: "" } // Default values for new item
        ]);
    };

    // Function to handle deleting an initiative item
    const handleDeleteInitiativeItem = (id) => {
        setInitiativeItems(initiativeItems.filter(item => item.id !== id));
    };

    // Function to handle updating an initiative item
    const handleUpdateInitiativeItem = (id, field, value) => {
        setInitiativeItems(
            initiativeItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Add useEffect to log token state changes
    useEffect(() => {
        console.log("Token state updated:", placedTokens);
    }, [placedTokens]);

    useEffect(() => {
        console.log("NPCs in GameView:", npcs);
    }, [npcs]);

    function dice(max) {
        return 1 + Math.floor(Math.random() * max);
    }

    // Add a function to handle adding dice rolls to the game log
    // This is for gamelog dice tracker
    const addToGameLog = (diceType, rollResult) => {
        const logContainer = document.getElementById("gamelog-container");

        // Create new log entry
        const logEntry = document.createElement("p");
        logEntry.innerText = `Player rolled d${diceType}: ${rollResult}`;

        // Add the new entry to the log (at the bottom)
        logContainer.appendChild(logEntry);

        // Limit to 100 entries
        while (logContainer.childElementCount > 100) {
            logContainer.removeChild(logContainer.firstChild);
        }

        // Auto-scroll to the bottom to show the latest roll
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    // Handle token selection from sidebar
    const handleTokenSelect = (tokenType) => {
        // If we already have this token type selected, deselect it
        if (selectedToken && selectedToken.type === tokenType) {
            setSelectedToken(null);
            return;
        }

        // Otherwise, select this token type
        setSelectedToken({
            type: tokenType,
            image: wizard, // Using wizard image for all tokens for now
            isNew: true
        });
    };

    // Simplified token click handler
    const handleTokenClick = (tokenId, event) => {
        // Always prevent default and stop propagation
        event.preventDefault();
        event.stopPropagation();

        console.log(`Token ${tokenId} clicked for movement`);
        setDebugInfo(`Token ${tokenId} clicked for movement`);

        // Get the token
        const token = placedTokens.find(t => t.id === tokenId);

        if (token) {
            // Create a new selected token from the clicked one
            const tokenToMove = {
                id: token.id,
                type: token.type,
                image: token.image,
                isNew: false,
                originalPosition: token.position
            };

            // First set selected token so it follows cursor
            setSelectedToken(tokenToMove);

            // Then remove the token from the board
            setPlacedTokens(placedTokens.filter(t => t.id !== tokenId));

            console.log("Token selected for movement:", tokenId);
        } else {
            console.error(`Token ${tokenId} not found`);
        }
    };

    // Handle closing the expanded map
    const handleCloseMap = () => {
        console.log("Closing expanded map. Current tokens:", placedTokens);
        setShowExpandedMap(false);
    };

    // Update map dimensions when it loads or resizes
    useEffect(() => {
        const updateMapDimensions = () => {
            if (mapRef.current) {
                const rect = mapRef.current.getBoundingClientRect();
                // Make sure grid is always square (uses the smaller dimension)
                const size = Math.min(rect.width, rect.height);
                setMapDimensions({
                    width: size,
                    height: size
                });
            }
        };

        // Initial update
        if (showExpandedMap) {
            setTimeout(updateMapDimensions, 100); // Small delay to ensure DOM is updated
        }

        // Add resize listener
        window.addEventListener('resize', updateMapDimensions);

        return () => {
            window.removeEventListener('resize', updateMapDimensions);
        };
    }, [showExpandedMap]);

    // Create a ResizeObserver to watch for changes to map size
    useEffect(() => {
        if (mapRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    // Make sure grid is always square (uses the smaller dimension)
                    const size = Math.min(width, height);
                    setMapDimensions({
                        width: size,
                        height: size
                    });
                }
            });

            resizeObserver.observe(mapRef.current);
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [mapRef.current]);

    // Track cursor position when a token is selected
    const handleMouseMove = (e) => {
        if (selectedToken && gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            // Calculate cursor position relative to the grid
            const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
            const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
            setCursorPosition({ x, y });
        }
    };

    // Handle token placement on grid
    const handleGridCellClick = (row, col) => {
        // Add 1 to row and col for display purposes, this is so it won't be 0x0
        const displayRow = row + 1;
        const displayCol = col + 1;

        setDebugInfo(`Grid cell ${displayRow}x${displayCol} clicked`);

        if (selectedToken) {
            // Check if a token already exists at this position
            const existingTokenIndex = placedTokens.findIndex(
                token => token.position.row === row && token.position.col === col
            );

            if (existingTokenIndex >= 0) {
                setDebugInfo(`Cell ${displayRow}x${displayCol} already has a token.`);

                // If we're moving a token and it's not the original position, ignore the click
                if (!selectedToken.isNew) {
                    if (selectedToken.originalPosition &&
                        selectedToken.originalPosition.row === row &&
                        selectedToken.originalPosition.col === col) {
                        // Allow placing back in original position
                    } else {
                        // Don't allow placing on another token
                        return;
                    }
                } else {
                    // Don't allow placing a new token on an existing one
                    return;
                }
            }

            // Place the token
            setPlacedTokens([
                ...placedTokens.filter(t => !(selectedToken.id && t.id === selectedToken.id)),
                {
                    id: selectedToken.id || Date.now(),
                    type: selectedToken.type,
                    image: selectedToken.image,
                    position: { row, col }
                }
            ]);

            setDebugInfo(`Placed ${selectedToken.type} token at ${displayRow}x${displayCol}`);

            // Clear selected token after placement
            setSelectedToken(null);
        }
    };
    // This is for chat-orb
    // Creating chat-related state variables
    const [isChatSlideOut, setChatSlideOut] = useState(false);
    const [selectedChatPlayer, setSelectedChatPlayer] = useState(null);
    {/**Later will need to communicate a loop into database to load up players */ }
    const [playerChatMessages, setPlayerChatMessages] = useState({
        "DM": [],
        "Player1": [],
        "Player2": [],
        "Player3": []
    });
    const [currentChatMessage, setCurrentChatMessage] = useState("");

    // Chat handler functions
    const handlePlayerSelect = (playerName) => {
        setSelectedChatPlayer(playerName);
        setChatSlideOut(true); // Slide out the chat when a player is selected
    };

    const handleCloseChat = () => {
        setChatSlideOut(false);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();

        if (currentChatMessage.trim() !== "" && selectedChatPlayer) {
            // Add message to the selected player's chat
            setPlayerChatMessages({
                ...playerChatMessages,
                [selectedChatPlayer]: [
                    ...playerChatMessages[selectedChatPlayer],
                    currentChatMessage.trim()
                ]
            });

            // Clear the input
            setCurrentChatMessage("");
        }
    };

    // This is for notes
    const [publicExpanded, setPublicExpanded] = useState(false);
    const [privateExpanded, setPrivateExpanded] = useState(false);
    const [dmExpanded, setDmExpanded] = useState(false);
    const [publicNotes, setPublicNotes] = useState([]);
    const [privateNotes, setPrivateNotes] = useState([]);
    const [dmNotes, setDmNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    // This is to expand notes
    const [activeSection, setActiveSection] = useState(null);

    // Toggle public notes section
    // VISION: Anyone can see these notes (globally)
    const togglePublicNotes = () => {
        // This part is for the expanding notes
        if (activeSection === 'public') {
            // If public is already active, deactivate it
            setActiveSection(null);
            setPublicExpanded(false);
        } else {
            // Activate public, deactivate others
            setActiveSection('public');
            setPublicExpanded(true);
            setPrivateExpanded(false);
            setDmExpanded(false);
        }
    };

    // Toggle private notes section
    // VISION: Only the current player can see these notes (with other players? 1 on 1) 
    const togglePrivateNotes = () => {
        if (activeSection === 'private') {
            // If private is already active, deactivate it
            setActiveSection(null);
            setPrivateExpanded(false);
        } else {
            // Activate private, deactivate others
            setActiveSection('private');
            setPrivateExpanded(true);
            setPublicExpanded(false);
            setDmExpanded(false);
        }
    };

    // Toggle DM notes section
    // VISION: Only current player and DM can see these notes
    const toggleDmNotes = () => {
        if (activeSection === 'dm') {
            // If dm is already active, deactivate it
            setActiveSection(null);
            setDmExpanded(false);
        } else {
            // Activate dm, deactivate others
            setActiveSection('dm');
            setDmExpanded(true);
            setPublicExpanded(false);
            setPrivateExpanded(false);
        }
    };

    // Handle note submission - will add to the active section
    const handleNoteSubmit = (e) => {
        e.preventDefault();
        const noteInput = e.target.querySelector('input');

        if (noteInput && noteInput.value.trim() !== '') {
            const newNote = noteInput.value.trim();

            // Add note to the appropriate section based on activeSection
            if (activeSection === 'public') {
                setPublicNotes([...publicNotes, newNote]);
            } else if (activeSection === 'private') {
                setPrivateNotes([...privateNotes, newNote]);
            } else if (activeSection === 'dm') {
                setDmNotes([...dmNotes, newNote]);
            } else {
                // If no section is active, do nothing or show a message
                console.log("No active section to add note to");
                return;
            }

            // Clear the input field
            noteInput.value = '';
        }
    };

    return (
        <>
            <Nav />

            <main>
                <div className="gameside">
                    <div className="initiative-container">
                        {initiativeItems.map(item => (
                            <div key={item.id} className="initiative-item">
                                <input
                                    type="text"
                                    className="initiative-name monster-spd"
                                    placeholder="Enter name"
                                    value={item.name}
                                    onChange={(e) => handleUpdateInitiativeItem(item.id, "name", e.target.value)}
                                />

                                <button
                                    className="initiative-delete"
                                    onClick={() => handleDeleteInitiativeItem(item.id)}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                        <div className="initiative-new">
                            <button className="initiative-add" onClick={handleAddInitiativeItem}>+</button>
                        </div>
                    </div>

                    <div className="map">
                        {/* Display the selected map or the default map */}
                        <img className="map-up" src={selectedMap?.src || mapplaceholder} alt="Game Map" />

                        {/* Render tokens on the small map */}
                        {placedTokens.length > 0 && (
                            <div className="small-map-tokens">
                                {placedTokens.map(token => {
                                    // Calculate position as percentage of the map
                                    const posX = (token.position.col / gridSize) * 100;
                                    const posY = (token.position.row / gridSize) * 100;

                                    return (
                                        <div
                                            key={token.id}
                                            className="small-map-token"
                                            style={{
                                                left: `${posX}%`,
                                                top: `${posY}%`
                                            }}
                                            title={`${token.type}`}
                                        >
                                            <img src={token.image} alt={token.type} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Always show the "View Map" button */}
                        <button
                            className="view-map-button"
                            onClick={() => setShowExpandedMap(true)}
                        >
                            View Map
                        </button>
                    </div>

                    {showExpandedMap && (
                        <div className="map-expanded-overlay">
                            <div className="map-expanded-container">

                                {/* Token Selector (Left) */}
                                <div className="token-selector">
                                    <h3>Map Tokens</h3>

                                    {/* Character Section */}
                                    <div className="token-category">
                                        <div className="token-category-header">Character</div>

                                        <div className="token-category-content">
                                            {/* Character token options */}
                                            <div className="token-options">
                                                <div
                                                    id="character-token-1"
                                                    className="token-item"
                                                    onClick={() => handleTokenSelect('Character')}
                                                    onMouseEnter={() => setHoveredToken({ type: 'Character', name: 'Wizard Character', id: 'character-token-1' })}
                                                    onMouseLeave={() => setHoveredToken(null)}
                                                >
                                                    <img src={wizard} alt="Character Token 1" />
                                                </div>

                                                <div
                                                    id="character-token-2"
                                                    className="token-item"
                                                    onClick={() => handleTokenSelect('Character')}
                                                    onMouseEnter={() => setHoveredToken({ type: 'Character', name: 'Knight Character', id: 'character-token-2' })}
                                                    onMouseLeave={() => setHoveredToken(null)}
                                                >
                                                    <img src={wizard} alt="Character Token 2" />
                                                </div>
                                            </div>

                                            {/* Character info display */}
                                            <div className="token-info-panel">
                                                {hoveredToken && hoveredToken.type === 'Character' ? (
                                                    <div className="token-database-info">
                                                        <p>{hoveredToken.name}</p>
                                                    </div>
                                                ) : (
                                                    <div className="token-database-info">
                                                        <p className="placeholder-text">Hover over a token to see details</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monster Section */}
                                    <div className="token-category">
                                        <div className="token-category-header">Monster</div>

                                        <div className="token-category-content">
                                            {/* Monster token options */}
                                            <div className="token-options">
                                                {monsters && monsters.length > 0 ? (
                                                    monsters.map((monster) => (
                                                        <div
                                                            key={monster.id}
                                                            className="token-item"
                                                            onMouseEnter={() => setHoveredToken({ type: 'Monster', name: monster.name })}
                                                            onMouseLeave={() => setHoveredToken(null)}
                                                            onClick={() => {
                                                                setSelectedToken({
                                                                    id: monster.id,
                                                                    type: 'Monster',
                                                                    image: monster.imageUrl,
                                                                    isNew: true
                                                                });
                                                                console.log(`Selected token: ${monster.name}`);
                                                            }}
                                                        >
                                                            <img src={monster.imageUrl} alt={monster.name} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No monsters available</p>
                                                )}
                                            </div>

                                            {/* Monster info display */}
                                            <div className="token-info-panel">
                                                {hoveredToken && hoveredToken.type === 'Monster' ? (
                                                    <div className="token-database-info">
                                                        <p>{hoveredToken.name}</p>
                                                    </div>
                                                ) : (
                                                    <div className="token-database-info">
                                                        <p className="placeholder-text">Hover over a token to see details</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* NPC Section */}
                                    <div className="token-category">
                                        <div className="token-category-header">NPC</div>

                                        <div className="token-category-content">
                                            <div className="token-options">
                                                {npcs && npcs.length > 0 ? (
                                                    npcs.map((npc) => (
                                                        <div
                                                            key={npc.id}
                                                            className="token-item"
                                                            onMouseEnter={() => setHoveredToken({ type: 'NPC', name: npc.name })}
                                                            onMouseLeave={() => setHoveredToken(null)}
                                                            onClick={() => {
                                                                setSelectedToken({
                                                                    id: npc.id,
                                                                    type: 'NPC',
                                                                    image: npc.imageUrl,
                                                                    isNew: true
                                                                });
                                                                console.log(`Selected token: ${npc.name}`);
                                                            }}
                                                        >
                                                            <img src={npc.imageUrl} alt={npc.name} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No NPCs available</p>
                                                )}
                                            </div>

                                            {/* NPC Info Display */}
                                            <div className="token-info-panel">
                                                {hoveredToken && hoveredToken.type === 'NPC' ? (
                                                    <div className="token-database-info">
                                                        <p>{hoveredToken.name}</p>
                                                    </div>
                                                ) : (
                                                    <div className="token-database-info">
                                                        <p className="placeholder-text">Hover over a token to see details</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="expanded-map">
                                    <button
                                        className="close-expanded-map"
                                        onClick={handleCloseMap}
                                    >
                                        X
                                    </button>
                                    {debugInfo && (
                                        <div className="debug-info">
                                            {debugInfo}
                                        </div>
                                    )}
                                    <div
                                        className="map-container"
                                        ref={gridRef}
                                        onMouseMove={handleMouseMove}
                                    >
                                        <img
                                            ref={mapRef}
                                            className="map-large"
                                            src={selectedMap?.src || mapplaceholder}
                                            alt="Game Map"
                                            onLoad={() => {
                                                if (mapRef.current) {
                                                    const rect = mapRef.current.getBoundingClientRect();
                                                    const size = Math.min(rect.width, rect.height);
                                                    setMapDimensions({
                                                        width: size,
                                                        height: size
                                                    });
                                                }
                                            }}
                                        />

                                        {/* Grid overlay and tokens container */}
                                        <div
                                            className="grid-and-tokens-container"
                                            style={{
                                                width: `${mapDimensions.width}px`,
                                                height: `${mapDimensions.height}px`
                                            }}
                                        >
                                            {/* Grid cells that can be toggled */}
                                            {showGrid && (
                                                <div
                                                    className="grid-overlay"
                                                    style={{
                                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                                        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                                                    }}
                                                >
                                                    {/* Generate grid cells */}
                                                    {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                                                        const row = Math.floor(index / gridSize);
                                                        const col = index % gridSize;
                                                        return (
                                                            <div
                                                                key={`cell-${row}-${col}`}
                                                                className="grid-cell"
                                                                onClick={() => handleGridCellClick(row, col)}
                                                                data-row={row}
                                                                data-col={col}
                                                            >
                                                                {gridSize <= 10 && (
                                                                    <span className="grid-coordinate">
                                                                        {row + 1},{col + 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Token container - always visible regardless of grid */}
                                            <div className="tokens-container">
                                                {/* Render placed tokens */}
                                                {placedTokens.map(token => {
                                                    const cellSize = 100 / gridSize; // Size as percentage
                                                    const style = {
                                                        left: `${token.position.col * cellSize + (cellSize / 2)}%`,
                                                        top: `${token.position.row * cellSize + (cellSize / 2)}%`,
                                                        width: `${cellSize * 0.8}%`,  // Make token slightly smaller than cell
                                                        height: `${cellSize * 0.8}%`,
                                                        zIndex: 150 // Extremely high to ensure clickability
                                                    };

                                                    return (
                                                        <div
                                                            key={token.id}
                                                            className="placed-token"
                                                            style={style}
                                                            onMouseDown={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                console.log(`Token clicked: ${token.id}`);
                                                                handleTokenClick(token.id, e);
                                                            }}
                                                            data-token-id={token.id}
                                                            data-token-type={token.type}
                                                        >
                                                            <img
                                                                src={token.image}
                                                                alt={token.type}
                                                                style={{ pointerEvents: 'none' }}
                                                            />
                                                        </div>
                                                    );
                                                })}

                                                {/* Show selected token with cursor */}
                                                {selectedToken && (
                                                    <div
                                                        className="token-cursor"
                                                        style={{
                                                            left: `${cursorPosition.x}px`,
                                                            top: `${cursorPosition.y}px`,
                                                            zIndex: 200
                                                        }}
                                                    >
                                                        <img src={selectedToken.image} alt={selectedToken.type} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="map-settings">
                                    <h3>Map Settings</h3>
                                    <div className="settings-controls">
                                        {/* could not get it to work">}
                                        {/* <div className="setting-item">
    <label>Map:</label>
    <select
        value={selectedMap?.id || ""}
        onChange={(e) => {
            const selected = maps.find(map => map.id === e.target.value);
            if (selected) {
                setSelectedMap(selected);
            }
        }}
    >
        {Array.isArray(maps) && maps.length > 0 ? (
            maps.map(map => (
                <option key={map.id} value={map.id}>
                    {map.name || "Unnamed Map"}
                </option>
            ))
        ) : (
            <option disabled>No maps available</option>
        )}
    </select>
</div> */}
                                        <div className="setting-item">
                                            <label>Grid:</label>
                                            <select
                                                value={showGrid ? "Show" : "Hide"}
                                                onChange={(e) => setShowGrid(e.target.value === "Show")}
                                            >
                                                <option>Show</option>
                                                <option>Hide</option>
                                            </select>
                                        </div>
                                        {/* <div className="setting-item">
    <label>Lighting:</label>
    <select>
        <option>Day</option>
        <option>Night</option>
        <option>Fog</option>
    </select>
</div> */}
                                        <div className="setting-item">
                                            <label>Grid Size (Rows/Columns):</label>
                                            <select
                                                value={gridSize}
                                                onChange={(e) => setGridSize(Number(e.target.value))}
                                            >
                                                <option value="10">10 x 10</option>
                                                <option value="20">20 x 20</option>
                                                <option value="30">30 x 30</option>
                                            </select>
                                        </div>
                                        <div className="setting-item">
                                            <button
                                                className="clear-tokens-btn"
                                                onClick={() => setPlacedTokens([])}
                                            >
                                                Clear All Tokens
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="gamelog">
                        <div id="gamelog-container">
                            {/* Dice log entries will appear here */}
                        </div>
                    </div>

                    <div className="bottom">
                        <div className="chat-container">
                            {/* Chat-up first in DOM order since it's behind */}
                            <div className={`chat-up ${isChatSlideOut ? 'slide-out' : ''}`}>
                                <div className="slide-out-chat-top-context">
                                    <button className="chat-minimize" onClick={handleCloseChat}>-</button>

                                    {/* Add player name header */}
                                    <div className="chat-header">
                                        {selectedChatPlayer && (
                                            <h4>{selectedChatPlayer}</h4>
                                        )}
                                    </div>

                                    {/* Message display area - simple list of messages */}
                                    <div className="chat-messages">
                                        {selectedChatPlayer && playerChatMessages[selectedChatPlayer]?.length > 0 ? (
                                            <ul>
                                                {playerChatMessages[selectedChatPlayer].map((message, index) => (
                                                    <li key={index}>{message}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="empty-chat">No messages yet</p>
                                        )}
                                    </div>
                                </div>

                                <div className="slide-out-chat-bottom-context">
                                    <form className="form-chat" onSubmit={(e) => {
                                        e.preventDefault();
                                        const inputField = e.target.querySelector('.input-chat');
                                        if (inputField && inputField.value.trim() !== '' && selectedChatPlayer) {
                                            // Add message to the selected player's chat
                                            setPlayerChatMessages({
                                                ...playerChatMessages,
                                                [selectedChatPlayer]: [
                                                    ...playerChatMessages[selectedChatPlayer],
                                                    inputField.value.trim()
                                                ]
                                            });
                                            // Clear the input field
                                            inputField.value = '';
                                        }
                                    }}>
                                        <input
                                            type="text"
                                            className="input-chat"
                                            placeholder="Message Player..."
                                            disabled={!selectedChatPlayer}
                                        />
                                        <button type="submit" className="submit-chat" disabled={!selectedChatPlayer}>&#8594;</button>
                                    </form>
                                </div>
                            </div>

                            <div className="chat">
                                {/* Crystal ball image stays as background element */}
                                <img className="orb-chat" src={crystalball} alt="Crystal Ball" />

                                {/* Player list that appears on hover */}
                                {/* When the room is initialized, the program should grab 
                                    from "party list" or whatever is holding the group of people 
                                    and print it so orb can display it*/}
                                <div className="orb-chat-player-list">
                                    {Object.keys(playerChatMessages).map(playerName => (
                                        <div
                                            key={playerName}
                                            className={`player-item ${selectedChatPlayer === playerName ? 'selected' : ''}`}
                                            onClick={() => handlePlayerSelect(playerName)}
                                        >
                                            {playerName}
                                        </div>
                                    ))}
                                </div>

                                {/* Keep these as they were */}
                                <img className="group-chat" src="" alt="" />
                                <img className="dm-chat" src="" alt="" />
                                <img className="player2-chat" src="" alt="" />
                            </div>
                        </div>
                        {/* Notes section with multiple note types */}
                        <div className="notes">
                            <div className={`public-notes ${activeSection === 'public' ? 'expanded' : activeSection ? 'minimized' : ''}`}>
                                <button onClick={togglePublicNotes}>
                                    Public
                                </button>
                                {publicExpanded && (
                                    <div className="written-public-notes">
                                        {publicNotes.length > 0 ? (
                                            <ul>
                                                {publicNotes.map((note, index) => (
                                                    <li key={index}>{note}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No public notes yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={`private-notes ${activeSection === 'private' ? 'expanded' : activeSection ? 'minimized' : ''}`}>
                                <button onClick={togglePrivateNotes}>
                                    Private
                                </button>
                                {privateExpanded && (
                                    <div className="written-notes">
                                        {privateNotes.length > 0 ? (
                                            <ul>
                                                {privateNotes.map((note, index) => (
                                                    <li key={index}>{note}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No private notes yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={`dm-notes ${activeSection === 'dm' ? 'expanded' : activeSection ? 'minimized' : ''}`}>
                                <button onClick={toggleDmNotes}>
                                    DM
                                </button>
                                {dmExpanded && (
                                    <div className="written-notes">
                                        {dmNotes.length > 0 ? (
                                            <ul>
                                                {dmNotes.map((note, index) => (
                                                    <li key={index}>{note}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No DM notes yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="input-notes">
                                <form className="input-notes-form" onSubmit={handleNoteSubmit}>
                                    <input
                                        type="text"
                                        placeholder={activeSection ? `Write a ${activeSection} note...` : "Select a section first..."}
                                        disabled={!activeSection}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!activeSection}
                                    >{">"}</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Updated dice buttons to use addToGameLog function */}
                    <div className="dice">
                        <button className="d4"
                            onClick={() => {
                                const rollD4 = dice(4);
                                console.log(rollD4);
                                addToGameLog(4, rollD4);
                            }}
                        >
                            <img className="d4-img" src={imgd4} alt="" />d4
                        </button>

                        <button className="d6"
                            onClick={() => {
                                const rollD6 = dice(6);
                                console.log(rollD6);
                                addToGameLog(6, rollD6);
                            }}
                        >
                            <img className="d6-img" src={imgd6} alt="" />d6
                        </button>

                        <button className="d8"
                            onClick={() => {
                                const rollD8 = dice(8);
                                console.log(rollD8);
                                addToGameLog(8, rollD8);
                            }}
                        >
                            <img className="d8-img" src={imgd8} alt="" />d8
                        </button>

                        <button className="d10"
                            onClick={() => {
                                const rollD10 = dice(10);
                                console.log(rollD10);
                                addToGameLog(10, rollD10);
                            }}
                        >
                            <img className="d10-img" src={imgd10} alt="" />d10
                        </button>

                        <button className="d12"
                            onClick={() => {
                                const rollD12 = dice(12);
                                console.log(rollD12);
                                addToGameLog(12, rollD12);
                            }}
                        >
                            <img className="d12-img" src={imgd12} alt="" />d12
                        </button>

                        <button className="d20"
                            onClick={() => {
                                const rollD20 = dice(20);
                                console.log(rollD20);
                                addToGameLog(20, rollD20);
                            }}
                        >
                            <img className="d20-img" src={imgd20} alt="" />d20
                        </button>
                        <button className="d100"
                            onClick={() => {
                                const rollD100 = dice(100);
                                console.log(rollD100);
                                addToGameLog(100, rollD100);
                            }}
                        >
                            <img className="d100-img" src={imgd100} alt="" />d100
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default GameView;

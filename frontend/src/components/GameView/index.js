import "./index.scss";
import Nav from "../Nav";
import { useState, useEffect, useRef } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import mapplaceholder from "../asset/mapplaceholder.png";
import crystalball from "../asset/gameside/crystalball.png";
import minimap from "../asset/gameside/minimap.png";

const GameView = () => {
    const [showMapButton, setShowMapButton] = useState(false);
    const [showExpandedMap, setShowExpandedMap] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [placedTokens, setPlacedTokens] = useState([]);
    const [gridSize, setGridSize] = useState(10); // Default 10x10 grid
    const [showGrid, setShowGrid] = useState(true);
    const [debugInfo, setDebugInfo] = useState("");

    const gridRef = useRef(null);
    const mapRef = useRef(null);
    const smallMapRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

    // Add useEffect to log token state changes
    useEffect(() => {
        console.log("Token state updated:", placedTokens);
    }, [placedTokens]);

    function dice(max) {
        return 1 + Math.floor(Math.random() * max);
    }

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

    return (
        <>
            <Nav />

            <main>
                <div className="gameside">
        //The initiative area should let users add a new initiative-block and add a name for the new initiative character/monster/npc
        //They should also be able to click on one of the initiative blocks to highlight it / make it bigger to show whose turn it is in the initiative
                    <div className="initiative-container">
                        <div className="initiative-item">
                            <img className="initiative-block" src="" />
                            <img className="initiative-prof-pic" src="" />
                            <span>Character 1</span>
        //They should also be able to delete a character/monster/npc from initiative
                            <button className="initiative-delete">-</button>
                        </div>
                        <div className="initiative-new">
                            <img className="initiative-block" src="" />
                            <button className="initiative-add">+</button>
                        </div>
                    </div>

        //for the map, the dm should be allowed to choose which map is displayed, from their list of maps on the left (the dmside)
                    <div
                        className="map"
                        onMouseEnter={() => setShowMapButton(true)}
                        onMouseLeave={() => setShowMapButton(false)}
                        ref={smallMapRef}
                    >
                        <img className="map-up" src={mapplaceholder} />

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

                        <button className="map-expand"><img src={wizard} /></button>
                        <button className="map-log"><img src={minimap} /></button>
                        <button className="add-token"><img src={wizard} /></button>

                        {showMapButton && (
                            <button
                                className="view-map-button"
                                onClick={() => setShowExpandedMap(true)}
                            >
                                View Map
                            </button>
                        )}
                    </div>

                    {showExpandedMap && (
                        <div className="map-expanded-overlay">
                            <div className="map-expanded-container">
                                <div className="token-selector">
                                    <h3>Map Tokens</h3>
                                    <div className="token-list">
                                        <div
                                            className={`token-item ${selectedToken?.type === 'Character' ? 'selected' : ''}`}
                                            onClick={() => handleTokenSelect('Character')}
                                        >
                                            <img src={wizard} alt="Character Token" />
                                            <p>Character</p>
                                        </div>
                                        <div
                                            className={`token-item ${selectedToken?.type === 'Monster' ? 'selected' : ''}`}
                                            onClick={() => handleTokenSelect('Monster')}
                                        >
                                            <img src={wizard} alt="Monster Token" />
                                            <p>Monster</p>
                                        </div>
                                        <div
                                            className={`token-item ${selectedToken?.type === 'NPC' ? 'selected' : ''}`}
                                            onClick={() => handleTokenSelect('NPC')}
                                        >
                                            <img src={wizard} alt="NPC Token" />
                                            <p>NPC</p>
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
                                            src={mapplaceholder}
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

                                                //the dm should also be able to select tokens based on the player characters/npcs/monsters 
                                                //that they can see/create on dmside (Note: dms can't create player characters)
                                                //When a token is hovered over, it should display the info like name and hp
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
                                        <div className="setting-item">
                                            <label>Lighting:</label>
                                            <select>
                                                <option>Day</option>
                                                <option>Night</option>
                                                <option>Fog</option>
                                            </select>
                                        </div>
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

                    <div className="token-info">
                        <button className="token-delete">X</button>
                        <button className="token-info-minimize">-</button>
                        <p>Name</p>
                        <p>HP: 99</p>
                    </div>

                        //The last 100 dice rolls should appear here, with users scrolling up to see the past ones and the most recent one
                        //displayed at the bottom.  They should also be able to tell which user rolled the die.  If it's the dm, maybe
                        //it could display "DM Rolled: " and then the roll.  For players, something like "Callie Rolled: 9" for example.
                        //It would also be nice to show the image of the die that was rolled, we can deal with that when the dice assets are up.
                    <div className="gamelog">
                        <p>\Character\ Rolled: </p>
                        <p id="testd4"> </p>
                    </div>

                    <div className="bottom">
                        <div className="chat-container">
                            <div className="chat">
                                <img className="orb-chat" src={crystalball} />
                                <img className="group-chat" src="" />
                                <img className="dm-chat" src="" />
                                <img className="player2-chat" src="" />
                            </div>

                        //For the chat: The crystal ball will contain the names in a vertical row of all the players and the dm
                        //(except the player currently viewing it, they cannot message themself after all.  When they hover over a name,
                        //It should get bigger and "glow", and clicking on it will make the message section slide out from behind the orb
                        //(currently it's already displayed out)
                        //The chat should let users send messages, and display the last 100 messages.
                        //you can scroll up to see the chat log
                            <div className="chat-up">
                                <button className="chat-minimize">-</button>
                                <form>
                                    <input type="text" className="message-player" placeholder="Message Player..." />
                                    <button>&#8594;</button>
                                </form>
                            </div>
                        </div>

                        //Notes: When no notes are selected, the bottom "note-open" should not be visble.  When a note tab (either
                        //public, private, or dm) is selected, it should move to the bottom and the note-open should be displayed under it.
                        //The user should be able to input notes into the input, and have the notes be displayed above the input, showing all
                        //the notes ever written in that section.
                        //Private notes should only be readable and writable to the player writing them.
                        //DM notes should be readable to everyone but only the DM can write them.
                        //Public notes are shared amongst everyone, everyone can read them and write them.
                        //If someone can write to a note section, they should be able to delete from it as well.
                        //You can scroll up to see the previous notes in the notes section selected.
                        <div className="notes">
                            <div className="public-notes">
                                <button>
                                    Public
                                </button>
                            </div>
                            <div className="private-notes">
                                <button>
                                    Private
                                </button>
                            </div>
                            <div className="dm-public-notes">
                                <button>
                                    DM
                                </button>
                            </div>
                            <div className="note-open" id="note-dm">
                                <form><input type="text" />
                                    <button type="submit">{">"}</button>
                                </form>
                            </div>
                        </div>
                    </div>
//Dice rolls the dice.  These rolls need to be saved.
                    <div className="dice">
                        <button className="d4"
                            onClick={
                                () => {
                                    const rollD4 = dice(4);
                                    console.log(rollD4);

                                    document.getElementById("testd4").innerHTML = rollD4;
                                }
                            }
                        >
                            <img className="d4-img" src="" />d4
                        </button>

                        <button className="d6"
                            onClick={
                                () => {
                                    const rollD6 = dice(6);
                                    console.log(rollD6);

                                    document.getElementById("testd4").innerHTML = rollD6;
                                }
                            }
                        >
                            <img className="d6-img" src="" />d6
                        </button>

                        <button className="d8"
                            onClick={
                                () => {
                                    const rollD8 = dice(8);
                                    console.log(rollD8);

                                    document.getElementById("testd4").innerHTML = rollD8;
                                }
                            }
                        >
                            <img className="d8-img" src="" />d8
                        </button>

                        <button className="d10"
                            onClick={
                                () => {
                                    const rollD10 = dice(10);
                                    console.log(rollD10);

                                    document.getElementById("testd4").innerHTML = rollD10;
                                }
                            }
                        >
                            <img className="d10-img" src="" />d10
                        </button>

                        <button className="d12"
                            onClick={
                                () => {
                                    const rollD12 = dice(12);
                                    console.log(rollD12);

                                    document.getElementById("testd4").innerHTML = rollD12;
                                }
                            }
                        >
                            <img className="d12-img" src="" />d12
                        </button>

                        <button className="d20"
                            onClick={
                                () => {
                                    const rollD20 = dice(20);
                                    console.log(rollD20);

                                    document.getElementById("testd4").innerHTML = rollD20;
                                }
                            }
                        >
                            <img className="d20-img" src="" />d20
                        </button>
                        <button className="d100"
                            onClick={
                                () => {
                                    const rollD100 = dice(100);
                                    console.log(rollD100);

                                    document.getElementById("testd4").innerHTML = rollD100;
                                }
                            }
                        >
                            <img className="d100-img" src="" />d100
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default GameView;

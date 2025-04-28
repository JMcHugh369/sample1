import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import mapplaceholder from "../asset/mapplaceholder.png";
import wizard from "../asset/prof-pics/wizard.png";
import crystalball from "../asset/gameside/crystalball.png";
import minimap from "../asset/gameside/minimap.png";
import imgd4 from "../asset/gameside/d4.png";
import imgd6 from "../asset/gameside/d6.png";
import imgd8 from "../asset/gameside/d8.png";
import imgd10 from "../asset/gameside/d10.png";
import imgd12 from "../asset/gameside/d12.png";
import imgd20 from "../asset/gameside/d20.png";
import imgd100 from "../asset/gameside/d100.png";

import "./index.scss";

const socket = io("http://localhost:5002"); // Use your server URL

const GameView = ({ campaignId, currentUser, users = [] }) => {
  console.log("Rendering GameView with campaignId:", campaignId, "currentUser:", currentUser);
  console.log("GameView users:", users); // Should show all users
  console.log("GameView currentUser:", currentUser); // Should show the logged-in user
  const [chatMode, setChatMode] = useState("public");
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [dmNotes, setDmNotes] = useState([]);
  const [privateNotes, setPrivateNotes] = useState([]);
  const [dmNoteInput, setDmNoteInput] = useState("");
  const [privateNoteInput, setPrivateNoteInput] = useState("");
  const [initiativeItems, setInitiativeItems] = useState([]);
  const [placedTokens, setPlacedTokens] = useState([]);
  const [showMapButton, setShowMapButton] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [gridSize, setGridSize] = useState(10);
  const [showGrid, setShowGrid] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const [hoveredToken, setHoveredToken] = useState(null);
  const [diceLog, setDiceLog] = useState([]);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [mapImage, setMapImage] = useState(null);

  // Calculate cell width and height based on mapDimensions and gridSize
  const cellWidth = mapDimensions.width / gridSize;
  const cellHeight = mapDimensions.height / gridSize;

  const gridRef = useRef(null);
  const mapRef = useRef(null);
  const smallMapRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });



  useEffect(() => {
    if (campaignId) {
      fetch(`http://localhost:5002/campaigns/${campaignId}/tokens`)
        .then(res => res.json())
        .then(data => setPlacedTokens(data.tokens || []));
    }
  }, [campaignId]);

  // Fetch chat history
  useEffect(() => {
    if (chatMode === "public" && campaignId) {
      console.log("Fetching public chat history for campaign:", campaignId);
      fetch(`http://localhost:5002/chat/messages/${campaignId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched public messages:", data.messages);
          setMessages(data.messages || []);
        })
        .catch(err => {
          console.error("Error fetching public messages:", err);
        });
    } else if (chatMode === "private" && currentUser?.id && selectedUser?.id) {
      console.log(`Fetching private chat history between ${currentUser.id} and ${selectedUser.id}`);
      fetch(`http://localhost:5002/chat/private/${currentUser.id}/${selectedUser.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched private messages:", data.messages);
          setMessages(data.messages || []);
        })
        .catch(err => {
          console.error("Error fetching private messages:", err);
        });
    }
  }, [chatMode, campaignId, currentUser, selectedUser]);

  // Join campaign and private rooms
  useEffect(() => {
    if (campaignId) {
      socket.emit('join_campaign', campaignId);
    }
  }, [campaignId]);

  // Listen for new messages
  useEffect(() => {
    const handlePublic = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.timestamp === msg.timestamp && m.sender_id === msg.sender_id)) return prev;
        return [...prev, msg];
      });
    };
    const handlePrivate = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.timestamp === msg.timestamp && m.sender_id === msg.sender_id)) return prev;
        return [...prev, msg];
      });
    };
    socket.on("public_message", handlePublic);
    socket.on("private_message", handlePrivate);

    // Clean up listeners on unmount or dependency change
    return () => {
      socket.off("public_message", handlePublic);
      socket.off("private_message", handlePrivate);
    };
  }, [campaignId]);

  useEffect(() => {
    fetch(`http://localhost:5002/campaigns/${campaignId}/dice-logs`)
      .then(res => res.json())
      .then(data => setDiceLog((data.dice_logs || []).map(
        log => `Rolled d${log.sides}: ${log.result} (${new Date(log.timestamp).toLocaleTimeString()})`
      )));
  }, [campaignId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveDiceLog = async (sides, result) => {
    try {
      await fetch(`http://localhost:5002/campaigns/${campaignId}/dice-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          sides,
          result,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to save dice log', err);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5002/campaigns/${campaignId}/initiative`)
      .then(res => res.json())
      .then(data => setInitiativeItems(data.initiative || []));
  }, [campaignId]);

  const saveInitiative = async (items) => {
    await fetch(`http://localhost:5002/campaigns/${campaignId}/initiative`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initiativeItems: items }),
    });
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser?.id) return;
    const msg = {
      campaign_id: campaignId,
      sender_id: currentUser.id,
      sender_username: currentUser.username,
      content: input,
      timestamp: new Date().toISOString(),
    };
    if (chatMode === "public") {
      socket.emit("public_message", msg);
      setMessages(prev => [...prev, msg]); // Optimistic update
    } else if (chatMode === "private" && selectedUser?.id) {
      const privateMsg = {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        sender_username: currentUser.username,
        content: input,
        timestamp: new Date().toISOString(),
      };
      socket.emit("private_message", privateMsg);
      setMessages(prev => [...prev, privateMsg]); // Optimistic update
    }
    setInput("");
  };

  useEffect(() => {
    console.log("Token state updated:", placedTokens);
  }, [placedTokens]);

  function dice(max) {
    return 1 + Math.floor(Math.random() * max);
  }

  // Fetch DM notes
  useEffect(() => {
    fetch(`http://localhost:5002/campaigns/${campaignId}/dm-notes`)
      .then(res => res.json())
      .then(data => setDmNotes(data.notes));
  }, [campaignId]);

  // Fetch private notes
  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://localhost:5002/campaigns/${campaignId}/private-notes/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setPrivateNotes(data.notes));
  }, [campaignId, currentUser]);

  // Add DM note (only DM)
  const addDmNote = () => {
    fetch(`http://localhost:5002/campaigns/${campaignId}/dm-notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, content: dmNoteInput })
    })
      .then(res => res.json())
      .then(data => {
        setDmNotes(prev => [...prev, data.note]);
        setDmNoteInput("");
      });
  };

  // Add private note
  const addPrivateNote = () => {
    fetch(`http://localhost:5002/campaigns/${campaignId}/private-notes/${currentUser.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: privateNoteInput })
    })
      .then(res => res.json())
      .then(data => {
        setPrivateNotes(prev => [...prev, data.note]);
        setPrivateNoteInput("");
      });
  };

  useEffect(() => {
    socket.on("dm_note_added", (note) => {
      // Only add if it's for the current campaign
      if (note.campaign_id === Number(campaignId)) {
        setDmNotes((prev) => [...prev, note]);
      }
    });
    return () => {
      socket.off("dm_note_added");
    };
  }, [campaignId]);

  // Initiative Tracker functions
  const handleAddInitiativeItem = () => {
    const newItem = { id: Date.now(), name: "", roll: 0 };
    const updated = [...initiativeItems, newItem];
    setInitiativeItems(updated);
    saveInitiative(updated);
  };

  const handleUpdateInitiativeItem = (id, field, value) => {
    const updated = initiativeItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setInitiativeItems(updated);
    saveInitiative(updated);
  };

  const handleDeleteInitiativeItem = (id) => {
    const updated = initiativeItems.filter(item => item.id !== id);
    setInitiativeItems(updated);
    saveInitiative(updated);
  };

  // Token placement functions
  const handleTokenDrop = (e) => {
    const tokenId = e.dataTransfer.getData("tokenId");
    const token = { id: tokenId, position: { col: 0, row: 0 }, type: "default", image: wizard };
    setPlacedTokens([...placedTokens, token]);
  };

  const handleTokenDragStart = (e, tokenId) => {
    e.dataTransfer.setData("tokenId", tokenId);
  };

  // Add to game log function
  const addToGameLog = (sides, result) => {
    const logEntry = `Rolled a d${sides}: ${result}`;
    const logContainer = document.getElementById("gamelog-container");
    logContainer.innerHTML += `<div>${logEntry}</div>`;
    logContainer.scrollTop = logContainer.scrollHeight;
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

  const handleCloseMap = () => {
    console.log("Closing expanded map. Current tokens:", placedTokens);
    setShowExpandedMap(false);
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

  useEffect(() => {
    function handleTokensUpdate({ campaignId: incomingCampaignId, tokens }) {
      if (String(incomingCampaignId) === String(campaignId)) {
        setPlacedTokens(tokens);
      }
    }
    socket.on("tokens_update", handleTokensUpdate);
    return () => socket.off("tokens_update", handleTokensUpdate);
  }, [campaignId]);

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

  const handleMouseMove = (e) => {
    if (selectedToken && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      // Calculate cursor position relative to the grid
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      setCursorPosition({ x, y });
    }
  };

  const handleGridCellClick = (row, col) => {
    if (selectedToken) {
      const newTokens = [
        ...placedTokens.filter(t => !(selectedToken.id && t.id === selectedToken.id)),
        {
          id: selectedToken.id || Date.now(),
          type: selectedToken.type,
          image: selectedToken.image,
          position: { row, col }
        }
      ];
      socket.emit("tokens_update", {
        campaignId,
        tokens: newTokens,
      });
      setSelectedToken(null);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetch(`http://localhost:5002/campaigns/${campaignId}/map`)
        .then(res => res.json())
        .then(data => {
          if (data.src) setMapImage(data.src);
        });
    }
  }, [campaignId]);

  //  useEffect(() => {
  //  if (showExpandedMap) {
  // Emit placedTokens to the server when they change and map is open
  //    socket.emit("tokens_update", {
  //      campaignId,
  //      tokens: placedTokens,
  //    });
  //  }
  //}, [placedTokens, campaignId, showExpandedMap]);

  return (
    <div className="gameview-root">
      <div className="gameview-main">
        <div className="initiative-container">
          {initiativeItems.map(item => (
            <div key={item.id} className="initiative-item">
              <input
                type="text"
                className="initiative-name monster-spd" // Add "monster-spd" class for styling
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

        <div
          className="map"
          onMouseEnter={() => setShowMapButton(true)}
          onMouseLeave={() => setShowMapButton(false)}
          ref={smallMapRef}
        >
          <img className="map-up" src={mapImage || mapplaceholder} alt="" />

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
                      <div
                        id="monster-token-1"
                        className="token-item"
                        onClick={() => handleTokenSelect('Monster')}
                        onMouseEnter={() => setHoveredToken({ type: 'Monster', name: 'Dragon Monster', id: 'monster-token-1' })}
                        onMouseLeave={() => setHoveredToken(null)}
                      >
                        <img src={wizard} alt="Monster Token 1" />
                      </div>

                      <div
                        id="monster-token-2"
                        className="token-item"
                        onClick={() => handleTokenSelect('Monster')}
                        onMouseEnter={() => setHoveredToken({ type: 'Monster', name: 'Goblin Monster', id: 'monster-token-2' })}
                        onMouseLeave={() => setHoveredToken(null)}
                      >
                        <img src={wizard} alt="Monster Token 2" />
                      </div>
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
                    {/* NPC token options */}
                    <div className="token-options">
                      <div
                        id="npc-token-1"
                        className="token-item"
                        onClick={() => handleTokenSelect('NPC')}
                        onMouseEnter={() => setHoveredToken({ type: 'NPC', name: 'Merchant NPC', id: 'npc-token-1' })}
                        onMouseLeave={() => setHoveredToken(null)}
                      >
                        <img src={wizard} alt="NPC Token 1" />
                      </div>

                      <div
                        id="npc-token-2"
                        className="token-item"
                        onClick={() => handleTokenSelect('NPC')}
                        onMouseEnter={() => setHoveredToken({ type: 'NPC', name: 'Villager NPC', id: 'npc-token-2' })}
                        onMouseLeave={() => setHoveredToken(null)}
                      >
                        <img src={wizard} alt="NPC Token 2" />
                      </div>
                    </div>

                    {/* NPC info display */}
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
                    src={mapImage || mapplaceholder}
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
                        if (
                          !token.position ||
                          typeof token.position.col !== "number" ||
                          typeof token.position.row !== "number"
                        ) {
                          // Skip tokens with invalid position
                          return null;
                        }
                        return (
                          <img
                            key={token.id}
                            src={token.image}
                            alt={token.type}
                            style={{
                              position: "absolute",
                              left: `${token.position.col * cellWidth}px`,
                              top: `${token.position.row * cellHeight}px`,
                              width: `${cellWidth}px`,
                              height: `${cellHeight}px`
                            }}
                          />
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
      </div>

      <div className="gamelog">
        <div id="gamelog-container"></div>
      </div>

      {/* --- Your existing chat/notes container --- */}
      <div className="chat-right">
        <div className="chat-header">
          <div className="chat-tabs">
            <button className={chatMode === "private" ? "active" : ""} onClick={() => setChatMode("private")}>Private Chat</button>
            <button className={chatMode === "dmnotes" ? "active" : ""} onClick={() => setChatMode("dmnotes")}>DM Notes</button>
            <button className={chatMode === "public" ? "active" : ""} onClick={() => setChatMode("public")}>Public Notes</button>
            <button className={chatMode === "privatenotes" ? "active" : ""} onClick={() => setChatMode("privatenotes")}>Private Notes</button>
            <button className={chatMode === "dice" ? "active" : ""} onClick={() => setChatMode("dice")}>🎲 Dice Rolls</button>
          </div>
        </div>

        <div className="chat-window">
          {chatMode === "public" && (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  {msg.sender_username && (
                    <span className="chat-username">{msg.sender_username}:</span>
                  )}
                  <span className="chat-text">{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
          {chatMode === "private" && (
            <>
              {currentUser && (
                <select
                  value={selectedUser?.id || ""}
                  onChange={e => {
                    const user = users.find(u => u.id === Number(e.target.value));
                    setSelectedUser(user);
                  }}
                >
                  <option value="">Select user</option>
                  {users
                    .filter(u => Number(u.id) !== Number(currentUser.id))
                    .map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                </select>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  {msg.sender_username && (
                    <span className="chat-username">{msg.sender_username}:</span>
                  )}
                  <span className="chat-text">{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
          {chatMode === "dmnotes" && (
            <div id="dm-note-window" className="notes-section">
              <ul>
                {dmNotes.map(note => <li key={note.id}>{note.content}</li>)}
              </ul>
              {currentUser?.isDM && (
                <form onSubmit={e => { e.preventDefault(); addDmNote(); }}>
                  <input
                    id="dm-note"
                    value={dmNoteInput}
                    onChange={e => setDmNoteInput(e.target.value)}
                    placeholder="Add a DM note..."
                  />
                  <button id="dm-submit" type="submit" disabled={!dmNoteInput.trim()}>Add DM Note</button>
                </form>
              )}
            </div>
          )}
          {chatMode === "privatenotes" && (
            <div id="private-notes" className="notes-section">
              <h3>Private Notes</h3>
              <ul>
                {privateNotes.map(note => <li key={note.id}>{note.content}</li>)}
              </ul>
              <form onSubmit={e => { e.preventDefault(); addPrivateNote(); }}>
                <input
                  value={privateNoteInput}
                  onChange={e => setPrivateNoteInput(e.target.value)}
                  placeholder="Add a private note..."
                />
                <button id="dm-submit" type="submit" disabled={!privateNoteInput.trim()}>Add Private Note</button>
              </form>
            </div>
          )}
          {chatMode === "dice" && (
            <div className="dice-tab-panel">
              <div className="dice-log-window">
                <h3>Dice Log</h3>
                <ul>
                  {diceLog.map((entry, idx) => (
                    <li key={idx}>{entry}</li>
                  ))}
                </ul>
              </div>
              <div className="dice-tab-roller-panel">
                {[
                  { sides: 4, img: imgd4 },
                  { sides: 6, img: imgd6 },
                  { sides: 8, img: imgd8 },
                  { sides: 10, img: imgd10 },
                  { sides: 12, img: imgd12 },
                  { sides: 20, img: imgd20 },
                  { sides: 100, img: imgd100 },
                ].map(die => (
                  <button
                    key={die.sides}
                    className="dice-img-btn"
                    onClick={async () => {
                      const result = Math.floor(Math.random() * die.sides) + 1;
                      setDiceLog(log => [
                        ...log,
                        `Rolled d${die.sides}: ${result} (${new Date().toLocaleTimeString()})`
                      ]);
                      await saveDiceLog(die.sides, result); // <-- Save to DB
                    }}
                  >
                    <img src={die.img} alt={`d${die.sides}`} style={{ height: "40px", width: "40px" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* These should NOT be inside any tab panel */}
        {(chatMode === "public" || chatMode === "private") && (
          <form className="chat-input-area" onSubmit={sendMessage}>
            <input
              id="chat-message"
              style={{ position: 'absolute', top: '360px', right: '250px' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={chatMode === "private" && !selectedUser}
            />
            <button className="submit" id="submit" type="submit" disabled={!input || (chatMode === "private" && !selectedUser)}>Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default GameView;
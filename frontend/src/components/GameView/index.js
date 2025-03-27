import "./index.scss";
import Nav from "../Nav";
import DMView from "../DMView";
import { useState, useEffect } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import mapplaceholder from "../asset/mapplaceholder.png";
import crystalball from "../asset/gameside/crystalball.png";
import minimap from "../asset/gameside/minimap.png";

const GameView = () => {

    function dice(max) {
        return 1 + Math.floor(Math.random() * max);
    }


    return (
        <>
            <Nav />

            <DMView />
          

            <main>
                <div class="gameside">
                    <div class="initiative-container">
                        <div class="initiative-item">
                            <img class="initiative-block" src="" />
                            <img class="initiative-prof-pic" src="" />
                            <span>Character 1</span>
                            <button class="initiative-delete">-</button>
                        </div>
                        <div class="initiative-new">
                            <img class="initiative-block" src="" />
                            <button class="initiative-add">+</button>
                        </div>


                    </div>

                    <div class="map">
                        <img class="map-up" src={mapplaceholder} />
                        <button class="map-expand"><img src={wizard} /></button>
                        <button class="map-log"><img src={minimap} /></button>
                        <button class="add-token"><img src={wizard} /></button>
                    </div>

                    <div class="map-expanded">
                        <img class="map-up" src="" />
                        <img class="map-minimize" src="" />
                        <img class="add-token" src="" />
                    </div>

                    <div class="token-info">
                        <button class="token-delete">X</button>
                        <button class="token-info-minimize">-</button>
                        <p>Name</p>
                        <p>HP: 99</p>
                    </div>

                    <div class="gamelog">
                        <p>\Character\ Rolled: </p>
                        <p id="testd4"> </p>
                    </div>

                    <div class="bottom">

                        <div class="chat-container">
                            <div class="chat">
                                <img class="orb-chat" src={crystalball} />
                                <img class="group-chat" src="" />
                                <img class="dm-chat" src="" />
                                <img class="player2-chat" src="" />
                            </div>

                            <div class="chat-up">
                                <button class="chat-minimize">-</button>
                                <form>
                                    <input type="text" class="message-player" placeholder="Message Player..." />
                                    <button>&#8594;</button>
                                </form>
                            </div>
                        </div>

                        <div class="notes">
                            <div class="public-notes">
                                <button>
                                    Public
                                </button>
                            </div>
                            <div class="private-notes">

                                <button>
                                    Private
                                </button>
                            </div>
                            <div class="dm-public-notes">

                                <button>
                                    DM
                                </button>
                            </div>
                            <div class="note-open" id="note-dm">
                                <form><input type="text" />
                                    <button type="submit">{">"}</button>
                                </form>
                            </div>
                        </div>

                    </div>

                    <div class="dice">

                        <button class="d4"
                            onClick={
                                () => {
                                    const rollD4 = dice(4);
                                    console.log(rollD4);
                                    
                                    document.getElementById("testd4").innerHTML = rollD4;
                                }
                            }
                        >
                            <img class="d4-img" src="" />d4
                        </button>

                        <button class="d6"
                            onClick={
                                () => {
                                    const rollD6 = dice(6);
                                    console.log(rollD6);
                                  
                                    document.getElementById("testd4").innerHTML = rollD6;
                                }
                            }
                        >
                            <img class="d6-img" src="" />d6
                        </button>

                        <button class="d8"
                            onClick={
                                () => {
                                    const rollD8 = dice(8);
                                    console.log(rollD8);
                                  
                                    document.getElementById("testd4").innerHTML = rollD8;
                                }
                            }
                        >
                            <img class="d8-img" src="" />d8
                        </button>

                        <button class="d10"
                            onClick={
                                () => {
                                    const rollD10 = dice(10);
                                    console.log(rollD10);
                                    
                                    document.getElementById("testd4").innerHTML = rollD10;
                                }
                            }
                        >
                            <img class="d10-img" src="" />d10
                        </button>

                        <button class="d12"
                            onClick={
                                () => {
                                    const rollD12 = dice(12);
                                    console.log(rollD12);
                                  
                                    document.getElementById("testd4").innerHTML = rollD12;
                                }
                            }
                        >
                            <img class="d12-img" src="" />d12
                        </button>

                        <button class="d20"
                            onClick={
                                () => {
                                    const rollD20 = dice(20);
                                    console.log(rollD20);
                                    
                                    document.getElementById("testd4").innerHTML = rollD20;
                                }
                            }

                        >
                            <img class="d20-img" src="" />d20
                        </button>
                        <button class="d100"
                            onClick={
                                () => {
                                    const rollD100 = dice(100);
                                    console.log(rollD100);
                                
                                    document.getElementById("testd4").innerHTML = rollD100;
                                }
                            }
                        >
                            <img class="d100-img" src="" />d100
                        </button>

                    </div>

                </div>
            </main>

            {

            }
        </>
    )

}

export default GameView;
import "./index.scss";
import Nav from "../Nav";
import DMView from "../DMView";
import { useState, useEffect } from "react";
import wizard from "../asset/prof-pics/wizard.png";

const GameView = () => {

    return (
        <>
            <Nav />

            <main>
                <div class="gameside">
                    <div class="initiative-container">
                        <div class="initiative-item">
                            <img class="initiative-block" src="" />
                            <img class="initiative-prof-pic" src="" />
                            <span>Character1</span>
                            <button class="initiative-delete">-</button>
                        </div>
                        <div class="initiative-new">
                            <img class="initiative-block" src="" />
                            <p>This is only available to the DM</p>
                            <button class="initiative-add">+</button>
                        </div>


                    </div>

                    <div class="map">
                        <img class="map-up" src="" />
                        <img class="map-expand" src="" />
                        <img class="map-log" src="" />
                        <img class="add-token" src="" />
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
                        <p>HP://Only available to dm</p>
                    </div>

                    <div class="gamelog">
                        <p>Character Rolled: </p>
                    </div>

                    <div class="chat">
                        <img class="orb-chat" src="" />
                        <img class="group-chat" src="" />
                        <img class="dm-chat" src="" />
                        <img class="player2-chat" src="" />
                    </div>

                    <div class="chat-up">
                        <button class="chat-minimize">-</button>
                        <form class="message-player">Message Player...</form>
                        <span>&#8594;</span>
                    </div>

                    <div class="dice">
                        <img class="d4" src="" />
                        <img class="d6" src="" />
                        <img class="d8" src="" />
                        <img class="d10" src="" />
                        <img class="d12" src="" />
                        <img class="d20" src="" />
                        <img class="d100" src="" />
                    </div>

                    <div class="notes">
                        <div class="public-notes">
                            <p>These notes are public</p>
                        </div>
                        <div class="private-notes">
                            <p>These notes are private to only me</p>
                        </div>
                        <div class="dm-public-notes">
                            <p>Only the DM can edit these</p>
                        </div>
                    </div>


                </div>
            </main>

            {

            }
        </>
    )

}

export default GameView;
import "./index.scss";
import Nav from "../Nav";
import DMView from "../DMView";
import { useState, useEffect } from "react";
import wizard from "../asset/prof-pics/wizard.png";

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
                        <img class="map-up" src={wizard} />
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
                        <p>HP: 99</p>
                    </div>

                    <div class="gamelog">
                        <p>\Character\ Rolled: </p>
                    </div>

                    <div class="bottom">

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

                    <div class="dice">

                        <button class="d4"
                            onclick={
                                () => {
                                    const rollD4 = () => dice(4);
                                    console.log(rollD4);
                                }
                            }
                        >
                            <img class="d4-img" src="" />d4
                        </button>

                        <button class="d6"
                        
                        >
                            <img class="d6-img" src="" />d6
                        </button>

                        <button class="d8">
                            <img class="d8-img" src="" />d8
                        </button>

                        <button class="d10">
                            <img class="d10-img" src="" />d10
                        </button>

                        <button class="d12">
                            <img class="d12-img" src="" />d12
                        </button>

                        <button class="d20">
                            <img class="d20-img" src="" />d20
                        </button>

                        <button class="d100">
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
import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
import { useState, useEffect } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import map from "../asset/gameside/minimap.png";
import adventurer from "../asset/dmside/adventurer.png";
import addmonster from "../asset/dmside/add-monster.png";
import addnpc from "../asset/dmside/add-npc.png";

const DMView = () => {

    const [monsters, setMonsters] = useState([]);

    function minMonster() {
        const viewMon = document.createElement('view-monster');
        viewMon.className = "invisible";
    }

    function upMonster() {
        const viewMon = document.createElement('view-monster');
        viewMon.className = "visible";
    }

    function viewPC() {

    }

    function addMap() {

    }

    function addNPC() {

    }


    function addMonster() {
        var popup = document.getElementById("add-monster");
        popup.classList.toggle("show");

        const monster = {
            name: "New Monster",
            size: "size",
            alignment: "alignment",
            ac: "ac",
            hp: "hp",
            spd: "spd",
            str: "str",
            dex: "dex",
            con: "con",
            int: "int",
            wis: "wis",
            cha: "cha"

        };

        setMonsters([...monsters, monster]);

    }

    return (
        <>
            <Nav />
            <GameView />

          
                <div class="dm-side">
                    <div class="monsters">
                        <div>
                            <p>Monsters</p>
                            <img class="img-frame" src=""></img>
                            <img class="dm-token-img" src=""></img>
                            <img class="img-frame" src=""></img>
                            <button class="add-monster" onClick={
                                () => {
                                    upMonster();
                                }
                            }
                            ><img class="add-monster-img" src={addmonster} />
                            </button>
                        </div>
                    </div>
                    <div class="npcs">
                        <div>
                            <p>NPCs</p>
                            <img class="img-frame" src=""></img>
                            <img class="dm-token-img" src=""></img>
                            <img class="img-frame" src=""></img>
                            <button class="add-npc"
                                onclick={
                                    () => {
                                        addNPC();
                                    }
                                }
                            ><img class="add-npc-img" src={addnpc} />
                            </button>
                        </div>
                    </div>
                    <div class="dmview-pcs">
                        <div>
                            <p>Player Characters</p>
                            <img class="img-frame" src=""></img>
                            <img class="dm-token-img" src=""></img>
                            <button class="view-pc"
                                onclick={
                                    () => {
                                        viewPC();
                                    }
                                }
                            ><img class="view-pc-img" src={adventurer} />
                            </button>
                        </div>
                    </div>
                    <div class="maps">
                        <div>
                            <p>Maps</p>
                            <img class="dm-map" src=""></img>
                            <img class="add-map-img" src=""></img>
                            <button class="dm-add-map"
                                onclick={
                                    () => {
                                        addMap();
                                    }
                                }
                        ><img class="add-map-img" src={map} />
                            </button>
                        </div>
                    </div>

                    <div class="invisible" id="view-monster">

                        <button class="minimize-monster"
                        onclick={
                            () => {
                                minMonster();
                            }
                        }
                        >-</button>

                        <form class="monster-basics">
                            <input type="text" name="monster-name" placeholder="Monster Name..." />
                            <div class="size-align">
                                <input type="text" name="monster-size" placeholder="size" />
                                <input type="text" name="monster-alignment" placeholder="alignment" />
                            </div>
                            Armor Class <input type="text" name="monster-ac" placeholder="0" />
                            Hit Points <input type="text" name="monster-hp" placeholder="0" />
                            Speed <input type="text" name="monster-spd" placeholder="0" />
                        </form>

                        <form class="monster-stats">

                            <div>
                                <div>STR</div>
                                <input type="text" name="monster-str" placeholder="0" />
                            </div>

                            <div>
                                <div>DEX</div>
                                <input type="text" name="monster-dex" placeholder="0" />
                            </div>
                            <div>
                                <div>CON</div>
                                <input type="text" name="monster-con" placeholder="0" />
                            </div>

                            <div>
                                <div>INT</div>
                                <input type="text" name="monster-int" placeholder="0" />
                            </div>

                            <div>
                                <div>WIS</div>
                                <input type="text" name="monster-wis" placeholder="0" />
                            </div>

                            <div>
                                <div>CHA</div>
                                <input type="text" name="monster-cha" placeholder="0" />
                            </div>

                        </form>

                        <form class="monster-details">
                            <div>
                            Saving Throws <input type="text" name="monster-saves" placeholder="Add Saves..."/>
                            </div>
                            <div>
                            Skills <input type="text" name="monster-skills" placeholder="Add Skills..."/>
                            </div>
                            <div>
                            Senses <input type="text" name="monster-senses" placeholder="Add Senses..."/>
                            </div>
                            <div>
                            Languages <input type="text" name="monster-languages" placeholder="Add Languages..."/>
                            </div>
                            <div>
                            Challenge <input type="text" name="monster-challenge" placeholder="Add Challenge Rating..."/>
                            </div>
                        </form>

                        <form class="monster-abilities">
                            <p>Abilities</p>
                            <input type="text" name="monster-ability-name" placholder="Name..."/>
                            <input type="text" name="monster-ability" placholder="Descr..." />
                            <button id="new-monster-ability">+</button>
                        </form>

                        <h1>Actions</h1>
                        <form class="monster-actions-form">
                            <input type="text" name="monster-action-name" placeholder="Name..." />
                            <input type="text" name="monster-action" placeholder="Descr..." />
                            <button id="new-monster-action">+</button>
                        </form>

                        <h1>Reactions</h1>
                        <form class="monster-reactions-form">
                            <input type="text" name="monster-reaction-name" placeholder="Name..." />
                            <input type="text" name="monster-reaction" placeholder="Descr..." />
                            <button id="new-monster-reaction">+</button>
                        </form>

                    </div>

                    <div class="view-pc">

                    </div>

                    <div class="view-map">

                    </div>

                </div>
         

        </>
    )
}

export default DMView;

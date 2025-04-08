import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
import wizard from "../asset/prof-pics/wizard.png";
import str from "../asset/charsheet/str.png";
import dex from "../asset/charsheet/dex.png";
import con from "../asset/charsheet/con.png";
import int from "../asset/charsheet/int.png";
import wis from "../asset/charsheet/wis.png";
import cha from "../asset/charsheet/cha.png";
import ac from "../asset/charsheet/ac.png";
import perception from "../asset/charsheet/passive-perception.png";
import gold from "../asset/charsheet/gold.png";
import silver from "../asset/charsheet/silver.png";
import copper from "../asset/charsheet/copper.png";
import platinum from "../asset/charsheet/platinum.png";
import electrum from "../asset/charsheet/electrum.png";
import adventurer from "../asset/dmside/adventurer.png";
import speed from "../asset/charsheet/speed.png";
import initiativemod from "../asset/charsheet/initiativemod.png";
import inspoff from "../asset/charsheet/inspoff.png";
import inspon from "../asset/charsheet/insp-on-btn.png";

const PlayerView = () => {

    function openTab(event, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";
    }

    return (
        <>
            <Nav />
            <GameView />

            <main>
                <div class="playerside">
                    <header class="sheet-header">
                        <img class="sheet-pc-image" src={adventurer} />
        //The character name, level, species, class, and background should all be saved and displayed here if already saved.

        //Clicking on the sheet-pc-image icon should allow the user to change the image of the icon.
                        <form>
                            <input type="text" class="char-name" placeholder="Name..." />
                        </form>
                        <form>
                            <input type="text" class="char-lvl" placeholder="Level..." />
                        </form>
                        <form>
                            <input type="text" class="char-species" placeholder="Species..." />
                        </form>
                    </header>
                    <div class="header2">
                        <form>
                            <input type="text" class="char-class" placeholder="Class..." />
                        </form>
                        <form>
                            <input type="text" class="char-bg" placeholder="Background..." />
                        </form>
                    </div>


//Abilities should also be saved and displayed if saved.  Anything in the sheet that's already saved should be displayed as it was last saved.
                    <sidebar class="abilities">
                        <div class="abil-img">
                            <img class="str-img" src={str} />
                            <img class="dex-img" src={dex} />
                            <img class="con-img" src={con} />
                            <img class="int-img" src={int} />
                            <img class="wis-img" src={wis} />
                            <img class="cha-img" src={cha} />
                            <img class="percep-img" src={perception}
                        </div>

                        <form class="form-str">

                            <input type="text" class="str" placeholder="0" />
                            <input type="text" class="str-mod" placeholder="0" />
                        </form>

                        <form>

                            <input type="text" class="dex" placeholder="0" />
                            <input type="text" class="dex-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="con" placeholder="0" />
                            <input type="text" class="con-mod" placeholder="0" />
                        </form>

                        <form>
                            <input type="text" class="int" placeholder="0" />
                            <input type="text" class="int-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="wis" placeholder="0" />
                            <input type="text" class="wis-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="cha" placeholder="0" />
                            <input type="text" class="cha-mod" placeholder="0" />
                        </form>

                        <form>
                            <input type="text" class="passive-perception" placeholder="0" />
                        </form>

                    </sidebar>

                    <div class="top-middle">
                        <img class="ac-img" src={ac} />
                        <form>
                            <input type="text" class="ac" placeholder="0" />
                        </form>
                        <img class="init-img" src={initiativemod} />
                        <form>
                            <input type="text" class="init" placeholder="0" />
                        </form>
                        <img class="spd-img" src={speed} />
                        <form>
                            <input type="text" class="spd" placeholder="0" />
                        </form>
                        <img class="inspiration-img" src={inspoff} />
                        <form>
                            <button class="inspiration"/>
                            <input type="checkbox"/>
                        </form>
                    </div>

                    <div class="skills">
                        <ul>
                            <li>0 Acrobatics (Dex)</li>
                            <li>0 Animal Handling (Wis)</li>
                            <li>0 Arcana (Int)</li>
                            <li>0 Athletics (Str)</li>
                            <li>0 Deception (Cha)</li>
                            <li>0 History (Int)</li>
                            <li>0 Insight (Wis)</li>
                            <li>0 Intimidation (Cha)</li>
                            <li>0 Investigation (Int)</li>
                            <li>0 Medicine (Wis)</li>
                            <li>0 Nature (Int)</li>
                            <li>0 Perception (Wis)</li>
                            <li>0 Performance (Cha)</li>
                            <li>0 Persuasion (Cha)</li>
                            <li>0 Religion (Int)</li>
                            <li>0 Sleight of Hand (Dex)</li>
                            <li>0 Stealth (Dex)</li>
                            <li>0 Survival (Wis)</li>
                        </ul>

                    </div>

                    <div class="center-center">
                        <div class="hp-container">
                            <input type="text" class="curr-hp" placeholder="0" />/<span><input type="text" class="max-hp" placeholder="0" /></span>
                            <br /><input type="text" class="temp-hp" placeholder="- -" />
                        </div>
                        <div class="center-other">

                            <input type="text" class="conditions" placeholder="conditions..." />
                            <input type="text" class="defenses" placeholder="defenses..." />

                        </div>
                    </div>

                    <div class="bottom-center">
//On the click of one of these buttons, it should show the tab contents.  So, Actions should show the Actions tabcontent, Spells should
        //show Spells, etc.
                        <div class="tab">
                            <button class="tablinks" onclick="openTab(event, 'Actions')">Actions</button>
                            <button class="tablinks" onclick="openTab(event, 'Spells')">Spells</button>
                            <button class="tablinks" onclick="openTab(event, 'Features')">Features</button>
                            <button class="tablinks" onclick="openTab(event, 'Traits')">Traits</button>
                        </div>

                        <div id="Actions" class="tabcontent">
                            <h3>Actions</h3>
                            <button class="add-actions">+</button>
//when the + button is pressed, it should add a new input field for Name and Description.  For this, as well as Spells, Features, Traits.
                        </div>

                        <div id="Spells" class="tabcontent">
                            <h3>Spells</h3>
                            <button class="add-spells">+</button>
                        </div>

                        <div id="Features" class="tabcontent">
                            <h3>Features</h3>
                            <button class="add-features">+</button>
                        </div>

                        <div id="Traits" class="tabcontent">
                            <h3>Traits</h3>
                            <button class="add-traits">+</button>
                        </div>


                    </div>
        
                    <div class="inventory-container">
                      <div class="currency-img">
                            <img class="platinum-img" src={platinum} />
                            <img class="gold-img" src={gold} />
                            <img class="electrum-img" src={electrum} />
                            <img class="silver-img" src={silver} />
                            <img class="copper-img" src={copper} />
                        </div>
                        <div class="currency-name">
                            <p>P</p>
                            <p>G</p>
                            <p>E</p>
                            <p>S</p>
                            <p>C</p>
                        </div>
                        <div class="currency">
                            <input type="text" class="platinum" placeholder="0" />
                            <input type="text" class="gold" placeholder="0" />
                            <input type="text" class="electrum" placeholder="0" />
                            <input type="text" class="silver" placeholder="0" />
                            <input type="text" class="copper" placeholder="0" />
                        </div>
        //when the + button is pressed, it should add a new input field for Name and Description for the inventory item.
                        <p>Inventory</p>
                        <button class="add-features">+</button>
        
                    </div>

        //when the + button is pressed, it should add a new input field for Name and Description for the Features/Traits, the Background,
        //and the Extra.
                    <div class="feature-container">
                        <p>Features/Traits</p>
                        <button class="add-features">+</button>
                        <p>Background</p>
                        <button class="add-features">+</button>
                        <p>Extra</p>
                        <button class="add-features">+</button>

                    </div>

                    <div class="char-notes">
        //The character notes will act similarly to the notes on the right (gameview), with notes being added by the player to be
        //displayed above the input.  All character notes will be saved, and they can scroll up to view the previous notes.
                        <p>Character Notes</p>
                        <input type="text" class="notes" placeholder="Notes..." />

                    </div>
                </div>
            </main>
        </>
    )
}

export default PlayerView;

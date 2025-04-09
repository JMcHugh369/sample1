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
        //When the inspiration button is clicked (it should be invisible usually and fit to the inspiration-img
        //(also totally fine to just do an onClick for the img instead of having a button), it should display the inspon image, which
        //is in the imports.  When it's clicked again, the inspon image should disappear.  The inspon image is invisible by default.
        //(inspon is short for "inspiration on" and implies that the character has inspiration, which is just represented by the inspon image)
                            <button class="inspiration"/>
                        
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

        //for these, we still need a minus button to delete an action or a spell, etc.
                    <div class="bottom-center">

                        <div class="tab">
                            <button class="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Actions")
                                }
                            }
                            >Actions</button>
                            <button class="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Spells")
                                }
                            }
                            >Spells</button>
                            <button class="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Features")
                                }
                            }>Features</button>
                            <button class="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Traits")
                                }
                            }>Traits</button>
                        </div>

                        <div id="Actions" class="tabcontent">
                            <h3>Actions <span><button class="add-actions" onClick={
                                () => {
                                    var actionName = document.createElement("input");
                                    var actionDesc = document.createElement("input");
                                    actionName.setAttribute('type', 'text');
                                    actionDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("action-items");
                                    parent.appendChild(actionName);

                                    actionName.classList.add("action-name");
                                    actionDesc.classList.add("action-desc");

                                    actionName.placeholder = "Name...";
                                    actionDesc.placeholder = "Description..."

                                    var parent = document.getElementById("action-items");
                                    parent.appendChild(actionDesc);
                                }
                            }>+</button>
                            </span></h3>
                            <div id="action-items">

                            </div>
                        </div>

                        <div id="Spells" class="tabcontent">
                            <h3>Spells <span><button class="add-spells" onClick={
                                    () => {
                                        var spellName = document.createElement("input");
                                        var spellDesc = document.createElement("input");
                                        spellName.setAttribute('type', 'text');
                                        spellDesc.setAttribute('type', 'text');

                                        var parent = document.getElementById("spell-items");
                                        parent.appendChild(spellName);

                                        spellName.classList.add("spell-name");
                                        spellDesc.classList.add("spell-desc");

                                        spellName.placeholder = "Name...";
                                        spellDesc.placeholder = "Description..."

                                        var parent = document.getElementById("spell-items");
                                        parent.appendChild(spellDesc);
                                    }
                                }
                            >+</button>
                            </span></h3>

                            <div id="spell-items">

                            </div>

                        </div>

                        <div id="Features" class="tabcontent">
                            <h3>Features <span>
                                <button class="add-f" onClick={
                                () => {
                                    var fName = document.createElement("input");
                                    var fDesc = document.createElement("input");
                                    fName.setAttribute('type', 'text');
                                    fDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("f-items");
                                    parent.appendChild(fName);

                                    fName.classList.add("f-name");
                                    fDesc.classList.add("f-desc");

                                    fName.placeholder = "Name...";
                                    fDesc.placeholder = "Description..."

                                    var parent = document.getElementById("f-items");
                                    parent.appendChild(fDesc);
                                }
                            }>+</button>
                            </span></h3>

                            <div id="f-items">

                            </div>

                        </div>

                        <div id="Traits" class="tabcontent">
                            <h3>Traits <span>
                                <button class="add-traits" onClick={
                                () => {
                                    var tName = document.createElement("input");
                                    var tDesc = document.createElement("input");
                                    tName.setAttribute('type', 'text');
                                    tDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("t-items");
                                    parent.appendChild(tName);

                                    tName.classList.add("t-name");
                                    tDesc.classList.add("t-desc");

                                    tName.placeholder = "Name...";
                                    tDesc.placeholder = "Description..."

                                    var parent = document.getElementById("t-items");
                                    parent.appendChild(tDesc);
                                }
                            }>+</button>
                            </span></h3>

                            <div id="t-items">

                            </div>

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
        //still need a button to delete inventory item, and need to figure out how to let input overflow onto next line instead of overflowing
        //to a horozontal scroll.
                        <p>Inventory<span>
                            <button class="add-inventory" onClick={
                                () => {
                                    var invName = document.createElement("input");
                                    var invDesc = document.createElement("input");
                                    invName.setAttribute('type', 'text');
                                    invDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("inventory-items");
                                    parent.appendChild(invName);

                                    invName.classList.add("inv-name");
                                    invDesc.classList.add("inv-desc");

                                    invName.placeholder = "Name...";
                                    invDesc.placeholder = "Description..."

                                    var parent = document.getElementById("inventory-items");
                                    parent.appendChild(invDesc);
                                }
                            }>+</button>
                        </span></p>
                        <div id="inventory-items">

                        </div>
        
                    </div>

       //still need a button to delete items, and need to figure out how to let input overflow onto next line instead of overflowing
        //to a horozontal scroll.
                    <div class="feature-container">
                        <p>Features/Traits <span>
                            <button class="add-features" onClick={
                                () => {
                                    var featureName = document.createElement("input");
                                    var featureDesc = document.createElement("input");
                                    featureName.setAttribute('type', 'text');
                                    featureDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("feature-items");
                                    parent.appendChild(featureName);

                                    featureName.classList.add("feature-name");
                                    featureDesc.classList.add("feature-desc");

                                    featureName.placeholder = "Name...";
                                    featureDesc.placeholder = "Description..."

                                    var parent = document.getElementById("feature-items");
                                    parent.appendChild(featureDesc);
                                }
                            }>+</button>
                        </span></p>


                        <div id="feature-items">

                        </div>


                        <p>Background <span>
                            <button class="add-bg" onClick={
                                () => {
                                    var bgName = document.createElement("input");
                                    var bgDesc = document.createElement("input");
                                    bgName.setAttribute('type', 'text');
                                    bgDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("bg-items");
                                    parent.appendChild(bgName);

                                    bgName.classList.add("bg-name");
                                    bgDesc.classList.add("bg-desc");

                                    bgName.placeholder = "Name...";
                                    bgDesc.placeholder = "Description..."

                                    var parent = document.getElementById("bg-items");
                                    parent.appendChild(bgDesc);
                                }
                            }>+</button>
                        </span></p>

                        <div id="bg-items">

                        </div>

                        <p>Extra <span>
                            <button class="add-extra" onClick={
                                () => {
                                    var extraName = document.createElement("input");
                                    var extraDesc = document.createElement("input");
                                    extraName.setAttribute('type', 'text');
                                    extraDesc.setAttribute('type', 'text');

                                    var parent = document.getElementById("extra-items");
                                    parent.appendChild(extraName);

                                    extraName.classList.add("extra-name");
                                    extraDesc.classList.add("extra-desc");

                                    extraName.placeholder = "Name...";
                                    extraDesc.placeholder = "Description...";

                                    var parent = document.getElementById("extra-items");
                                    parent.appendChild(extraDesc);
                                }
                            }>+</button>
                        </span></p>

                        <div id="extra-items">

                        </div>

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

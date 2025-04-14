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
        tabcontent = document.getElementsByclassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByclassName("tablinks");
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
                <div className="playerside">
                    <header className="sheet-header">
                        <img className="sheet-pc-image" src={adventurer} />
        //The character name, level, species, class, and background should all be saved and displayed here if already saved.

        //Clicking on the sheet-pc-image icon should allow the user to change the image of the icon.
                        <form>
                            <input type="text" className="char-name" placeholder="Name..." />
                        </form>
                        <form>
                            <input type="text" className="char-lvl" placeholder="Level..." />
                        </form>
                        <form>
                            <input type="text" className="char-species" placeholder="Species..." />
                        </form>
                    </header>
                    <div className="header2">
                        <form>
                            <input type="text" className="char-class" placeholder="Class..." />
                        </form>
                        <form>
                            <input type="text" className="char-bg" placeholder="Background..." />
                        </form>
                    </div>


//Abilities should also be saved and displayed if saved.  Anything in the sheet that's already saved should be displayed as it was last saved.
                    <sidebar className="abilities">
                        <div className="abil-img">
                            <img className="str-img" src={str} />
                            <img className="dex-img" src={dex} />
                            <img className="con-img" src={con} />
                            <img className="int-img" src={int} />
                            <img className="wis-img" src={wis} />
                            <img className="cha-img" src={cha} />
                            <img className="percep-img" src={perception}
                        </div>

                        <form className="form-str">

                            <input type="text" className="str" placeholder="0" />
                            <input type="text" className="str-mod" placeholder="0" />
                        </form>

                        <form>

                            <input type="text" className="dex" placeholder="0" />
                            <input type="text" className="dex-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" className="con" placeholder="0" />
                            <input type="text" className="con-mod" placeholder="0" />
                        </form>

                        <form>
                            <input type="text" className="int" placeholder="0" />
                            <input type="text" className="int-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" className="wis" placeholder="0" />
                            <input type="text" className="wis-mod" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" className="cha" placeholder="0" />
                            <input type="text" className="cha-mod" placeholder="0" />
                        </form>

                        <form>
                            <input type="text" className="passive-perception" placeholder="0" />
                        </form>

                    </sidebar>

                    <div className="top-middle">
                        <img className="ac-img" src={ac} />
                        <form>
                            <input type="text" className="ac" placeholder="0" />
                        </form>
                        <img className="init-img" src={initiativemod} />
                        <form>
                            <input type="text" className="init" placeholder="0" />
                        </form>
                        <img className="spd-img" src={speed} />
                        <form>
                            <input type="text" className="spd" placeholder="0" />
                        </form>
                        <img className="inspiration-img" src={inspoff} />
                        <div>
                            <button className="inspiration" onClick={
                                () => {
                                        var x = document.getElementById("insp-off");
                                        if (x.style.display === "none") {
                                          x.style.display = "block";
                                        } else {
                                          x.style.display = "none";
                                        }
                                }
                            } />
                        </div>
                        <div id="insp-off">
                            <img className="inspiration-on" src={inspon} />
                        </div>
                    </div>

        //Need to be able to click on the bullet of a specific skill to change that bullet to be filled in
                    <div className="skills">
                        <ul>
                            <li><input className="skill-num" type="text" placeholder="0"/> Acrobatics (Dex)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Animal Handling (Wis)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Arcana (Int)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Athletics (Str)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Deception (Cha)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> History (Int)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Insight (Wis)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Intimidation (Cha)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Investigation (Int)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Medicine (Wis)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Nature (Int)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Perception (Wis)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Performance (Cha)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Persuasion (Cha)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Religion (Int)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Sleight of Hand (Dex)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Stealth (Dex)</li>
                            <li><input className="skill-num" type="text" placeholder="0"/> Survival (Wis)</li>
                        </ul>
                    </div>

                    <div className="center-center">
                        <div className="hp-container">
                            <input type="text" className="curr-hp" placeholder="0" />/<span><input type="text" className="max-hp" placeholder="0" /></span>
                            <br /><input type="text" className="temp-hp" placeholder="- -" />
                        </div>
                        <div className="center-other">

                            <input type="text" className="conditions" placeholder="conditions..." />
                            <input type="text" className="defenses" placeholder="defenses..." />

                        </div>
                    </div>

        //for these, we still need a minus button to delete an action or a spell, etc.
                    <div className="bottom-center">

                        <div className="tab">
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Actions")
                                }
                            }
                            >Actions</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Spells")
                                }
                            }
                            >Spells</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Features")
                                }
                            }>Features</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Traits")
                                }
                            }>Traits</button>
                        </div>

                        <div id="Actions" className="tabcontent">
                            <h3>Actions <span><button className="add-actions" onClick={
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

                        <div id="Spells" className="tabcontent">
                            <h3>Spells <span><button className="add-spells" onClick={
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

                        <div id="Features" className="tabcontent">
                            <h3>Features <span>
                                <button className="add-f" onClick={
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

                        <div id="Traits" className="tabcontent">
                            <h3>Traits <span>
                                <button className="add-traits" onClick={
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
        
                    <div className="inventory-container">
                      <div className="currency-img">
                            <img className="platinum-img" src={platinum} />
                            <img className="gold-img" src={gold} />
                            <img className="electrum-img" src={electrum} />
                            <img className="silver-img" src={silver} />
                            <img className="copper-img" src={copper} />
                        </div>
                        <div className="currency-name">
                            <p>P</p>
                            <p>G</p>
                            <p>E</p>
                            <p>S</p>
                            <p>C</p>
                        </div>
                        <div className="currency">
                            <input type="text" className="platinum" placeholder="0" />
                            <input type="text" className="gold" placeholder="0" />
                            <input type="text" className="electrum" placeholder="0" />
                            <input type="text" className="silver" placeholder="0" />
                            <input type="text" className="copper" placeholder="0" />
                        </div>
        //still need a button to delete inventory item, and need to figure out how to let input overflow onto next line instead of overflowing
        //to a horozontal scroll.
                        <p>Inventory<span>
                            <button className="add-inventory" onClick={
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
                    <div className="feature-container">
                        <p>Features/Traits <span>
                            <button className="add-features" onClick={
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
                            <button className="add-bg" onClick={
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
                            <button className="add-extra" onClick={
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

                    <div className="char-notes">
        //The character notes will act similarly to the notes on the right (gameview), with notes being added by the player to be
        //displayed above the input.  All character notes will be saved, and they can scroll up to view the previous notes.
                        <p>Character Notes</p>
                        <input type="text" className="notes" placeholder="Notes..." />

                    </div>
                </div>
            </main>
        </>
    )
}

export default PlayerView;

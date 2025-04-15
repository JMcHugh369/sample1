import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
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
import bagtop from "../asset/charsheet/bag-top.png";
import profbonus from "../asset/charsheet/profbonus.png";

const PlayerView = () => {

    function openTab(evt, tabName) {
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
        evt.currentTarget.className += " active";
    }

    return (
        <>
            <Nav />
            <GameView />

            <main>
                <div class="playerside">
                    <header class="sheet-header">
                        <img class="sheet-pc-image" src={adventurer} 
                        />
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



                    <sidebar class="abilities">
                        <div class="abil-img">
                            <img class="str-img" src={str} />
                            <img class="dex-img" src={dex} />
                            <img class="con-img" src={con} />
                            <img class="int-img" src={int} />
                            <img class="wis-img" src={wis} />
                            <img class="cha-img" src={cha} />
                            <img class="percep-img" src={perception} />
                        </div>

                        <form class="form-str">

                            <input type="text" class="str-mod" placeholder="0" />
                            <input type="text" class="str" placeholder="0" />
                        </form>

                        <form>

                            <input type="text" class="dex-mod" placeholder="0" />
                            <input type="text" class="dex" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="con-mod" placeholder="0" />
                            <input type="text" class="con" placeholder="0" />
                        </form>

                        <form>
                            <input type="text" class="int-mod" placeholder="0" />
                            <input type="text" class="int" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="wis-mod" placeholder="0" />
                            <input type="text" class="wis" placeholder="0" />
                        </form>
                        <form>

                            <input type="text" class="cha-mod" placeholder="0" />
                            <input type="text" class="cha" placeholder="0" />
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
                        <img class="prof-bonus-img" src={profbonus} />
                        <form>
                            <input type="text" class="prof-bonus" placeholder="0" />
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
                            <img class="inspiration-on" src={inspon} />
                        </div>
                    </div>

                    <div class="skills">
                        <ul>
                            <li><input class="skill-num" type="text" placeholder="0" /> Acrobatics (Dex)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Animal Handling (Wis)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Arcana (Int)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Athletics (Str)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Deception (Cha)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> History (Int)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Insight (Wis)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Intimidation (Cha)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Investigation (Int)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Medicine (Wis)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Nature (Int)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Perception (Wis)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Performance (Cha)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Persuasion (Cha)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Religion (Int)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Sleight of Hand (Dex)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Stealth (Dex)</li>
                            <li><input class="skill-num" type="text" placeholder="0" /> Survival (Wis)</li>
                        </ul>

                    </div>

                    <div class="center-center">
                        <div class="hp-container">
                            <p>Hit Points</p>
                            <input type="text" class="curr-hp" placeholder="0" />/<span><input type="text" class="max-hp" placeholder="0" /></span>
                            <br /><input type="text" class="temp-hp" placeholder="- -" /><span class="temp">Temp HP</span>
                        </div>
                        <div class="center-other">

                            <input type="text" class="conditions" placeholder="conditions..." />
                            <input type="text" class="defenses" placeholder="defenses..." />

                        </div>
                    </div>

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
                                    openTab(event, "Proficiencies")
                                }
                            }>Proficiencies</button>
                            <button class="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Other")
                                }
                            }>Other</button>
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
  
                                    var actionBtn = document.createElement("extra-btn");

                                    actionBtn.textContent = "+";
                                    actionBtn.classList.add("extra-button-class");
                                    actionBtn.setAttribute('type', 'button');

                                    actionBtn.addEventListener('click', function () {

                                        var actionDesc = document.createElement("input");

                                        actionDesc.setAttribute('type', 'text');

                                        actionDesc.classList.add("action-desc");

                                        actionDesc.placeholder = "Description..."

                                        var parent = document.getElementById("action-items");
                                        parent.appendChild(actionDesc);

                                        parent.insertBefore(actionDesc, actionBtn);
                                    });

                                    var parent = document.getElementById("action-items");
                                    parent.appendChild(actionBtn);
                                   
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

                                    var spellBtn = document.createElement("spell-extra-btn");

                                    spellBtn.textContent = "+";
                                    spellBtn.classList.add("extra-button-class");
                                    spellBtn.setAttribute('type', 'button');

                                    spellBtn.addEventListener('click', function () {

                                        var spellDesc = document.createElement("input");

                                        spellDesc.setAttribute('type', 'text');

                                        spellDesc.classList.add("spell-desc");

                                        spellDesc.placeholder = "Description..."

                                        var parent = document.getElementById("spell-items");
                                        parent.appendChild(spellDesc);

                                        parent.insertBefore(spellDesc, spellBtn);
                                    });

                                    var parent = document.getElementById("spell-items");
                                    parent.appendChild(spellBtn);
                                }
                            }
                            >+</button>
                            </span></h3>

                            <div id="spell-items">

                            </div>

                        </div>

                        <div id="Proficiencies" class="tabcontent">
                            <h3>Proficiencies <span>
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

                                        var fBtn = document.createElement("f-extra-btn");

                                    fBtn.textContent = "+";
                                    fBtn.classList.add("extra-button-class");
                                    fBtn.setAttribute('type', 'button');

                                    fBtn.addEventListener('click', function () {

                                        var fDesc = document.createElement("input");

                                        fDesc.setAttribute('type', 'text');

                                        fDesc.classList.add("f-desc");

                                        fDesc.placeholder = "Description..."

                                        var parent = document.getElementById("f-items");
                                        parent.appendChild(fDesc);

                                        parent.insertBefore(fDesc, fBtn);
                                    });

                                    var parent = document.getElementById("f-items");
                                    parent.appendChild(fBtn);
                                    }
                                }>+</button>
                            </span></h3>

                            <div id="f-items">

                            </div>

                        </div>

                        <div id="Other" class="tabcontent">
                            <h3>Other <span>
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

                                        var tBtn = document.createElement("t-extra-btn");

                                    tBtn.textContent = "+";
                                    tBtn.classList.add("extra-button-class");
                                    tBtn.setAttribute('type', 'button');

                                    tBtn.addEventListener('click', function () {

                                        var tDesc = document.createElement("input");

                                        tDesc.setAttribute('type', 'text');

                                        tDesc.classList.add("t-desc");

                                        tDesc.placeholder = "Description..."

                                        var parent = document.getElementById("t-items");
                                        parent.appendChild(tDesc);

                                        parent.insertBefore(tDesc, tBtn);
                                    });

                                    var parent = document.getElementById("t-items");
                                    parent.appendChild(tBtn);
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

                                    var invBtn = document.createElement("inv-extra-btn");

                                    invBtn.textContent = "+";
                                    invBtn.classList.add("extra-button-class");
                                    invBtn.setAttribute('type', 'button');

                                    invBtn.addEventListener('click', function () {

                                        var invDesc = document.createElement("input");

                                        invDesc.setAttribute('type', 'text');

                                        invDesc.classList.add("inv-desc");

                                        invDesc.placeholder = "Description..."

                                        var parent = document.getElementById("inventory-items");
                                        parent.appendChild(invDesc);

                                        parent.insertBefore(invDesc, invBtn);
                                    });

                                    var parent = document.getElementById("inventory-items");
                                    parent.appendChild(invBtn);
                                }
                            }>+</button>
                        </span></p>
                        <div id="inventory-items">

                        </div>


                    </div>

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
                                    
                                    var featureBtn = document.createElement("feature-extra-btn");

                                    featureBtn.textContent = "+";
                                    featureBtn.classList.add("extra-button-class");
                                    featureBtn.setAttribute('type', 'button');

                                    featureBtn.addEventListener('click', function () {

                                        var featureDesc = document.createElement("input");

                                        featureDesc.setAttribute('type', 'text');

                                        featureDesc.classList.add("feature-desc");

                                        featureDesc.placeholder = "Description..."

                                        var parent = document.getElementById("feature-items");
                                        parent.appendChild(featureDesc);

                                        parent.insertBefore(featureDesc, featureBtn);
                                    });

                                    var parent = document.getElementById("feature-items");
                                    parent.appendChild(featureBtn);
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

                                    var bgBtn = document.createElement("bg-extra-btn");

                                    bgBtn.textContent = "+";
                                    bgBtn.classList.add("extra-button-class");
                                    bgBtn.setAttribute('type', 'button');

                                    bgBtn.addEventListener('click', function () {

                                        var bgDesc = document.createElement("input");

                                        bgDesc.setAttribute('type', 'text');

                                        bgDesc.classList.add("bg-desc");

                                        bgDesc.placeholder = "Description..."

                                        var parent = document.getElementById("bg-items");
                                        parent.appendChild(bgDesc);

                                        parent.insertBefore(bgDesc, bgBtn);
                                    });

                                    var parent = document.getElementById("bg-items");
                                    parent.appendChild(bgBtn);
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

                                    var exBtn = document.createElement("ex-extra-btn");

                                    exBtn.textContent = "+";
                                    exBtn.classList.add("extra-button-class");
                                    exBtn.setAttribute('type', 'button');

                                    exBtn.addEventListener('click', function () {

                                        var exDesc = document.createElement("input");

                                        exDesc.setAttribute('type', 'text');

                                        exDesc.classList.add("extra-desc");

                                        exDesc.placeholder = "Description..."

                                        var parent = document.getElementById("extra-items");
                                        parent.appendChild(exDesc);

                                        parent.insertBefore(exDesc, exBtn);
                                    });

                                    var parent = document.getElementById("extra-items");
                                    parent.appendChild(exBtn);
                                }
                            }>+</button>
                        </span></p>

                        <div id="extra-items">

                        </div>

                    </div>

                </div>
            </main>
        </>
    )
}

export default PlayerView;

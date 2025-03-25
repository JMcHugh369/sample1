import "./index.scss";
import Nav from "../Nav";

const PlayerView = () => {
    return (
        <>
            <Nav />

            <main>
                <div class="playerside">
                    <header class="sheet-header">
                        <img class="sheet-pc-image" src="" />
                        <form class="char-name">Name</form>
                        <form class="char-lvl">Level</form>
                        <form class="char-species">Species</form>
                        <form class="char-class">Class</form>
                        <form class="char-bg">Background</form>
                    </header>

                    <sidebar class="abilities">
                        <img class="str-img" src="" />
                        <form class="str">0</form>
                        <img class="dex-img" src="" />
                        <form class="dex">0</form>
                        <img class="con-img" src="" />
                        <form class="con">0</form>
                        <img class="int-img" src="" />
                        <form class="int">0</form>
                        <img class="wis-img" src="" />
                        <form class="wis">0</form>
                        <img class="cha-img" src="" />
                        <form class="cha">0</form>
                    </sidebar>

                    <div class="top-middle">
                        <img class="ac-img" src="" />
                        <form class="ac">0</form>
                        <img class="init-img" src="" />
                        <form class="init">0</form>
                        <img class="spd-img" src="" />
                        <form class="spd">0</form>
                        <img class="inspiration-img" src="" />
                        <form class="inspiration">0</form>
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

                        </div>
                    </div>



                    <div class="bottom-center">

                    </div>

                    <div class="inventory-container">

                    </div>

                    <div class="feature-container">

                    </div>

                    <div class="char-notes">

                    </div>

                </div>
            </main>
        </>
    )
}

export default PlayerView;
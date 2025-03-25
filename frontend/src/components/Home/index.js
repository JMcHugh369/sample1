import "./index.scss";
import Nav from "../Nav";
import { useState, useEffect } from "react";

const Home = () => {

    const [games, setGames] = useState([]);

    function addGame() {
        const game = {
            name: "New Campaign",
            dm: "Wizard"
        };

        setGames([...games, game]);
    }

    return (
        <>
            <Nav />
            <a onClick={
                () => {
                    addGame();
                }
            }>+</a>
            
            {
                games.map((game, index) => (

                    <div key={index}>
                        <input type="text" placeholder={game.name}></input>
                    </div>
                ))
            }
        </>
    )
}

export default Home;
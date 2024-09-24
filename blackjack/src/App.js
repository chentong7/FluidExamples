import "./App.css";
import React, { useEffect, useState } from "react";
import Game from "./component/Game";
import { getRandomCard, calculateTotal } from "./component/utils";
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { playersMap: SharedMap },
};

function App() {
  const [playersMap, setPlayersMap] = useState(null);

  useEffect(() => {
    const start = async () => {
      let container;
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        ({ container } = await client.getContainer(id, containerSchema));
      } else {
        ({ container } = await client.createContainer(containerSchema));

        const playerCards = [getRandomCard(), getRandomCard()];
        container.initialObjects.playersMap.set("numPlayers", 1);
        container.initialObjects.playersMap.set("playerNames", ["Player 1"]);
        container.initialObjects.playersMap.set("playerCards", playerCards);
        container.initialObjects.playersMap.set(
          "totals",
          calculateTotal(playerCards)
        );

        const id = await container.attach();
        window.location.hash = id;
      }
      setPlayersMap(container.initialObjects.playersMap);
    };

    start().catch((error) => console.error(error));
  }, []);

  if (!playersMap) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Game playersMap={playersMap} />
    </div>
  );
}

export default App;

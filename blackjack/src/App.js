import "./App.css";
import React, { useEffect, useState } from "react";
import Game from "./component/Game";
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { playersMap: SharedMap },
};

function App() {
  const [playersMap, setPlayersMap] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const start = async () => {
      let container;
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        ({ container } = await client.getContainer(id, containerSchema));
      } else {
        ({ container } = await client.createContainer(containerSchema));
        const id = await container.attach();
        window.location.hash = id;
      }
      const map = container.initialObjects.playersMap;
      setPlayersMap(map);

      // Load existing data from the playersMap if available
      if (
        map.has("playerNames") &&
        map.has("playerCards") &&
        map.has("totals")
      ) {
        setInitialDataLoaded(true);
      }
    };

    start().catch((error) => console.error(error));
  }, []);

  if (!playersMap) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Game playersMap={playersMap} initialDataLoaded={initialDataLoaded} />
    </div>
  );
}

export default App;

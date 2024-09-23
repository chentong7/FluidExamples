import "./App.css";
import React, { useEffect, useState } from "react";
import Game from "./component/Game";
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { playersMap: SharedMap }
};

function App() {
  const [playersMap, setPlayersMap] = useState(null);

  useEffect(() => {
    const start = async () => {
      let container;
      if (location.hash) {
        const id = location.hash.substring(1);
        ({ container } = await client.getContainer(id, containerSchema));
      } else {
        ({ container } = await client.createContainer(containerSchema));
        const id = await container.attach();
        location.hash = id;
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
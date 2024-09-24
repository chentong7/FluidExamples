import React, { useEffect, useRef } from "react";
import { calculateTotal } from "./utils";

const Player = ({
  playerName,
  setPlayerName,
  playerCards,
  total,
  setTotal,
  handleMoreClick,
}) => {
  const promptShown = useRef(false);

  useEffect(() => {
    if (!promptShown.current) {
      promptShown.current = true;
      const name = prompt("Please enter your name:");
      setPlayerName(name || playerName);
    }
  }, [playerName, setPlayerName]);

  useEffect(() => {
    setTotal(calculateTotal(playerCards));
  }, [playerCards, setTotal]);

  return (
    <div>
      <div className="player-title">
        <h2>{playerName}</h2>
      </div>
      <div className="player-card">
        {playerCards.map((src, index) => (
          <img
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            src={src}
            alt={`player card ${index + 1}`}
            height={300}
            width={200}
          />
        ))}
      </div>
      <div className="player-total">
        <h3>Total: {total}</h3>
      </div>
      <div className="card-footer">
        <button
          type="button"
          name={`more-${playerName}`}
          onClick={handleMoreClick}
        >
          Get more card
        </button>
      </div>
    </div>
  );
};

export default Player;

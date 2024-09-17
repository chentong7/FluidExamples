import React from "react";
import card from "./asset/2S.svg";
import blinded from "./asset/1B.svg";

const Game = (props) => {
  const { playerName } = props;

  const handleMoreClick = () => {
    alert("Render another card image. How to randomly pick a card?");
  };

  const handleShowClick = () => {
    alert("Render Blinded card image");
  };

  return (
    <div className="game">
      <div className="dealer-title">
        <h2>Dealer</h2>
      </div>
      <div className="dealer-card">
        <img src={card} alt="card 1" height={300} width={200} />
        <img src={blinded} alt="card 2" height={300} width={200} />
      </div>

      <div className="player-title">
        <h2>{playerName}</h2>
      </div>
      <div className="player-card">
        <img src={card} alt="card 1" height={300} width={200} />
        <img src={card} alt="card 2" height={300} width={200} />
      </div>
      <div className="card-footer">
        <button
          type="button"
          onClick={handleMoreClick}
          onKeyUp={handleMoreClick}
        >
          Get more card button??
        </button>
        <button
          type="button"
          onClick={handleShowClick}
          onKeyUp={handleShowClick}
        >
          Show dealer's card
        </button>
      </div>
    </div>
  );
};

export default Game;

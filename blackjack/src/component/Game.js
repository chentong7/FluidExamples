import React, { useState } from "react";
import Dealer from "./Dealer";
import Player from "./Player";
import { getRandomCard, calculateTotal } from "./utils";
import blinded from "./1B.svg";

const Game = () => {
  const [playerName, setPlayerName] = useState("");
  const playerCard1 = getRandomCard();
  const playerCard2 = getRandomCard();
  const dealerCard1 = getRandomCard();
  const [playerCards, setPlayerCards] = useState([playerCard1, playerCard2]);
  const [dealerCards, setDealerCards] = useState([dealerCard1, blinded]);
  const [total, setTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);

  const handleMoreClick = () => {
    const newCard = getRandomCard();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const newTotal = calculateTotal(newPlayerCards);
    setTotal(newTotal);

    if (newTotal > 21) {
      setTimeout(() => {
        alert("You lose!");
        const moreButton = document.querySelector(".card-footer button:more");
        const showButton = document.querySelector(".card-footer button:show");
        if (moreButton) moreButton.disabled = true;
        if (showButton) showButton.disabled = true;
      }, 500);
    } else if (newTotal === 21) {
      setTimeout(() => {
        alert("You Win!");
      }, 500);
    }
  };

  const handleShowClick = () => {
    const newDealerCard = getRandomCard();
    const newDealerCards = [dealerCards[0], newDealerCard];
    setDealerCards(newDealerCards);

    const dealerTotal = calculateTotal(newDealerCards);
    setDealerTotal(dealerTotal);

    setTimeout(() => {
      document.querySelector(
        ".card-footer button[name='more']"
      ).disabled = true;
      document.querySelector(
        ".card-footer button[name='show']"
      ).disabled = true;

      if (dealerTotal > 21 || total > dealerTotal) {
        alert("You Win!");
      } else if (total < dealerTotal) {
        alert("You lose!");
      } else {
        alert("It's a tie!");
      }
    }, 500);
  };

  return (
    <div className="game">
      <Dealer
        dealerCards={dealerCards}
        setDealerCards={setDealerCards}
        dealerTotal={dealerTotal}
        setDealerTotal={setDealerTotal}
      />
      <Player
        playerName={playerName}
        setPlayerName={setPlayerName}
        playerCards={playerCards}
        setPlayerCards={setPlayerCards}
        total={total}
        setTotal={setTotal}
      />
      <div className="card-footer">
        <button type="button" name="more" onClick={handleMoreClick}>
          Get more card
        </button>
        <button type="button" name="show" onClick={handleShowClick}>
          Show dealer's card
        </button>
      </div>
    </div>
  );
};

export default Game;

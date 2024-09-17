import React, { useState } from "react";
import blinded from "./1B.svg";

// Dynamically import all card images from the ./asset directory, excluding 1B.svg
const cardsContext = require.context("./asset", false, /\.svg$/);
const cards = cardsContext
  .keys()
  .map(cardsContext)
  .filter((src) => !src.includes("1B.svg"));

const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

const getCardValue = (cardSrc) => {
  const cardName = cardSrc.split("/").pop().split(".")[0]; // Extract the card name from the src
  const value = cardName[0];
  if (value === "A") return 11;
  if (["K", "Q", "J"].includes(value)) return 10;
  return Number.parseInt(value, 10);
};

const calculateTotal = (cardImages) => {
  let total = 0;
  let aceCount = 0;
  cardImages.forEach((img) => {
    const value = getCardValue(img.src);
    total += value;
    if (value === 11) aceCount++;
  });
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
};

const Game = (props) => {
  const { playerName } = props;
  const playerCard1 = getRandomCard();
  const playerCard2 = getRandomCard();
  const dealerCard1 = getRandomCard();
  const [playerCards, setPlayerCards] = useState([playerCard1, playerCard2]);
  const [dealerCards, setDealerCards] = useState([dealerCard1, blinded]);
  const [total, setTotal] = useState(
    calculateTotal([{ src: playerCard1 }, { src: playerCard2 }])
  );

  const handleMoreClick = () => {
    const newCard = getRandomCard();
    setPlayerCards([...playerCards, newCard]);

    const playerCardImages = [...playerCards, newCard].map((src) => ({ src }));
    const newTotal = calculateTotal(playerCardImages);
    setTotal(newTotal);

    if (newTotal === 21) {
      alert("You Win!");
    } else if (newTotal > 21) {
      setTimeout(() => {
        alert("You lose!");
        document.querySelector(
          ".card-footer button:nth-child(1)"
        ).disabled = true;
        document.querySelector(
          ".card-footer button:nth-child(2)"
        ).disabled = true;
      }, 5);
    }
  };

  const handleShowClick = () => {
    setDealerCards([dealerCards[0], getRandomCard()]);
  };

  return (
    <div className="game">
      <div className="dealer-title">
        <h2>Dealer</h2>
      </div>
      <div className="dealer-card">
        {dealerCards.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`dealer card ${index + 1}`}
            height={300}
            width={200}
          />
        ))}
      </div>

      <div className="player-title">
        <h2>{playerName}</h2>
      </div>
      <div className="player-card">
        {playerCards.map((src, index) => (
          <img
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

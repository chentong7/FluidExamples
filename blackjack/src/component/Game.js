import React from "react";
import card from "./asset/2S.svg";
import blinded from "./asset/1B.svg";

const cardsContext = require.context("./asset", false, /\.svg$/);
const cards = cardsContext.keys().map(cardsContext);

const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

const getCardValue = (cardSrc) => {
  const cardName = cardSrc.split("/").pop().split(".")[0]; // Extract the card name from the src
  const value = cardName[0];
  if (value === "A") return 11;
  if (["K", "Q", "J"].includes(value)) return 10;
  return parseInt(value, 10);
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

  const handleMoreClick = () => {
    const playerCardContainer = document.querySelector(".player-card");
    const newCardImage = document.createElement("img");
    newCardImage.src = getRandomCard();
    newCardImage.alt = "New Card";
    newCardImage.height = 300;
    newCardImage.width = 200;
    playerCardContainer.appendChild(newCardImage);

    const playerCardImages = playerCardContainer.querySelectorAll("img");
    const total = calculateTotal(playerCardImages);
    if (total > 21) {
      alert("You lose!");
      document.querySelector(
        ".card-footer button:nth-child(1)"
      ).disabled = true;
      document.querySelector(
        ".card-footer button:nth-child(2)"
      ).disabled = true;
    }
  };

  const handleShowClick = () => {
    const dealerCardImages = document.querySelectorAll(".dealer-card img");
    if (dealerCardImages.length > 1) {
      dealerCardImages[1].src = getRandomCard(); // Change the src attribute of the second image to card6
    }
  };

  return (
    <div className="game">
      <div className="dealer-title">
        <h2>Dealer</h2>
      </div>
      <div className="dealer-card">
        <img src={getRandomCard()} alt="card 1" height={300} width={200} />
        <img src={blinded} alt="card 2" height={300} width={200} />
      </div>

      <div className="player-title">
        <h2>{playerName}</h2>
      </div>
      <div className="player-card">
        <img src={getRandomCard()} alt="card 1" height={300} width={200} />
        <img src={getRandomCard()} alt="card 2" height={300} width={200} />
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

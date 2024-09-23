import React, { useState, useEffect } from "react";
import Dealer from "./Dealer";
import Player from "./Player";
import { getRandomCard, calculateTotal } from "./utils";
import blinded from "./1B.svg";

const Game = ({ playersMap }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(["Player 1"]);
  const [playerCards, setPlayerCards] = useState([[]]);
  const [totals, setTotals] = useState([0]);
  const dealerCard1 = getRandomCard();
  const [dealerCards, setDealerCards] = useState([dealerCard1, blinded]);
  const [dealerTotal, setDealerTotal] = useState(0);

  useEffect(() => {
    // Initialize player cards with 2 cards each when the number of players changes
    setPlayerCards(
      Array.from({ length: numPlayers }, () => [
        getRandomCard(),
        getRandomCard(),
      ])
    );
    setTotals(Array.from({ length: numPlayers }, () => 0));
  }, [numPlayers]);

  useEffect(() => {
    // Update playersMap whenever playerNames or playerCards change
    playersMap.set("playerNames", playerNames);
    playersMap.set("playerCards", playerCards);
  }, [playerNames, playerCards, playersMap]);

  const handleNumPlayersChange = (e) => {
    const num = Number.parseInt(e.target.value, 10);
    setNumPlayers(num);
    setPlayerNames(Array.from({ length: num }, (_, i) => `Player ${i + 1}`));
    setPlayerCards(
      Array.from({ length: num }, () => [getRandomCard(), getRandomCard()])
    );
    setTotals(Array.from({ length: num }, () => 0));
  };

  const handleMoreClick = (playerIndex) => {
    const newCard = getRandomCard();
    const newPlayerCards = [...playerCards[playerIndex], newCard];
    const newPlayerCardsArray = [...playerCards];
    newPlayerCardsArray[playerIndex] = newPlayerCards;
    setPlayerCards(newPlayerCardsArray);

    const newTotal = calculateTotal(newPlayerCards);
    const newTotals = [...totals];
    newTotals[playerIndex] = newTotal;
    setTotals(newTotals);

    if (newTotal > 21) {
      setTimeout(() => {
        alert(`${playerNames[playerIndex]} loses!`);
        document.querySelector(
          `.card-footer button[name='more-${playerIndex}']`
        ).disabled = true;
        document.querySelector(
          `.card-footer button[name='show']`
        ).disabled = true;
      }, 500);
    } else if (newTotal === 21) {
      setTimeout(() => {
        alert(`${playerNames[playerIndex]} Wins!`);
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
      document
        .querySelectorAll(".card-footer button[name^='more-']")
        .forEach((button) => (button.disabled = true));

      const winningPlayers = playerNames.filter(
        (_, i) => totals[i] <= 21 && totals[i] > dealerTotal
      );
      if (dealerTotal > 21 || winningPlayers.length > 0) {
        alert(`${winningPlayers.join(", ")} Win!`);
      } else {
        alert("Dealer Wins!");
      }
    }, 500);
  };

  return (
    <div className="game">
      <div>
        <label htmlFor="numPlayers">Number of Players: </label>
        <input
          type="number"
          id="numPlayers"
          value={numPlayers}
          onChange={handleNumPlayersChange}
          min="1"
        />
      </div>
      <Dealer
        dealerCards={dealerCards}
        setDealerCards={setDealerCards}
        dealerTotal={dealerTotal}
        setDealerTotal={setDealerTotal}
      />
      {playerNames.map((playerName, index) => (
        <Player
          key={index}
          playerName={playerName}
          setPlayerName={(name) => {
            const newPlayerNames = [...playerNames];
            newPlayerNames[index] = name;
            setPlayerNames(newPlayerNames);
          }}
          playerCards={playerCards[index]}
          setPlayerCards={(cards) => {
            const newPlayerCards = [...playerCards];
            newPlayerCards[index] = cards;
            setPlayerCards(newPlayerCards);
          }}
          total={totals[index]}
          setTotal={(total) => {
            const newTotals = [...totals];
            newTotals[index] = total;
            setTotals(newTotals);
          }}
          handleMoreClick={() => handleMoreClick(index)}
        />
      ))}
      <div className="card-footer">
        <button type="button" name="show" onClick={handleShowClick}>
          Show dealer's card
        </button>
      </div>
    </div>
  );
};

export default Game;

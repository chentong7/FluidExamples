import React, { useState, useEffect } from "react";
import Dealer from "./Dealer";
import Player from "./Player";
import { getRandomCard, calculateTotal } from "./utils";
import blinded from "./1B.svg";

const Game = ({ playersMap }) => {
  const [numPlayers, setNumPlayers] = useState(playersMap.get("numPlayers"));
  const [playerNames, setPlayerNames] = useState(playersMap.get("playerNames"));
  const [playerCards, setPlayerCards] = useState(playersMap.get("playerCards"));
  const [totals, setTotals] = useState(playersMap.get("totals"));

  const dealerCard1 = getRandomCard();
  const [dealerCards, setDealerCards] = useState([dealerCard1, blinded]);
  const [dealerTotal, setDealerTotal] = useState(0);

  useEffect(() => {
    // Update playersMap whenever playerNames or playerCards change
    playersMap.set("numPlayers", numPlayers);
    playersMap.set("playerNames", playerNames);
    playersMap.set("playerCards", playerCards);
    playersMap.set("totals", totals);
  }, [playerNames, playerCards, totals, numPlayers, playersMap]);

  const handleNumPlayersChange = (e) => {
    const num = Number.parseInt(e.target.value, 10);
    const currentNumPlayers = playerNames.length;
    let newPlayerNames;
    let newPlayerCards;
    let newTotals;

    if (num > currentNumPlayers) {
      // Adding new players
      newPlayerNames = [...playerNames, `Player ${currentNumPlayers + 1}`];
      const newCards = [getRandomCard(), getRandomCard()];
      newPlayerCards = [...playerCards, newCards];
      newTotals = [...totals, calculateTotal(newCards)];
    } else if (num < currentNumPlayers) {
      // Removing players
      newPlayerNames = playerNames.slice(0, num);
      newPlayerCards = playerCards.slice(0, num);
      newTotals = totals.slice(0, num);
    }
    setPlayerNames(newPlayerNames);
    setPlayerCards(newPlayerCards);
    setTotals(newTotals);
    setNumPlayers(num);
    if (playersMap) {
      playersMap.set("playerNames", newPlayerNames);
      playersMap.set("playerCards", newPlayerCards);
      playersMap.set("totals", newTotals);
      playersMap.set("numPlayers", num);
    }
  };

  const handleMoreClick = (playerIndex) => {
    const newCard = getRandomCard();

    // Create a new array for playerCards to avoid direct mutation
    const newPlayerCardsArray = [...playerCards];
    const currentPlayerCards = playerCards[playerIndex];
    const currentPlayerNewCards = [...currentPlayerCards, newCard];
    newPlayerCardsArray[playerIndex] = currentPlayerNewCards;
    setPlayerCards(newPlayerCardsArray);

    const newTotal = calculateTotal(newPlayerCardsArray[playerIndex]);
    const newTotals = [...totals];
    newTotals[playerIndex] = newTotal;
    setTotals(newTotals);

    // Update playersMap with new player cards and totals
    playersMap.set("playerCards", newPlayerCardsArray);
    playersMap.set("totals", newTotals);

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
      const buttons = document.querySelectorAll(
        ".card-footer button[name^='more-']"
      );
      for (const button of buttons) {
        button.disabled = true;
      }

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
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          playerName={playerName}
          setPlayerName={(name) => {
            const newPlayerNames = [...playerNames];
            newPlayerNames[index] = name;
          }}
          playerCards={playerCards[index]}
          setPlayerCards={(cards) => {
            const newPlayerCards = [...playerCards];
            newPlayerCards[index] = cards;
          }}
          total={totals[index]}
          setTotal={(total) => {
            const newTotals = [...totals];
            newTotals[index] = total;
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

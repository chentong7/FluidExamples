import React, { useState, useEffect } from "react";
import Dealer from "./Dealer";
import Player from "./Player";
import { getRandomCard, calculateTotal } from "./utils";
import blinded from "./1B.svg";

const Game = ({ playersMap, initialDataLoaded }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(["Player 1"]);
  const [playerCards, setPlayerCards] = useState([[]]);
  const [totals, setTotals] = useState([0]);
  const dealerCard1 = getRandomCard();
  const [dealerCards, setDealerCards] = useState([dealerCard1, blinded]);
  const [dealerTotal, setDealerTotal] = useState(0);

  useEffect(() => {
    if (initialDataLoaded) {
      // Load existing data from playersMap
      setPlayerNames(playersMap.get("playerNames"));
      setPlayerCards(playersMap.get("playerCards"));
      setTotals(playersMap.get("totals"));
      setNumPlayers(playersMap.get("playerNames").length);
    } else {
      // Initialize player cards with 2 cards each when the number of players changes
      setPlayerCards(
        Array.from({ length: numPlayers }, () => [
          getRandomCard(),
          getRandomCard(),
        ])
      );
      setTotals(Array.from({ length: numPlayers }, () => 0));
    }
  }, [initialDataLoaded, numPlayers, playersMap]);

  useEffect(() => {
    // Update playersMap whenever playerNames or playerCards change
    playersMap.set("playerNames", playerNames);
    playersMap.set("playerCards", playerCards);
    playersMap.set("totals", totals);
  }, [playerNames, playerCards, totals, playersMap]);

  const handleNumPlayersChange = (e) => {
    const num = Number.parseInt(e.target.value, 10);
    setNumPlayers(num);
    setPlayerNames(Array.from({ length: num }, (_, i) => `Player ${i + 1}`));
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
          key={index}
          playerName={playerName}
          setPlayerName={(name) => {
            const newPlayerNames = [...playerNames];
            newPlayerNames[index] = name;
            setPlayerNames(newPlayerNames);
            // Update playersMap with new player names
            playersMap.set("playerNames", newPlayerNames);
          }}
          playerCards={playerCards[index]}
          setPlayerCards={(cards) => {
            const newPlayerCards = [...playerCards];
            newPlayerCards[index] = cards;
            setPlayerCards(newPlayerCards);
            // Update playersMap with new player cards
            playersMap.set("playerCards", newPlayerCards);
          }}
          total={totals[index]}
          setTotal={(total) => {
            const newTotals = [...totals];
            newTotals[index] = total;
            setTotals(newTotals);
            // Update playersMap with new totals
            playersMap.set("totals", newTotals);
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

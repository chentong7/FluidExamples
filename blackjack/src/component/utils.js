const cardsContext = require.context("./asset", false, /\.svg$/);
const cards = cardsContext
  .keys()
  .map(cardsContext)
  .filter((src) => !src.includes("1B.svg"));

export const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

export const getCardValue = (cardSrc) => {
  const cardName = cardSrc.split("/").pop().split(".")[0]; // Extract the card name from the src
  const value = cardName[0];
  if (value === "A") return 11;
  if (["K", "Q", "J"].includes(value)) return 10;
  return Number.parseInt(value, 10);
};

export const calculateTotal = (cardImages) => {
  let total = 0;
  let aceCount = 0;
  // biome-ignore lint/complexity/noForEach: <explanation>
  cardImages.forEach((img) => {
    const value = getCardValue(img);
    total += value;
    if (value === 11) aceCount++;
  });
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
};

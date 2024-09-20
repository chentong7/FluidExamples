import React, { useEffect } from "react";
import { calculateTotal } from "./utils";

const Dealer = ({ dealerCards, dealerTotal, setDealerTotal }) => {
  useEffect(() => {
    setDealerTotal(calculateTotal(dealerCards));
  }, [dealerCards, setDealerTotal]);

  return (
    <div>
      <div className="dealer-title">
        <h2>Dealer</h2>
      </div>
      <div className="dealer-card">
        {dealerCards.map((src, index) => (
          <img
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            src={src}
            alt={`dealer card ${index + 1}`}
            height={300}
            width={200}
          />
        ))}
      </div>
      <div className="dealer-total">
        <h3>Total: {dealerTotal}</h3>
      </div>
    </div>
  );
};

export default Dealer;

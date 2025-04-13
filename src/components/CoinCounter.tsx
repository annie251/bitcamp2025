import React from "react";
import coinIcon from "../art/coin.png"; // replace with your actual coin image
import "../components/CoinCounter.css";

interface CoinCounterProps { coins: number; }

const CoinCounter = ({ coins }: CoinCounterProps) => {
  return (
    <div className="coin-container">
      <h4>Coins</h4>
      <div className="coin-count">
        <span className="coin-amount">{coins}</span>
        <img src={coinIcon} alt="coin" className="coin-icon" />
      </div>
    </div>
  );
};

export { CoinCounter };

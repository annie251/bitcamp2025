import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import catPoke from "../art/cat_poke.png"; 
import fish from "../art/fish.png"; 
import "./StorePage.css";
import { CoinCounter } from "../components/CoinCounter";

const StorePage = () => {
    const [hunger, setHunger] = useState(3);
    const navigate = useNavigate();

    const [coins, setCoins] = useState(0);

    useEffect(() => {
      chrome.storage.local.get("coins", (result) => {
        setCoins(result.coins || 0);
      });
    
      // Optional: add a listener if you want it to update dynamically while open
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.coins) {
          setCoins(changes.coins.newValue);
        }
      });
    }, []);

    useEffect(() => {
        chrome.storage.local.get("hunger", (result) => {
          if (typeof result.hunger === "number") {
            setHunger(result.hunger);
          }
        });
      }, []);

    const backPage = () => {
        navigate(-1); 
      };

    const buyFish = () => {
      if (coins >= 2) {
        const newHunger = hunger + 1;   
        setHunger(newHunger);
        chrome.storage.local.set({ coins: coins - 2});
        setCoins (coins - 2);
        chrome.storage.local.set({ hunger: newHunger });
      }
    };

  return (
    <div className="popup-card">
      <div className="top-bar">
        <span className="coins">Coins <span className="coin-amount"><CoinCounter coins={coins} /></span></span>
        <button className="primary-button" onClick={backPage}>Back</button>
      </div>

      <div className="store-item" onClick={buyFish}>
        <img src={fish} alt="Fish" className="item-img" />
        <span className="item-price"><CoinCounter coins={2} /></span>
      </div>

      <img src={ catPoke } alt="Cat Poke" className="cat-bottom" />
    </div>
  );
};

export default StorePage;

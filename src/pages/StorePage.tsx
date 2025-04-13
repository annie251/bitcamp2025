import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HungerBar } from "../components/HungerBar";
import catPoke from "../art/cat_poke.png"; 
import fish from "../art/fish.png"; 
import "./StorePage.css";

const StorePage = () => {
    const [hunger, setHunger] = useState(3);
    const navigate = useNavigate();

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
    const newHunger = hunger + 1;   
    setHunger(newHunger);
    chrome.storage.local.set({ hunger: newHunger });
      };

  return (
    <div className="popup-card">
      <div className="top-bar">
        <span className="coins">Coins <span className="coin-amount">50 🟡</span></span>
        <button className="secondary-button" onClick={backPage}>Back</button>
      </div>

      <div className="store-item">
        <button className="item-button" onClick={buyFish}>
        <img src={fish} alt="Fish" className="item-img" />
        <span className="item-price">2 🟡</span>
  </button>
      </div>

      <img src={ catPoke } alt="Cat Poke" className="cat-bottom" />
    </div>
  );
};

export default StorePage;

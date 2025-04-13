import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./HomePage.css";


const HomePage = () => {
    const navigate = useNavigate();
    const [hunger, setHunger] = useState(3);
    const goInput = () => navigate('/input');
    const goStore = () => navigate('/store');

    useEffect(() => {
      chrome.storage.local.set({ currentPage: "" });
  
      chrome.storage.local.get(["hunger", "lastHungerDate"], (result) => {
        let currentHunger = result.hunger ?? 3;
  
        const today = new Date().toISOString().split("T")[0];
        // code above decreases fish below each below, testing! 
        //const today = Math.floor(Date.now() / 1000).toString(); 
        const lastDate = result.lastHungerDate;
  
        if (lastDate !== today) {
          currentHunger = Math.max(0, currentHunger - 1);
          chrome.storage.local.set({
            hunger: currentHunger,
            lastHungerDate: today,
          });
        }

        setHunger(currentHunger);
    });
  }, []);

  return (
    <div className="popup-card">
      <h1 className="title">Purromodoro</h1>

      <div className="stats-container">
        <HealthBar health={3} />
        <HungerBar hunger={hunger} />
      </div>

      <div className="cat-meow-wrapper">
        <img className="cat-sprite" src={cat} alt="cat" />
      </div>

      <div className="button-row">
        <button className="primary-button" onClick={goInput}>Study</button>
        <button className="primary-button" onClick={goStore}>Store</button>
      </div>
    </div>
  );
};

export default HomePage;
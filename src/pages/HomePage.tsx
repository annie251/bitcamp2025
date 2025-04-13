import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import sign from "../art/sign.png";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [hunger, setHunger] = useState(3);
  const [health, setHealth] = useState(3);

  const goInput = () => navigate('/input');
  const goStore = () => navigate('/store');

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" });

    chrome.storage.local.get(["hunger", "lastHungerDate", "health", "lastHealthLossHour"], (result) => {
      let currentHunger = result.hunger ?? 3;
      let currentHealth = result.health ?? 3;

      const today = new Date().toISOString().split("T")[0];
      const lastHungerDate = result.lastHungerDate;

      if (lastHungerDate !== today) {
        currentHunger = Math.max(0, currentHunger - 1);
        chrome.storage.local.set({ hunger: currentHunger, lastHungerDate: today });
      }

      if (currentHunger === 0) {
        const nowHour = new Date().getHours().toString();
        const lastHour = result.lastHealthLossHour;

        if (lastHour !== nowHour) {
          currentHealth = Math.max(0, currentHealth - 1);
          chrome.storage.local.set({ health: currentHealth, lastHealthLossHour: nowHour });
        }
      }

      setHunger(currentHunger);
      setHealth(currentHealth);
    });
  }, []);

  return (
    <div className="popup-card">
      <h1 className="title">Purromodoro</h1>

      <div className="stats-container">
        <HealthBar health={health} />
        <HungerBar hunger={hunger} />
      </div>

      <img className="cat-sprite" src={health === 0 ? sign : cat} alt="cat" />

      <div className="button-row">
        <button className="primary-button" onClick={goInput}>Study</button>
        <button className="primary-button" onClick={goStore}>Store</button>
      </div>
    </div>
  );
};

export default HomePage;

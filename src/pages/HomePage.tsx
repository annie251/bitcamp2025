import React from "react";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="popup-card">
      <h1 className="title">Purromodoro</h1>

      <div className="stats-container">
        <HealthBar health={3} />
        <HungerBar hunger={3} />
      </div>

      <div className="cat-meow-wrapper">
        <img className="cat-sprite" src={cat} alt="cat" />
      </div>

      <div className="button-row">
        <button className="primary-button">Study</button>
        <button className="primary-button">Stats</button>
      </div>
    </div>
  );
};

export default HomePage;

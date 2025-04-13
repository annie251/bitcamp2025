import React from "react";
import heart from "../art/heart.png"; 
import '../components/HealthBar.css';

interface HealthBarProps { health : number; }

// Change to Jersey 25 font later on

const HealthBar = ({ health } : HealthBarProps) => {
    const hearts = [];

    for (let i = 0; i < health; i++) {
        hearts.push(
        <span key = {i}>
            <img className="heart-icon" src = { heart } alt = "heart"/>
        </span>);
    }

    return (
        <div className="health-container">
          <h4>Health</h4>
          <div className="health-bar">
            {Array.from({ length: health }).map((_, i) => (
              <img key={i} className="heart-icon" src={heart} alt="heart" />
            ))}
          </div>
        </div>
    );
}

export { HealthBar }
import React from "react";
import fish from "../art/fish.png";
import "../components/HungerBar.css";

interface HungerBarProps {
  hunger: number;
}

const HungerBar = ({ hunger }: HungerBarProps) => {
  return (
    <div className="hunger-container">
      {hunger < 4 ? (
        <>
          <h4>Hunger</h4>
          {Array.from({ length: hunger }).map((_, i) => (
            <span key={i}>
              <img className="hunger-icon" src={fish} alt="fish" />
            </span>
          ))}
        </>
      ) : (
        <div className="hunger-condensed">
          <h4>Hunger {hunger}</h4>
          <img className="hunger-icon" src={fish} alt="fish" />
        </div>
      )}
    </div>
  );
};

export { HungerBar };

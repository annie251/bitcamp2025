import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./StartPage.css";

const TOTAL_TIME = 25 * 60;


const StartPage = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" }); // or "input", "home"
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        const newTime = t > 0 ? t - 1 : 0;
        chrome.storage.local.set({ pomodoroTimeLeft: newTime });
        return newTime;
      });
    }, 1000);
  
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    chrome.storage.local.get("pomodoroTimeLeft", (result) => {
      if (typeof result.pomodoroTimeLeft === "number") {
        setTimeLeft(result.pomodoroTimeLeft);
      }
    });
  }, []);

  const backPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: false});
    navigate(-1); 
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const elapsed = TOTAL_TIME - timeLeft;
  const fillRatio = elapsed / TOTAL_TIME;    
  const fillColor = "#8A6451";              

  return (
    <div className="popup-card">
      <div className="stats-container">
        <HealthBar health={3} />
        <HungerBar hunger={3} />
      </div>

      <div className="action-row">
        <button className="secondary-button" onClick={backPage}>
          Quit
        </button>
      </div>

      <img className="cat-sprite" src={cat} alt="cat" />

      <div className="timer-text">{mm}:{ss}</div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${fillRatio * 100}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
    </div>
  );
};

export default StartPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./StartPage.css";

const TOTAL_TIME = 25 * 60;


const StartPage = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" }); // or "input", "home"
  }, []);

  useEffect(() => {
    // Get stored end time
    chrome.storage.local.get("endTime", (result) => {
      let endTime = result.endTime;
  
      // If there's no end time yet, create and store it
      if (!endTime) {
        endTime = Date.now() + TOTAL_TIME * 1000;
        chrome.storage.local.set({ endTime });
      }
  
      const intervalId = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
  
        // Optional: reset endTime if countdown is finished
        if (remaining === 0) {
          clearInterval(intervalId);
          // maybe open break popup here?
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    });
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
    chrome.storage.local.remove("endTime");
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./StartPage.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const StartPage = () => {
  const [phase, setPhase] = useState("work"); 
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("endTime", (result) => {
      let endTime = result.endTime;

      if (!endTime) {
        const duration = phase === "work" ? WORK_TIME : BREAK_TIME;
        endTime = Date.now() + duration * 1;
        chrome.storage.local.set({ endTime });
      }

      const intervalId = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(intervalId);

          const nextPhase = phase === "work" ? "break" : "work";
          setPhase(nextPhase);

          const newEndTime = Date.now() + (nextPhase === "work" ? WORK_TIME : BREAK_TIME) * 1000;
          chrome.storage.local.set({ endTime: newEndTime });
        }
      }, 1000);

      return () => clearInterval(intervalId);
    });
  }, [phase]);

  useEffect(() => {
    chrome.storage.local.get("pomodoroTimeLeft", (result) => {
      if (typeof result.pomodoroTimeLeft === "number") {
        setTimeLeft(result.pomodoroTimeLeft);
      }
    });
  }, []);

  const backPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: false });
    chrome.storage.local.remove("endTime");
    navigate(-1);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const totalPhaseTime = phase === "work" ? WORK_TIME : BREAK_TIME;
  const elapsed = totalPhaseTime - timeLeft;
  const fillRatio = elapsed / totalPhaseTime;
  const fillColor = "#8A6451";

  return (
    <div className="popup-card">
      <div className="stats-container">
        <HealthBar health={3} />
        <HungerBar hunger={3} />
      </div>

      <div className="action-row">
        <button className="primary-button" onClick={backPage}>
          Quit
        </button>
      </div>

      <img className="cat-sprite" src={cat} alt="cat" />

      <h3>{phase === "work" ? "Focus Time!" : "Break Time!"}</h3>
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

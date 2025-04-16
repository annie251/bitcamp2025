import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import { CoinCounter } from "../components/CoinCounter";
import cat from "../art/cat.png";
import sign from "../art/sign.png";
import "./StartPage.css";

const TOTAL_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const StartPage = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<"work" | "break">("work");
  const [totalTime, setTotalTime] = useState(TOTAL_TIME);
  const [health, setHealth] = useState(3);
  const [hunger, setHunger] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [coins, setCoins] = useState(0);

  useEffect(() => {
    chrome.storage.local.get("coins", (result) => {
      setCoins(result.coins || 0);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.coins) {
        setCoins(changes.coins.newValue);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" });
  }, []);

  const startTimer = (type: "work" | "break", duration: number) => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    chrome.storage.local.set({ startTime, endTime, sessionType: type, duration });
    chrome.runtime.sendMessage({ type: "WORKING", goal: type === "work" });

    setSessionType(type);
    setTotalTime(duration);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timerRef.current!);
        if (type === "work") {
          chrome.storage.local.get("coins", (res) => {
            chrome.storage.local.set({ coins: (res.coins || 0) + 1 });
          });
          startTimer("break", BREAK_TIME);
        } else {
          startTimer("work", TOTAL_TIME);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    chrome.storage.local.set({ currentPage: "start" });

    chrome.storage.local.get(["hunger", "lastHungerDate", "health", "lastHealthLossHour"], (result) => {
      let currentHunger = result.hunger ?? 3;
      let currentHealth = result.health ?? 3;

      const today = new Date().toISOString().split("T")[0];
      const lastHungerDate = result.lastHungerDate;

      if (lastHungerDate !== today) {
        currentHunger = Math.max(0, currentHunger - 1);
        chrome.storage.local.set({
          hunger: currentHunger,
          lastHungerDate: today,
        });
      }

      if (currentHunger === 0) {
        const nowHour = new Date().getHours().toString();
        const lastHour = result.lastHealthLossHour;

        if (lastHour !== nowHour) {
          currentHealth = Math.max(0, currentHealth - 1);
          chrome.storage.local.set({
            health: currentHealth,
            lastHealthLossHour: nowHour,
          });
        }
      }

      setHunger(currentHunger);
      setHealth(currentHealth);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["startTime", "duration", "sessionType"], (result) => {
      const now = Date.now();
      const { startTime, duration, sessionType } = result;

      if (!startTime || !duration) {
        startTimer("work", TOTAL_TIME);
        return;
      }

      const timePassed = Math.floor((now - startTime) / 1000);
      const timeRemaining = Math.max(0, duration - timePassed);

      setSessionType(sessionType || "work");
      setTotalTime(duration);
      setTimeLeft(timeRemaining);

      if (timeRemaining > 0) {
        timerRef.current = setInterval(() => {
          const remaining = Math.max(0, duration - Math.floor((Date.now() - startTime) / 1000));
          setTimeLeft(remaining);
          if (remaining === 0 && timerRef.current) {
            clearInterval(timerRef.current);
            if (sessionType === "work") {
              chrome.storage.local.get("coins", (res) => {
                chrome.storage.local.set({ coins: (res.coins || 0) + 1 });
              });
              startTimer("break", BREAK_TIME);
            } else {
              startTimer("work", TOTAL_TIME);
            }
          }
        }, 1000);
      } else {
        if (sessionType === "work") startTimer("break", BREAK_TIME);
        else startTimer("work", TOTAL_TIME);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const backPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: false });
    chrome.storage.local.remove(["startTime", "endTime", "duration", "sessionType"]);
    setTimeLeft(null);
    setSessionType("work");
    setTotalTime(TOTAL_TIME);
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(-1);
  };

  const mm = timeLeft !== null ? String(Math.floor(timeLeft / 60)).padStart(2, "0") : "00";
  const ss = timeLeft !== null ? String(timeLeft % 60).padStart(2, "0") : "00";

  const fillRatio = timeLeft !== null ? (1 - timeLeft / totalTime) : 0;
  const fillColor = "#8A6451";

  return (
    <div className="popup-card">
      <div className="stats-container">
        <HealthBar health={health} />
        <HungerBar hunger={hunger} />
      </div>

      <div className="action-row">
        <button className="primary-button" onClick={backPage}>Quit</button>
        <span className="coins">Coins <span className="coin-amount"><CoinCounter coins={coins} /></span></span>
      </div>

      <img className="cat-sprite" src={(health === 0 ? sign : cat)} alt="cat" />

      <h3>{sessionType === "break" ? "Break time :3" : "Focus time ^-^"}</h3>

      <div className="timer-text">
        {timeLeft !== null ? `${mm}:${ss}` : "napping :>"}
      </div>

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
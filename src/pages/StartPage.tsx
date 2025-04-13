import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import { CoinCounter } from "../components/CoinCounter";
import cat from "../art/cat.png";
import "./StartPage.css";

const TOTAL_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const StartPage = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionType, setSessionType] = useState<"work" | "break">("work");
  const [totalTime, setTotalTime] = useState(TOTAL_TIME);
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
    const endTime = Date.now() + duration * 1000;
    chrome.storage.local.set({ endTime, sessionType: type });
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

          chrome.storage.local.get("coins", (result) => {
            const current = result.coins || 0;
            chrome.storage.local.set({ coins: current + 1 });
          });

          startTimer("break", BREAK_TIME);
        } else {
          // End of break → start next work session
          startTimer("work", TOTAL_TIME);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    chrome.storage.local.get(["endTime", "sessionType"], (result) => {
      const now = Date.now();
      const type: "work" | "break" = result.sessionType || "work";
      const storedEnd = result.endTime;

      if (!storedEnd) {
        startTimer("work", TOTAL_TIME);
        return;
      }

      const remaining = Math.floor((storedEnd - now) / 1000);
      if (remaining > 0) {
        startTimer(type, remaining);
      } else {
        // Timer expired while popup was closed — auto move to next session
        if (type === "work") {
          startTimer("break", BREAK_TIME);
        } else {
          chrome.storage.local.remove(["endTime", "sessionType"]);
          chrome.runtime.sendMessage({ type: "WORKING", goal: false });
          setTimeLeft(0);
        }
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const backPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: false });
    chrome.storage.local.remove("endTime");
    chrome.storage.local.set({ sessionType: "work" });
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(-1);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const elapsed = totalTime - timeLeft;
  const fillRatio = elapsed / totalTime;
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
        <span className="coins">Coins <span className="coin-amount"><CoinCounter coins={coins} /></span></span>
      </div>

      <img className="cat-sprite" src={cat} alt="cat" />
      
      <h3>{sessionType === "break" ? "Break time :3" : "Focus time >:|"}</h3>

      <div className="timer-text">
        {mm}:{ss}
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

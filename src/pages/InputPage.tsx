import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HealthBar } from "../components/HealthBar";
import { HungerBar } from "../components/HungerBar";
import cat from "../art/cat.png";
import "./InputPage.css";

const InputPage = () => {
  const [task, setTask] = useState("");
  const navigate = useNavigate();

// MAYBE DELETE 
  const startPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: true});
    navigate('/start');
  };

  const backPage = () => {
    chrome.runtime.sendMessage({ type: "WORKING", goal: false});
    navigate(-1); 
  };

  const isTaskValid = task.trim().length > 0;
  
  return (
    <div className="popup-card">
      <div className="stats-container">
        <HealthBar health={3} />
        <HungerBar hunger={3} />
      </div>

      <img className="cat-sprite" src={cat} alt="cat" />

      <div className="timer-row">
        <span className="timer-text">25:00</span>
        <button 
            className="primary-button" 
            onClick={startPage}
            disabled={!isTaskValid}>
          Start
        </button>
      </div>

      <label className="input-label" htmlFor="task-input">
        Input Goal Here:
      </label>
      <input required
        id="task-input"
        className="task-input"
        type="text"
        placeholder="What are you working on?"
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
          chrome.runtime.sendMessage({ type: "SAVE_GOAL", goal: e.target.value});
        }
      }
      />

      <button className="secondary-button" onClick={backPage}>
        Quit
      </button>
    </div>
  );
};

export default InputPage;

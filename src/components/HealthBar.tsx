import React from "react";
import heart from "../art/heart.png"; 

interface HealthBarProps { health: number; }

const HealthBar = ({ health } : HealthBarProps) => {
    const hearts = [];

    for (let i = 0; i < health; i++) {
        hearts.push(
        <span key = {i}>
            <img src = { heart } alt = "heart"/>
        </span>);
    }

    return (
        <div>
            <h3>Health</h3>
            <img src="heart.png"/>
        </div>
    );
}

export { HealthBar }
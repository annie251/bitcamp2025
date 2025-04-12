import React from "react";
import fish from "../art/fish.png";
import '../components/HungerBar.css';

interface HungerBarProps { hunger : number; }

const HungerBar = ( { hunger } : HungerBarProps ) => {
    const food = [];

    for (let i = 0; i < hunger; i++) {
        food.push(
        <span key = {i}>
            <img className="hunger-icon" src = { fish } alt = "fish"/>
        </span>);
    }

    return ( 
        <div>
            <div className="hunger-container">
            <h4>Hunger</h4>
                { food }
            </div>
        </div>
    )
}

export { HungerBar }
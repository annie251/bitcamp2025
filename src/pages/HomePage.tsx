import React from "react";
import { HealthBar } from "../components/HealthBar";
import "./HomePage.css"

const HomePage = () => {
    console.log("HomePage loaded!");
    return (
        <>
        <HealthBar health={3}/>
        </>
    );
}

export default HomePage;
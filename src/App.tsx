import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import StartPage from './pages/StartPage';
import StorePage from './pages/StorePage';
import RouteInitializer from './pages/RouteInitializer';

import './App.css';


// do popup size in manifest 
function App() {

  return (
    <>
    <RouteInitializer />
    <Routes>
      <Route path = "/" element = {<HomePage />}/>
      <Route path = "/input" element = {<InputPage />}/>
      <Route path = "/start" element = {<StartPage />}/>
      <Route path = "/store" element = {<StorePage />}/>
    </Routes>
    </>
  );
}

export default App;

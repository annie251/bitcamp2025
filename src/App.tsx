import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import StartPage from './pages/StartPage';

import './App.css';


// do popup size in manifest 
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<HomePage />}/>
      <Route path = "/input" element = {<InputPage />}/>
      <Route path = "/start" element = {<StartPage />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import StartPage from './pages/StartPage';

import './App.css';


// do popup size in manifest 
function App() {

  return (
    <HashRouter>
    <Routes>
      <Route path = "/" element = {<HomePage />}/>
      <Route path = "/input" element = {<InputPage />}/>
      <Route path = "/start" element = {<StartPage />}/>
    </Routes>
    </HashRouter>
  );
}

export default App;

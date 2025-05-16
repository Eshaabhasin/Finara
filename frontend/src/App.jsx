import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home/Home';
import LearnPath from './components/LearningPath/LearningPath';
import InvestiMate from './components/InvestmentPlanning/InvestmentPlanningtool';
import News from './components/News/News';
import Chatbot from './components/Chatbot/Chatbot';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LearningPaths" element={<LearnPath />} />
        <Route path="/Paths" element={<InvestiMate/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/chatbot" element={<Chatbot/>} />
      </Routes>
    </div>
  );
}

export default App;

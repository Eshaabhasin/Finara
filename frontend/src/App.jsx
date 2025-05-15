import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home/Home';
import LearnPath from './components/LearningPath/LearningPath';
import InvestiMate from './components/InvestmentPlanning/InvestmentPlanningtool';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LearningPaths" element={<LearnPath />} />
        <Route path="/Paths" element={<InvestiMate/>} />
      </Routes>
    </div>
  );
}

export default App;

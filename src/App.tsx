// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RootLayout from './app/layout';
import Home from './app/page';

const App: React.FC = () => {
  return (
    <RootLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </RootLayout>
  );
};

export default App;

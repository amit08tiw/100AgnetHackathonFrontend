// App.js
import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet
} from 'react-router-dom';

import MoleculeDesign from './tabs/MoleculeDesign';
import ToxicityReport from './tabs/ToxicityReport';
import RegulatoryReadiness from './tabs/RegulatoryReadiness';
import MoleculeComparison from './tabs/MoleculeComparison';
import VersionHistory from './tabs/VersionHistory';
import LandingPage from './LandingPage';

import './App.css';

const tabs = [
  { name: 'Molecule Design', path: '/design' },
  { name: 'Toxicity Report', path: '/toxicity' },
  { name: 'Regulatory Readiness', path: '/regulatory' },
  { name: 'Comparison', path: '/comparison' },
  { name: 'Version History', path: '/history' }
];

// ✅ Moved outside App to avoid re-creation
const Layout = React.memo(function Layout({
  darkMode,
  setDarkMode,
  model,
  setModel,
  effect,
  setEffect,
  handleGenerate
}) {
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="top-controls">
        <button className="button toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <header className="app-header">
        <h1 className="title glow">🧬 AgentNet BioForge</h1>
        <p className="subtitle">AI-powered synthetic biology lab assistant (developed by Amit Tiwary)</p>

        <div className="search-bar-container">
          <select
            className="input model-dropdown"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="llama">LLaMA 4 (Meta)</option>
            <option value="mistral">Mistral Small</option>
          </select>

          <input
            className="input search-input"
            type="text"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            placeholder="🔬 Enter biological effect (e.g., Boost testosterone)"
          />

          <button className="button gradient search-button" onClick={handleGenerate}>
            ⚗️ Generate
          </button>
        </div>

        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <Link key={tab.path} className="tab-link" to={tab.path}>
              {tab.name}
            </Link>
          ))}
        </nav>
      </header>

      <main className="tab-container">
        <Outlet />
      </main>
    </div>
  );
});

function App() {
  const [effect, setEffect] = useState('');
  const [model, setModel] = useState('llama');
  const [darkMode, setDarkMode] = useState(false);
  const [triggerGeneration, setTriggerGeneration] = useState(false);

  const handleGenerate = useCallback(() => {
    setTriggerGeneration(true);
    setTimeout(() => setTriggerGeneration(false), 100);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing page without layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages with layout */}
        <Route
          element={
            <Layout
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              model={model}
              setModel={setModel}
              effect={effect}
              setEffect={setEffect}
              handleGenerate={handleGenerate}
            />
          }
        >
          <Route path="/design" element={<MoleculeDesign effect={effect} model={model} trigger={triggerGeneration} />} />
          <Route path="/toxicity" element={<ToxicityReport effect={effect} model={model} trigger={triggerGeneration} />} />
          <Route path="/regulatory" element={<RegulatoryReadiness effect={effect} model={model} trigger={triggerGeneration} />} />
          <Route path="/comparison" element={<MoleculeComparison effect={effect} model={model} trigger={triggerGeneration} />} />
          <Route
            path="/history"
            element={
              <VersionHistory
                onRestore={(e, m) => {
                  setEffect(e);
                  setModel(m);
                  setTriggerGeneration(true);
                  setTimeout(() => setTriggerGeneration(false), 100);
                }}
              />
            }
          />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

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

const Layout = React.memo(function Layout({
  darkMode,
  setDarkMode,
  model,
  setModel,
  effect,
  setEffect,
  handleGenerate,
  searchHistory
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [customModels, setCustomModels] = useState(() => {
    const saved = localStorage.getItem('bioforge-models');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModelInput, setNewModelInput] = useState('');

  const filteredSuggestions = effect
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(effect.toLowerCase())
      )
    : searchHistory;

  const handleModelChange = (value) => {
    if (value === '__add__') {
      setIsAddingModel(true);
      setNewModelInput('');
    } else {
      setModel(value);
    }
  };

  const handleModelSubmit = () => {
    const trimmed = newModelInput.trim();
    if (trimmed && !customModels.includes(trimmed)) {
      const updated = [...customModels, trimmed];
      setCustomModels(updated);
      localStorage.setItem('bioforge-models', JSON.stringify(updated));
    }
    setModel(trimmed);
    setIsAddingModel(false);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="top-controls">
        <button className="button toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <header className="app-header">
        <h1 className="title glow">🧬 AgentNet BioForge</h1>
        <p className="subtitle">
          AI-powered synthetic biology lab assistant (developed by Amit Tiwary)
        </p>

        <div className="search-bar-container">
          {/* Model dropdown or add-new input */}
          {!isAddingModel ? (
            <select
              className="input model-dropdown"
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
            >
              <option value="llama">LLaMA 4 (Meta)</option>
              <option value="mistral">Mistral Small</option>
              {customModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value="__add__">➕ Add New Model</option>
            </select>
          ) : (
            <div className="add-model-inline">
              <input
                type="text"
                className="input"
                value={newModelInput}
                placeholder="Enter model name"
                onChange={(e) => setNewModelInput(e.target.value)}
              />
              <button className="button small" onClick={handleModelSubmit}>
                ✅ Add
              </button>
              <button
                className="button small danger"
                onClick={() => setIsAddingModel(false)}
              >
                ❌ Cancel
              </button>
            </div>
          )}

          {/* Search input with auto-suggestions */}
          <div className="search-autocomplete">
            <input
              className="input search-input"
              type="text"
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="🔬 Enter biological effect (e.g., Boost memory in elderly patients)"
              autoComplete="off"
            />
            {isFocused && filteredSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredSuggestions.map((item, i) => (
                  <li key={i} onClick={() => setEffect(item)}>
                    🔁 {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('bioforge-search-history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = useCallback(() => {
    if (effect.trim()) {
      setSearchHistory((prev) => {
        const updated = [effect, ...prev.filter((e) => e !== effect)].slice(0, 10);
        localStorage.setItem('bioforge-search-history', JSON.stringify(updated));
        return updated;
      });
    }

    setTriggerGeneration(true);
    setTimeout(() => setTriggerGeneration(false), 100);
  }, [effect]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
              searchHistory={searchHistory}
            />
          }
        >
          <Route
            path="/design"
            element={
              <MoleculeDesign effect={effect} model={model} trigger={triggerGeneration} />
            }
          />
          <Route
            path="/toxicity"
            element={
              <ToxicityReport effect={effect} model={model} trigger={triggerGeneration} />
            }
          />
          <Route
            path="/regulatory"
            element={
              <RegulatoryReadiness effect={effect} model={model} trigger={triggerGeneration} />
            }
          />
          <Route
            path="/comparison"
            element={
              <MoleculeComparison effect={effect} model={model} trigger={triggerGeneration} />
            }
          />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/tabs/ToxicityReport.js

import React, { useEffect, useState } from 'react';
import './TabStyles.css';

function ToxicityReport({ effect, model, trigger }) {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const cacheKey = `toxicity:${effect}:${model}`;

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setReport(cached);
    }
  }, [effect, model]);

  useEffect(() => {
    if (!trigger || !effect) return;

    const fetchData = async () => {
      setLoading(true);
      setReport('');
      try {
        const res = await fetch('https://100-agent-hackathon-backend.vercel.app/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            effect,
            model,
            mode: 'toxicity-report',
          }),
        });

        const data = await res.json();
        const response = data.result || 'No toxicity report received.';
        setReport(response);
        localStorage.setItem(cacheKey, response);
      } catch (err) {
        setReport('⚠️ Failed to fetch toxicity report.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trigger]);

  const renderFormattedReport = () => {
    if (!report) return null;
    const sections = report.split(/\n\n(?=\*\*|\d+\.\s)/g).map((section, idx) => {
      const html = section
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br />• ')
        .replace(/\n\d+\. /g, (match) => `<br /><strong>${match.trim()}</strong> `)
        .replace(/\n/g, '<br />');
      return <div key={idx} className="section" dangerouslySetInnerHTML={{ __html: html }} />;
    });
    return <div className="result-box animated fade-in">{sections}</div>;
  };

  return (
    <div className="tab-content">
      <h2>🧪 Toxicity Report</h2>
  
      {/* Placeholder if no trigger yet */}
      {!trigger && !loading && !report && (
        <div className="placeholder">
          🧬 Start by entering a biological effect (e.g., "reduce anxiety") and clicking **Generate** to view its toxicity analysis.
        </div>
      )}
  
      {/* Loading spinner */}
      {loading && <p className="loading-text">⏳ Generating toxicity report...</p>}
  
      {/* Final rendered report */}
      {!loading && renderFormattedReport()}
    </div>
  );
  
}

export default ToxicityReport;

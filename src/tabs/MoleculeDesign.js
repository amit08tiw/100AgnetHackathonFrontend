import React, { useState, useEffect } from 'react';
import './TabStyles.css';

function MoleculeDesign({ effect, model, trigger }) {
  const [result, setResult] = useState('');
  const [evidence, setEvidence] = useState('');
  const [patents, setPatents] = useState('');
  const [loading, setLoading] = useState(false);
  const [patentsLoading, setPatentsLoading] = useState(false);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  useEffect(() => {
    if (!trigger || !effect) return;
  
    const cacheKey = `molecule-${model}-${effect}`;
    const cached = localStorage.getItem(cacheKey);
  
    if (cached) {
      setResult(cached);
      return;
    }
  
    const fetchDesign = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://100-agent-hackathon-backend.vercel.app/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect, model, mode: 'molecule-design' })
        });
        const data = await res.json();
        const finalResult = data.result || 'No result received.';
        setResult(finalResult);
        localStorage.setItem(cacheKey, finalResult);
  
        // ✅ Save to bioforge-history
        const newEntry = {
          effect,
          model,
          result: finalResult,
          timestamp: new Date().toISOString()
        };
  
        const existing = JSON.parse(localStorage.getItem('bioforge-history')) || [];
        const updated = [newEntry, ...existing.filter(e => e.effect !== effect)].slice(0, 10);
        localStorage.setItem('bioforge-history', JSON.stringify(updated));
      } catch (err) {
        setResult('⚠️ Failed to fetch data.');
      }
      setLoading(false);
    };
  
    fetchDesign();
  }, [effect, model, trigger]);
  

  useEffect(() => {
    if (!result) return;
  
    setEvidenceLoading(true); // start loading
    fetch('https://100-agent-hackathon-backend.vercel.app/search-evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effect })
    })
      .then(res => res.json())
      .then(data => setEvidence(data.evidence || []))
      .catch(() =>
        setEvidence([{ title: 'No Tavily results', url: '#' }])
      )
      .finally(() => setEvidenceLoading(false)); // done
  }, [ result, trigger]);
  

  useEffect(() => {
    if (!result) return;
  
    setPatentsLoading(true);
  
    fetch('https://100-agent-hackathon-backend.vercel.app/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effect, model, mode: 'patents' })
    })
      .then(res => res.json())
      .then(data => setPatents(data.result || 'No patent text received.'))
      .catch(() =>
        setPatents('⚠️ Failed to fetch patent data.')
      )
      .finally(() => setPatentsLoading(false));
  }, [ result, trigger]);
  


  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '<br />• ')
      .replace(/\n\d+\. /g, (match) => `<br /><strong>${match.trim()}</strong> `)
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="tab-content">
      <h2 className="tab-title">🧬 Molecule Designer</h2>
  
      {/* 🔹 Placeholder before generation */}
      {!trigger && !loading && !result && (
        <div className="placeholder">
          💡 Start by entering a biological effect (e.g., “boost memory”) and clicking <strong>Generate</strong> to design a synthetic molecule.
        </div>
      )}
  
      {loading && <div className="loading">🔄 Designing molecule...</div>}
  
      {!loading && result && (
        <div className="result-layout">
          <div
            className="result-column styled-result animated fade-in"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(result) }}
          />
  
          <div className="evidence-column">
            {evidence.length > 0 && (
             <>
            <h3>🔎 Supporting Evidence powered by Tavily</h3>
{evidenceLoading ? (
  <div className="loading">🔄 Gathering biomedical evidence...</div>
) : (
  <ul>
    {evidence.map((item, idx) => (
      <li key={idx}>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </li>
    ))}
  </ul>
)}

           </>
           
            )}
  
            {patents.length > 0 && (
            <>
            <div className="patent-section">
              <h3>📄 Patentable Document</h3>
          
              {patentsLoading ? (
                <div className="loading">🔄 Generating Patentable Documents...</div>
              ) : (
                <div
                  className="styled-result"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(patents) }}
                />
              )}
            </div>
          </>          
           
            )}
          </div>
        </div>
      )}
    </div>
  );
  
}

export default MoleculeDesign;

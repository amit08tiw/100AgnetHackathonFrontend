import React, { useState, useEffect } from 'react';

function MoleculeDesign({ effect, model, trigger }) {
  const [result, setResult] = useState('');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);

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
        const res = await fetch('http://localhost:5000/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect, model, mode: 'molecule-design' })
        });
        const data = await res.json();
        const finalResult = data.result || 'No result received.';
        setResult(finalResult);
        localStorage.setItem(cacheKey, finalResult); // ✅ Cache the result
      } catch (err) {
        setResult('⚠️ Failed to fetch data.');
      }
      setLoading(false);
    };

    fetchDesign();
  }, [effect, model, trigger]);

  useEffect(() => {
    if (!result) return;
  
    fetch('http://localhost:5000/search-evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effect })
    })
      .then(res => res.json())
      .then(data => setEvidence(data.evidence || []))
      .catch(() => setEvidence([{ title: 'No Tavily results', link: '#' }]));
  }, [result]);

  // ✅ Format result for styled HTML
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

      {loading && <div className="loading">🔄 Designing molecule...</div>}

      {!loading && result && (
        <div
          className="styled-result animated fade-in"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(result) }}
        />
      )}
      {evidence.length > 0 && (
  <div className="evidence-section">
    <h3>🔎 Supporting Evidence powered by Tavily</h3>
    <ul>
      {evidence.map((item, idx) => (
        <li key={idx}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default MoleculeDesign;

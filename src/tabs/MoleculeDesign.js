import React, { useState, useEffect } from 'react';
import './TabStyles.css';

function MoleculeDesign({ effect, model, trigger }) {
  const [result, setResult] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [patents, setPatents] = useState('');
  const [svgSketch, setSvgSketch] = useState('');
  const [loading, setLoading] = useState(false);
  const [patentsLoading, setPatentsLoading] = useState(false);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [svgLoading, setSvgLoading] = useState(false);

  const BASE_URL = 'https://100-agent-hackathon-backend.vercel.app';

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
        const res = await fetch(`${BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect, model, mode: 'molecule-design' })
        });
        const data = await res.json();
        const finalResult = data.result || 'No result received.';
        setResult(finalResult);
        localStorage.setItem(cacheKey, finalResult);

        // Save to version history
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

    const fetchAll = async () => {
      // Fetch evidence
      setEvidenceLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/search-evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect })
        });
        const data = await res.json();
        setEvidence(data.evidence || []);
      } catch {
        setEvidence([{ title: 'No Tavily results', url: '#' }]);
      } finally {
        setEvidenceLoading(false);
      }

      await new Promise(res => setTimeout(res, 1000)); // delay to avoid rate limit

      // Fetch patents
      setPatentsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect, model, mode: 'patents' })
        });
        const data = await res.json();
        setPatents(data.result || 'No patent text received.');
      } catch {
        setPatents('⚠️ Failed to fetch patent data.');
      } finally {
        setPatentsLoading(false);
      }

      await new Promise(res => setTimeout(res, 1000)); // another delay

      // Fetch SVG
      setSvgLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect, model, mode: 'sketch' })
        });
        const data = await res.json();
        setSvgSketch(data.result || '');
      } catch {
        setSvgSketch('');
      } finally {
        setSvgLoading(false);
      }
    };

    fetchAll();
  }, [result, trigger]);

  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '<br />• ')
      .replace(/\n\d+\. /g, match => `<br /><strong>${match.trim()}</strong> `)
      .replace(/\n/g, '<br />');
  };

  const extractSVG = (svgString) =>
    svgString.replace(/^```svg/, '').replace(/```$/, '').trim();

  return (
    <div className="tab-content">
      <h2 className="tab-title">Molecule Designer</h2>

      {!trigger && !loading && !result && (
        <div className="placeholder">
          Start by entering a biological effect and clicking <strong>Generate</strong> to design a synthetic molecule.
        </div>
      )}

      {loading && <div className="loading">Designing molecule...</div>}

      {!loading && result && (
        <div className="result-layout">
          <div
            className="result-column styled-result animated fade-in"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(result) }}
          />

          <div className="evidence-column">
            {evidenceLoading ? (
              <div className="loading">Gathering biomedical evidence...</div>
            ) : evidence.length > 0 && (
              <>
                <h3>Supporting Evidence powered by Tavily AI</h3>
                <ul>
                  {evidence.map((item, idx) => (
                    <li key={idx}>
                      <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {patentsLoading ? (
              <div className="loading">Generating patentable documentation...</div>
            ) : (
              patents && (
                <>
                  <h3>Patentable Document</h3>
                  <div
                    className="styled-result"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(patents) }}
                  />
                </>
              )
            )}
            <h3>Molecule Sketch</h3>
            {svgLoading ? (
              <div className="loading">Loading molecule sketch...</div>
            ) : (
              svgSketch && (
                <div
                  className="svg-container"
                  dangerouslySetInnerHTML={{ __html: extractSVG(svgSketch) }}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoleculeDesign;

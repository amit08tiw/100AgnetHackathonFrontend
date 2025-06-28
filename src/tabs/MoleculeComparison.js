import React, { useEffect, useState } from 'react';

function MoleculeComparison({ effect, model, trigger }) {
  const [comparison, setComparison] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trigger || !effect) return;

    const cacheKey = `comparison-${model}-${effect}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setComparison(cached);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://100-agent-hackathon-backend.vercel.app/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            effect,
            model,
            mode: 'comparison'
          })
        });

        const data = await res.json();
        const output = data.result || 'No comparison data found.';
        setComparison(output);
        localStorage.setItem(cacheKey, output); // ✅ Cache result
      } catch (err) {
        setComparison('❌ Error fetching molecule comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [effect, model, trigger]);

  const renderFormatted = () => {
    if (!comparison) return null;

    const sections = comparison.split(/\n\n(?=\*\*|\d+\.\s)/g).map((section, idx) => {
      const html = section
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br />• ')
        .replace(/\n\d+\. /g, (match) => `<br /><strong>${match.trim()}</strong> `)
        .replace(/\n/g, '<br />');
      return <div key={idx} className="section" dangerouslySetInnerHTML={{ __html: html }} />;
    });

    return <div className="tab-result animated fade-in">{sections}</div>;
  };

  return (
    <div className="tab-content">
      <h2 className="tab-title">🔬 Molecule Comparison</h2>
  
      {/* Placeholder before comparison trigger */}
      {!trigger && !loading && !comparison && (
        <div className="placeholder">
          📊 Generate a molecule first to compare it with known alternatives and evaluate key differences.
        </div>
      )}
  
      {/* Loading indicator */}
      {loading && <div className="loading">🧪 Comparing molecules...</div>}
  
      {/* Render result */}
      {!loading && renderFormatted()}
    </div>
  );
  
}

export default MoleculeComparison;

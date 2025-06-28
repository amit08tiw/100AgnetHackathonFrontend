import React, { useEffect, useState } from 'react';
import './TabStyles.css';

function VersionHistory({ reloadTrigger, onRestore }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bioforge-history')) || [];
    setHistory(saved);
  }, [reloadTrigger]); // re-read history when parent updates reloadTrigger

  const handleRestore = (item) => {
    if (onRestore) {
      onRestore(item.effect, item.model || 'llama');
    }
  };

  return (
    <div className="tab-content">
      <h2 className="tab-title">📚 Version History</h2>

      {history.length === 0 && (
        <div className="placeholder">
          📦 No saved versions yet. Generate a molecule to start building your version history.
        </div>
      )}

      {history.map((item, idx) => (
        <div key={idx} className="version-entry animated fade-in">
          <div className="version-header">
            <div>
              <strong>🧬 Effect:</strong> {item.effect}
              <span className="model-badge">
                {item.model === 'mistral' ? 'Mistral Small' : 'LLaMA 4'}
              </span>
            </div>
            <button className="button small" onClick={() => handleRestore(item)}>
              🔁 Restore
            </button>
          </div>

          <div className="version-body">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  item.result
                    ?.slice(0, 250)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />') + '...',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default VersionHistory;

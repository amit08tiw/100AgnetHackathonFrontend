import React, { useEffect, useState } from 'react';
import './TabStyles.css';

function RegulatoryReadiness({ effect, model, trigger }) {
  const [regulatoryData, setRegulatoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!effect || !trigger) return;

    const cacheKey = `regulatory-${model}-${effect}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setRegulatoryData(JSON.parse(cached));
      return;
    }

    const fetchRegulatoryData = () => {
      setLoading(true);

      // Simulate async API call (replace with real call if needed)
      setTimeout(() => {
        const data = {
          fdaPhase: 'Preclinical',
          euApprovalLikelihood: 'Moderate',
          patentStatus: 'Not Filed',
          requiredStudies: [
            'Toxicology report',
            'Pharmacokinetics (PK/PD)',
            'In-vitro efficacy',
            'Animal safety study'
          ],
          notes:
            'To move into Phase 1 trials, complete toxicity and safety studies and consider provisional patent filing.'
        };

        setRegulatoryData(data);
        localStorage.setItem(cacheKey, JSON.stringify(data)); // ✅ Cache the response
        setLoading(false);
      }, 1200);
    };

    fetchRegulatoryData();
  }, [effect, model, trigger]);

  return (
    <div className="tab-content">
      <h2 className="tab-title">📋 Regulatory Readiness</h2>

      {!effect && <p className="dim-text">Please generate a molecule to assess readiness.</p>}

      {loading && <p>🔍 Analyzing regulatory status...</p>}

      {regulatoryData && !loading && (
        <>
          <ul className="readiness-list">
            <li><strong>FDA Clinical Phase:</strong> {regulatoryData.fdaPhase}</li>
            <li><strong>EU EMA Approval Likelihood:</strong> {regulatoryData.euApprovalLikelihood}</li>
            <li><strong>Patent Status:</strong> {regulatoryData.patentStatus}</li>
          </ul>

          <div className="required-studies">
            <strong>🧪 Required Preclinical Studies:</strong>
            <ul>
              {regulatoryData.requiredStudies.map((study, i) => (
                <li key={i}>✔️ {study}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation">
            <strong>📌 Notes & Guidance:</strong>
            <p>{regulatoryData.notes}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default RegulatoryReadiness;

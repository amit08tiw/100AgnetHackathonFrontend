import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTryNow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/design');
    }, 3000); // simulate loading for 2 seconds
  };

  const handleWatchDemo = () =>
    window.open('https://your-demo-video-link.com', '_blank');

  return (
    <div className="landing-page">
      {loading && (
        <div className="loader-overlay">
          <div className="complex-spinner">🚀 Launching Your Smart Lab Environment...</div>
        </div>
      )}

      {/* === Navigation Bar === */}
      <nav className="top-nav glass-nav">
        <div className="nav-logo">🧬 AgentNet <span className="bioforge">BioForge</span></div>
        <ul className="nav-links">
          <li onClick={() => handleScroll('why-section')}>Features</li>
          <li onClick={() => handleScroll('how-it-works')}>How it Works?</li>
          <li onClick={() => handleScroll('pricing-section')}>Pricing</li>
          <li onClick={() => handleScroll('testimonial-section')}>Testimonials</li>
          <li onClick={() => handleScroll('contact-section')}>Documentation</li>
          <li onClick={() => handleScroll('contact-section')}>Contact</li>
        </ul>
        <button className="get-started-btn" onClick={handleTryNow}>
          🚀 Get Started
        </button>
      </nav>

      {/* === Header Section === */}
      <header className="landing-header">
        <p className="powered-by">🚀  Evidence-enriched by <strong>Tavily</strong></p>
        <p className='where-molecule'>Where <span className='biofrge'>Molecules</span> Meet <span className='bioforge'>Intelligence</span></p>
        <p className='where-molecule-description'>
          AgentNet BioForge simplifies the science, accelerates discovery, and empowers researchers to create groundbreaking molecules — even when the lab gets chaotic.
        </p>
        <div className="landing-buttons">
          <button className="try-button" onClick={handleTryNow}>Try for Free →</button>
          <button className="demo-button" onClick={handleWatchDemo}>Watch Demo ▶️</button>
        </div>
        <p className='credit'>✨ No credit card required • 🎓 Free for students • 🚀 Setup in 60 seconds</p>
      </header>

      {/* === WHY Section === */}
      <section id="why-section" className="why-section glass">
        <h2 className='built-for'><span className='quotes'>"</span>Designed for Researchers. Loved by Innovators.<span className='quotes'>"</span></h2>
        <ul>
          <li>✅ <strong>No Coding Required</strong> — Just describe the biological effect in plain English.</li>
          <li>🧪 <strong>AI-Powered Molecule Design</strong> — Real-time suggestions for synthetic compounds tailored to your needs.</li>
          <li>🔍 <strong>Instant Safety Insights</strong> — Predict toxicity, side effects, and safety thresholds automatically.</li>
          <li>📜 <strong>Regulatory Roadmaps</strong> — Get FDA & EMA approval guidance without the jargon.</li>
          <li>🧬 <strong>Scientist-Friendly UI</strong> — Built for researchers with zero technical complexity.</li>
          <li>🤝 <strong>Team Collaboration</strong> — Easily compare versions, restore designs, and co-create with your team.</li>
        </ul>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="how-it-works">
  <h2>How It Works</h2>
  <div className="steps">
    <div className="step-card">
      <h3>1. Describe Effect</h3>
      <p>Type any biological goal like "boost memory" or "lower cortisol."</p>
    </div>
    <div className="step-card">
      <h3>2. Generate Molecule</h3>
      <p>BioForge AI generates synthetic molecule structure and usage info.</p>
    </div>
    <div className="step-card">
      <h3>3. Analyze & Approve</h3>
      <p>Get toxicity reports, comparison charts, and regulatory paths.</p>
    </div>
  </div>
</section>


      {/* === TESTIMONIAL === */}
      <section id="testimonial-section" className="testimonial-section">
        <h2>👩‍🔬 Trusted by Scientists</h2>
        <blockquote>
          “AgentNet BioForge saved me weeks of lab time by predicting molecule behavior before synthesis.”
        </blockquote>
        <cite>– Dr. Amit Tiwary, Synthetic Biologist</cite>
      </section>

      {/* === PRICING === */}
      <section id="pricing-section" className="how-it-worksp">
  <h2>Pricing</h2>
  <div className="steps">
    <div className="step-cardp">
      <h3>Basic</h3>
       <p>🔓 10 free molecule queries/month</p>
        <p>💬 Community Support</p>
        <p>🧪 Basic molecule editor</p>
        <p>📄 No PDF export</p>
        <p>🧾 Limited toxicity insights</p>
        <button className="select-plan bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300">
        Start Free
      </button>
    </div>
    <div className="step-cardp">
      <h3>Plus*</h3>
       <p>✅ Unlimited molecule generations</p>
        <p>📈 Full toxicity & safety reports</p>
        <p>🔍 Similarity & comparison tools</p>
        <p>🧪 Advanced molecule editor</p>
        <p>📤 Limited PDF export</p>
        <button className="select-plan bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300">
        Contact Sales
      </button>
    </div>
    <div className="step-cardp">
      <h3>Pro*</h3>
       <p>👥 Team collaboration features</p>
        <p>🧬 Full API access + export tools</p>
        <p>📊 Unlimited PDF downloads</p>
        <p>⚖️ Regulatory readiness reports</p>
        <p>🔗 Molecule version history</p>
        <button className="select-plan bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300">
        Contact Sales
      </button>
    </div>
    </div>
</section>


      {/* === CONTACT === */}
      <section id="contact-section" className="contact-section">
        <h2>📫 Get in Touch</h2>
        <p>Have questions, ideas, or want to collaborate?</p>
        <p>Email us: <a href="mailto:amittiwary@gmail.com">amittiwary08@gmail.com</a></p>
        <p style={{ marginBottom: '0px' }}>Follow on X: <a href="https://twitter.com/" target="_blank" rel="noreferrer">@agentnet</a></p>
      </section>

      {/* === FOOTER === */}
      <footer className="footer">
        <p style={{ margin: '0px' }}>© 2025 AgentNet BioForge. Built with ❤️ by Amit Tiwary for 100 Agents Hackathon - Pushing The Limits of Agentic AI.</p>
      </footer>
    </div>
  );
}

export default LandingPage;

import React from 'react';
import { Sparkles, BarChart2, BookOpen, Calculator } from 'lucide-react';

const WelcomeScreen = ({ onSelectSuggestion }) => {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const suggestions = [
    {
      title: 'Compare aircraft range & seating',
      text: 'Analyze the specs of the Boeing 787 vs the Airbus A350.',
      prompt: 'Compare Boeing 787 and Airbus A350 specifications',
      icon: <Sparkles className="suggestion-icon text-indigo" size={18} style={{ color: '#6366f1' }} />
    },
    {
      title: 'Analyze flight logs',
      text: 'Scan telemetry spreadsheets for anomalies and performance.',
      prompt: 'How do you analyze flight telemetry CSV files for anomalies?',
      icon: <BarChart2 className="suggestion-icon text-success" size={18} style={{ color: '#10b981' }} />
    },
    {
      title: 'Summarize maintenance PDFs',
      text: 'Check compliance audits and engine turbine borescope logs.',
      prompt: 'Summarize standard checklist findings in C-Check maintenance PDF reports',
      icon: <BookOpen className="suggestion-icon text-warning" size={18} style={{ color: '#f59e0b' }} />
    },
    {
      title: 'Calculate lift parameters',
      text: 'Review aerodynamic formulas and compute lift coefficients.',
      prompt: 'Show me the formula for Lift and walk through a sample Cessna calculation',
      icon: <Calculator className="suggestion-icon text-error" size={18} style={{ color: '#ef4444' }} />
    }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-logo">
        <Sparkles size={40} style={{ fill: '#6366f1', color: '#6366f1' }} />
        <span>Antigravity</span>
      </div>
      <h1 className="welcome-greeting">{getGreeting()}, Engineer</h1>
      <p className="welcome-subtitle">
        How can I help you analyze, calculate, or inspect your aircraft systems today?
      </p>

      <div className="suggestions-grid">
        {suggestions.map((s, index) => (
          <button
            key={index}
            className="suggestion-card"
            onClick={() => onSelectSuggestion(s.prompt)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {s.icon}
              <span className="suggestion-title">{s.title}</span>
            </div>
            <span className="suggestion-text">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;

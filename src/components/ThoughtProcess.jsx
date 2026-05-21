import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';

const ThoughtProcess = ({ thought, thoughtTime }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!thought) return null;

  return (
    <div className="thought-container">
      <div className="thought-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="thought-header-left">
          <Eye size={14} style={{ color: '#6366f1' }} />
          <span>Thought Process</span>
          {thoughtTime && (
            <span className="thought-time">({thoughtTime}s)</span>
          )}
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      {isOpen && (
        <div className="thought-content">
          {thought}
        </div>
      )}
    </div>
  );
};

export default ThoughtProcess;

import React, { useState } from 'react';
import { Copy, Check, FileText, BarChart2, Image, ShieldAlert, File } from 'lucide-react';
import ThoughtProcess from './ThoughtProcess';

// Custom Markdown-like Renderer for Chat Messages
const renderMessageContent = (text) => {
  if (!text) return null;

  const blocks = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block Parsing
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3) || 'code';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        lang,
        content: codeLines.join('\n')
      });
      i++;
      continue;
    }

    // 2. Alert Callouts (e.g. > [!WARNING])
    if (line.trim().startsWith('>') && lines[i].includes('[!')) {
      const type = lines[i].includes('WARNING') ? 'warning' : 'note';
      const contentLines = [];
      // Clean first line
      const match = lines[i].match(/>\s*\[!(?:WARNING|NOTE)\]\s*(.*)/);
      if (match && match[1]) {
        contentLines.push(match[1]);
      }
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        contentLines.push(lines[i].trim().slice(1).trim());
        i++;
      }
      blocks.push({
        type: 'alert',
        alertType: type,
        content: contentLines.join(' ')
      });
      continue;
    }

    // 3. Table Parsing
    if (line.trim().startsWith('|')) {
      const headers = line.split('|').map(s => s.trim()).filter(Boolean);
      i++; // Skip delimiter line (e.g., |:---|:---|)
      if (i < lines.length && lines[i].includes('---')) {
        i++;
      }
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').map(s => s.trim()).filter(Boolean);
        // Sometimes trailing pipes create an extra empty cell; standard split takes care of it
        if (cells.length > 0) {
          rows.push(cells);
        }
        i++;
      }
      blocks.push({
        type: 'table',
        headers,
        rows
      });
      continue;
    }

    // 4. Header (e.g., ### Heading)
    if (line.trim().startsWith('#')) {
      const level = (line.match(/^#+/) || ['#'])[0].length;
      const content = line.replace(/^#+\s*/, '');
      blocks.push({
        type: 'header',
        level,
        content
      });
      i++;
      continue;
    }

    // 5. Lists (Unordered / Ordered)
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim())) {
      const items = [];
      let isOrdered = /^\d+\.\s/.test(line.trim());
      
      while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- ') || /^\d+\.\s/.test(lines[i].trim()))) {
        const itemText = lines[i].trim().replace(/^(\*|-|\d+\.)\s*/, '');
        items.push(itemText);
        i++;
      }
      
      blocks.push({
        type: 'list',
        ordered: isOrdered,
        items
      });
      continue;
    }

    // 6. Normal Paragraph
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Accumulate multiple text lines into a single paragraph
    const paragraphLines = [];
    while (i < lines.length && 
           lines[i].trim() !== '' && 
           !lines[i].trim().startsWith('```') && 
           !lines[i].trim().startsWith('|') && 
           !lines[i].trim().startsWith('>') && 
           !lines[i].trim().startsWith('#') && 
           !lines[i].trim().startsWith('* ') && 
           !lines[i].trim().startsWith('- ') && 
           !/^\d+\.\s/.test(lines[i].trim())) {
      paragraphLines.push(lines[i]);
      i++;
    }
    blocks.push({
      type: 'paragraph',
      content: paragraphLines.join(' ')
    });
  }

  // Render processed blocks to React Elements
  return blocks.map((block, idx) => {
    switch (block.type) {
      case 'code':
        return <CodeBlock key={idx} lang={block.lang} code={block.content} />;
      case 'alert':
        return (
          <div key={idx} className={`alert-${block.alertType}`}>
            <strong>{block.alertType === 'warning' ? 'Warning: ' : 'Note: '}</strong>
            {parseInlineElements(block.content)}
          </div>
        );
      case 'table':
        return (
          <div key={idx} style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {block.headers.map((h, hIdx) => <th key={hIdx}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{parseInlineElements(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'header':
        const HeaderTag = `h${Math.min(block.level + 1, 6)}`;
        return React.createElement(HeaderTag, { key: idx }, parseInlineElements(block.content));
      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return React.createElement(
          ListTag, 
          { key: idx }, 
          block.items.map((item, itemIdx) => (
            <li key={itemIdx}>{parseInlineElements(item)}</li>
          ))
        );
      case 'paragraph':
      default:
        return <p key={idx}>{parseInlineElements(block.content)}</p>;
    }
  });
};

// Parse bold (**text**) and inline code (`code`) within text blocks
const parseInlineElements = (text) => {
  if (!text) return '';

  const parts = [];
  let currentText = text;

  // Regex to match inline code (`code`) and bold (**bold**)
  // We process them sequentially or token-based. A simple split/replace is easier.
  // First, find all occurrences of code and bold, sort by index
  let matchFound = true;
  let keyIdx = 0;

  while (matchFound) {
    const codeMatch = currentText.match(/`([^`]+)`/);
    const boldMatch = currentText.match(/\*\*([^*]+)\*\*/);

    let nextMatch = null;
    let type = '';

    if (codeMatch && boldMatch) {
      if (codeMatch.index < boldMatch.index) {
        nextMatch = codeMatch;
        type = 'code';
      } else {
        nextMatch = boldMatch;
        type = 'bold';
      }
    } else if (codeMatch) {
      nextMatch = codeMatch;
      type = 'code';
    } else if (boldMatch) {
      nextMatch = boldMatch;
      type = 'bold';
    }

    if (nextMatch) {
      // Add text before match
      if (nextMatch.index > 0) {
        parts.push(currentText.substring(0, nextMatch.index));
      }

      // Add styled matched element
      if (type === 'code') {
        parts.push(<code key={`inline-${keyIdx++}`} className="inline-code">{nextMatch[1]}</code>);
      } else {
        parts.push(<strong key={`inline-${keyIdx++}`}>{nextMatch[1]}</strong>);
      }

      // Update current text
      currentText = currentText.substring(nextMatch.index + nextMatch[0].length);
    } else {
      matchFound = false;
    }
  }

  // Add remaining text
  if (currentText.length > 0) {
    parts.push(currentText);
  }

  return parts.length > 0 ? parts : text;
};

// Copyable Code Block component
const CodeBlock = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="code-block-container">
      <div className="code-header">
        <span>{lang}</span>
        <button className="copy-code-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Helper for choosing file icon
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'csv':
    case 'xlsx':
    case 'xls':
      return <BarChart2 size={16} style={{ color: '#10b981' }} />;
    case 'pdf':
      return <FileText size={16} style={{ color: '#ef4444' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <Image size={16} style={{ color: '#3b82f6' }} />;
    default:
      return <File size={16} style={{ color: '#94a3b8' }} />;
  }
};

// Main MessageItem Component
const MessageItem = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'} animate-message`}>
      <div className="message-content-container">
        <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
          {isUser ? 'U' : 'A'}
        </div>
        <div className="message-body">
          {/* If assistant, render thought process block first */}
          {!isUser && message.thought && (
            <ThoughtProcess thought={message.thought} thoughtTime={message.thoughtTime} />
          )}

          {/* Render regular contents */}
          <div>{renderMessageContent(message.content)}</div>

          {/* Render files attached by user */}
          {isUser && message.files && message.files.length > 0 && (
            <div className="attachments-grid">
              {message.files.map((file, fIdx) => (
                <div key={fIdx} className="attachment-chip">
                  {getFileIcon(file.name)}
                  <span className="attachment-chip-name">{file.name}</span>
                  <span className="attachment-chip-size">({file.size})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
export { getFileIcon };

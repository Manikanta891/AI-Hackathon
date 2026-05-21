import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, PanelLeftOpen, UploadCloud, X } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import MessageItem, { getFileIcon } from './MessageItem';

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ChatArea = ({
  chat,
  isSidebarCollapsed,
  onToggleSidebar,
  onSendMessage,
  isGenerating
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isGenerating]);

  // Adjust textarea height on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  // Reset textarea height and inputs when loading a different chat
  useEffect(() => {
    setInputText('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [chat?.id]);

  const handleSend = () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;
    if (isGenerating) return;

    onSendMessage(inputText, attachedFiles);
    setInputText('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files) => {
    const formatted = files.map(file => ({
      name: file.name,
      size: formatBytes(file.size),
      type: file.type
    }));
    setAttachedFiles(prev => [...prev, ...formatted]);
  };

  const removeFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSuggestion = (promptText) => {
    onSendMessage(promptText, []);
  };

  const messages = chat?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div
      className="main-chat"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="drag-overlay animate-message">
          <UploadCloud size={60} style={{ color: '#6366f1' }} />
          <div className="drag-overlay-text">Drop files here to analyze</div>
        </div>
      )}

      {/* Chat Top Bar */}
      <header className="chat-header">
        <div className="header-left">
          {isSidebarCollapsed && (
            <button
              className="toggle-sidebar-btn"
              onClick={onToggleSidebar}
              title="Open sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
          <div className="header-model">
            <span>Antigravity Assistant</span>
            <span className="model-badge">v3.5 Flash</span>
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="messages-list">
        {!hasMessages ? (
          <WelcomeScreen onSelectSuggestion={handleSelectSuggestion} />
        ) : (
          messages.map(msg => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="message-wrapper assistant">
            <div className="message-content-container">
              <div className="message-avatar assistant">A</div>
              <div className="message-body">
                <div className="typing-wrapper">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          {/* Attached Files Previews */}
          {attachedFiles.length > 0 && (
            <div className="input-previews">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="preview-chip animate-message">
                  {getFileIcon(file.name)}
                  <span className="attachment-chip-name">{file.name}</span>
                  <button className="preview-remove-btn" onClick={() => removeFile(idx)}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="input-row">
            {/* Attachment Button */}
            <button
              type="button"
              className="file-upload-label"
              onClick={triggerFileInput}
              title="Attach files (PDF, CSV, Image)"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden-file-input"
              multiple
            />

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Message Antigravity..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            {/* Send Button */}
            <button
              className="send-message-btn"
              disabled={(!inputText.trim() && attachedFiles.length === 0) || isGenerating}
              onClick={handleSend}
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <div className="disclaimer-text">
          Antigravity can make mistakes. Verify critical aircraft specs and calculations.
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
export { formatBytes };

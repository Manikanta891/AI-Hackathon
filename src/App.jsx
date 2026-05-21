import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { getResponseForPrompt } from './utils/mockData';

const LOCAL_STORAGE_KEY = 'antigravity_chats_v1';

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        } else {
          createNewChat();
        }
      } catch (e) {
        console.error('Failed to parse saved chats:', e);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // 2. Save to LocalStorage on updates
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    return newChat;
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
  };

  const handleDeleteChat = (id) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        // Re-create a fresh chat if all are deleted
        setTimeout(() => createNewChat(), 0);
      } else if (activeChatId === id) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameChat = (id, newTitle) => {
    setChats(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleSendMessage = (text, files = []) => {
    if (isGenerating) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      files: files,
      createdAt: new Date().toISOString()
    };

    // Update messages list for the active chat
    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const isFirstMessage = c.messages.length === 0;
          const updatedMessages = [...c.messages, userMessage];
          
          // Auto-rename chat title based on the first prompt
          let newTitle = c.title;
          if (isFirstMessage) {
            newTitle = text.trim() 
              ? (text.length > 25 ? text.trim().substring(0, 25) + '...' : text.trim())
              : (files.length > 0 ? `Uploaded ${files[0].name}` : 'New Chat');
          }

          return {
            ...c,
            title: newTitle,
            messages: updatedMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );

    setIsGenerating(true);

    // Get Mock Response mapping matching details
    const responseTemplate = getResponseForPrompt(text, files);
    const thinkingDelay = (responseTemplate.thoughtTime || 1.5) * 1000;

    // Simulate thought-process duration delay
    setTimeout(() => {
      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: responseTemplate.content,
        thought: responseTemplate.thought,
        thoughtTime: responseTemplate.thoughtTime,
        createdAt: new Date().toISOString()
      };

      setChats(prev =>
        prev.map(c => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: new Date().toISOString()
            };
          }
          return c;
        })
      );
      setIsGenerating(false);
    }, thinkingDelay);
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(true)}
        onSelectChat={handleSelectChat}
        onNewChat={createNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <ChatArea
        chat={activeChat}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(false)}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
      />
    </div>
  );
}

export default App;

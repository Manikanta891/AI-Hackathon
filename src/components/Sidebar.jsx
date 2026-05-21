import React, { useState } from 'react';
import { Plus, PanelLeftClose, Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';

const Sidebar = ({
  chats,
  activeChatId,
  isCollapsed,
  onToggleCollapse,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (e, chatId) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      handleSaveRename(e, chatId);
    } else if (e.key === 'Escape') {
      handleCancelRename(e);
    }
  };

  // Group chats by date (Today, Yesterday, Previous 7 Days, Older)
  const groupChats = () => {
    const today = [];
    const yesterday = [];
    const previous7Days = [];
    const older = [];

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt || chat.createdAt);
      const diffTime = now - chatDate;
      const diffDays = Math.floor(diffTime / oneDayMs);

      if (diffDays === 0 && now.getDate() === chatDate.getDate()) {
        today.push(chat);
      } else if (diffDays <= 1) {
        yesterday.push(chat);
      } else if (diffDays <= 7) {
        previous7Days.push(chat);
      } else {
        older.push(chat);
      }
    });

    return [
      { title: 'Today', items: today },
      { title: 'Yesterday', items: yesterday },
      { title: 'Previous 7 Days', items: previous7Days },
      { title: 'Older', items: older }
    ].filter(group => group.items.length > 0);
  };

  const chatGroups = groupChats();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={16} />
          <span>New Chat</span>
        </button>
        <button className="collapse-sidebar-btn" onClick={onToggleCollapse} title="Close sidebar">
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="sidebar-scroll">
        {chats.length === 0 ? (
          <div style={{ padding: '16px', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>
            No chat history
          </div>
        ) : (
          chatGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h2 className="chat-group-title">{group.title}</h2>
              {group.items.map(chat => {
                const isActive = chat.id === activeChatId;
                const isEditing = chat.id === editingId;

                return (
                  <div
                    key={chat.id}
                    className={`chat-item ${isActive ? 'active' : ''}`}
                    onClick={() => !isEditing && onSelectChat(chat.id)}
                  >
                    <div className="chat-item-left">
                      <MessageSquare size={16} style={{ color: isActive ? '#6366f1' : '#94a3b8', flexShrink: 0 }} />
                      {isEditing ? (
                        <input
                          type="text"
                          className="chat-rename-input"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, chat.id)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <span className="chat-item-title">{chat.title}</span>
                      )}
                    </div>

                    <div className="chat-item-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="action-icon"
                            onClick={(e) => handleSaveRename(e, chat.id)}
                            title="Save title"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            className="action-icon"
                            onClick={handleCancelRename}
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-icon"
                            onClick={(e) => handleStartRename(e, chat)}
                            title="Rename"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="action-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">ME</div>
          <div>
            <div className="user-name">Manikanta</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Premium Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

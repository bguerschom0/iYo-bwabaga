import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.sender_id === currentUserId
                ? 'bg-sandbeige-800 text-white'
                : 'bg-sandbeige-100 text-sandbeige-900'
            }`}
          >
            <div className="text-sm mb-1">
              {message.sender?.full_name || 'Anonymous'}
            </div>
            <div>{message.content}</div>
            <div
              className={`text-xs mt-1 ${
                message.sender_id === currentUserId
                  ? 'text-sandbeige-200'
                  : 'text-sandbeige-500'
              }`}
            >
              {formatTime(message.created_at)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

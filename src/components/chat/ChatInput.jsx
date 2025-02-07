import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // File upload logic will be implemented here
        // Once uploaded, you can send the file URL in the message
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full resize-none rounded-lg border border-sandbeige-200 p-2 focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
          rows={1}
          style={{
            minHeight: '40px',
            maxHeight: '120px',
          }}
        />
      </div>
      <div className="flex space-x-2">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isUploading}
          onClick={() => document.getElementById('file-upload').click()}
          className="border-sandbeige-200"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          disabled={!message.trim() || isUploading}
          className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;

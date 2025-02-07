import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const ChatWindow = ({ user, adminId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .match({ chat_id: `${user.id}_${adminId}` })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${user.id}_${adminId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content) => {
    try {
      const { error } = await supabase.from('messages').insert({
        chat_id: `${user.id}_${adminId}`,
        sender_id: user.id,
        content,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl transition-all duration-200 ${
        minimized ? 'h-14' : 'h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-sandbeige-200">
        <h3 className="font-medium text-sandbeige-900">Customer Support</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 h-[calc(600px-120px)]">
            <MessageList messages={messages} currentUserId={user.id} />
          </div>

          {/* Input */}
          <div className="border-t border-sandbeige-200 p-4">
            <ChatInput onSend={sendMessage} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;

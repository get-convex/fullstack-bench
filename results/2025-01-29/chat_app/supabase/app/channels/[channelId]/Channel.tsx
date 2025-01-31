"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/database';
import type { Message } from '@/types/database';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

interface ChannelProps {
  channelId: string;
  userId: string;
}

export function Channel({ channelId, userId }: ChannelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    console.log('Setting up realtime for channel:', channelId);

    // Initial fetch of messages
    const fetchMessages = async () => {
      console.log('Fetching messages for channel:', channelId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Fetched messages:', data);
      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages from other users
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload: RealtimePostgresInsertPayload<Message>) => {
          console.log('Realtime event received:', payload);
          const newMessage = payload.new;
          // Only add messages from other users (our own messages are added immediately)
          if (newMessage.channel_id === parseInt(channelId) && newMessage.user_id !== userId) {
            console.log('New message from another user:', newMessage);
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status:`, status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [channelId, supabase, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message to channel:', channelId);
    const messageToSend = {
      channel_id: parseInt(channelId),
      user_id: userId,
      content: newMessage.trim(),
    };
    console.log('Message data:', messageToSend);

    setNewMessage('');

    const { data, error } = await supabase
      .from('messages')
      .insert(messageToSend)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Add the message to local state immediately
    console.log('Message sent successfully:', data);
    setMessages((current) => [...current, data]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-sm ${
                message.user_id === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

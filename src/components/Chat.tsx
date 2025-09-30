import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for previous messages
    socketRef.current.on('previous messages', (prevMessages: Message[]) => {
      setMessages(prevMessages);
    });

    // Listen for new messages
    socketRef.current.on('chat message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && username.trim() && socketRef.current) {
      const messageData = {
        username,
        message: inputMessage,
        timestamp: new Date()
      };
      socketRef.current.emit('chat message', messageData);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Chat Room</h1>
        <div className="text-sm">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="font-semibold text-blue-600">{msg.username}</div>
              <div className="text-gray-800">{msg.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        {!username && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l"
            disabled={!username || !isConnected}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!inputMessage.trim() || !username || !isConnected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

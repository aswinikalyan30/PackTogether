import React, { useState } from 'react';
import { Trip } from '../App';
import { 
  Send,
  Smile,
  Paperclip,
  Reply,
  MoreHorizontal,
  Heart,
  ThumbsUp,
  Laugh,
  Search,
  Filter
} from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions: Reaction[];
  replies?: Message[];
  attachments?: Attachment[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Props {
  trip: Trip;
}

const GroupChat: React.FC<Props> = ({ trip }) => {
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Alice Johnson',
      avatar: '👩‍💻',
      text: 'Hey everyone! I just booked our hotel in Shibuya. The reviews look amazing! 🏨',
      timestamp: '2024-01-15T10:30:00Z',
      reactions: [
        { emoji: '👍', count: 3, users: ['2', '3', '4'] },
        { emoji: '🎉', count: 1, users: ['2'] }
      ],
      replies: [
        {
          id: '1-1',
          userId: '2',
          userName: 'Bob Smith',
          avatar: '👨‍💼',
          text: 'Awesome! What\'s the check-in time?',
          timestamp: '2024-01-15T10:35:00Z',
          reactions: []
        }
      ]
    },
    {
      id: '2',
      userId: '3',
      userName: 'Carol Brown',
      avatar: '👩‍🎨',
      text: 'I found some great restaurant recommendations for our first day. Should I make reservations?',
      timestamp: '2024-01-15T11:15:00Z',
      reactions: [
        { emoji: '🍽️', count: 2, users: ['1', '4'] }
      ]
    },
    {
      id: '3',
      userId: '4',
      userName: 'David Wilson',
      avatar: '👨‍🚀',
      text: 'The weather forecast looks perfect for our Tokyo Skytree visit! ☀️ Clear skies all week.',
      timestamp: '2024-01-15T14:20:00Z',
      reactions: [
        { emoji: '☀️', count: 4, users: ['1', '2', '3', '4'] }
      ]
    },
    {
      id: '4',
      userId: '2',
      userName: 'Bob Smith',
      avatar: '👨‍💼',
      text: '@Alice Johnson @Carol Brown Can we sync up on the itinerary tonight? I have some activity suggestions.',
      timestamp: '2024-01-15T16:45:00Z',
      reactions: []
    }
  ]);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🤔'];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'Alice Johnson',
      avatar: '👩‍💻',
      text: newMessage,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    if (replyingTo) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === replyingTo) {
          return {
            ...msg,
            replies: [...(msg.replies || []), message]
          };
        }
        return msg;
      }));
      setReplyingTo(null);
    } else {
      setMessages(prev => [...prev, message]);
    }

    setNewMessage('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          const hasUserReacted = existingReaction.users.includes('1');
          if (hasUserReacted) {
            // Remove reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== '1') }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, '1'] }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...message,
            reactions: [...message.reactions, { emoji, count: 1, users: ['1'] }]
          };
        }
      }
      return message;
    }));
    setShowEmojiPicker(null);
  };

  const renderMessage = (message: Message, isReply = false) => {
    const hasUserReacted = (emoji: string) => {
      const reaction = message.reactions.find(r => r.emoji === emoji);
      return reaction?.users.includes('1') || false;
    };

    return (
      <div key={message.id} className={`${isReply ? 'ml-12 mt-2' : 'mb-6'}`}>
        <div className="flex gap-3">
          <div className={`avatar ${isReply ? 'avatar-sm' : ''}`}>
            {message.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-gray-900">{message.userName}</span>
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <p className="text-gray-900">{message.text}</p>
            </div>

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      hasUserReacted(reaction.emoji)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleReaction(message.id, reaction.emoji)}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => setReplyingTo(message.id)}
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
              
              <div className="relative">
                <button
                  className="flex items-center gap-1 hover:text-gray-700"
                  onClick={() => setShowEmojiPicker(
                    showEmojiPicker === message.id ? null : message.id
                  )}
                >
                  <Smile className="w-4 h-4" />
                  React
                </button>
                
                {showEmojiPicker === message.id && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                    <div className="flex gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                          onClick={() => handleReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="flex items-center gap-1 hover:text-gray-700">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Replies */}
            {message.replies && message.replies.length > 0 && (
              <div className="mt-4 space-y-2">
                {message.replies.map((reply) => renderMessage(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Chat</h1>
          <p className="text-gray-600">Discuss your trip plans with the group</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button className="btn btn-secondary">
            <Search className="w-4 h-4" />
            Search
          </button>
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 min-h-0">
        <div className="card h-full flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h4>
                <p className="text-gray-500 mb-4">Start the conversation with your travel companions</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => renderMessage(message))}
              </div>
            )}
          </div>

          {/* Reply indicator */}
          {replyingTo && (
            <div className="px-6 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  Replying to {messages.find(m => m.id === replyingTo)?.userName}
                </span>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-3">
              <div className="avatar avatar-sm">
                👩‍💻
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg pr-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Members */}
      <div className="mt-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Online Members</h3>
          </div>
          <div className="card-content">
            <div className="flex gap-3">
              {trip.members.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <div className="relative">
                    <div className="avatar avatar-sm">
                      {member.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
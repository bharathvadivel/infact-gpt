"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  MessageSquare, 
  Moon, 
  User, 
  ChevronUp,
  Paperclip,
  ArrowUp,
  Edit3,
  Trash2,
  Sun,
  ChevronDown
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [chatModel, setChatModel] = useState('gpt-4');
  const [isPrivate, setIsPrivate] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const suggestionCards = [
    {
      title: "What are the advantages",
      subtitle: "of using Next.js?",
      prompt: "What are the advantages of using Next.js for web development?"
    },
    {
      title: "Write code to",
      subtitle: "demonstrate dijkstra's algorithm",
      prompt: "Write code to demonstrate Dijkstra's algorithm with explanations"
    },
    {
      title: "Help me write an essay",
      subtitle: "about silicon valley",
      prompt: "Help me write an essay about Silicon Valley's impact on technology"
    },
    {
      title: "What is the weather",
      subtitle: "in San Francisco?",
      prompt: "What is the current weather in San Francisco?"
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingConversationId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingConversationId]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
    }
  };

  const startEditingTitle = (conversationId: string, currentTitle: string) => {
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = (conversationId: string) => {
    if (editingTitle.trim()) {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: editingTitle.trim(), updatedAt: new Date() }
          : conv
      ));
    }
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const cancelEditing = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple response simulation based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('next.js') || lowerMessage.includes('nextjs')) {
      return "Next.js offers several key advantages:\n\n1. **Server-Side Rendering (SSR)** - Improves SEO and initial page load times\n2. **Static Site Generation (SSG)** - Pre-renders pages at build time for optimal performance\n3. **API Routes** - Built-in API functionality without needing a separate backend\n4. **Automatic Code Splitting** - Only loads the JavaScript needed for each page\n5. **Built-in CSS Support** - Supports CSS Modules, Sass, and CSS-in-JS out of the box\n6. **Image Optimization** - Automatic image optimization with the Image component\n7. **TypeScript Support** - First-class TypeScript support with zero configuration\n\nThese features make Next.js an excellent choice for building modern, performant web applications.";
    }
    
    if (lowerMessage.includes('dijkstra')) {
      return "Here's an implementation of Dijkstra's algorithm in JavaScript:\n\n```javascript\nfunction dijkstra(graph, start) {\n  const distances = {};\n  const visited = new Set();\n  const previous = {};\n  const queue = [];\n\n  // Initialize distances\n  for (let vertex in graph) {\n    distances[vertex] = vertex === start ? 0 : Infinity;\n    queue.push(vertex);\n  }\n\n  while (queue.length > 0) {\n    // Find vertex with minimum distance\n    queue.sort((a, b) => distances[a] - distances[b]);\n    const current = queue.shift();\n    \n    if (visited.has(current)) continue;\n    visited.add(current);\n\n    // Update distances to neighbors\n    for (let neighbor in graph[current]) {\n      const distance = distances[current] + graph[current][neighbor];\n      if (distance < distances[neighbor]) {\n        distances[neighbor] = distance;\n        previous[neighbor] = current;\n      }\n    }\n  }\n\n  return { distances, previous };\n}\n```\n\nThis algorithm finds the shortest path from a start vertex to all other vertices in a weighted graph.";
    }
    
    if (lowerMessage.includes('essay') && lowerMessage.includes('silicon valley')) {
      return "Here's an outline for an essay about Silicon Valley:\n\n**Title: Silicon Valley: The Engine of Technological Innovation**\n\n**Introduction:**\n- Brief history of Silicon Valley's transformation from agricultural land to tech hub\n- Thesis: Silicon Valley has fundamentally shaped the modern technological landscape\n\n**Body Paragraphs:**\n\n1. **Historical Development**\n   - Post-WWII military contracts and Stanford University's role\n   - The semiconductor industry's emergence\n   - Key figures like William Shockley and the \"Traitorous Eight\"\n\n2. **Culture of Innovation**\n   - Risk-taking and failure tolerance\n   - Venture capital ecosystem\n   - Networking and knowledge sharing\n\n3. **Global Impact**\n   - Major companies: Apple, Google, Facebook, Tesla\n   - Influence on global tech ecosystems\n   - Economic implications worldwide\n\n4. **Challenges and Criticisms**\n   - Income inequality and housing crisis\n   - Privacy and ethical concerns\n   - Environmental impact\n\n**Conclusion:**\n- Silicon Valley's continued relevance in the digital age\n- Future challenges and opportunities\n\nWould you like me to help you develop any specific section?";
    }
    
    if (lowerMessage.includes('weather') && lowerMessage.includes('san francisco')) {
      return "I don't have access to real-time weather data, but I can tell you about San Francisco's typical weather patterns:\n\n**San Francisco Climate:**\n- **Mediterranean climate** with mild, wet winters and dry summers\n- **Average temperatures:** 50-70°F (10-21°C) year-round\n- **Fog season:** June through August, especially in the mornings\n- **Rainiest months:** December through March\n- **Driest months:** June through September\n\n**Current Season Expectations:**\n- **Summer:** Cool and foggy, especially near the coast\n- **Fall:** Often the warmest and clearest time of year\n- **Winter:** Mild with occasional rain\n- **Spring:** Variable with mix of sun and rain\n\nFor current conditions, I'd recommend checking a weather service like Weather.com or your local weather app!";
    }
    
    // Default responses for other messages
    const responses = [
      "That's an interesting question! Let me think about that for a moment. Could you provide a bit more context about what specifically you'd like to know?",
      "I'd be happy to help you with that! Can you tell me more about what you're looking for?",
      "Great question! There are several ways to approach this. What's your current level of experience with this topic?",
      "I understand what you're asking. Let me break this down for you in a clear and helpful way.",
      "That's a thoughtful question. Here's what I think about that topic..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    let conversationId = activeConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: generateTitle(content),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConversations(prev => [newConversation, ...prev]);
      conversationId = newConversation.id;
      setActiveConversationId(conversationId);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ? generateTitle(content) : conv.title,
            updatedAt: new Date()
          }
        : conv
    ));

    setMessage('');
    setIsTyping(true);

    try {
      // Simulate AI response
      const aiResponse = await simulateAIResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd persist this to localStorage and apply theme classes
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setUsername(isLoggedIn ? 'Guest' : 'John Doe');
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        {/* Sidebar Header */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Chatbot
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={createNewConversation}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-4">
          {conversations.length === 0 ? (
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              <MessageSquare className="h-4 w-4" />
              <span>Your conversations will appear here once you start chatting!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversationId === conversation.id
                      ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  {editingConversationId === conversation.id ? (
                    <input
                      ref={editInputRef}
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => saveTitle(conversation.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTitle(conversation.id);
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className={`w-full bg-transparent border-none outline-none text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                  ) : (
                    <>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate pr-8`}>
                        {conversation.title}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {formatTime(conversation.updatedAt)}
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingTitle(conversation.id, conversation.title);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t space-y-3`}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700'} font-normal`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
            Toggle {isDarkMode ? 'light' : 'dark'} mode
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700'} font-normal`}
            onClick={toggleLogin}
          >
            <User className="h-4 w-4 mr-3" />
            {isLoggedIn ? 'Logout' : 'Login to your account'}
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${isLoggedIn ? 'bg-green-500' : 'bg-orange-500'} rounded-full`}></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{username}</span>
            </div>
            <ChevronUp className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={chatModel} onValueChange={setChatModel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={isPrivate ? "private" : "public"} onValueChange={(value) => setIsPrivate(value === "private")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-black text-white hover:bg-gray-800">
              Deploy with Vercel
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-2">
                  <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Hello there!
                  </h1>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    How can I help you today?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {suggestionCards.map((card, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${
                        isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSuggestionClick(card.prompt)}
                    >
                      <CardContent className="p-4">
                        <div className="text-left">
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                            {card.title}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {card.subtitle}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages Area
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      msg.role === 'user' 
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-4`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className={`text-xs mt-2 ${
                        msg.role === 'user' 
                          ? 'text-blue-100' 
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Message Input */}
        <div className={`p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Input
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`pr-20 py-3 text-base ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-gray-500' 
                    : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
                }`}
                disabled={isTyping}
              />
              <div className="absolute right-2 flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  className={`h-8 w-8 ${
                    message.trim() && !isTyping
                      ? isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      : isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'
                  }`}
                  disabled={!message.trim() || isTyping}
                  onClick={() => sendMessage(message)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
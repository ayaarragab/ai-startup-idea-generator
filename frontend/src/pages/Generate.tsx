import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { 
  Settings, 
  Sparkles, 
  Check,
  ChevronRight,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  Edit2
} from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  selectedSectors: string[];
  formData: {
    focusImpact: boolean;
    maturityLevel: string;
  };
}

export function Generate() {
  const navigate = useNavigate();
  const userId = 'user-123'; // TODO: Replace with actual user ID from auth

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      userId: userId,
      title: 'HealthTech Solution for Cairo',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      messages: [
        {
          id: 1,
          role: 'ai',
          content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea tailored for the Egyptian market.",
          timestamp: new Date('2024-02-10'),
        }
      ],
      selectedSectors: ['Healthcare', 'FinTech'],
      formData: {
        focusImpact: true,
        maturityLevel: 'mvp-ready',
      }
    },
    {
      id: 'conv-2',
      userId: userId,
      title: 'E-commerce Platform',
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-12'),
      messages: [
        {
          id: 1,
          role: 'ai',
          content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea tailored for the Egyptian market.",
          timestamp: new Date('2024-02-12'),
        }
      ],
      selectedSectors: ['E-commerce', 'Tourism'],
      formData: {
        focusImpact: false,
        maturityLevel: 'exploratory',
      }
    },
    {
      id: 'conv-3',
      userId: userId,
      createdAt: new Date('2024-02-14'),
      updatedAt: new Date('2024-02-14'),
      messages: [
        {
          id: 1,
          role: 'ai',
          content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea tailored for the Egyptian market.",
          timestamp: new Date('2024-02-14'),
        }
      ],
      selectedSectors: ['Education'],
      formData: {
        focusImpact: true,
        maturityLevel: 'mvp-ready',
      }
    }
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    focusImpact: true,
    maturityLevel: 'mvp-ready',
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea tailored for the Egyptian market. What problem or opportunity would you like to explore?",
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [showConversations, setShowConversations] = useState(false);

  const steps = [
    { number: 1, title: 'Preferences', icon: Settings },
    { number: 2, title: 'Chat with AI', icon: MessageSquare },
  ];

  const sectorOptions = [
    'Healthcare', 'Education', 'Agriculture', 'Transportation', 'Environment',
    'FinTech', 'E-commerce', 'Tourism', 'Manufacturing', 'Energy', 'Real Estate', 'Food Tech'
  ];

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/idea/sample-idea-1');
    }, 3000);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput('');

    // Update current conversation if exists
    if (currentConversationId) {
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...chatMessages, newMessage], updatedAt: new Date() }
          : conv
      ));
    }

    // Simulate AI response
    setIsAITyping(true);
    setTimeout(() => {
      let aiResponseContent = '';
      
      // Intelligent AI responses based on conversation context
      if (chatMessages.length === 1) {
        aiResponseContent = `Interesting! I can see you're interested in ${selectedSectors.join(', ')}. Let me help you explore this further. What specific challenges or pain points have you noticed in ${selectedSectors[0]} that could be addressed with a startup solution?`;
      } else if (chatMessages.length === 3) {
        aiResponseContent = `That's a great observation! Based on your preferences for ${formData.maturityLevel === 'mvp-ready' ? 'MVP-ready' : 'exploratory'} ideas${formData.focusImpact ? ' with high societal impact' : ''}, I'm analyzing the Egyptian market data to find the best match. Would you like me to generate a complete startup idea now, or would you like to discuss more details?`;
      } else if (chatMessages.length >= 5 || userInput.toLowerCase().includes('generate') || userInput.toLowerCase().includes('yes')) {
        aiResponseContent = `Perfect! I have gathered enough information. I'll now process your inputs through our 4-model AI pipeline to generate a comprehensive startup idea tailored for the Egyptian market. This will include a Business Model Canvas, pitch summary, and relevant academic references. Please wait a moment...`;
        
        const aiResponse: ChatMessage = {
          id: chatMessages.length + 2,
          role: 'ai',
          content: aiResponseContent,
          timestamp: new Date(),
        };
        setChatMessages([...chatMessages, newMessage, aiResponse]);
        setIsAITyping(false);
        
        // Trigger generation after showing the message
        setTimeout(() => {
          handleGenerate();
        }, 1500);
        return;
      } else {
        aiResponseContent = `I understand. Tell me more about your vision for this startup. What makes you passionate about solving this problem in the Egyptian market?`;
      }

      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'ai',
        content: aiResponseContent,
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, newMessage, aiResponse]);
      setIsAITyping(false);

      // Update conversation with AI response
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...chatMessages, newMessage, aiResponse], updatedAt: new Date() }
            : conv
        ));
      }
    }, 1500);
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: 1,
          role: 'ai',
          content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea tailored for the Egyptian market. What problem or opportunity would you like to explore?",
          timestamp: new Date(),
        }
      ],
      selectedSectors: [],
      formData: {
        focusImpact: true,
        maturityLevel: 'mvp-ready',
      }
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setSelectedSectors([]);
    setFormData({ focusImpact: true, maturityLevel: 'mvp-ready' });
    setChatMessages(newConv.messages);
    setCurrentStep(1);
    setShowConversations(false);
  };

  const handleSelectConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConversationId(convId);
      setSelectedSectors(conv.selectedSectors);
      setFormData(conv.formData);
      setChatMessages(conv.messages);
      setCurrentStep(2); // Always open to chat view
      setShowConversations(false);
    }
  };

  const handleDeleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConversationId === convId) {
      setCurrentConversationId(null);
      handleNewConversation();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-neutral-900 mb-2">Generate Your Startup Idea</h2>
              <p className="text-neutral-600">
                Answer a few questions to help our AI create the perfect startup idea for you
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNewConversation}
              className="hidden md:flex"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </Button>
          </div>

          {/* Mobile: Conversations Toggle Button */}
          <div className="mb-4 md:hidden">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setShowConversations(!showConversations)}
              className="w-full justify-center"
            >
              <MessageSquare className="w-4 h-4" />
              {showConversations ? 'Hide' : 'Show'} Conversations ({conversations.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Conversations Sidebar */}
            <div className={`lg:col-span-3 ${showConversations ? 'block' : 'hidden md:block'}`}>
              <Card variant="bordered" padding="sm" className="sticky top-24 max-h-[600px] overflow-y-auto">
                <div className="space-y-2">
                  <div className="px-2 py-1">
                    <h6 className="text-neutral-900 text-sm font-medium">Previous Conversations</h6>
                  </div>
                  
                  {conversations.length === 0 ? (
                    <div className="px-2 py-8 text-center">
                      <p className="text-neutral-500 text-sm">No conversations yet</p>
                      <Button variant="primary" size="sm" onClick={handleNewConversation} className="mt-4">
                        <Plus className="w-4 h-4" />
                        Start New Chat
                      </Button>
                    </div>
                  ) : (
                    <>
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`group relative p-3 rounded-lg transition-colors cursor-pointer ${
                            currentConversationId === conv.id
                              ? 'bg-primary-50 border border-primary-200'
                              : 'hover:bg-neutral-50 border border-transparent'
                          }`}
                          onClick={() => handleSelectConversation(conv.id)}
                        >
                          <div className="flex items-start gap-2">
                            <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              currentConversationId === conv.id ? 'text-primary-600' : 'text-neutral-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h6 className={`text-sm font-medium truncate ${
                                currentConversationId === conv.id ? 'text-primary-900' : 'text-neutral-900'
                              }`}>
                                {conv.title || 'Untitled Conversation'}
                              </h6>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                <span className="text-xs text-neutral-500">{formatDate(conv.updatedAt)}</span>
                              </div>
                              {conv.selectedSectors.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {conv.selectedSectors.slice(0, 2).map(sector => (
                                    <span key={sector} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                                      {sector}
                                    </span>
                                  ))}
                                  {conv.selectedSectors.length > 2 && (
                                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                                      +{conv.selectedSectors.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conv.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-neutral-200 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-neutral-600" />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-6">
              <Card variant="elevated" padding="lg">
                {/* Step 1: Preferences */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-neutral-900 mb-2">Your Preferences</h4>
                      <p className="text-neutral-600">
                        Customize your startup idea based on your interests and goals
                      </p>
                    </div>

                    <div>
                      <label className="block text-neutral-700 mb-3">
                        Target sectors (select one or more)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {sectorOptions.map((sector) => (
                          <button
                            key={sector}
                            onClick={() => toggleSector(sector)}
                            className={`px-4 py-2 rounded-full border-2 transition-colors ${
                              selectedSectors.includes(sector)
                                ? 'border-secondary-600 bg-secondary-50 text-secondary-700'
                                : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Card variant="bordered" padding="md" className="bg-yellow-50 border-yellow-200">
                      <p className="text-neutral-700">
                        <strong>Note:</strong> This system is designed specifically for the Egyptian market using local data sources and cultural context.
                      </p>
                    </Card>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="primary"
                        onClick={() => setCurrentStep(2)}
                        disabled={selectedSectors.length === 0}
                      >
                        Next: Chat with AI
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Chat with AI */}
                {currentStep === 2 && (
                  <div className="flex flex-col h-[600px]">
                    <div className="mb-6">
                      <h4 className="text-neutral-900 mb-1">Refine Your Idea</h4>
                      <p className="text-neutral-500 text-sm">
                        Discuss your vision with our AI assistant
                      </p>
                    </div>

                    {/* Selected Preferences Summary */}
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-neutral-500">Selected:</span>
                        {selectedSectors.map(sector => (
                          <span key={sector} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'ai' && (
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bot className="w-4 h-4 text-neutral-600" />
                            </div>
                          )}
                          <div 
                            className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                              message.role === 'user'
                                ? 'bg-neutral-900 text-white' 
                                : 'bg-neutral-50 text-neutral-900'
                            }`}
                          >
                            <p className={`text-sm leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-neutral-800'}`}>
                              {message.content}
                            </p>
                            <span className={`text-xs mt-1.5 block ${message.role === 'user' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isAITyping && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="max-w-[75%] rounded-lg px-4 py-3 bg-neutral-50">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={isGenerating || isAITyping}
                            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-neutral-400 transition-all placeholder:text-neutral-400"
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={isGenerating || isAITyping || !userInput.trim()}
                          className="px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Back Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => setCurrentStep(1)}
                          disabled={isGenerating || isAITyping}
                          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 transition-colors"
                        >
                          ← Back to Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
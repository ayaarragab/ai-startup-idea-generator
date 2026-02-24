import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Settings, 
  ChevronRight,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  Save
} from 'lucide-react';

interface ChatMessage {
  id: number | string;
  role: 'user' | 'ai';
  content: string;
  createdAt: string; 
  clientMessageId?: string;
  is_idea?: boolean; 
  is_idea_saved?: boolean;
  ideaId?: string | number;
}

interface Idea {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valueProposition: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  nextSteps: string[];
  academicReferences: string[];
}

interface Sector {
  id: number;
  name: string;
}

interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  sectors?: Sector[];
}

export function Generate() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const sectorOptions = [
    { id: 1, name: 'Healthcare' }, { id: 2, name: 'Education' }, 
    { id: 3, name: 'Agriculture' }, { id: 4, name: 'Transportation' }, 
    { id: 5, name: 'Environment' }, { id: 6, name: 'FinTech' }, 
    { id: 7, name: 'E-commerce' }, { id: 8, name: 'Tourism' }, 
    { id: 9, name: 'Manufacturing' }, { id: 10, name: 'Energy' }, 
    { id: 11, name: 'Real Estate' }, { id: 12, name: 'Food Tech' }
  ];
  
  const [selectedSectorIds, setSelectedSectorIds] = useState<number[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [showConversations, setShowConversations] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get('/conversation/');
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleSector = (sectorId: number) => {
    setSelectedSectorIds(prev =>
      prev.includes(sectorId) ? prev.filter(id => id !== sectorId) : [...prev, sectorId]
    );
  };

  const handleNextStep = async () => {
    if (selectedSectorIds.length === 0) return;
    
    setIsGenerating(true);
    try {
      const response = await axiosInstance.post('/conversation/', selectedSectorIds);
      const newConv = response.data;
      
      setCurrentConversationId(newConv.id);
      
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        role: 'ai',
        content: "Hello! I'm your AI startup advisor. Based on your preferences, I'll help you develop a startup idea. What problem would you like to explore?",
        createdAt: new Date().toISOString()
      };
      setChatMessages([welcomeMsg]);
      setCurrentStep(2);
      
      setConversations(prev => [newConv, ...prev]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;
    
    const clientMessageId = Date.now().toString();
    const newMessage: ChatMessage = {
      id: clientMessageId,
      role: 'user',
      content: userInput,
      createdAt: new Date().toISOString(),
      clientMessageId
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsAITyping(true);

    try {
      const response = await axiosInstance.post('/chat/', {
        content: newMessage.content,
        conversationId: currentConversationId,
        isNewConversation: !currentConversationId, 
        clientMessageId
      });

      const aiResponseData = response.data;
      if (aiResponseData.is_idea) {
        setCurrentIdea(aiResponseData.idea);
      }
      const aiMessage: ChatMessage = {
        id: aiResponseData.messageId || Date.now(),
        role: 'ai',
        content: aiResponseData.content,
        createdAt: new Date().toISOString(),
        is_idea: aiResponseData.is_idea || false,
        is_idea_saved: aiResponseData.is_idea_saved || false,
      };

      setChatMessages(prev => [...prev, aiMessage]);

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, updatedAt: new Date().toISOString() }
          : conv
      ));

    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleSelectConversation = async (convId: string) => {
    try {
      const response = await axiosInstance.get(`/conversation/${convId}`);
      const convData = response.data;
      
      setCurrentConversationId(convData.id);
      setSelectedSectorIds(convData.sectors?.map((s: Sector) => s.id) || []);
      setChatMessages(convData.messages || []);
      setCurrentStep(2);
      setShowConversations(false);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setSelectedSectorIds([]);
    setChatMessages([]);
    setCurrentStep(1);
    setShowConversations(false);
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await axiosInstance.delete(`/conversation/${convId}`);
    } catch (error) {
      console.log(error);
    }
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConversationId === convId) {
      handleNewConversation();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const toggleIdeaSave = async (messageId: string | number) => {
      const targetMessage = chatMessages.find(msg => msg.id === messageId);
      if (!targetMessage) return;

      const isCurrentlySaved = targetMessage.is_idea_saved;
      const newSavedState = !isCurrentlySaved;

      setChatMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_idea_saved: newSavedState } : msg
      ));

      try {
        if (!isCurrentlySaved) {
          await axiosInstance.post('idea/saved-ideas', { 
            ideaId: currentIdea?.id,
            messageId
          });
          
        } else {
          await axiosInstance.delete(`/saved-ideas/${ currentIdea?.id }`);
        }
      } catch (error) {
        console.error("Error saving/unsaving idea:", error);

        setChatMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, is_idea_saved: isCurrentlySaved } : msg
        ));
      }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-neutral-900 mb-2">Generate Your Startup Idea</h2>
              <p className="text-neutral-600">
                Answer a few questions to help our AI create the perfect startup idea for you
              </p>id
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

          <div className="mb-4 md:hidden">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setShowConversations(!showConversations)}
              className="w-full justify-center"
            >
              <MessageSquare className="w-4 h-4" />
              {showConversations ? 'Hide' : 'Show'} Conversations
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-3 ${showConversations ? 'block' : 'hidden md:block'}`}>
              <Card variant="bordered" padding="sm" className="sticky top-24 max-h-[600px] overflow-y-auto">
                <div className="space-y-2">
                  <div className="px-2 py-1">
                    <h6 className="text-neutral-900 text-sm font-medium">Previous Conversations</h6>
                  </div>
                  
                  {isLoadingHistory ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    </div>
                  ) : conversations.length === 0 ? (
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

            <div className="lg:col-span-6">
              <Card variant="elevated" padding="lg">
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
                            key={sector.id}
                            onClick={() => toggleSector(sector.id)}
                            className={`px-4 py-2 rounded-full border-2 transition-colors ${
                              selectedSectorIds.includes(sector.id)
                                ? 'border-secondary-600 bg-secondary-50 text-secondary-700'
                                : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            {sector.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="primary"
                        onClick={handleNextStep}
                        disabled={selectedSectorIds.length === 0 || isGenerating}
                      >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Next: Chat with AI
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col h-[600px]">
                    <div className="mb-6">
                      <h4 className="text-neutral-900 mb-1">Refine Your Idea</h4>
                      <p className="text-neutral-500 text-sm">
                        Discuss your vision with our AI assistant
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {message.role === 'ai' && (
                              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bot className="w-4 h-4 text-neutral-600" />
                              </div>
                            )}
                            <div 
                              className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                                message.role === 'user'
                                  ? 'bg-neutral-900 text-white' 
                                  : 'bg-neutral-50 text-neutral-900 border border-neutral-100'
                              }`}
                            >
                              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-neutral-800'}`}>
                                {message.content}
                              </p>
                              <span className={`text-xs mt-1.5 block ${message.role === 'user' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                              </span>
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          
                          {message.role === 'ai' && message.is_idea && (
                            <button
                              onClick={() => toggleIdeaSave(message.id)}
                              className={`ml-11 flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm border ${
                                message.is_idea_saved
                                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                                  : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                              }`}
                            >
                              <Save className="w-3.5 h-3.5" />
                              {message.is_idea_saved ? 'Unsave Idea' : 'Save Idea'}
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isAITyping && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="max-w-[75%] rounded-lg px-4 py-3 bg-neutral-50 border border-neutral-100">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={isAITyping}
                            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-neutral-400 transition-all placeholder:text-neutral-400"
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={isAITyping || !userInput.trim()}
                          className="px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          <span className="hidden sm:inline">Send</span>
                        </button>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          onClick={handleNewConversation}
                          disabled={isAITyping}
                          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 transition-colors"
                        >
                          ← Start New Idea
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
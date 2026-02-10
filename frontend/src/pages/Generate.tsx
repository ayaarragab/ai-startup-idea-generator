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
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function Generate() {
  const navigate = useNavigate();
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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-neutral-900 mb-2">Generate Your Startup Idea</h2>
            <p className="text-neutral-600">
              Answer a few questions to help our AI create the perfect startup idea for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Progress Sidebar */}
            <div className="lg:col-span-3">
              <Card variant="bordered" padding="md" className="sticky top-24">
                <div className="space-y-1">
                  {steps.map((step, index) => (
                    <div key={step.number}>
                      <button
                        onClick={() => !isGenerating && setCurrentStep(step.number)}
                        disabled={isGenerating}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          currentStep === step.number
                            ? 'bg-primary-50 text-primary-700'
                            : currentStep > step.number
                            ? 'text-neutral-700 hover:bg-neutral-50'
                            : 'text-neutral-400'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            currentStep === step.number
                              ? 'bg-primary-600 text-white'
                              : currentStep > step.number
                              ? 'bg-secondary-600 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          {currentStep > step.number ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{step.title}</div>
                        </div>
                      </button>
                      {index < steps.length - 1 && (
                        <div className="h-8 ml-7 w-0.5 bg-neutral-200" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
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
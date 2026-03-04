// IdeaDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { 
  ArrowLeft, Bookmark, Star, Users, DollarSign, TrendingUp, ExternalLink, 
  CheckCircle2, Handshake, Package, Heart, BarChart3, Loader2, Globe, Rocket
} from 'lucide-react';

// UPDATED: Aligned with the new Sequelize model
interface IdeaData {
  id: number;
  messageId: number | null;
  problemTitle: string;
  problemDescription: string;
  rootCause: string;
  targetUsers: string;
  marketRegion: string;
  whyNow: string;
  evidenceSignals: any[];
  solutionName: string;
  solutionDescription: string;
  howItWorks: string[];
  keyFeatures: string[];
  technologyStack: string[];
  retrivedStartups: any[];
  businessModel: {
    value_proposition: string;
    revenue_streams: string[];
    pricing_model: string;
    customer_acquisition: string[];
  };
  marketAnalysis: {
    market_size: string;
    competitors: string[];
    competitive_advantage: string;
  };
  feasibility: {
    technical_feasibility: string;
    market_feasibility: string;
    risk_factors: string[];
  };
  noveltyScore: number;
  impact: {
    economic_impact: string;
    social_impact: string;
  };
  mvpPlan: {
    mvp_features: string[];
    first_steps: string[];
  };
  createdAt: string;
}

export function IdeaDetail() {
  const navigate = useNavigate();
  const { id, messageid } = useParams();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(true);
  
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/idea/saved-ideas/${id}`);
        setIdea(response.data.idea);
      } catch (err: any) {
        console.error('Error fetching idea details:', err);
        setError(err.response?.data?.message || 'Failed to load idea details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchIdeaDetails();
    }
  }, [id]);

  // UPDATED: Renamed tabs to fit new model data
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'business', label: 'Business & Market' },
    { id: 'pitch', label: 'Pitch Summary' },
    { id: 'evidence', label: 'Evidence & Signals' },
  ];

  // UPDATED: Pitch slides generated from new fields
  const generatePitchSlides = () => {
    if (!idea) return [];
    return [
      {
        title: idea.solutionName,
        subtitle: idea.problemTitle,
        content: idea.solutionDescription
      },
      {
        title: 'The Problem & Root Cause',
        subtitle: 'What we are solving',
        content: `${idea.problemDescription}\n\nRoot Cause: ${idea.rootCause || 'Not specified'}`
      },
      {
        title: 'Value Proposition',
        subtitle: 'Our competitive advantage',
        content: `${idea.businessModel?.value_proposition || ''}\n\nAdvantage: ${idea.marketAnalysis?.competitive_advantage || ''}`
      },
      {
        title: 'MVP & Next Steps',
        subtitle: 'Path to Launch',
        content: idea.mvpPlan?.first_steps?.length > 0 
          ? idea.mvpPlan.first_steps.join(' • ') 
          : 'Further market research and validation.'
      }
    ];
  };

  const toggleIdeaSave = async (messageId: string | undefined, ideaId: string | number | undefined) => {
      try {
        if (!saved) {
          await axiosInstance.post('idea/saved-ideas', { ideaId, messageId });
        } else {
          await axiosInstance.delete(`idea/saved-ideas/${ ideaId }/${messageId}`);
        }
        setSaved(!saved)
      } catch (error) {
        console.error("Error saving/unsaving idea:", error);
      }
  };

  const sendFeedback = async () => {
    try {
      const response = await axiosInstance.post('/feedback/', {
        rating,
        ideaId: idea?.id,
        text
      })
      if (response.status === 201) {
        toast.success('Feedback submitted successfully!');
        setText('');
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-4">
          <div className="text-red-500 bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
            <p>{error || 'Idea not found.'}</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pitchSlides = generatePitchSlides();

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          {/* Header */}
          <Card variant="elevated" padding="lg" className="mb-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-neutral-900 mb-2">{idea.solutionName}</h2>
                  <p className="subtitle text-neutral-600">{idea.problemTitle}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {idea.noveltyScore !== undefined && (
                    <Badge variant="info" size="md">Novelty Score: {idea.noveltyScore}/10</Badge>
                  )}
                  <Button
                    variant={saved ? 'primary' : 'outlined'}
                    size="md"
                    onClick={async () => toggleIdeaSave(messageid, id)}
                  >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Tag variant="accent">
                  <Globe className="w-3 h-3 inline mr-1"/>
                  {idea.marketRegion}
                </Tag>
                {/* targetUsers is a string in the new model, displaying it as a single tag or splitting if comma-separated */}
                {idea.targetUsers?.split(',').slice(0, 3).map((user, idx) => (
                  <Tag key={idx} variant="secondary">{user.trim()}</Tag>
                ))}
              </div>
            </div>
          </Card>

          {/* Tabs Navigation */}
          <div className="mb-6">
            <div className="border-b border-neutral-200 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">The Problem</h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">{idea.problemDescription}</p>
                  {idea.rootCause && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg text-sm text-red-900 border border-red-100">
                      <strong>Root Cause:</strong> {idea.rootCause}
                    </div>
                  )}
                </Card>

                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">The Solution</h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">{idea.solutionDescription}</p>
                </Card>
                
                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">How it Works & Features</h4>
                  <div className="space-y-4">
                    <div>
                      <h6 className="font-semibold text-neutral-800 mb-2">Key Features</h6>
                      <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                        {idea.keyFeatures?.map((feature, i) => <li key={i}>{feature}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Target Audience</h5>
                  <p className="text-neutral-700">{idea.targetUsers}</p>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Impact</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-neutral-500 uppercase font-semibold">Economic Impact</span>
                      <p className="text-sm text-neutral-700">{idea.impact?.economic_impact || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 uppercase font-semibold">Social Impact</span>
                      <p className="text-sm text-neutral-700">{idea.impact?.social_impact || 'N/A'}</p>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.technologyStack?.length > 0 ? (
                      idea.technologyStack.map((tech, idx) => (
                        <Tag key={idx} variant="secondary">{tech}</Tag>
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">Not specified</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab Content: Business & Market (Replaces old BMC) */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <Card variant="elevated" padding="lg">
                <h4 className="text-neutral-900 mb-2">Business Model & Market Strategy</h4>
                <p className="text-neutral-600">Overview of the monetization strategy and market analysis.</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Value Proposition */}
                <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">Value Proposition</h6>
                  </div>
                  <p className="text-sm text-neutral-700">{idea.businessModel?.value_proposition}</p>
                </Card>

                {/* Revenue Streams */}
                <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">Revenue & Pricing</h6>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p><strong>Model:</strong> {idea.businessModel?.pricing_model}</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      {idea.businessModel?.revenue_streams?.map((stream, i) => <li key={i}>{stream}</li>)}
                    </ul>
                  </div>
                </Card>

                {/* Market & Competitors */}
                <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">Market Analysis</h6>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p><strong>Size:</strong> {idea.marketAnalysis?.market_size}</p>
                    <p><strong>Advantage:</strong> {idea.marketAnalysis?.competitive_advantage}</p>
                    <div className="mt-2">
                      <strong>Competitors:</strong>
                      <ul className="list-disc pl-4 mt-1">
                        {idea.marketAnalysis?.competitors?.map((comp, i) => <li key={i}>{comp}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Customer Acquisition */}
                <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">Customer Acquisition</h6>
                  </div>
                  <ul className="list-disc pl-4 text-sm text-neutral-700 space-y-1">
                    {idea.businessModel?.customer_acquisition?.map((ca, i) => <li key={i}>{ca}</li>)}
                  </ul>
                </Card>
                
                {/* Feasibility & Risks */}
                <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">Feasibility & Risks</h6>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p><strong>Tech Feasibility:</strong> {idea.feasibility?.technical_feasibility}</p>
                    <p><strong>Market Feasibility:</strong> {idea.feasibility?.market_feasibility}</p>
                    <div className="mt-2">
                      <strong>Risks:</strong>
                      <ul className="list-disc pl-4 mt-1">
                        {idea.feasibility?.risk_factors?.map((risk, i) => <li key={i}>{risk}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>

                 {/* MVP Plan */}
                 <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <h6 className="text-neutral-900 flex-1">MVP Plan</h6>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <strong>First Steps:</strong>
                    <ul className="list-disc pl-4 mt-1 mb-2">
                      {idea.mvpPlan?.first_steps?.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                    <strong>MVP Features:</strong>
                    <ul className="list-disc pl-4 mt-1">
                      {idea.mvpPlan?.mvp_features?.map((feat, i) => <li key={i}>{feat}</li>)}
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab Content: Pitch */}
          {activeTab === 'pitch' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Pitch Summary</h4>
                <p className="text-neutral-600">
                  A dynamically generated 4-slide pitch deck structure ready to present
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pitchSlides.map((slide, index) => (
                  <Card key={index} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="info" size="sm">Slide {index + 1}</Badge>
                      </div>
                      <div>
                        <h5 className="text-neutral-900 mb-2">{slide.title}</h5>
                        <p className="text-neutral-600 mb-3 font-medium">{slide.subtitle}</p>
                        <p className="text-neutral-700 whitespace-pre-wrap">{slide.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Evidence & References */}
          {activeTab === 'evidence' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Evidence & Retrieved Startups</h4>
                <p className="text-neutral-600">
                  Market signals and similar startups retrieved during idea generation.
                </p>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Evidence Signals */}
                <div>
                  <h5 className="text-neutral-800 mb-4 border-b pb-2">Evidence Signals</h5>
                  <div className="space-y-3">
                    {idea.evidenceSignals?.length > 0 ? (
                      idea.evidenceSignals.map((signal: any, index: number) => (
                        <Card key={index} variant="bordered" padding="md" className="bg-white">
                           <p className="text-sm text-neutral-700">{typeof signal === 'string' ? signal : JSON.stringify(signal)}</p>
                        </Card>
                      ))
                    ) : (
                      <p className="text-neutral-500 italic">No evidence signals provided.</p>
                    )}
                  </div>
                </div>

                {/* Retrieved Startups */}
                <div>
                  <h5 className="text-neutral-800 mb-4 border-b pb-2">Similar Startups</h5>
                  <div className="space-y-3">
                    {idea.retrivedStartups?.length > 0 ? (
                      idea.retrivedStartups.map((startup: any, index: number) => (
                         <Card key={index} variant="bordered" padding="md" className="bg-white">
                           <p className="text-sm text-neutral-700">{typeof startup === 'string' ? startup : JSON.stringify(startup)}</p>
                        </Card>
                      ))
                    ) : (
                       <p className="text-neutral-500 italic">No similar startups retrieved.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <Card variant="elevated" padding="lg" className="mt-8">
            <h5 className="text-neutral-900 mb-4">How useful is this idea?</h5>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex-1 w-full">
                <textarea
                  placeholder="Share your feedback or suggestions..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={3}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
                <div className="mt-3">
                  <Button variant="primary" size="md" 
                    onClick={() => {
                      sendFeedback();
                    }}
                  >Submit Feedback</Button>
                </div>
              </div>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
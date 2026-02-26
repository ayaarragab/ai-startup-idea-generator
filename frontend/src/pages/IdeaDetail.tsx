import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Make sure this path is correct
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { 
  ArrowLeft,
  Bookmark,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Handshake,
  Package,
  Heart,
  BarChart3,
  Loader2
} from 'lucide-react';

// Define the interface based on your Sequelize Idea model
interface IdeaData {
  id: number;
  messageId: number | null;
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
  academicReferences: any[]; // Adjust type if you store specific objects
  createdAt: string;
}

export function IdeaDetail() {
  const navigate = useNavigate();
  const { id, messageid } = useParams();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(true); // Assuming it's saved since we are viewing it from "Saved Ideas"
  
  // State for fetched data
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the idea data on mount
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bmc', label: 'Business Model Canvas' },
    { id: 'pitch', label: 'Pitch Summary' },
    { id: 'references', label: 'Evidence & References' },
  ];

  const bmcSections = [
    { key: 'keyPartners', title: 'Key Partners', icon: Handshake, color: 'bg-purple-100 text-purple-700' },
    { key: 'keyActivities', title: 'Key Activities', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700' },
    { key: 'keyResources', title: 'Key Resources', icon: Package, color: 'bg-green-100 text-green-700' },
    { key: 'valueProposition', title: 'Value Proposition', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
    { key: 'customerRelationships', title: 'Customer Relationships', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { key: 'channels', title: 'Channels', icon: TrendingUp, color: 'bg-indigo-100 text-indigo-700' },
    { key: 'customerSegments', title: 'Customer Segments', icon: Users, color: 'bg-cyan-100 text-cyan-700' },
    { key: 'costStructure', title: 'Cost Structure', icon: DollarSign, color: 'bg-red-100 text-red-700' },
    { key: 'revenueStreams', title: 'Revenue Streams', icon: BarChart3, color: 'bg-emerald-100 text-emerald-700' },
  ];

  // Helper to generate pitch slides dynamically from available model fields
  const generatePitchSlides = () => {
    if (!idea) return [];
    return [
      {
        title: idea.name,
        subtitle: idea.subtitle,
        content: idea.description
      },
      {
        title: 'The Problem',
        subtitle: 'What we are solving',
        content: idea.problem
      },
      {
        title: 'Our Solution',
        subtitle: 'How we fix it',
        content: idea.solution
      },
      {
        title: 'Next Steps',
        subtitle: 'Path to Launch',
        content: idea.nextSteps && idea.nextSteps.length > 0 
          ? idea.nextSteps.join(' • ') 
          : 'Further market research and validation.'
      }
    ];
  };

  const toggleIdeaSave = async (messageId: string | undefined, ideaId: string | number | undefined) => {
      try {
        if (!saved) {
          await axiosInstance.post('idea/saved-ideas', { 
            ideaId,
            messageId
          });
          
        } else {
          await axiosInstance.delete(`idea/saved-ideas/${ ideaId }/${messageId}`);
        }
        setSaved(!saved)
      } catch (error) {
        console.error("Error saving/unsaving idea:", error);
      }
  };

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
          
          {/* Back Button */}
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
                  <h2 className="text-neutral-900 mb-2">{idea.name}</h2>
                  <p className="subtitle text-neutral-600">{idea.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={saved ? 'primary' : 'outlined'}
                    size="md"
                    onClick={async () => {
                      toggleIdeaSave(messageid, id);
                    }}
                  >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                 {/* Dynamically displaying top customer segments as tags since 'targetUsers' isn't explicitly in the model */}
                {idea.customerSegments?.slice(0, 3).map((segment, idx) => (
                  <Tag key={idx} variant="accent">{segment}</Tag>
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
                  <h4 className="text-neutral-900 mb-4">Problem</h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">{idea.problem}</p>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">Solution</h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">{idea.solution}</p>
                </Card>
                
                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">Description & Impact</h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">{idea.description}</p>
                </Card>
              </div>

              <div className="space-y-6">
                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Target Audience</h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.customerSegments?.length > 0 ? (
                       idea.customerSegments.map((segment, idx) => (
                        <Tag key={idx} variant="accent">{segment}</Tag>
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">Not specified</p>
                    )}
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Key Channels</h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.channels?.length > 0 ? (
                      idea.channels.map((channel, idx) => (
                        <Tag key={idx} variant="secondary">{channel}</Tag>
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">Not specified</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab Content: BMC */}
          {activeTab === 'bmc' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Business Model Canvas</h4>
                <p className="text-neutral-600">
                  A complete business model breakdown across all 9 building blocks
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bmcSections.map((section) => {
                  const items = idea[section.key as keyof IdeaData] as string[];
                  return (
                    <Card key={section.key} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}>
                          <section.icon className="w-5 h-5" />
                        </div>
                        <h6 className="text-neutral-900 flex-1">{section.title}</h6>
                      </div>
                      <ul className="space-y-2">
                        {items && items.length > 0 ? (
                          items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-neutral-700">
                              <span className="text-neutral-400 mt-1">•</span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-neutral-400 italic text-sm">Not defined</li>
                        )}
                      </ul>
                    </Card>
                  );
                })}
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

          {/* Tab Content: References */}
          {activeTab === 'references' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Evidence & Academic References</h4>
                <p className="text-neutral-600">
                  Supporting research papers and data sources used to generate this idea
                </p>
              </Card>

              <div className="space-y-4">
                {idea.academicReferences && idea.academicReferences.length > 0 ? (
                  idea.academicReferences.map((ref: any, index: number) => (
                    <Card key={index} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          {/* Handling whether references are stored as strings or objects */}
                          <h6 className="text-neutral-900 mb-2">
                            {typeof ref === 'string' ? ref : ref.title || 'Reference Document'}
                          </h6>
                          {typeof ref !== 'string' && ref.source && (
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-neutral-600">{ref.source}</span>
                            </div>
                          )}
                        </div>
                        {typeof ref !== 'string' && ref.link && (
                          <Button 
                            variant="outlined" 
                            size="sm"
                            onClick={() => window.open(ref.link, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Source
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card variant="bordered" padding="md">
                    <p className="text-neutral-500 text-center py-4">No academic references provided for this idea.</p>
                  </Card>
                )}
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
                />
                <div className="mt-3">
                  <Button variant="primary" size="md">Submit Feedback</Button>
                </div>
              </div>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
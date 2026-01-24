import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { 
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  Star,
  Lightbulb,
  Users,
  DollarSign,
  Target,
  Briefcase,
  TrendingUp,
  FileText,
  BookOpen,
  Edit,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Handshake,
  Package,
  Heart,
  BarChart3,
  Copy
} from 'lucide-react';

interface IdeaDetailProps {
  onNavigate: (page: string) => void;
}

export function IdeaDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  // Mock generated idea data
  const idea = {
    name: 'MediConnect Egypt',
    tagline: 'Bridging Healthcare Gaps in Rural Egyptian Communities',
    problem: 'Rural Egyptian communities face severe healthcare access challenges, with limited medical facilities, long travel distances, and shortage of specialized doctors. Over 60% of rural residents must travel more than 50km to access quality healthcare.',
    solution: 'A telemedicine platform connecting rural patients with certified Egyptian doctors through mobile and web interfaces. Features include symptom checking, video consultations, prescription delivery, and health record management - all in Arabic with dialect support.',
    impact: 'Reaching 15+ million underserved Egyptians in rural governorates, reducing healthcare costs by 40%, and enabling preventive care through regular virtual checkups. Partnering with local pharmacies for prescription fulfillment.',
    sectors: ['Healthcare', 'Technology', 'Rural Development'],
    targetUsers: ['Rural Communities', 'Doctors', 'Pharmacies'],
    bmc: {
      keyPartners: [
        'Egyptian Medical Syndicate',
        'Local pharmacies network',
        'Ministry of Health & Population',
        'Telecom providers (Orange, Vodafone)'
      ],
      keyActivities: [
        'Platform development & maintenance',
        'Doctor onboarding & verification',
        'Patient support & education',
        'Partnership management'
      ],
      keyResources: [
        'Medical AI for symptom checking',
        'Secure video infrastructure',
        'Medical database & records',
        'Arabic NLP technology'
      ],
      valueProposition: [
        'Accessible healthcare for rural Egyptians',
        'Affordable consultation fees',
        'Arabic & dialect support',
        'Prescription delivery integration',
        'Health records in one place'
      ],
      customerRelationships: [
        '24/7 patient support hotline',
        'Community health ambassadors',
        'Automated follow-up reminders',
        'Doctor rating & feedback system'
      ],
      channels: [
        'Mobile app (Android/iOS)',
        'Web platform',
        'SMS for feature phones',
        'Local community centers',
        'Social media outreach'
      ],
      customerSegments: [
        'Rural patients (primary)',
        'Urban patients seeking convenience',
        'Chronic disease patients',
        'Elderly population'
      ],
      costStructure: [
        'Technology infrastructure & hosting',
        'Doctor payment commissions',
        'Marketing & user acquisition',
        'Customer support operations',
        'Regulatory compliance'
      ],
      revenueStreams: [
        'Consultation fees (20% commission)',
        'Subscription plans for families',
        'Corporate health packages',
        'Government partnerships',
        'Premium features (specialists)'
      ]
    },
    pitch: [
      {
        title: 'MediConnect Egypt',
        subtitle: 'Bridging Healthcare Gaps in Rural Communities',
        content: 'Accessible, affordable telemedicine for every Egyptian'
      },
      {
        title: 'The Problem',
        subtitle: 'Healthcare Desert in Rural Egypt',
        content: '60% of rural residents travel 50+ km for healthcare • Limited specialized doctors • High costs • Language barriers'
      },
      {
        title: 'Our Solution',
        subtitle: 'Telemedicine Made for Egypt',
        content: 'Video consultations with certified doctors • Arabic dialect support • Prescription delivery • Affordable pricing'
      },
      {
        title: 'Next Steps',
        subtitle: 'Path to Launch',
        content: 'Pilot in 3 governorates • Doctor partnerships • Ministry approval • Seed funding ($500K)'
      }
    ],
    references: [
      {
        title: 'Telemedicine adoption in developing countries: challenges and opportunities',
        source: 'Journal of Medical Internet Research',
        link: 'https://scholar.google.com',
      },
      {
        title: 'Healthcare accessibility in rural Egypt: A systematic review',
        source: 'Egyptian Journal of Community Medicine',
        link: 'https://scholar.google.com',
      },
      {
        title: 'Mobile health interventions in Middle East: Success factors',
        source: 'BMC Health Services Research',
        link: 'https://scholar.google.com',
      },
      {
        title: 'Arabic NLP for healthcare applications',
        source: 'arXiv.org',
        link: 'https://arxiv.org',
      }
    ]
  };

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

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card variant="elevated" padding="lg" className="mb-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-neutral-900 mb-2">{idea.name}</h2>
                  <p className="subtitle text-neutral-600">{idea.tagline}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={saved ? 'primary' : 'outlined'}
                    size="md"
                    onClick={() => setSaved(!saved)}
                  >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {idea.sectors.map(sector => (
                  <Tag key={sector} variant="secondary">{sector}</Tag>
                ))}
                {idea.targetUsers.map(user => (
                  <Tag key={user} variant="accent">{user}</Tag>
                ))}
              </div>

            </div>
          </Card>

          {/* Tabs */}
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">Problem</h4>
                  <p className="text-neutral-700">{idea.problem}</p>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h4 className="text-neutral-900 mb-4">Solution</h4>
                  <p className="text-neutral-700">{idea.solution}</p>
                </Card>
              </div>

              <div className="space-y-6">
                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Quick Stats</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Feasibility</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Usefulness</span>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Target Sectors</h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.sectors.map(sector => (
                      <Tag key={sector} variant="secondary">{sector}</Tag>
                    ))}
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <h5 className="text-neutral-900 mb-4">Target Users</h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.targetUsers.map(user => (
                      <Tag key={user} variant="accent">{user}</Tag>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'bmc' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Business Model Canvas</h4>
                <p className="text-neutral-600">
                  A complete business model breakdown across all 9 building blocks
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bmcSections.map((section) => (
                  <Card key={section.key} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <h6 className="text-neutral-900 flex-1">{section.title}</h6>
                    </div>
                    <ul className="space-y-2">
                      {idea.bmc[section.key as keyof typeof idea.bmc].map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-neutral-700">
                          <span className="text-neutral-400 mt-1">•</span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pitch' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Pitch Summary</h4>
                <p className="text-neutral-600">
                  A 5-slide pitch deck structure ready to present
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {idea.pitch.map((slide, index) => (
                  <Card key={index} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="info" size="sm">Slide {index + 1}</Badge>
                      </div>
                      <div>
                        <h5 className="text-neutral-900 mb-2">{slide.title}</h5>
                        <p className="text-neutral-600 mb-3">{slide.subtitle}</p>
                        <p className="text-neutral-700">{slide.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'references' && (
            <div>
              <Card variant="elevated" padding="lg" className="mb-6">
                <h4 className="text-neutral-900 mb-2">Evidence & Academic References</h4>
                <p className="text-neutral-600">
                  Supporting research papers and data sources used to generate this idea
                </p>
              </Card>

              <div className="space-y-4">
                {idea.references.map((ref, index) => (
                  <Card key={index} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h6 className="text-neutral-900 mb-2">{ref.title}</h6>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-neutral-600">{ref.source}</span>
                        </div>
                      </div>
                      <Button variant="outlined" size="sm">
                        <ExternalLink className="w-4 h-4" />
                        View Source
                      </Button>
                    </div>
                  </Card>
                ))}
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { 
  Lightbulb, 
  FileText, 
  Target, 
  BookOpen, 
  ArrowRight,
  Database,
  Brain,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Lightbulb,
      title: 'Novel Startup Idea',
      description: 'AI-generated innovative startup concepts tailored for the Egyptian market',
      tags: ['AI-generated', 'Egypt-focused'],
    },
    {
      icon: FileText,
      title: 'Business Model Canvas',
      description: 'Complete BMC with all 9 building blocks structured and ready',
      tags: ['Strategic', 'Comprehensive'],
    },
    {
      icon: Target,
      title: 'Pitch Summary',
      description: 'Professional pitch deck summary to present your idea confidently',
      tags: ['Presentation-ready'],
    },
    {
      icon: BookOpen,
      title: 'Academic References',
      description: 'Supporting research papers and explainability for credibility',
      tags: ['Research-backed', 'Explainable AI'],
    },
  ];

  const pipelineSteps = [
    {
      number: 1,
      icon: Database,
      title: 'Analyze Existing Ideas',
      description: 'Collect and analyze startup ideas from LinkedIn, research papers, hackathons, and news sources',
      color: 'bg-primary-100 text-primary-700',
    },
    {
      number: 2,
      icon: Brain,
      title: 'Detect Egyptian Needs',
      description: 'Identify current societal needs from social media, newspapers, and government reports',
      color: 'bg-secondary-100 text-secondary-700',
    },
    {
      number: 3,
      icon: Filter,
      title: 'Filter & Match Skills',
      description: 'Match unsolved problems to your skills and filter out already-solved challenges',
      color: 'bg-accent-100 text-accent-700',
    },
    {
      number: 4,
      icon: Sparkles,
      title: 'Generate Final Idea',
      description: 'Create complete startup idea with BMC, pitch, references, and evaluation metrics',
      color: 'bg-yellow-100 text-yellow-700',
    },
  ];

  const stats = [
    { label: 'Local Problems Analyzed', value: '1,200+', icon: TrendingUp },
    { label: 'Egyptian Data Sources', value: '50+', icon: Database },
    { label: 'Target Sectors', value: '12', icon: MapPin },
    { label: 'Ideas Generated', value: '340+', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span>NLP + Generative AI for Egypt</span>
              </div>
              
              <h1 className="text-neutral-900">
                AI Startup Idea Generator for the Egyptian Market
              </h1>
              
              <p className="subtitle text-neutral-600">
                A web-based system that uses NLP + Generative AI to create original, market-fit startup ideas specifically designed for Egypt's unique challenges and opportunities.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-neutral-700">Innovative startup idea tailored to Egyptian market</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-neutral-700">Full Business Model Canvas with all 9 blocks</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-neutral-700">Professional pitch summary ready to present</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-neutral-700">Supporting academic references and explainability</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/generate')}
                >
                  Generate My Idea
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outlined" 
                  size="lg"
                  onClick={() => navigate('/how-it-works')}
                >
                  See How It Works
                </Button>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="hidden lg:block">
              <Card variant="elevated" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <h5 className="text-neutral-900">4-Model Pipeline</h5>
                    <Tag variant="accent">AI-Powered</Tag>
                  </div>
                  {pipelineSteps.map((step, index) => (
                    <div key={step.number} className="flex gap-4">
                      <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-neutral-900">Model {step.number}</span>
                        </div>
                        <p className="text-neutral-600">{step.title}</p>
                      </div>
                      {index < pipelineSteps.length - 1 && (
                        <div className="absolute left-6 mt-12 h-8 w-0.5 bg-neutral-200" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-neutral-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-3">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-neutral-900 mb-1">{stat.value}</div>
                <p className="text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-neutral-900 mb-4">What You Get</h2>
            <p className="subtitle text-neutral-600 max-w-2xl mx-auto">
              Our AI system delivers comprehensive startup materials ready for implementation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h5 className="text-neutral-900 mb-2">{feature.title}</h5>
                    <p className="text-neutral-600 mb-4">{feature.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <Tag key={tag} variant="primary" size="sm">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Egypt-Focused Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary-50 to-accent-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-neutral-900">Why Egypt-Focused?</h2>
              <p className="text-neutral-700">
                Egypt faces unique societal challenges and opportunities that generic startup ideas cannot address. Our system specifically analyzes Egyptian data sources to identify unmet needs and create contextually relevant solutions.
              </p>
              <p className="text-neutral-700">
                By focusing on local problems, cultural context, and market dynamics, we help entrepreneurs build startups that truly serve Egyptian communities and have higher chances of success.
              </p>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                <MapPin className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h6 className="text-neutral-900 mb-1">Local Context Matters</h6>
                  <p className="text-neutral-600">
                    Our AI understands Egyptian culture, regulations, infrastructure, and social dynamics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card variant="elevated" padding="md">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <h6 className="text-neutral-900">100M+ Population</h6>
                  <p className="text-neutral-600">Massive market potential</p>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-600" />
                  </div>
                  <h6 className="text-neutral-900">Growing Tech Scene</h6>
                  <p className="text-neutral-600">Emerging opportunities</p>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent-600" />
                  </div>
                  <h6 className="text-neutral-900">Unmet Needs</h6>
                  <p className="text-neutral-600">Vast problem space</p>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h6 className="text-neutral-900">Innovation Gap</h6>
                  <p className="text-neutral-600">Room for disruption</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-neutral-900 mb-4">How It Works</h2>
            <p className="subtitle text-neutral-600 max-w-2xl mx-auto">
              Our four-model AI pipeline transforms Egyptian market data into actionable startup ideas
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {pipelineSteps.map((step, index) => (
              <Card key={step.number} variant="bordered" padding="lg" className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className={`w-16 h-16 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-neutral-900">Model {step.number}</span>
                      <span className="text-neutral-400">•</span>
                      <h5 className="text-neutral-900">{step.title}</h5>
                    </div>
                    <p className="text-neutral-600">{step.description}</p>
                  </div>
                  <div className="hidden md:block text-neutral-300">
                    {index < pipelineSteps.length - 1 && <ArrowRight className="w-6 h-6" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/how-it-works')}
            >
              Learn More About Our Models
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-white">Ready to Generate Your Startup Idea?</h2>
            <p className="subtitle text-white/90">
              Start your entrepreneurial journey with an AI-generated startup idea tailored for the Egyptian market
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/generate')}
                className="bg-white text-primary-600 hover:bg-neutral-100"
              >
                Generate My Idea
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outlined" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="border-white text-white hover:bg-white/10"
              >
                View Saved Ideas
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
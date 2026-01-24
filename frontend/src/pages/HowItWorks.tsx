import React from 'react';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Database, Brain, Filter, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  const models = [
    {
      number: 1,
      icon: Database,
      title: 'Idea Collection and Analysis',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-700',
      description: 'The foundation of our pipeline - collecting and analyzing existing startup ideas from diverse sources.',
      dataSources: [
        'LinkedIn posts and articles',
        'Academic research papers',
        'Hackathon submissions',
        'Tech news and blogs',
        'Startup databases (Crunchbase, AngelList)',
        'Y Combinator and similar accelerators'
      ],
      process: [
        'Web scraping and API integration',
        'Duplicate detection using NLP',
        'Problem statement extraction',
        'Categorization by sector and domain',
        'Trend analysis and pattern recognition'
      ],
      output: 'A comprehensive database of existing startup ideas with extracted problem statements and market insights.',
    },
    {
      number: 2,
      icon: Brain,
      title: 'Egyptian Needs Identification',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-100',
      textColor: 'text-secondary-700',
      description: 'Understanding Egypt\'s unique challenges by analyzing local data sources to identify unmet societal needs.',
      dataSources: [
        'Arabic social media (Twitter, Facebook)',
        'Egyptian newspapers and media',
        'Government reports and statistics',
        'NGO publications and surveys',
        'Community forums and discussions',
        'Local research institutions'
      ],
      process: [
        'Arabic NLP for sentiment analysis',
        'Topic modeling and clustering',
        'Need prioritization by impact',
        'Geographic mapping of problems',
        'Temporal trend analysis',
        'Cross-validation with official data'
      ],
      output: 'A structured list of current Egyptian societal needs ranked by severity, frequency, and geographic distribution.',
    },
    {
      number: 3,
      icon: Filter,
      title: 'Problem Filtering & Skill Matching',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-100',
      textColor: 'text-accent-700',
      description: 'Intelligent matching of unsolved Egyptian problems with your skills while filtering out already-solved challenges.',
      dataSources: [
        'User skill profiles',
        'Existing Egyptian startups',
        'Government initiatives database',
        'International development projects',
        'Market competition analysis'
      ],
      process: [
        'Problem-solution gap analysis',
        'Skill compatibility scoring',
        'Market saturation detection',
        'Feasibility assessment',
        'Resource requirement estimation',
        'Competitive landscape mapping'
      ],
      output: 'A curated set of unsolved problems matched to user capabilities with feasibility scores.',
    },
    {
      number: 4,
      icon: Sparkles,
      title: 'Generative AI for Final Startup Idea',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      description: 'Creating the complete startup package using generative AI with evaluation metrics for quality assurance.',
      dataSources: [
        'Filtered problems from Model 3',
        'Business model templates',
        'Academic research database',
        'Successful startup case studies',
        'Egyptian market data'
      ],
      process: [
        'GPT-based idea generation',
        'Business Model Canvas creation',
        'Pitch deck summary generation',
        'Reference paper matching',
        'Novelty scoring (uniqueness)',
        'Feasibility scoring (practicality)',
        'Usefulness scoring (impact)',
        'GraphEval metrics for quality'
      ],
      output: 'Complete startup idea with BMC, pitch summary, academic references, and evaluation scores.',
    },
  ];

  const evaluationMetrics = [
    {
      name: 'Novelty Score',
      description: 'Measures how unique and innovative the idea is compared to existing solutions',
      range: '0-10',
      criteria: ['Uniqueness of approach', 'Innovation level', 'Market differentiation']
    },
    {
      name: 'Feasibility Score',
      description: 'Assesses how practical and achievable the idea is given current resources and constraints',
      range: '0-10',
      criteria: ['Technical feasibility', 'Resource requirements', 'Implementation complexity']
    },
    {
      name: 'Usefulness Score',
      description: 'Evaluates the potential impact and value the idea brings to the target audience',
      range: '0-10',
      criteria: ['Problem severity', 'Market size', 'Social impact potential']
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-neutral-900 mb-4">How Our Four-Model Pipeline Works</h1>
            <p className="subtitle text-neutral-600 max-w-3xl mx-auto">
              A sophisticated AI system that transforms Egyptian market data into actionable, validated startup ideas
            </p>
          </div>

          {/* Technology Stack */}
          <Card variant="elevated" padding="lg" className="mt-12">
            <h4 className="text-neutral-900 mb-6">Technology & Methodology</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="text-neutral-900 mb-3">NLP & AI Technologies</h6>
                <div className="flex flex-wrap gap-2">
                  <Tag variant="primary">GPT-4</Tag>
                  <Tag variant="primary">Arabic NLP</Tag>
                  <Tag variant="primary">Sentiment Analysis</Tag>
                  <Tag variant="primary">Topic Modeling</Tag>
                  <Tag variant="primary">Entity Recognition</Tag>
                </div>
              </div>
              <div>
                <h6 className="text-neutral-900 mb-3">Evaluation Methods</h6>
                <div className="flex flex-wrap gap-2">
                  <Tag variant="secondary">GraphEval</Tag>
                  <Tag variant="secondary">Similarity Metrics</Tag>
                  <Tag variant="secondary">Expert Validation</Tag>
                  <Tag variant="secondary">Market Analysis</Tag>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

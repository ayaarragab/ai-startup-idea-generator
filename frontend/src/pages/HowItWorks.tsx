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

          {/* Pipeline Overview */}
          <Card variant="elevated" padding="lg" className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {models.map((model, index) => (
                <React.Fragment key={model.number}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-3`}>
                      <model.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-neutral-900 mb-1">Model {model.number}</div>
                    <p className="text-neutral-600 max-w-[120px]">{model.title}</p>
                  </div>
                  {index < models.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-neutral-300 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>

          {/* Detailed Model Sections */}
          <div className="space-y-12">
            {models.map((model, index) => (
              <div key={model.number} className="scroll-mt-24" id={`model-${model.number}`}>
                <Card variant="elevated" padding="lg">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center flex-shrink-0`}>
                        <model.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-neutral-600">Model {model.number}</span>
                          <span className="text-neutral-400">•</span>
                          <Tag variant="primary">{['Foundation', 'Discovery', 'Matching', 'Generation'][index]}</Tag>
                        </div>
                        <h3 className="text-neutral-900 mb-2">{model.title}</h3>
                        <p className="text-neutral-600">{model.description}</p>
                      </div>
                    </div>

                    {/* Data Sources */}
                    <div>
                      <h5 className="text-neutral-900 mb-3">Data Sources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {model.dataSources.map((source, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                            <span className="text-neutral-700">{source}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Process */}
                    <div className={`${model.bgColor} rounded-lg p-6`}>
                      <h5 className="text-neutral-900 mb-4">Processing Steps</h5>
                      <div className="space-y-3">
                        {model.process.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full ${model.color} bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-white`}>
                              {idx + 1}
                            </div>
                            <span className="text-neutral-700 flex-1">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Output */}
                    <div className="border-t border-neutral-200 pt-6">
                      <h6 className="text-neutral-900 mb-2">Output</h6>
                      <p className="text-neutral-700">{model.output}</p>
                    </div>
                  </div>
                </Card>

                {/* Arrow between models */}
                {index < models.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-neutral-300 to-transparent" />
                      <ArrowRight className="w-6 h-6 text-neutral-400 rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Evaluation Metrics Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-neutral-900 mb-3">Evaluation & Quality Metrics</h3>
              <p className="text-neutral-600">
                Every generated idea is evaluated using multiple metrics to ensure quality and relevance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {evaluationMetrics.map((metric) => (
                <Card key={metric.name} variant="bordered" padding="lg" className="hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-neutral-900 mb-2">{metric.name}</h5>
                      <p className="text-neutral-600">{metric.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">Range:</span>
                      <Tag variant="accent" size="sm">{metric.range}</Tag>
                    </div>
                    <div>
                      <h6 className="text-neutral-900 mb-2">Criteria:</h6>
                      <ul className="space-y-1">
                        {metric.criteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-neutral-700">
                            <span className="text-neutral-400 mt-1">•</span>
                            <span className="flex-1">{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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

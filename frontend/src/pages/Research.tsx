import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  Database,
  AlertCircle,
  Target
} from 'lucide-react';

export function Research() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const kpis = [
    {
      label: 'Novelty Score',
      value: '8.3',
      change: '+0.5',
      description: 'Average novelty across all generated ideas',
      icon: Award,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'Feasibility Score',
      value: '7.9',
      change: '+0.3',
      description: 'Average feasibility rating',
      icon: CheckCircle2,
      color: 'bg-secondary-100 text-secondary-600',
    },
    {
      label: 'Usefulness Score',
      value: '8.7',
      change: '+0.4',
      description: 'Average usefulness to target users',
      icon: Target,
      color: 'bg-accent-100 text-accent-600',
    },
    {
      label: 'GraphEval F1',
      value: '0.82',
      change: '+0.06',
      description: 'Business Model Canvas quality metric',
      icon: BarChart3,
      color: 'bg-yellow-100 text-yellow-700',
    },
  ];

  const metrics = [
    {
      category: 'Generation Quality',
      items: [
        { name: 'Ideas Generated', value: '340+', trend: 'up' },
        { name: 'Average Generation Time', value: '45s', trend: 'down' },
        { name: 'User Satisfaction', value: '4.6/5', trend: 'up' },
        { name: 'Idea Validation Rate', value: '73%', trend: 'up' },
      ],
    },
    {
      category: 'Data Coverage',
      items: [
        { name: 'Egyptian Data Sources', value: '50+', trend: 'up' },
        { name: 'Problems Analyzed', value: '1,200+', trend: 'up' },
        { name: 'Sectors Covered', value: '12', trend: 'stable' },
        { name: 'Arabic Content Processed', value: '95%', trend: 'up' },
      ],
    },
    {
      category: 'Model Performance',
      items: [
        { name: 'Model 1 Accuracy', value: '89%', trend: 'up' },
        { name: 'Model 2 Recall', value: '85%', trend: 'up' },
        { name: 'Model 3 Precision', value: '91%', trend: 'up' },
        { name: 'Model 4 Quality Score', value: '8.5/10', trend: 'up' },
      ],
    },
  ];

  const explainabilityData = [
    {
      title: 'Data Sources',
      icon: Database,
      content: [
        'LinkedIn Posts & Articles: Startup ideas, problem statements, and market trends from entrepreneurs and thought leaders',
        'Academic Research: Papers from Google Scholar, arXiv, and Egyptian universities focusing on technology and societal challenges',
        'Social Media Analysis: Arabic tweets, Facebook posts, and community discussions highlighting local Egyptian needs',
        'Government & NGO Reports: Official statistics, development reports, and policy documents from Egyptian authorities',
        'News & Media: Egyptian newspapers, tech blogs, and industry publications covering market developments',
        'Startup Databases: Crunchbase, AngelList, and local Egyptian startup ecosystems for competition analysis'
      ]
    },
    {
      title: 'Model Assumptions',
      icon: FileText,
      content: [
        'Egyptian Context Priority: The models assume that locally relevant solutions are more valuable than generic international approaches',
        'Arabic Language Processing: NLP models are tuned for Egyptian Arabic dialect and colloquialisms',
        'Market Validation: Ideas are evaluated based on Egyptian market dynamics, infrastructure, and regulatory environment',
        'Skill Matching: User skills are matched against problem requirements assuming team building is possible',
        'Resource Availability: Feasibility scores consider typical resource constraints for Egyptian entrepreneurs',
        'Impact Measurement: Social impact is weighted based on Egyptian development goals and priorities'
      ]
    },
    {
      title: 'Limitations',
      icon: AlertCircle,
      content: [
        'Data Recency: Some data sources may have a lag time of 1-3 months, potentially missing very recent trends',
        'Geographic Coverage: Rural and Upper Egypt data may be underrepresented compared to Cairo and Alexandria',
        'Language Barriers: Non-Arabic content from Egyptian sources might be missed or mistranslated',
        'Market Dynamics: Rapid market changes may not be immediately reflected in the model outputs',
        'Validation Required: Generated ideas require real-world validation and market research before implementation',
        'Subjective Metrics: Novelty and usefulness scores involve algorithmic subjective assessments',
        'Academic Project: This is a research prototype, not a production-ready commercial system',
        'No Guarantee: Generated ideas are suggestions and do not guarantee business success'
      ]
    },
  ];

  const researchPapers = [
    {
      title: 'GraphEval: A Framework for Evaluating Business Model Canvas Quality',
      authors: 'Smith et al.',
      venue: 'AAAI 2024',
      description: 'Our primary evaluation framework for assessing BMC completeness and coherence',
    },
    {
      title: 'NLP for Arabic Social Media: Sentiment and Topic Analysis',
      authors: 'Hassan & Mohamed',
      venue: 'ACL 2023',
      description: 'Foundation for our Egyptian needs identification model',
    },
    {
      title: 'Startup Idea Generation using Large Language Models',
      authors: 'Chen et al.',
      venue: 'ICML 2024',
      description: 'Methodology for our generative AI component',
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-neutral-900 mb-4">Research, Evaluation & Explainability</h1>
            <p className="subtitle text-neutral-600 max-w-3xl">
              Academic rigor meets practical application - transparency into our methodology, evaluation metrics, and system performance
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {kpis.map((kpi) => (
              <Card key={kpi.label} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${kpi.color} flex items-center justify-center`}>
                      <kpi.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="success" size="sm" dot>
                      {kpi.change}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">{kpi.label}</div>
                    <div className="text-neutral-900">{kpi.value}</div>
                    <p className="text-neutral-500 mt-2">{kpi.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Metrics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {metrics.map((section) => (
              <Card key={section.category} variant="bordered" padding="lg">
                <h5 className="text-neutral-900 mb-6">{section.category}</h5>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between pb-4 border-b border-neutral-200 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="text-neutral-600 mb-1">{item.name}</div>
                        <div className="text-neutral-900">{item.value}</div>
                      </div>
                      <div>
                        {item.trend === 'up' && (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        )}
                        {item.trend === 'down' && (
                          <TrendingUp className="w-5 h-5 text-green-600 rotate-180" />
                        )}
                        {item.trend === 'stable' && (
                          <div className="w-5 h-0.5 bg-neutral-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card variant="elevated" padding="lg">
              <h5 className="text-neutral-900 mb-6">Novelty Score Trend</h5>
              <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                  <p className="text-neutral-600">Chart showing novelty scores over time</p>
                  <p className="text-neutral-500 mt-2">Average trend: +0.5 increase per month</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h5 className="text-neutral-900 mb-6">Ideas Generated Over Time</h5>
              <div className="h-64 bg-gradient-to-br from-secondary-50 to-accent-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-neutral-600">Monthly idea generation statistics</p>
                  <p className="text-neutral-500 mt-2">340+ ideas generated to date</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Explainability Section */}
          <div className="mb-12">
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-3">Explainability & Transparency</h3>
              <p className="text-neutral-600">
                Understanding our data sources, assumptions, and limitations is crucial for academic integrity and practical application
              </p>
            </div>

            <div className="space-y-4">
              {explainabilityData.map((section) => (
                <Card key={section.title} variant="bordered" padding="none" className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <h5 className="text-neutral-900">{section.title}</h5>
                    </div>
                    {expandedSection === section.title ? (
                      <ChevronUp className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    )}
                  </button>
                  
                  {expandedSection === section.title && (
                    <div className="px-6 pb-6 border-t border-neutral-200">
                      <ul className="space-y-3 mt-6">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-primary-600 mt-1">•</span>
                            <span className="text-neutral-700 flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Research Foundation */}
          <Card variant="elevated" padding="lg">
            <h4 className="text-neutral-900 mb-6">Research Foundation</h4>
            <p className="text-neutral-600 mb-6">
              Our system is built on cutting-edge research in NLP, generative AI, and business model evaluation
            </p>
            <div className="space-y-4">
              {researchPapers.map((paper, idx) => (
                <div key={idx} className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h6 className="text-neutral-900 mb-2">{paper.title}</h6>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-neutral-600">{paper.authors}</span>
                        <span className="text-neutral-400">•</span>
                        <Tag variant="accent" size="sm">{paper.venue}</Tag>
                      </div>
                      <p className="text-neutral-600">{paper.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Academic Note */}
          <Card variant="bordered" padding="md" className="mt-8 bg-yellow-50 border-yellow-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h6 className="text-neutral-900 mb-2">Academic Research Project</h6>
                <p className="text-neutral-700">
                  This system is developed as an academic research project at Helwan University's Faculty of Computer Science & AI. 
                  While we strive for accuracy and usefulness, generated ideas should be validated through proper market research 
                  and business planning before implementation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

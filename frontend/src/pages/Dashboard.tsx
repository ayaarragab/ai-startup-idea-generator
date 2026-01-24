import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tag } from '../components/Tag';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { 
  Search, 
  Plus, 
  Grid, 
  List,
  Eye,
  Trash2,
  Calendar,
  TrendingUp,
  Bookmark,
  Clock,
  Filter,
  Download,
  Share2
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  // Mock saved ideas
  const savedIdeas = [
    {
      id: 1,
      name: 'MediConnect Egypt',
      description: 'Telemedicine platform for rural Egyptian communities',
      sector: 'Healthcare',
      dateGenerated: '2025-12-01',
      tags: ['Healthcare', 'Rural Development'],
    },
    {
      id: 2,
      name: 'EduBridge',
      description: 'AI-powered tutoring matching students with teachers',
      sector: 'Education',
      dateGenerated: '2025-11-28',
      tags: ['Education', 'Technology'],
    },
    {
      id: 3,
      name: 'FarmSmart Egypt',
      description: 'IoT-based precision agriculture for small Egyptian farms',
      sector: 'Agriculture',
      dateGenerated: '2025-11-25',
      tags: ['Agriculture', 'IoT', 'Sustainability'],
    },
    {
      id: 4,
      name: 'WasteWise',
      description: 'Waste collection optimization using AI routing',
      sector: 'Environment',
      dateGenerated: '2025-11-20',
      tags: ['Environment', 'Smart Cities'],
    },
  ];

  const sectors = ['all', 'Healthcare', 'Education', 'Agriculture', 'Environment', 'FinTech', 'Transportation'];

  const stats = [
    {
      label: 'Total Ideas',
      value: savedIdeas.length.toString(),
      icon: Bookmark,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'This Month',
      value: '4',
      icon: Calendar,
      color: 'bg-accent-100 text-accent-600',
    },
  ];

  const filteredIdeas = savedIdeas.filter(idea => {
    const matchesSearch = idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || idea.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-neutral-900 mb-2">Saved Ideas</h2>
              <p className="text-neutral-600">
                Manage and review your generated startup ideas
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => navigate('/generate')}
            >
              <Plus className="w-5 h-5" />
              Generate New Idea
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} variant="bordered" padding="md">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-neutral-900">{stat.value}</div>
                    <div className="text-neutral-600">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card variant="bordered" padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by idea name, sector, or keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'all' ? 'All Sectors' : sector}
                    </option>
                  ))}
                </select>
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 border-l border-neutral-300 ${
                      viewMode === 'list'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Ideas Display */}
        {filteredIdeas.length === 0 ? (
          <Card variant="elevated" padding="none">
            <EmptyState
              icon={Bookmark}
              title="No ideas found"
              description={searchQuery || selectedSector !== 'all' 
                ? "Try adjusting your search or filter criteria"
                : "Generate your first startup idea to get started"}
              actionLabel="Generate New Idea"
              onAction={() => navigate('/generate')}
            />
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-neutral-900 mb-1 truncate">{idea.name}</h5>
                      <p className="text-neutral-600 line-clamp-2">{idea.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {idea.tags.slice(0, 2).map(tag => (
                      <Tag key={tag} variant="primary" size="sm">{tag}</Tag>
                    ))}
                    {idea.tags.length > 2 && (
                      <Tag variant="default" size="sm">+{idea.tags.length - 2}</Tag>
                    )}
                  </div>

                  <div className="text-neutral-500">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {new Date(idea.dateGenerated).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/idea/sample-idea-1')}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outlined" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} variant="bordered" padding="md" className="hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h5 className="text-neutral-900 mb-1">{idea.name}</h5>
                        <p className="text-neutral-600">{idea.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {idea.tags.map(tag => (
                        <Tag key={tag} variant="primary" size="sm">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/idea/sample-idea-1')}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outlined" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
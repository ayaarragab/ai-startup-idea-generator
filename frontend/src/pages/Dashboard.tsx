// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { EmptyState } from '../components/EmptyState';
import { Search, Plus, Grid, List, Eye, Trash2, Calendar, Bookmark, Loader2 } from 'lucide-react';

// Updated Sector interface
interface Sector {
  id: number;
  name: string;
}

interface Idea {
  id: number;
  messageId: number;
  solutionName: string;
  solutionDescription: string;
  marketRegion: string;
  createdAt: string; 
  sectors?: Sector[]; // Changed from tags?: string[]
}

export function Dashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/idea/saved-ideas');
        setSavedIdeas(response.data.ideas || []);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setSavedIdeas([]);
        } else {
          console.error('Error fetching ideas:', err);
          setError('Failed to load saved ideas. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const handleUnsaveIdea = async (ideaId: number, messageId: number) => {
    try {
      await axiosInstance.delete(`/saved-ideas/${ideaId}/${messageId}`);
      setSavedIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
    } catch (err) {
      console.error('Error unsaving idea:', err);
    }
  };

  const sectorsOptions = ['all', 'Healthcare', 'Education', 'Agriculture', 'Environment', 'FinTech', 'Transportation'];

  const currentMonth = new Date().getMonth();
  const ideasThisMonth = savedIdeas.filter(idea => {
    if (!idea.createdAt) return false;
    return new Date(idea.createdAt).getMonth() === currentMonth;
  }).length;

  const stats = [
    {
      label: 'Total Ideas',
      value: savedIdeas.length.toString(),
      icon: Bookmark,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'This Month',
      value: ideasThisMonth.toString(),
      icon: Calendar,
      color: 'bg-accent-100 text-accent-600',
    },
  ];

  const filteredIdeas = savedIdeas.filter(idea => {
    const matchesSearch = idea.solutionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.solutionDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // UPDATED: Check if any sector name in the array matches the selectedSector
    const matchesSector = selectedSector === 'all' || 
                         idea.sectors?.some(s => s.name === selectedSector); 
                         
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-neutral-900 mb-2">Saved Ideas</h2>
              <p className="text-neutral-600">Manage and review your generated startup ideas</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/generate')}>
              <Plus className="w-5 h-5" />
              Generate New Idea
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} variant="bordered" padding="md">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-neutral-900 font-semibold">{stat.value}</div>
                    <div className="text-neutral-600 text-sm">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filter Bar */}
          <Card variant="bordered" padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by idea name or description"
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
                  {sectorsOptions.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'all' ? 'All Sectors' : sector}
                    </option>
                  ))}
                </select>
                {/* View Toggles */}
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'}`}><Grid className="w-5 h-5" /></button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-2 border-l border-neutral-300 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'}`}><List className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content State Handling */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>
        ) : filteredIdeas.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No ideas found"
            description="Try adjusting your search or filter criteria"
            actionLabel="Generate New Idea"
            onAction={() => navigate('/generate')}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow group">
                <div className="space-y-4">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-neutral-900 mb-1 truncate">{idea.solutionName}</h5>
                    <p className="text-neutral-600 line-clamp-2 text-sm">{idea.solutionDescription}</p>
                  </div>

                  {/* UPDATED: Rendering Sector Tags */}
                  <div className="flex flex-wrap gap-2">
                    {idea.sectors?.slice(0, 2).map(sector => (
                      <Tag key={sector.id} variant="primary" size="sm">{sector.name}</Tag>
                    ))}
                    {idea.sectors && idea.sectors.length > 2 && (
                      <Tag variant="default" size="sm">+{idea.sectors.length - 2}</Tag>
                    )}
                  </div>

                  <div className="text-neutral-500 text-xs">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-neutral-200">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/idea/${idea.id}/${idea.messageId}`)}>
                      <Eye className="w-4 h-4" /> View
                    </Button>
                    <Button variant="outlined" size="sm" onClick={() => handleUnsaveIdea(idea.id, idea.messageId)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h5 className="text-neutral-900 mb-1">{idea.solutionName}</h5>
                    <p className="text-neutral-600 text-sm">{idea.solutionDescription}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {/* UPDATED: Sector Tags in List View */}
                      {idea.sectors?.map(sector => (
                        <Tag key={sector.id} variant="primary" size="sm">{sector.name}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => navigate(`/idea/${idea.id}/${idea.messageId}`)}>
                      <Eye className="w-4 h-4" /> View
                    </Button>
                    <Button variant="outlined" size="sm" onClick={() => handleUnsaveIdea(idea.id, idea.messageId)}>
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
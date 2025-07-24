import React, { useState } from 'react';
import { Trip } from '../App';
import { 
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Filter,
  RefreshCw,
  Heart,
  Users,
  Car,
  Camera,
  Utensils,
  Bed
} from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'destination' | 'activity' | 'restaurant' | 'hotel' | 'transport';
  title: string;
  description: string;
  location: string;
  price?: string;
  rating: number;
  duration?: string;
  tags: string[];
  imageUrl?: string;
  aiReason: string;
  votes: { up: number; down: number };
  bookmarked: boolean;
}

interface Props {
  trip: Trip;
}

const AISuggestions: React.FC<Props> = ({ trip }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Sample AI suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'activity',
      title: 'TeamLab Borderless Digital Art Museum',
      description: 'Immersive digital art experience with interactive exhibitions and stunning visual displays.',
      location: 'Odaiba, Tokyo',
      price: '$32',
      rating: 4.8,
      duration: '3-4 hours',
      tags: ['art', 'technology', 'family-friendly', 'instagram-worthy'],
      aiReason: 'Based on your group\'s interest in unique experiences and photography opportunities.',
      votes: { up: 15, down: 2 },
      bookmarked: false
    },
    {
      id: '2',
      type: 'restaurant',
      title: 'Sukiyabashi Jiro Honten',
      description: 'World-renowned sushi restaurant with exceptional omakase experience.',
      location: 'Ginza, Tokyo',
      price: '$400',
      rating: 4.9,
      tags: ['sushi', 'fine-dining', 'michelin-star', 'authentic'],
      aiReason: 'Perfect for a special celebration dinner, matching your group\'s interest in authentic cuisine.',
      votes: { up: 23, down: 8 },
      bookmarked: true
    },
    {
      id: '3',
      type: 'activity',
      title: 'Cooking Class in Shibuya',
      description: 'Learn to make traditional Japanese dishes including sushi, tempura, and miso soup.',
      location: 'Shibuya, Tokyo',
      price: '$85',
      rating: 4.7,
      duration: '3 hours',
      tags: ['cooking', 'cultural', 'hands-on', 'group-activity'],
      aiReason: 'Great team bonding activity that aligns with your group\'s love for food experiences.',
      votes: { up: 31, down: 3 },
      bookmarked: false
    },
    {
      id: '4',
      type: 'destination',
      title: 'Mount Fuji Day Trip',
      description: 'Scenic day trip to Japan\'s iconic mountain with lake views and photography opportunities.',
      location: 'Mount Fuji, Japan',
      price: '$120',
      rating: 4.6,
      duration: '10 hours',
      tags: ['nature', 'scenic', 'photography', 'day-trip'],
      aiReason: 'Recommended based on your travel dates when Mount Fuji visibility is at its peak.',
      votes: { up: 45, down: 7 },
      bookmarked: true
    },
    {
      id: '5',
      type: 'hotel',
      title: 'Park Hyatt Tokyo',
      description: 'Luxury hotel with stunning city views, featured in Lost in Translation movie.',
      location: 'Shinjuku, Tokyo',
      price: '$600/night',
      rating: 4.8,
      tags: ['luxury', 'city-views', 'iconic', 'spa'],
      aiReason: 'Matches your group\'s preference for comfortable accommodations with great amenities.',
      votes: { up: 28, down: 12 },
      bookmarked: false
    },
    {
      id: '6',
      type: 'transport',
      title: 'JR Pass 7-Day Unlimited',
      description: 'Unlimited travel on JR trains including bullet trains across Japan.',
      location: 'Japan-wide',
      price: '$280',
      rating: 4.9,
      tags: ['convenient', 'unlimited', 'fast', 'economical'],
      aiReason: 'Cost-effective for your 7-day trip with planned inter-city travel.',
      votes: { up: 67, down: 4 },
      bookmarked: true
    }
  ]);

  const filterOptions = [
    { id: 'all', name: 'All Suggestions', icon: Sparkles },
    { id: 'activity', name: 'Activities', icon: Camera },
    { id: 'restaurant', name: 'Restaurants', icon: Utensils },
    { id: 'hotel', name: 'Hotels', icon: Bed },
    { id: 'transport', name: 'Transport', icon: Car },
    { id: 'destination', name: 'Destinations', icon: MapPin }
  ];

  const budgetOptions = [
    { id: 'all', name: 'All Budgets' },
    { id: 'budget', name: 'Budget ($0-50)' },
    { id: 'mid', name: 'Mid-range ($51-200)' },
    { id: 'luxury', name: 'Luxury ($200+)' }
  ];

  const distanceOptions = [
    { id: 'all', name: 'All Distances' },
    { id: 'walking', name: 'Walking Distance' },
    { id: 'transit', name: 'Public Transit' },
    { id: 'day-trip', name: 'Day Trip' }
  ];

  const getFilteredSuggestions = () => {
    return suggestions.filter(suggestion => {
      const typeMatch = activeFilter === 'all' || suggestion.type === activeFilter;
      
      let budgetMatch = true;
      if (budgetFilter !== 'all' && suggestion.price) {
        const price = parseInt(suggestion.price.replace(/[^0-9]/g, ''));
        switch (budgetFilter) {
          case 'budget':
            budgetMatch = price <= 50;
            break;
          case 'mid':
            budgetMatch = price > 50 && price <= 200;
            break;
          case 'luxury':
            budgetMatch = price > 200;
            break;
        }
      }
      
      return typeMatch && budgetMatch;
    });
  };

  const handleVote = (suggestionId: string, voteType: 'up' | 'down') => {
    setSuggestions(prev => prev.map(suggestion => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          votes: {
            ...suggestion.votes,
            [voteType]: suggestion.votes[voteType] + 1
          }
        };
      }
      return suggestion;
    }));
  };

  const handleBookmark = (suggestionId: string) => {
    setSuggestions(prev => prev.map(suggestion => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          bookmarked: !suggestion.bookmarked
        };
      }
      return suggestion;
    }));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'activity':
        return <Camera className="w-4 h-4" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'hotel':
        return <Bed className="w-4 h-4" />;
      case 'transport':
        return <Car className="w-4 h-4" />;
      case 'destination':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Suggestions</h1>
          <p className="text-gray-600">Personalized recommendations powered by AI</p>
        </div>
        <button 
          className="btn btn-primary mt-4 lg:mt-0"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Suggestions'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Type Filter */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Categories</h3>
              </div>
              <div className="card-content p-0">
                <div className="space-y-1">
                  {filterOptions.map((option) => {
                    const Icon = option.icon;
                    const count = option.id === 'all' 
                      ? suggestions.length 
                      : suggestions.filter(s => s.type === option.id).length;

                    return (
                      <button
                        key={option.id}
                        className={`w-full text-left p-3 border-b transition-colors ${
                          activeFilter === option.id 
                            ? 'bg-blue-50 border-blue-200 text-blue-900' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveFilter(option.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <span className="badge badge-primary">{count}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Budget Filter */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Budget Range</h3>
              </div>
              <div className="card-content">
                <div className="space-y-2">
                  {budgetOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="budget"
                        value={option.id}
                        checked={budgetFilter === option.id}
                        onChange={(e) => setBudgetFilter(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Suggestions Stats</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Suggestions</span>
                    <span className="font-medium">{suggestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bookmarked</span>
                    <span className="font-medium">
                      {suggestions.filter(s => s.bookmarked).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Rating</span>
                    <span className="font-medium">
                      {(suggestions.reduce((acc, s) => acc + s.rating, 0) / suggestions.length).toFixed(1)}⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {activeFilter === 'all' ? 'All Suggestions' : 
               filterOptions.find(f => f.id === activeFilter)?.name} 
              ({filteredSuggestions.length})
            </h3>
            <button className="btn btn-secondary btn-sm">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>

          <div className="space-y-6">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No suggestions found</h4>
                <p className="text-gray-500 mb-4">Try adjusting your filters or refresh for new suggestions</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Suggestions
                </button>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="card">
                  <div className="card-content">
                    <div className="flex gap-4">
                      {/* Suggestion Image Placeholder */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(suggestion.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                              <span className={`badge badge-${
                                suggestion.type === 'restaurant' ? 'green' :
                                suggestion.type === 'activity' ? 'blue' :
                                suggestion.type === 'hotel' ? 'purple' :
                                suggestion.type === 'transport' ? 'orange' : 'primary'
                              }`}>
                                {suggestion.type}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {suggestion.location}
                              </div>
                              {suggestion.price && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {suggestion.price}
                                </div>
                              )}
                              {suggestion.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {suggestion.duration}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {suggestion.rating}
                              </div>
                            </div>
                          </div>

                          <button
                            className={`p-2 rounded-lg transition-colors ${
                              suggestion.bookmarked 
                                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            onClick={() => handleBookmark(suggestion.id)}
                          >
                            <Heart className={`w-5 h-5 ${suggestion.bookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {suggestion.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* AI Reason */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-800 text-sm">{suggestion.aiReason}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                              onClick={() => handleVote(suggestion.id, 'up')}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {suggestion.votes.up}
                            </button>
                            <button
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                              onClick={() => handleVote(suggestion.id, 'down')}
                            >
                              <ThumbsDown className="w-4 h-4" />
                              {suggestion.votes.down}
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <button className="btn btn-secondary btn-sm">
                              Share
                            </button>
                            <button className="btn btn-primary btn-sm">
                              Add to Itinerary
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
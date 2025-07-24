import React, { useState } from 'react';
import { Plus, ThumbsUp, ThumbsDown, MessageCircle, Clock, MapPin, Users as UsersIcon, Star, Heart, Camera, Utensils, Mountain, Waves, Building2, Music, Calendar as CalendarIcon } from 'lucide-react';
import { Trip, Activity, Comment } from '../App';

interface CollaborativeItineraryProps {
  trip: Trip;
}

const CollaborativeItinerary: React.FC<CollaborativeItineraryProps> = ({ trip }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'suggested'>('all');

  // Sample activities data with enhanced structure
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Visit Senso-ji Temple',
      description: 'Explore Tokyo\'s oldest temple in historic Asakusa district',
      day: 1,
      time: '09:00',
      location: 'Asakusa, Tokyo',
      votes: 8,
      voters: ['alice', 'bob', 'carol'],
      comments: [
        { id: '1', authorId: 'alice', author: 'Alice Johnson', content: 'Perfect way to start our trip! 🏮', timestamp: '2024-01-15T10:30:00Z', reactions: { heart: 2, thumbsUp: 1 } }
      ],
      suggestedBy: 'Alice Johnson',
      status: 'confirmed',
      type: 'culture',
      estimatedCost: 0,
      duration: '2 hours',
      difficulty: 'easy',
      weatherDependent: false
    },
    {
      id: '2',
      title: 'Tsukiji Outer Market Food Tour',
      description: 'Sample the freshest sushi and street food in Tokyo',
      day: 1,
      time: '12:00',
      location: 'Tsukiji, Tokyo',
      votes: 12,
      voters: ['alice', 'bob', 'carol', 'david'],
      comments: [
        { id: '2', authorId: 'bob', author: 'Bob Smith', content: 'Can\'t wait to try authentic Japanese cuisine!', timestamp: '2024-01-15T11:00:00Z', reactions: { heart: 3, thumbsUp: 2 } },
        { id: '3', authorId: 'carol', author: 'Carol Brown', content: 'I heard the tuna there is incredible 🍣', timestamp: '2024-01-15T11:15:00Z', reactions: { heart: 1 } }
      ],
      suggestedBy: 'Bob Smith',
      status: 'confirmed',
      type: 'food',
      estimatedCost: 50,
      duration: '3 hours',
      difficulty: 'easy',
      weatherDependent: false
    },
    {
      id: '3',
      title: 'Mount Fuji Day Trip',
      description: 'Take a day trip to see Japan\'s iconic mountain',
      day: 3,
      time: '07:00',
      location: 'Mount Fuji, Japan',
      votes: 6,
      voters: ['alice', 'david'],
      comments: [
        { id: '4', authorId: 'david', author: 'David Wilson', content: 'Weather looks good for that day! 🗻', timestamp: '2024-01-15T12:00:00Z', reactions: { heart: 2, thumbsUp: 3 } }
      ],
      suggestedBy: 'David Wilson',
      status: 'suggested',
      type: 'nature',
      estimatedCost: 120,
      duration: 'Full day',
      difficulty: 'moderate',
      weatherDependent: true
    },
    {
      id: '4',
      title: 'Robot Restaurant Show',
      description: 'Experience Tokyo\'s most famous robot cabaret show',
      day: 2,
      time: '20:00',
      location: 'Shinjuku, Tokyo',
      votes: 4,
      voters: ['bob', 'carol'],
      comments: [],
      suggestedBy: 'Carol Brown',
      status: 'suggested',
      type: 'entertainment',
      estimatedCost: 80,
      duration: '2 hours',
      difficulty: 'easy',
      weatherDependent: false
    }
  ]);

  // Get trip days
  const getTripDays = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Array.from({ length: diffDays }, (_, i) => i + 1);
  };

  // Filter activities by day and status
  const getActivitiesForDay = (day: number) => {
    return activities
      .filter(activity => {
        const dayMatch = activity.day === day;
        const statusMatch = filter === 'all' || activity.status === filter;
        return dayMatch && statusMatch;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Get activity type icon and color
  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      culture: { icon: Building2, color: 'from-purple-500 to-indigo-600', emoji: '🏛️' },
      food: { icon: Utensils, color: 'from-orange-500 to-red-600', emoji: '🍽️' },
      nature: { icon: Mountain, color: 'from-green-500 to-emerald-600', emoji: '🏔️' },
      beach: { icon: Waves, color: 'from-blue-500 to-cyan-600', emoji: '🏖️' },
      entertainment: { icon: Music, color: 'from-pink-500 to-rose-600', emoji: '🎭' },
      shopping: { icon: Building2, color: 'from-amber-500 to-yellow-600', emoji: '🛍️' },
      adventure: { icon: Mountain, color: 'from-red-500 to-orange-600', emoji: '🎢' }
    } as const;
    return icons[type] || icons.culture;
  };

  // Handle voting
  const handleVote = (activityId: string, isUpvote: boolean) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const currentUserVoted = activity.voters.includes('currentUser');
        let newVotes = activity.votes;
        let newVoters = [...activity.voters];

        if (isUpvote) {
          if (!currentUserVoted) {
            newVotes += 1;
            newVoters.push('currentUser');
          }
        } else {
          if (currentUserVoted) {
            newVotes -= 1;
            newVoters = newVoters.filter(voter => voter !== 'currentUser');
          }
        }

        return { ...activity, votes: newVotes, voters: newVoters };
      }
      return activity;
    }));
  };

  // Handle comments
  const handleAddComment = (activityId: string) => {
    const commentText = newComment[activityId];
    if (!commentText?.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      authorId: 'currentUser',
      author: 'You',
      content: commentText,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, comments: [...activity.comments, newCommentObj] };
      }
      return activity;
    }));

    setNewComment(prev => ({ ...prev, [activityId]: '' }));
  };

  // Toggle comment expansion
  const toggleComments = (activityId: string) => {
    setExpandedComments(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Format time
  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get day name
  const getDayName = (dayNumber: number) => {
    const startDate = new Date(trip.startDate);
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayNumber - 1);
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const tripDays = getTripDays();
  const currentDayActivities = getActivitiesForDay(selectedDay);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Trip Itinerary</h1>
          <p className="text-neutral-600 mt-1">Plan your perfect adventure together</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="form-select"
            aria-label="Filter activities"
          >
            <option value="all">All Activities</option>
            <option value="confirmed">Confirmed</option>
            <option value="suggested">Suggested</option>
          </select>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            aria-label="Add new activity"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Day Selector Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-6">
              <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Trip Days
              </h3>
              <div className="space-y-2">
                {tripDays.map((day) => {
                  const dayActivities = getActivitiesForDay(day);
                  const confirmedCount = dayActivities.filter(a => a.status === 'confirmed').length;
                  const suggestedCount = dayActivities.filter(a => a.status === 'suggested').length;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedDay === day
                          ? 'border-primary bg-primary text-white shadow-md'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                      aria-label={`Select day ${day}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">Day {day}</div>
                        <div className="text-xs opacity-75">
                          {dayActivities.length} activities
                        </div>
                      </div>
                      <div className={`text-sm ${selectedDay === day ? 'text-white opacity-90' : 'text-neutral-600'}`}>
                        {getDayName(day)}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {confirmedCount > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedDay === day 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {confirmedCount} confirmed
                          </span>
                        )}
                        {suggestedCount > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedDay === day 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {suggestedCount} suggested
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-800">
                Day {selectedDay} - {getDayName(selectedDay)}
              </h2>
              <div className="text-sm text-neutral-600">
                {currentDayActivities.length} activities planned
              </div>
            </div>

            {currentDayActivities.length === 0 ? (
              <div className="card">
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-600 mb-2">No activities planned</h3>
                  <p className="text-neutral-500 mb-4">Start planning your day by adding some activities!</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Activity
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentDayActivities.map((activity, index) => {
                  const activityIcon = getActivityIcon(activity.type);
                  const IconComponent = activityIcon.icon;
                  const isCommentsExpanded = expandedComments.includes(activity.id);
                  const userHasVoted = activity.voters.includes('currentUser');

                  return (
                    <div key={activity.id} className="card hover:shadow-lg transition-all duration-200">
                      <div className="p-6">
                        {/* Activity Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activityIcon.color} flex items-center justify-center text-white flex-shrink-0`}>
                            <span className="text-lg">{activityIcon.emoji}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                                  {activity.title}
                                </h3>
                                <p className="text-neutral-600 mb-2">{activity.description}</p>
                                
                                {/* Activity Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTime(activity.time)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{activity.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{activity.duration}</span>
                                  </div>
                                  {activity.estimatedCost > 0 && (
                                    <div className="flex items-center gap-1">
                                      <span>💰</span>
                                      <span>${activity.estimatedCost}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="flex-shrink-0">
                                <span className={`badge ${
                                  activity.status === 'confirmed' ? 'badge-success' : 
                                  activity.status === 'suggested' ? 'badge-warning' : 'badge-danger'
                                }`}>
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Activity Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Voting */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleVote(activity.id, true)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                                  userHasVoted 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-green-50 hover:text-green-600'
                                }`}
                                aria-label={`${userHasVoted ? 'Remove vote' : 'Vote'} for ${activity.title}`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="font-medium">{activity.votes}</span>
                              </button>
                            </div>

                            {/* Comments */}
                            <button
                              onClick={() => toggleComments(activity.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                              aria-label={`${isCommentsExpanded ? 'Hide' : 'Show'} comments for ${activity.title}`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{activity.comments.length}</span>
                            </button>

                            {/* Suggested by */}
                            <div className="text-sm text-neutral-500">
                              Suggested by <span className="font-medium">{activity.suggestedBy}</span>
                            </div>
                          </div>

                          {/* Activity Settings */}
                          <div className="flex items-center gap-2">
                            {activity.weatherDependent && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Weather dependent
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              activity.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              activity.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {activity.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {isCommentsExpanded && (
                          <div className="mt-6 pt-4 border-t border-neutral-200">
                            <div className="space-y-4">
                              {activity.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <div className="avatar avatar-sm">
                                    <span>{comment.author.charAt(0)}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-neutral-50 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-neutral-800">
                                          {comment.author}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                          {new Date(comment.timestamp).toLocaleTimeString()}
                                        </span>
                                      </div>
                                      <p className="text-neutral-700">{comment.content}</p>
                                      
                                      {/* Comment Reactions */}
                                      {Object.keys(comment.reactions || {}).length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                          {Object.entries(comment.reactions || {}).map(([reaction, count]) => (
                                            <span key={reaction} className="text-xs bg-white px-2 py-1 rounded-full border">
                                              {reaction === 'heart' ? '❤️' : reaction === 'thumbsUp' ? '👍' : '😊'} {count}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add Comment */}
                              <div className="flex gap-3">
                                <div className="avatar avatar-sm">
                                  <span>Y</span>
                                </div>
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment[activity.id] || ''}
                                    onChange={(e) => setNewComment(prev => ({ ...prev, [activity.id]: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(activity.id)}
                                    className="form-input flex-1"
                                    aria-label={`Add comment to ${activity.title}`}
                                  />
                                  <button
                                    onClick={() => handleAddComment(activity.id)}
                                    className="btn btn-primary btn-sm"
                                    disabled={!newComment[activity.id]?.trim()}
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Activity</h3>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Activity Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Visit Tokyo Tower"
                  aria-label="Activity title"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe the activity..."
                  aria-label="Activity description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <select className="form-select" defaultValue={selectedDay} aria-label="Select day">
                    {tripDays.map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input 
                    type="time" 
                    className="form-input"
                    aria-label="Activity time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" aria-label="Activity type">
                    <option value="culture">Culture 🏛️</option>
                    <option value="food">Food 🍽️</option>
                    <option value="nature">Nature 🏔️</option>
                    <option value="beach">Beach 🏖️</option>
                    <option value="entertainment">Entertainment 🎭</option>
                    <option value="shopping">Shopping 🛍️</option>
                    <option value="adventure">Adventure 🎢</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Estimated Cost</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0"
                    min="0"
                    aria-label="Estimated cost"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Shibuya, Tokyo"
                  aria-label="Activity location"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., 2 hours"
                  aria-label="Activity duration"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Activity
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeItinerary;
import React, { useState } from 'react';
import { Trip, Activity, Comment } from '../App';
import { 
  Plus,
  ThumbsUp,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Send,
  Calendar,
  Filter
} from 'lucide-react';

interface Props {
  trip: Trip;
}

const CollaborativeItinerary: React.FC<Props> = ({ trip }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Sample activities data
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Visit Tokyo Skytree',
      description: 'Enjoy panoramic views of Tokyo from the observation deck',
      day: 1,
      time: '09:00',
      location: 'Sumida, Tokyo',
      votes: 3,
      voters: ['1', '2', '3'],
      comments: [
        {
          id: '1',
          userId: '1',
          userName: 'Alice Johnson',
          text: 'Great idea! The weather should be perfect that day.',
          timestamp: '2024-01-15T10:00:00Z'
        }
      ],
      suggestedBy: '1',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Sushi Making Class',
      description: 'Learn traditional sushi making techniques',
      day: 1,
      time: '14:00',
      location: 'Shibuya, Tokyo',
      votes: 2,
      voters: ['1', '4'],
      comments: [],
      suggestedBy: '2',
      status: 'suggested'
    },
    {
      id: '3',
      title: 'Explore Senso-ji Temple',
      description: 'Visit the ancient Buddhist temple in Asakusa',
      day: 2,
      time: '10:00',
      location: 'Asakusa, Tokyo',
      votes: 4,
      voters: ['1', '2', '3', '4'],
      comments: [],
      suggestedBy: '3',
      status: 'confirmed'
    }
  ]);

  const getTripDays = () => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Array.from({ length: diffDays }, (_, i) => i + 1);
  };

  const getActivitiesForDay = (day: number) => {
    return activities
      .filter(activity => activity.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleVote = (activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const isVoted = activity.voters.includes('1'); // Assuming current user ID is '1'
        return {
          ...activity,
          votes: isVoted ? activity.votes - 1 : activity.votes + 1,
          voters: isVoted 
            ? activity.voters.filter(id => id !== '1')
            : [...activity.voters, '1']
        };
      }
      return activity;
    }));
  };

  const handleAddComment = (activityId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Alice Johnson',
      text: newComment,
      timestamp: new Date().toISOString()
    };

    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          comments: [...activity.comments, comment]
        };
      }
      return activity;
    }));

    setNewComment('');
  };

  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-success">Confirmed</span>;
      case 'suggested':
        return <span className="badge badge-warning">Suggested</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return null;
    }
  };

  const days = getTripDays();
  const dayActivities = getActivitiesForDay(selectedDay);

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Itinerary</h1>
          <p className="text-gray-600">Collaborate on your day-by-day activities</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Day Selector */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Trip Days</h3>
            </div>
            <div className="card-content p-0">
              <div className="space-y-1">
                {days.map((day) => {
                  const dayDate = new Date(trip.startDate);
                  dayDate.setDate(dayDate.getDate() + day - 1);
                  const activitiesCount = getActivitiesForDay(day).length;

                  return (
                    <button
                      key={day}
                      className={`w-full text-left p-3 border-b transition-colors ${
                        selectedDay === day 
                          ? 'bg-blue-50 border-blue-200 text-blue-900' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Day {day}</div>
                          <div className="text-sm text-gray-500">
                            {dayDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        {activitiesCount > 0 && (
                          <span className="badge badge-primary">
                            {activitiesCount}
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
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Day {selectedDay} Activities</h3>
              <p className="card-subtitle">
                {dayActivities.length} activit{dayActivities.length !== 1 ? 'ies' : 'y'} planned
              </p>
            </div>
            <div className="card-content">
              {dayActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No activities planned</h4>
                  <p className="text-gray-500 mb-4">Start planning your day by adding some activities</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add First Activity
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {dayActivities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      {/* Timeline line */}
                      {index < dayActivities.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      <div className="flex gap-4">
                        {/* Time indicator */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center relative z-10">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-2">
                            {activity.time}
                          </div>
                        </div>

                        {/* Activity card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {activity.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="w-4 h-4" />
                                {activity.location}
                              </div>
                            </div>
                            {getStatusBadge(activity.status)}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-4 pt-3 border-t">
                            <button
                              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                                activity.voters.includes('1')
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              onClick={() => handleVote(activity.id)}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {activity.votes}
                            </button>

                            <button
                              className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              onClick={() => setExpandedComments(
                                expandedComments === activity.id ? null : activity.id
                              )}
                            >
                              <MessageCircle className="w-4 h-4" />
                              {activity.comments.length}
                            </button>

                            {activity.status === 'suggested' && (
                              <button className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                                <CheckCircle className="w-4 h-4" />
                                Confirm
                              </button>
                            )}
                          </div>

                          {/* Comments section */}
                          {expandedComments === activity.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="space-y-3 mb-4">
                                {activity.comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-3">
                                    <div className="avatar avatar-sm">
                                      👤
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">
                                          {comment.userName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(comment.timestamp).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {comment.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(activity.id);
                                    }
                                  }}
                                />
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAddComment(activity.id)}
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Activity</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Activity Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Visit Tokyo Skytree"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Brief description of the activity"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <select className="form-input form-select" defaultValue={selectedDay}>
                    {days.map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Shibuya, Tokyo"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  className="btn btn-secondary flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Add Activity
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
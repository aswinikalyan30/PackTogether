import React, { useState } from 'react';
import { Trip } from '../App';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Edit3, 
  UserPlus,
  Clock,
  Share2
} from 'lucide-react';

interface Props {
  trip: Trip;
}

const TripOverview: React.FC<Props> = ({ trip }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getDaysUntilTrip = () => {
    const startDate = new Date(trip.startDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTripDuration = () => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysUntil = getDaysUntilTrip();
  const duration = getTripDuration();

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{trip.destination}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">Start Date</div>
                    <div className="font-medium">{formatDate(trip.startDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{duration} days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-500">Members</div>
                    <div className="font-medium">{trip.members.length} people</div>
                  </div>
                </div>
              </div>

              {daysUntil > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {daysUntil} days until your trip!
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 className="w-4 h-4" />
                Edit Trip
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowInviteModal(true)}
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
              <button className="btn btn-secondary">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Members */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Trip Members</h2>
          <p className="card-subtitle">
            {trip.members.length} member{trip.members.length !== 1 ? 's' : ''} planning together
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trip.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="avatar">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">$2,450</div>
                <div className="text-sm text-gray-500">Total Budget</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">Activities Planned</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-gray-500">Planning Complete</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="friend@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Personal Message (Optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Hey! Want to join our amazing trip to Japan?"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  className="btn btn-secondary flex-1"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Trip Details</h3>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Trip Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={trip.name}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={trip.destination}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={trip.startDate}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={trip.endDate}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  className="btn btn-secondary flex-1"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripOverview;
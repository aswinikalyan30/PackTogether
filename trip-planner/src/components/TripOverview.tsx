import React, { useState } from 'react';
import { MapPin, Calendar, Users, Edit3, UserPlus, Share2, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Trip } from '../App';

interface TripOverviewProps {
  trip: Trip;
}

const TripOverview: React.FC<TripOverviewProps> = ({ trip }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Calculate trip stats
  const getDaysUntilTrip = () => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTripDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock member avatars with actual images
  const memberAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108755-2616b612b172?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  ];

  // Destination images for different locations
  const getDestinationImage = (destination: string) => {
    const images: { [key: string]: string } = {
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=1200&q=80',
      'Iceland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'Thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80'
    };
    return images[destination] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80';
  };

  const daysUntil = getDaysUntilTrip();
  const duration = getTripDuration();

  return (
    <div className="space-y-8">
      {/* Hero Banner with Destination Imagery */}
      <div 
        className="hero-banner"
        style={{
          backgroundImage: `url('${getDestinationImage(trip.destination)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {trip.name}
          </h1>
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-medium">{trip.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-medium">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-lg font-medium">{trip.members.length} Travelers</span>
            </div>
          </div>
          
          {daysUntil > 0 && (
            <div className="mb-6">
              <div className="text-2xl font-bold">
                {daysUntil} days to go!
              </div>
              <div className="text-lg opacity-90">
                {duration} day adventure awaits
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => setShowEditModal(true)}
              className="btn btn-primary btn-lg"
              aria-label="Edit trip details"
            >
              <Edit3 className="w-5 h-5" />
              Edit Trip
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="btn btn-secondary btn-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}
              aria-label="Add new member"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}
              aria-label="Share trip"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">$2,450</div>
              <div className="text-sm text-neutral-600">Estimated Budget</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">8/12</div>
              <div className="text-sm text-neutral-600">Activities Planned</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">75%</div>
              <div className="text-sm text-neutral-600">Trip Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Members Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Trip Members</h2>
            <p className="card-subtitle">
              {trip.members.length} people are joining this adventure
            </p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="btn btn-primary"
            aria-label="Invite new member"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trip.members.map((member, index) => (
            <div key={member.id} className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary transition-all hover:shadow-md">
              <div className="avatar avatar-md">
                <img 
                  src={memberAvatars[index % memberAvatars.length]} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-neutral-800">{member.name}</div>
                <div className="text-sm text-neutral-600">{member.email}</div>
                <div className="mt-1">
                  <span className={`badge ${
                    member.role === 'organizer' ? 'badge-primary' : 
                    member.role === 'member' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Details Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Trip Details</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Destination
              </label>
              <div className="flex items-center gap-2 text-neutral-800">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{trip.destination}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Duration
              </label>
              <div className="flex items-center gap-2 text-neutral-800">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">{duration} days</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Dates
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">Start:</span>
                <span className="font-medium text-neutral-800">{formatDate(trip.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">End:</span>
                <span className="font-medium text-neutral-800">{formatDate(trip.endDate)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <p className="text-neutral-700 leading-relaxed">
              An amazing journey to {trip.destination} with friends and family. Experience the best of local culture, 
              beautiful landscapes, and unforgettable adventures. This trip promises to be filled with excitement, 
              relaxation, and memories that will last a lifetime.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Trip Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Trip</h3>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Trip Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={trip.name}
                  aria-label="Trip name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={trip.destination}
                  aria-label="Trip destination"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    defaultValue={trip.startDate}
                    aria-label="Start date"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    defaultValue={trip.endDate}
                    aria-label="End date"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe your trip..."
                  aria-label="Trip description"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Invite New Member</h3>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter member name"
                  aria-label="Member name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Enter email address"
                  aria-label="Member email"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" aria-label="Member role">
                  <option value="member">Member</option>
                  <option value="organizer">Organizer</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Send Invitation
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
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

export default TripOverview;
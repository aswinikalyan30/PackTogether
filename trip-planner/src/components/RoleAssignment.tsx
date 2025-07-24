import React, { useState } from 'react';
import { Trip, Role } from '../App';
import { 
  Plus,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  X,
  Calendar,
  MapPin
} from 'lucide-react';

interface Props {
  trip: Trip;
}

const RoleAssignment: React.FC<Props> = ({ trip }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      title: 'Hotel Booking Manager',
      description: 'Research and book accommodations for the group',
      assignedTo: '1',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Transportation Coordinator',
      description: 'Arrange flights, trains, and local transport',
      assignedTo: '3',
      status: 'assigned'
    },
    {
      id: '3',
      title: 'Activity Planner',
      description: 'Research and book tours, activities, and attractions',
      assignedTo: '2',
      status: 'assigned'
    },
    {
      id: '4',
      title: 'Restaurant Scout',
      description: 'Find and make reservations at restaurants',
      status: 'open'
    },
    {
      id: '5',
      title: 'Budget Tracker',
      description: 'Monitor expenses and keep track of group spending',
      assignedTo: '4',
      status: 'assigned'
    },
    {
      id: '6',
      title: 'Emergency Contact Coordinator',
      description: 'Compile emergency contacts and important documents',
      status: 'open'
    }
  ]);

  const statusOptions = [
    { id: 'all', name: 'All Roles', color: 'gray' },
    { id: 'open', name: 'Open', color: 'orange' },
    { id: 'assigned', name: 'Assigned', color: 'blue' },
    { id: 'completed', name: 'Completed', color: 'green' }
  ];

  const getMemberName = (memberId?: string) => {
    if (!memberId) return 'Unassigned';
    return trip.members.find(member => member.id === memberId)?.name || 'Unknown';
  };

  const getMemberAvatar = (memberId?: string) => {
    if (!memberId) return '👤';
    return trip.members.find(member => member.id === memberId)?.avatar || '👤';
  };

  const getStatusIcon = (status: Role['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'assigned':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Role['status']) => {
    switch (status) {
      case 'open':
        return <span className="badge badge-warning">Open</span>;
      case 'assigned':
        return <span className="badge badge-primary">Assigned</span>;
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const getFilteredRoles = () => {
    return selectedStatus === 'all' 
      ? roles 
      : roles.filter(role => role.status === selectedStatus);
  };

  const getStatusCount = (status: string) => {
    return status === 'all' ? roles.length : roles.filter(role => role.status === status).length;
  };

  const handleAssignRole = (roleId: string, memberId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          assignedTo: memberId,
          status: 'assigned' as const
        };
      }
      return role;
    }));
  };

  const handleMarkComplete = (roleId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          status: 'completed' as const
        };
      }
      return role;
    }));
  };

  const filteredRoles = getFilteredRoles();

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Role Assignment</h1>
          <p className="text-gray-600">Organize responsibilities for trip planning</p>
        </div>
        <button 
          className="btn btn-primary mt-4 lg:mt-0"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Status Filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statusOptions.map((status) => (
          <button
            key={status.id}
            className={`p-4 border rounded-lg transition-colors ${
              selectedStatus === status.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedStatus(status.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{status.name}</span>
              {getStatusIcon(status.id as Role['status'])}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {getStatusCount(status.id)}
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Unassigned Members */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Available Members</h3>
              <p className="card-subtitle">Drag to assign roles</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {trip.members.map((member) => {
                  const assignedRolesCount = roles.filter(role => role.assignedTo === member.id).length;
                  return (
                    <div 
                      key={member.id} 
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:border-gray-300 transition-colors"
                      draggable
                    >
                      <div className="avatar">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {assignedRolesCount} role{assignedRolesCount !== 1 ? 's' : ''} assigned
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Progress Overview</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed Roles</span>
                    <span>{getStatusCount('completed')}/{roles.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(getStatusCount('completed') / roles.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {getStatusCount('assigned')}
                    </div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {getStatusCount('open')}
                    </div>
                    <div className="text-xs text-gray-500">Open</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                {selectedStatus === 'all' ? 'All Roles' : 
                 statusOptions.find(s => s.id === selectedStatus)?.name + ' Roles'}
              </h3>
              <p className="card-subtitle">
                {filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="card-content">
              {filteredRoles.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No roles found</h4>
                  <p className="text-gray-500 mb-4">
                    {selectedStatus === 'all' 
                      ? 'Start by creating your first role'
                      : `No ${selectedStatus} roles yet`
                    }
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Role
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRoles.map((role) => (
                    <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{role.title}</h4>
                            {getStatusBadge(role.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                          
                          {role.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="avatar avatar-sm">
                                {getMemberAvatar(role.assignedTo)}
                              </div>
                              <span className="text-sm font-medium">
                                Assigned to {getMemberName(role.assignedTo)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-orange-600">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">Unassigned</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(role.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t">
                        {role.status === 'open' && (
                          <div className="flex gap-2">
                            {trip.members.map((member) => (
                              <button
                                key={member.id}
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleAssignRole(role.id, member.id)}
                                title={`Assign to ${member.name}`}
                              >
                                <span className="text-xs">{member.avatar}</span>
                                <span className="hidden sm:inline ml-1">{member.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {role.status === 'assigned' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarkComplete(role.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Role</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Hotel Booking Manager"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Describe the responsibilities and tasks for this role"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign To (Optional)</label>
                <select className="form-input form-select">
                  <option value="">Leave unassigned</option>
                  {trip.members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
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
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;
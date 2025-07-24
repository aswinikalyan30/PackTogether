import React, { useState } from 'react';
import './App.css';
import TripOverview from './components/TripOverview';
import CollaborativeItinerary from './components/CollaborativeItinerary';
import ExpenseSplitter from './components/ExpenseSplitter';
import RoleAssignment from './components/RoleAssignment';
import GroupChat from './components/GroupChat';
import AISuggestions from './components/AISuggestions';
import { 
  Map, 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: Member[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  day: number;
  time: string;
  location: string;
  votes: number;
  voters: string[];
  comments: Comment[];
  suggestedBy: string;
  status: 'suggested' | 'confirmed' | 'rejected';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  category: string;
  splitBetween: string[];
  date: string;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'open' | 'assigned' | 'completed';
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample data - in a real app, this would come from an API
  const [trip] = useState<Trip>({
    id: '1',
    name: 'Summer Adventure in Japan',
    destination: 'Tokyo, Japan',
    startDate: '2024-07-15',
    endDate: '2024-07-25',
    members: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩‍💻' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: '👨‍💼' },
      { id: '3', name: 'Carol Brown', email: 'carol@example.com', avatar: '👩‍🎨' },
      { id: '4', name: 'David Wilson', email: 'david@example.com', avatar: '👨‍🚀' },
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Map },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'roles', label: 'Roles', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'ai', label: 'AI Suggestions', icon: Sparkles },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TripOverview trip={trip} />;
      case 'itinerary':
        return <CollaborativeItinerary trip={trip} />;
      case 'expenses':
        return <ExpenseSplitter trip={trip} />;
      case 'roles':
        return <RoleAssignment trip={trip} />;
      case 'chat':
        return <GroupChat trip={trip} />;
      case 'ai':
        return <AISuggestions trip={trip} />;
      default:
        return <TripOverview trip={trip} />;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <Map className="title-icon" />
            TripPlan
          </h1>
          
          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar Navigation */}
        <nav className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-content">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'nav-item-active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-backdrop md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

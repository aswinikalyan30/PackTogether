import React, { useState } from 'react';
import { Trip, Expense } from '../App';
import { 
  Plus,
  DollarSign,
  Receipt,
  Users,
  TrendingUp,
  PieChart,
  Download,
  Filter,
  X
} from 'lucide-react';

interface Props {
  trip: Trip;
}

const ExpenseSplitter: React.FC<Props> = ({ trip }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample expenses data
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Tokyo Hotel Booking',
      amount: 1200,
      paidBy: '1',
      category: 'accommodation',
      splitBetween: ['1', '2', '3', '4'],
      date: '2024-01-10'
    },
    {
      id: '2',
      title: 'Group Dinner at Sushi Restaurant',
      amount: 280,
      paidBy: '2',
      category: 'food',
      splitBetween: ['1', '2', '3', '4'],
      date: '2024-01-12'
    },
    {
      id: '3',
      title: 'Train Tickets (JR Pass)',
      amount: 560,
      paidBy: '3',
      category: 'transport',
      splitBetween: ['1', '2', '3', '4'],
      date: '2024-01-08'
    },
    {
      id: '4',
      title: 'Tokyo Skytree Tickets',
      amount: 120,
      paidBy: '1',
      category: 'activities',
      splitBetween: ['1', '2', '3'],
      date: '2024-01-15'
    },
    {
      id: '5',
      title: 'Souvenirs Shopping',
      amount: 85,
      paidBy: '4',
      category: 'shopping',
      splitBetween: ['4'],
      date: '2024-01-18'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', color: 'gray' },
    { id: 'accommodation', name: 'Accommodation', color: 'blue' },
    { id: 'food', name: 'Food & Dining', color: 'green' },
    { id: 'transport', name: 'Transport', color: 'purple' },
    { id: 'activities', name: 'Activities', color: 'orange' },
    { id: 'shopping', name: 'Shopping', color: 'pink' },
    { id: 'other', name: 'Other', color: 'gray' }
  ];

  const getMemberName = (memberId: string) => {
    return trip.members.find(member => member.id === memberId)?.name || 'Unknown';
  };

  const getTotalExpenses = () => {
    const filteredExpenses = selectedCategory === 'all' 
      ? expenses 
      : expenses.filter(expense => expense.category === selectedCategory);
    
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getMemberBalance = (memberId: string) => {
    let totalPaid = 0;
    let totalOwed = 0;

    expenses.forEach(expense => {
      if (expense.paidBy === memberId) {
        totalPaid += expense.amount;
      }
      if (expense.splitBetween.includes(memberId)) {
        totalOwed += expense.amount / expense.splitBetween.length;
      }
    });

    return totalPaid - totalOwed;
  };

  const getCategoryTotal = (categoryId: string) => {
    return expenses
      .filter(expense => expense.category === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getFilteredExpenses = () => {
    return selectedCategory === 'all' 
      ? expenses 
      : expenses.filter(expense => expense.category === selectedCategory);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'gray';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalExpenses = getTotalExpenses();
  const filteredExpenses = getFilteredExpenses();

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Splitter</h1>
          <p className="text-gray-600">Track and split trip expenses fairly</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalExpenses)}
                </div>
                <div className="text-sm text-gray-500">Total Expenses</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalExpenses / trip.members.length)}
                </div>
                <div className="text-sm text-gray-500">Per Person</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {expenses.length}
                </div>
                <div className="text-sm text-gray-500">Total Transactions</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Filter & Breakdown */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title">Categories</h3>
            </div>
            <div className="card-content p-0">
              <div className="space-y-1">
                {categories.map((category) => {
                  const total = category.id === 'all' 
                    ? getTotalExpenses() 
                    : getCategoryTotal(category.id);
                  const percentage = totalExpenses > 0 
                    ? (total / getTotalExpenses()) * 100 
                    : 0;

                  return (
                    <button
                      key={category.id}
                      className={`w-full text-left p-3 border-b transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-blue-50 border-blue-200 text-blue-900' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-3 h-3 rounded-full bg-${category.color}-500`}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(total)}</div>
                          {category.id !== 'all' && (
                            <div className="text-xs text-gray-500">
                              {percentage.toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Member Balances */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Member Balances</h3>
              <p className="card-subtitle">Who owes what</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {trip.members.map((member) => {
                  const balance = getMemberBalance(member.id);
                  const isPositive = balance > 0;

                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm">
                          {member.avatar}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className={`font-semibold ${
                        isPositive ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {isPositive ? '+' : ''}{formatCurrency(balance)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="card-title">
                    {selectedCategory === 'all' ? 'All Expenses' : 
                     categories.find(cat => cat.id === selectedCategory)?.name + ' Expenses'}
                  </h3>
                  <p className="card-subtitle">
                    {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} • {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h4>
                    <p className="text-gray-500 mb-4">
                      {selectedCategory === 'all' 
                        ? 'Start by adding your first expense'
                        : 'No expenses in this category yet'
                      }
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Expense
                    </button>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => (
                    <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{expense.title}</h4>
                            <span className={`badge badge-${getCategoryColor(expense.category)}`}>
                              {categories.find(cat => cat.id === expense.category)?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Paid by {getMemberName(expense.paidBy)}</span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Split {expense.splitBetween.length} way{expense.splitBetween.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(expense.amount / expense.splitBetween.length)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t">
                        <span className="text-sm text-gray-500">Split between:</span>
                        <div className="flex gap-1">
                          {expense.splitBetween.map((memberId) => {
                            const member = trip.members.find(m => m.id === memberId);
                            return (
                              <div key={memberId} className="avatar avatar-sm" title={member?.name}>
                                {member?.avatar}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Expense</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Expense Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Dinner at Sushi Restaurant"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select">
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Paid By</label>
                <select className="form-input form-select">
                  {trip.members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Split Between</label>
                <div className="space-y-2 mt-2">
                  {trip.members.map(member => (
                    <label key={member.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <div className="avatar avatar-sm">
                        {member.avatar}
                      </div>
                      <span className="text-sm font-medium">{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  defaultValue={new Date().toISOString().split('T')[0]}
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSplitter;
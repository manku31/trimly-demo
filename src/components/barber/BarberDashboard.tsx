import React, { useState } from 'react';
import { Clock, Users, DollarSign, Calendar, QrCode, Settings, UserX } from 'lucide-react';
import { mockQueueEntries, mockBarberShops, mockServices } from '../../data/mockData';
import { QueueEntry, Service } from '../../types';
import Header from '../common/Header';

const BarberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'services' | 'analytics'>('queue');
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>(mockQueueEntries);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [showQRCode, setShowQRCode] = useState(false);

  const shop = mockBarberShops[0]; // Current barber's shop

  const completeService = (entryId: string) => {
    setQueueEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'completed' as const } : entry
      )
    );
  };

  const removeFromQueue = (entryId: string) => {
    setQueueEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'cancelled' as const } : entry
      )
    );
  };

  const generateQRCode = () => {
    return `https://trimly.app/join/${shop.id}`;
  };

  const activeQueue = queueEntries.filter(entry => entry.status === 'waiting');
  const totalEarnings = queueEntries
    .filter(entry => entry.status === 'completed')
    .reduce((sum, entry) => {
      const service = services.find(s => s.id === entry.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Barber Dashboard</h1>
          <p className="text-gray-600">Manage your queue and services at {shop.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Queue Length</p>
                <p className="text-2xl font-bold text-gray-900">{activeQueue.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeQueue.length > 0 
                    ? Math.round(activeQueue.reduce((sum, entry) => sum + entry.estimatedWaitTime, 0) / activeQueue.length)
                    : 0
                  } min
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queueEntries.filter(entry => entry.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'queue', label: 'Current Queue', icon: Users },
                { id: 'services', label: 'Services', icon: Settings },
                { id: 'analytics', label: 'Analytics', icon: DollarSign }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'queue' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Current Queue</h2>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <QrCode size={18} />
                    <span>Show QR Code</span>
                  </button>
                </div>

                {showQRCode && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-4">Walk-in QR Code</h3>
                      <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                        <QrCode size={120} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Customers can scan this code to join your queue
                      </p>
                      <p className="text-xs text-gray-500 font-mono">{generateQRCode()}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {activeQueue.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="text-gray-400 mx-auto mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No customers in queue</h3>
                      <p className="text-gray-600">Queue entries will appear here as customers join</p>
                    </div>
                  ) : (
                    activeQueue.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`bg-gray-50 rounded-xl p-4 ${
                          index === 0 ? 'ring-2 ring-teal-500 bg-teal-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-teal-600' : 'bg-gray-400'
                            }`}>
                              {entry.position}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{entry.customerName}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>
                                  {services.find(s => s.id === entry.serviceId)?.name}
                                </span>
                                <span>•</span>
                                <span>{entry.estimatedWaitTime} min wait</span>
                                <span>•</span>
                                <span>Joined {new Date(entry.joinedAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {index === 0 && (
                              <button
                                onClick={() => completeService(entry.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => removeFromQueue(entry.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <UserX size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Service Management</h2>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map(service => (
                    <div key={service.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings size={18} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">${service.price}</span>
                          <span className="text-sm text-gray-600">{service.duration} min</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-teal-600 hover:bg-teal-50 px-3 py-1 rounded text-sm transition-colors">
                            Edit
                          </button>
                          <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics & Insights</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Today's Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Customers</span>
                        <span className="font-medium">{queueEntries.filter(e => e.status === 'completed').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium">${totalEarnings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Service Time</span>
                        <span className="font-medium">32 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Rating</span>
                        <span className="font-medium">4.8 ⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Popular Services</h3>
                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <div key={service.id} className="flex justify-between items-center">
                          <span className="text-gray-600">{service.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-teal-600 h-2 rounded-full" 
                                style={{ width: `${(services.length - index) * 25}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{(services.length - index) * 25}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
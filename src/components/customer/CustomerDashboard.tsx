import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import { mockBarberShops } from '../../data/mockData';
import { BarberShop } from '../../types';
import ShopCard from './ShopCard';
import ShopDetails from './ShopDetails';
import Header from '../common/Header';

const CustomerDashboard: React.FC = () => {
  const [shops, setShops] = useState<BarberShop[]>(mockBarberShops);
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'queue'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          // In a real app, we'd calculate actual distances here
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const filteredAndSortedShops = shops
    .filter(shop =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'queue':
          return a.queueLength - b.queueLength;
        default:
          return 0;
      }
    });

  if (selectedShop) {
    return (
      <ShopDetails
        shop={selectedShop}
        onBack={() => setSelectedShop(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold gradient-text mb-2">Find Your Perfect Barber</h1>
          <p className="text-gray-600 text-lg">Discover nearby barbershops and join the queue digitally</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fadeInScale hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" size={20} />
              <input
                type="text"
                placeholder="Search barbershops or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-teal-300"
              />
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-gray-600 animate-slideInRight">
              <MapPin size={20} />
              <span className="text-sm">
                {locationGranted ? 'New York, NY' : 'Enable location for better results'}
              </span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-teal-300"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="queue">Sort by Queue Length</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeInUp">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-teal-300">
                    <option>Any price</option>
                    <option>$10 - $25</option>
                    <option>$25 - $50</option>
                    <option>$50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-teal-300">
                    <option>Any rating</option>
                    <option>4.5+ stars</option>
                    <option>4.0+ stars</option>
                    <option>3.5+ stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-teal-300">
                    <option>All shops</option>
                    <option>Open now</option>
                    <option>Short queue only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6 animate-slideInRight">
          <p className="text-gray-600">
            {filteredAndSortedShops.length} barbershops found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span>Average rating: 4.7</span>
          </div>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedShops.map((shop, index) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onClick={() => setSelectedShop(shop)}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedShops.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No barbershops found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
import React from 'react';
import { Star, Clock, Users, Navigation } from 'lucide-react';
import { BarberShop } from '../../types';

interface ShopCardProps {
  shop: BarberShop;
  onClick: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  const getQueueStatus = () => {
    if (shop.queueLength === 0) return { text: 'No wait', color: 'text-green-600' };
    if (shop.queueLength <= 2) return { text: 'Short wait', color: 'text-yellow-600' };
    return { text: 'Long wait', color: 'text-red-600' };
  };

  const queueStatus = getQueueStatus();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-teal-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">{shop.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        </div>
        {shop.distance && (
          <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg">
            <div className="flex items-center space-x-1">
              <Navigation size={12} />
              <span className="text-sm font-medium">{shop.distance} mi</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
            {shop.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm font-medium text-gray-700">{shop.rating}</span>
            <span className="text-sm text-gray-500">({shop.reviewCount})</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{shop.address}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{shop.queueLength} in queue</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} className="text-gray-500" />
              <span className={`text-sm font-medium ${queueStatus.color}`}>
                {queueStatus.text}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">From</p>
            <p className="text-lg font-bold text-gray-900">
              ${Math.min(...shop.services.map(s => s.price))}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {shop.services.slice(0, 3).map(service => (
            <span
              key={service.id}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {service.name}
            </span>
          ))}
          {shop.services.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              +{shop.services.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
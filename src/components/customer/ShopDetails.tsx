import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Users, MapPin, Phone, QrCode } from 'lucide-react';
import { BarberShop, Service, Barber } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';

interface ShopDetailsProps {
  shop: BarberShop;
  onBack: () => void;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({ shop, onBack }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const { user } = useAuth();
  const { joinQueue, getCurrentUserQueueEntry } = useQueue();

  const currentQueueEntry = user ? getCurrentUserQueueEntry(user.id) : null;

  const handleJoinQueue = () => {
    if (!selectedService || !user) return;

    const estimatedWaitTime = shop.queueLength * (selectedService.duration + 5);

    joinQueue({
      customerId: user.id,
      customerName: user.name,
      shopId: shop.id,
      barberId: selectedBarber?.id,
      serviceId: selectedService.id,
      estimatedWaitTime,
      status: 'waiting',
      notificationSent: false
    });
  };

  const generateQRCodeData = () => {
    return JSON.stringify({
      shopId: shop.id,
      shopName: shop.name,
      timestamp: Date.now()
    });
  };

  if (currentQueueEntry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to shops</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're in the queue!</h2>
            <p className="text-gray-600 mb-6">You're currently #{currentQueueEntry.position} in line at {shop.name}</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Estimated wait</p>
                  <p className="text-2xl font-bold text-teal-600">{currentQueueEntry.estimatedWaitTime} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-2xl font-bold text-teal-600">#{currentQueueEntry.position}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                View on Map
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to shops</span>
          </button>
        </div>
      </div>

      {/* Shop Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400 fill-current" size={20} />
              <span className="font-medium">{shop.rating}</span>
              <span className="opacity-80">({shop.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={20} />
              <span>{shop.queueLength} in queue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="space-y-4">
                {shop.services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            <Clock size={14} className="inline mr-1" />
                            {service.duration} min
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barbers */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Our Barbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shop.barbers.map(barber => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedBarber?.id === barber.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!barber.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{barber.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-400 fill-current" size={14} />
                          <span className="text-sm text-gray-600">{barber.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {barber.specialties.slice(0, 2).map(specialty => (
                            <span
                              key={specialty}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${barber.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Any barber available:</strong> Select this option to be assigned to the next available barber
                </p>
                <button
                  onClick={() => setSelectedBarber(null)}
                  className={`mt-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedBarber === null
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Any Available Barber
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shop Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-500 mt-1" size={16} />
                  <div>
                    <p className="text-gray-900">{shop.address}</p>
                    <button className="text-teal-600 text-sm hover:underline">
                      Get directions
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-gray-900">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Queue Management */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Join Queue</h3>
              
              {selectedService ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{selectedService.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">${selectedService.price} • {selectedService.duration} min</p>
                    {selectedBarber && (
                      <p className="text-sm text-gray-600 mt-1">with {selectedBarber.name}</p>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <Clock size={14} className="inline mr-1" />
                      Estimated wait: {shop.queueLength * (selectedService.duration + 5)} minutes
                    </p>
                  </div>

                  <button
                    onClick={handleJoinQueue}
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                  >
                    Join Queue
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">Select a service to join the queue</p>
              )}
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Walk-in Option</h3>
              <p className="text-sm text-gray-600 mb-4">
                Already at the shop? Scan the QR code to join the queue instantly.
              </p>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode size={20} />
                <span>Show QR Code</span>
              </button>
              
              {showQRCode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode size={80} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">QR Code for {shop.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
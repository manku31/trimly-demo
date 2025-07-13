import { BarberShop, Service, Barber, QueueEntry } from '../types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    price: 25,
    duration: 30,
    description: 'Traditional haircut with styling'
  },
  {
    id: '2',
    name: 'Beard Trim',
    price: 15,
    duration: 20,
    description: 'Professional beard shaping and trimming'
  },
  {
    id: '3',
    name: 'Hair Wash & Cut',
    price: 35,
    duration: 45,
    description: 'Complete service with wash, cut, and style'
  },
  {
    id: '4',
    name: 'Hot Towel Shave',
    price: 30,
    duration: 40,
    description: 'Traditional hot towel shave experience'
  }
];

export const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.8,
    specialties: ['Classic Cuts', 'Beard Styling'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Carlos Rodriguez',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.9,
    specialties: ['Modern Cuts', 'Hot Shaves'],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Alex Thompson',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.7,
    specialties: ['Fade Cuts', 'Hair Styling'],
    isAvailable: false
  }
];

export const mockBarberShops: BarberShop[] = [
  {
    id: '1',
    name: 'Elite Cuts Barbershop',
    address: '123 Main Street, Downtown',
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=500',
    services: mockServices,
    barbers: mockBarbers,
    queueLength: 3,
    isOpen: true,
    distance: 0.8,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    name: 'Classic Gentleman',
    address: '456 Oak Avenue, Midtown',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=500',
    services: mockServices.slice(0, 3),
    barbers: mockBarbers.slice(0, 2),
    queueLength: 1,
    isOpen: true,
    distance: 1.2,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: '3',
    name: 'Modern Styles Studio',
    address: '789 Pine Street, Uptown',
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=500',
    services: mockServices,
    barbers: mockBarbers,
    queueLength: 5,
    isOpen: true,
    distance: 2.1,
    coordinates: { lat: 40.7831, lng: -73.9712 }
  }
];

export const mockQueueEntries: QueueEntry[] = [
  {
    id: '1',
    customerId: 'user1',
    customerName: 'John Smith',
    shopId: '1',
    barberId: '1',
    serviceId: '1',
    position: 1,
    estimatedWaitTime: 15,
    status: 'waiting',
    joinedAt: new Date(Date.now() - 10 * 60 * 1000),
    notificationSent: false
  },
  {
    id: '2',
    customerId: 'user2',
    customerName: 'Sarah Johnson',
    shopId: '1',
    barberId: '2',
    serviceId: '3',
    position: 2,
    estimatedWaitTime: 40,
    status: 'waiting',
    joinedAt: new Date(Date.now() - 5 * 60 * 1000),
    notificationSent: false
  }
];
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'barber';
  avatar?: string;
}

export interface BarberShop {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  services: Service[];
  barbers: Barber[];
  queueLength: number;
  isOpen: boolean;
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialties: string[];
  isAvailable: boolean;
}

export interface QueueEntry {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  barberId?: string;
  serviceId: string;
  position: number;
  estimatedWaitTime: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  joinedAt: Date;
  notificationSent: boolean;
}

export interface Notification {
  id: string;
  type: 'queue-update' | 'turn-coming' | 'ready' | 'delay';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
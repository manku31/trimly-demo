import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QueueEntry, Notification } from '../types';
import { mockQueueEntries } from '../data/mockData';

interface QueueContextType {
  queueEntries: QueueEntry[];
  notifications: Notification[];
  joinQueue: (entry: Omit<QueueEntry, 'id' | 'position' | 'joinedAt'>) => void;
  updateQueuePosition: (entryId: string, newPosition: number) => void;
  completeService: (entryId: string) => void;
  cancelQueue: (entryId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getCurrentUserQueueEntry: (userId: string) => QueueEntry | null;
}

const QueueContext = createContext<QueueContextType | null>(null);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

interface QueueProviderProps {
  children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>(mockQueueEntries);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate real-time queue updates
    const interval = setInterval(() => {
      setQueueEntries(prev => 
        prev.map(entry => {
          if (entry.status === 'waiting' && entry.estimatedWaitTime > 0) {
            const newWaitTime = Math.max(0, entry.estimatedWaitTime - 1);
            
            // Send notification when user is next (5 minutes remaining)
            if (newWaitTime <= 5 && !entry.notificationSent) {
              addNotification({
                type: 'turn-coming',
                title: 'Your turn is coming!',
                message: `You're next in line at the barbershop. Please head over in the next 5 minutes.`
              });
              
              return { ...entry, estimatedWaitTime: newWaitTime, notificationSent: true };
            }
            
            return { ...entry, estimatedWaitTime: newWaitTime };
          }
          return entry;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const joinQueue = (entryData: Omit<QueueEntry, 'id' | 'position' | 'joinedAt'>) => {
    const shopQueueEntries = queueEntries.filter(entry => 
      entry.shopId === entryData.shopId && entry.status === 'waiting'
    );
    
    const newEntry: QueueEntry = {
      ...entryData,
      id: Math.random().toString(36).substr(2, 9),
      position: shopQueueEntries.length + 1,
      joinedAt: new Date()
    };

    setQueueEntries(prev => [...prev, newEntry]);
    
    addNotification({
      type: 'queue-update',
      title: 'Successfully joined queue!',
      message: `You're #${newEntry.position} in line. Estimated wait time: ${newEntry.estimatedWaitTime} minutes.`
    });
  };

  const updateQueuePosition = (entryId: string, newPosition: number) => {
    setQueueEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, position: newPosition } : entry
      )
    );
  };

  const completeService = (entryId: string) => {
    setQueueEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'completed' as const } : entry
      )
    );
  };

  const cancelQueue = (entryId: string) => {
    setQueueEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'cancelled' as const } : entry
      )
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const getCurrentUserQueueEntry = (userId: string): QueueEntry | null => {
    return queueEntries.find(entry => 
      entry.customerId === userId && (entry.status === 'waiting' || entry.status === 'in-progress')
    ) || null;
  };

  return (
    <QueueContext.Provider value={{
      queueEntries,
      notifications,
      joinQueue,
      updateQueuePosition,
      completeService,
      cancelQueue,
      markNotificationRead,
      getCurrentUserQueueEntry
    }}>
      {children}
    </QueueContext.Provider>
  );
};
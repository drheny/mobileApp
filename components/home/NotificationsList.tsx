import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';
import type { Notification } from '../../types';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Syringe, Calendar } from 'lucide-react';

const SWIPE_THRESHOLD = -75;

const NotificationItem: React.FC<{
  notif: Notification;
  onDelete: () => void;
}> = ({ notif, onDelete }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, x: '-100%', transition: { duration: 0.2 } }} // This handles the 'list-item-exit' animation.
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-red-500 flex justify-end items-center pr-6 pointer-events-none">
        <Trash2 className="h-5 w-5 text-white" />
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(event, info) => {
          if (info.offset.x < SWIPE_THRESHOLD) {
            onDelete();
          }
        }}
        className="relative p-4 flex items-start space-x-4 bg-white z-10 cursor-grab active:cursor-grabbing"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notif.read ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
          <notif.icon className="h-5 w-5" />
        </div>
        <div className="flex-grow">
          <p className={`font-semibold text-sm ${!notif.read ? 'text-text-primary' : 'text-text-secondary'}`}>{notif.title}</p>
          <p className="text-xs text-text-secondary">{notif.description}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end">
          <span className="text-xs text-gray-400">{notif.time}</span>
          {!notif.read && <div className="mt-1 w-2 h-2 rounded-full bg-accent"></div>}
        </div>
      </motion.div>
    </motion.li>
  );
};

const NotificationsList: React.FC = () => {
  const { vaccines, appointments, selectedChild } = useContext(AppContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);

    const isTomorrow = (dateString: string | null): boolean => {
      if (!dateString) return false;
      // Safely parse YYYY-MM-DD to avoid timezone issues
      const parts = dateString.split('-').map(p => parseInt(p, 10));
      const eventDate = new Date(parts[0], parts[1] - 1, parts[2]);
      
      return eventDate.getFullYear() === tomorrow.getFullYear() &&
             eventDate.getMonth() === tomorrow.getMonth() &&
             eventDate.getDate() === tomorrow.getDate();
    };

    if (selectedChild) {
      // Generate vaccine reminders
      vaccines
        .filter(v => v.childId === selectedChild.id && v.status === 'à faire' && v.reminder && isTomorrow(v.appointmentDate))
        .forEach(vaccine => {
          generatedNotifications.push({
            id: `vaccine-${vaccine.id}`,
            icon: Syringe,
            title: 'Rappel de vaccination',
            description: `Le vaccin "${vaccine.name}" de ${selectedChild.name} est prévu demain.`,
            time: 'Rappel',
            read: false,
          });
        });

      // Generate appointment reminders
      appointments
        .filter(a => a.childId === selectedChild.id && a.status === 'confirmé' && isTomorrow(a.date))
        .forEach(appointment => {
          generatedNotifications.push({
            id: `appt-${appointment.id}`,
            icon: Calendar,
            title: 'Rappel de rendez-vous',
            description: `N'oubliez pas le RDV de ${selectedChild.name} demain à ${appointment.time}.`,
            time: 'Rappel',
            read: false,
          });
        });
    }
    
    // Combine dynamic notifications with static ones, with dynamic ones first
    const combinedNotifications = [...generatedNotifications, ...MOCK_NOTIFICATIONS];
    
    // Limit to the 4 most recent/relevant notifications
    setNotifications(combinedNotifications.slice(0, 4));

  }, [vaccines, appointments, selectedChild]);

  const handleDelete = (id: number | string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-3">Notifications</h3>
      <Card className="p-0">
        <ul className="divide-y divide-gray-100">
          <AnimatePresence initial={false}>
            {notifications.map(notif => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onDelete={() => handleDelete(notif.id)}
              />
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
            <li className="p-8 text-center text-sm text-text-secondary">
              <p>Aucune notification pour le moment.</p>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default NotificationsList;
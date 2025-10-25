import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';

const NotificationsPanel: React.FC = () => {
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2, ease: 'easeOut' } },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={panelVariants}
      className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 origin-top-right"
    >
      <div className="p-4 border-b border-gray-100">
        <h4 className="font-semibold text-text-primary">Notifications</h4>
      </div>
      
      {MOCK_NOTIFICATIONS.length > 0 ? (
        <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <li
              key={notif.id}
              className="p-4 flex items-start space-x-4 hover:bg-light transition-colors"
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
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-text-secondary">
          <p>Vous n'avez aucune notification.</p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPanel;
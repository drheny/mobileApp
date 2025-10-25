import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AppContext';
import { Bell, UserCircle } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';
import NotificationsPanel from './NotificationsPanel';
import { AnimatePresence, motion } from 'framer-motion';

const Header: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasUnread = MOCK_NOTIFICATIONS.some(n => !n.read);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [panelRef]);
  
  return (
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto h-28 bg-white/60 backdrop-blur-3xl z-50 px-6 flex justify-between items-center border-b border-white/20 shadow-sm overflow-hidden">
        <motion.div
            className="absolute inset-0 w-full h-full -z-10"
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(74, 144, 226, 0.15), rgba(80, 227, 194, 0.15), rgba(245, 166, 35, 0.1))',
                backgroundSize: '400% 400%',
            }}
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
                duration: 20,
                ease: 'linear',
                repeat: Infinity,
            }}
        />

      <div className="flex flex-col">
        <p className="text-md text-text-secondary drop-shadow-sm">Bienvenue,</p>
        <h1 className="text-2xl font-bold text-dark tracking-tight drop-shadow-sm">{user?.name}</h1>
      </div>
      <div className="flex items-center space-x-5">
        <div ref={panelRef} className="relative">
          <button onClick={() => setIsPanelOpen(prev => !prev)} className="relative transform transition-transform hover:scale-110">
            <Bell className="text-dark h-7 w-7 drop-shadow-sm" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            )}
          </button>
          <AnimatePresence>
            {isPanelOpen && <NotificationsPanel />}
          </AnimatePresence>
        </div>
        
        {user?.role === 'guest' ? (
          <UserCircle className="text-gray-400 h-12 w-12" />
        ) : (
          <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md" />
        )}
      </div>
    </header>
  );
};

export default Header;

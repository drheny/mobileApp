import React, { useContext } from 'react';
import { Home, Calendar, MessageSquare, BookOpen, HeartPulse } from 'lucide-react';
import { View, UserRole } from '../../types';
import { AuthContext, AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative z-10 flex-1 flex flex-col items-center justify-center h-full transition-colors duration-200 focus:outline-none group"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div 
        className="relative flex flex-col items-center transition-transform"
        style={isActive ? { filter: 'drop-shadow(0 2px 5px rgba(74, 144, 226, 0.6))' } : {}}
      >
        <Icon
          className={`h-6 w-6 mb-1 transition-all duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary/80'}`}
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
        <span className={`text-xs font-semibold transition-colors ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary/80'}`}>
          {label}
        </span>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-nav-halo"
          className="absolute w-14 h-14 bg-primary/10 rounded-full -z-10"
          style={{ filter: 'blur(15px)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
    </motion.button>
  );
};


const BottomNav: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { activeView, setActiveView } = useContext(AppContext);
  const isVerified = user?.role === UserRole.VerifiedPatient;

  const navItems = [
    { view: View.Home, display: View.Home, icon: Home, roles: [UserRole.Guest, UserRole.VerifiedPatient] },
    { view: View.Appointments, display: 'RDV', icon: Calendar, roles: [UserRole.Guest, UserRole.VerifiedPatient] },
    { view: View.Messages, display: View.Messages, icon: MessageSquare, roles: [UserRole.VerifiedPatient] },
    { view: View.Library, display: View.Library, icon: BookOpen, roles: [UserRole.Guest, UserRole.VerifiedPatient] },
    { view: View.Tracker, display: View.Tracker, icon: HeartPulse, roles: [UserRole.VerifiedPatient] },
  ].filter(item => item.roles.includes(user?.role || UserRole.Guest));

  return (
    <nav className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary/20 rounded-3xl h-20 z-50">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.display}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
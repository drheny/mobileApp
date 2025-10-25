import React, { useContext } from 'react';
import { CalendarPlus, MessageCircleWarning, Video } from 'lucide-react';
import { AppContext, AuthContext } from '../../context/AppContext';
import { UserRole, View, AppointmentType } from '../../types';
import { motion } from 'framer-motion';

const ActionButton: React.FC<{ icon: React.ElementType, label: string, disabled?: boolean, onClick?: () => void }> = ({ icon: Icon, label, disabled, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      className={`flex flex-col items-center space-y-2 text-center transition-opacity duration-200 ${disabled ? 'opacity-40 cursor-not-allowed' : 'text-text-primary'}`}
      disabled={disabled}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${disabled ? 'bg-gray-200' : 'bg-primary/10 text-primary'}`}>
        <Icon className="h-7 w-7" />
      </div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

const QuickActions: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { setActiveView, setInitialAppointmentType } = useContext(AppContext);
  const isVerified = user?.role === UserRole.VerifiedPatient;

  const handleNewAppointment = () => {
    setInitialAppointmentType(null);
    setActiveView(View.NewAppointment);
  };

  const handleUrgentMessage = () => {
    setActiveView(View.UrgentMessage);
  };

  const handleTeleconsultation = () => {
    setInitialAppointmentType(AppointmentType.Teleconsultation);
    setActiveView(View.NewAppointment);
  };


  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Actions rapides</h3>
      <div className="grid grid-cols-3 gap-4">
        <ActionButton icon={CalendarPlus} label="Prendre RDV" onClick={handleNewAppointment} />
        <ActionButton icon={MessageCircleWarning} label="Message Urgent" onClick={handleUrgentMessage} disabled={!isVerified} />
        <ActionButton icon={Video} label="Télé-consultation" onClick={handleTeleconsultation} disabled={!isVerified} />
      </div>
    </div>
  );
};

export default QuickActions;
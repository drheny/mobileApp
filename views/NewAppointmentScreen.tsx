
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { View, AppointmentType, Appointment } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock available time slots for simplicity
const AVAILABLE_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30"];
const APPOINTMENT_TYPES = [AppointmentType.Visite, AppointmentType.Controle, AppointmentType.Teleconsultation];

const Calendar: React.FC<{
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (newMonth: Date) => void;
}> = ({ currentMonth, selectedDate, onDateSelect, onMonthChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7; // 0 for Monday
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const prevMonth = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isPast = date < today;
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    
    calendarDays.push(
      <button
        key={day}
        disabled={isPast}
        onClick={() => onDateSelect(date)}
        className={`text-center p-2 rounded-full w-9 h-9 flex items-center justify-center transition-colors text-sm
          ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary/10'}
          ${isSelected ? 'bg-primary text-white font-bold' : 'text-text-primary'}`
        }
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-4 bg-light rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft className="h-5 w-5"/></button>
        <h4 className="font-semibold text-text-primary">
          {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h4>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight className="h-5 w-5"/></button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => <div key={day} className="text-center font-bold text-xs text-text-secondary">{day}</div>)}
        {calendarDays}
      </div>
    </div>
  );
};


const NewAppointmentScreen: React.FC = () => {
    const { 
      setActiveView, 
      children, 
      addAppointment, 
      editingAppointment, 
      updateAppointment, 
      selectAppointmentForEdit,
      initialAppointmentType,
      setInitialAppointmentType
    } = useContext(AppContext);
    
    const isEditMode = useMemo(() => !!editingAppointment, [editingAppointment]);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [childId, setChildId] = useState<string>(editingAppointment?.childId.toString() || children[0]?.id.toString() || '');
    const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null);
    const [reason, setReason] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

     useEffect(() => {
        if (isEditMode && editingAppointment) {
            setChildId(editingAppointment.childId.toString());
            setAppointmentType(editingAppointment.type);
            setReason(editingAppointment.reason);
            // Handle timezone offset to correctly display the date from YYYY-MM-DD string
            const date = new Date(editingAppointment.date);
            const tzOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() + tzOffset);
            setSelectedDate(localDate);
            setSelectedTime(editingAppointment.time);
            setCurrentMonth(localDate);
        } else if (initialAppointmentType) {
            setAppointmentType(initialAppointmentType);
            setInitialAppointmentType(null); // Reset after use
        }
    }, [isEditMode, editingAppointment, initialAppointmentType, setInitialAppointmentType]);

    const isFormValid = useMemo(() => {
        if (appointmentType === AppointmentType.Teleconsultation) {
            return !!(childId && appointmentType && selectedDate);
        }
        return !!(childId && appointmentType && reason && selectedDate && selectedTime);
    }, [childId, appointmentType, reason, selectedDate, selectedTime]);

    const handleSave = () => {
        if (!isFormValid || !selectedDate) return;
        
        const appointmentData = {
            childId: parseInt(childId),
            date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
            time: appointmentType === AppointmentType.Teleconsultation ? 'À confirmer' : selectedTime!,
            type: appointmentType!,
            reason: (appointmentType === AppointmentType.Teleconsultation && !reason.trim()) ? 'Demande de téléconsultation' : reason,
        };

        if (isEditMode && editingAppointment) {
            updateAppointment({
                ...appointmentData,
                id: editingAppointment.id,
                status: editingAppointment.status,
            });
        } else {
            addAppointment(appointmentData);
        }
    };

    const handleBack = () => {
        selectAppointmentForEdit(null); // Clear editing state
        setActiveView(View.Appointments);
    };
    
    const buttonText = isEditMode
        ? 'Enregistrer les modifications'
        : appointmentType === AppointmentType.Teleconsultation
        ? 'Enregistrer et attendre la confirmation'
        : 'Confirmer le rendez-vous';

    return (
        <div className="space-y-6 pb-6">
            <div className="flex items-center space-x-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="h-6 w-6 text-text-primary" />
                </button>
                <h2 className="text-2xl font-bold text-dark">{isEditMode ? 'Modifier le rendez-vous' : 'Nouveau Rendez-vous'}</h2>
            </div>

            <Card className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">1. Pour quel enfant ?</label>
                  <select
                      value={childId}
                      onChange={(e) => setChildId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary bg-white"
                      required
                  >
                      <option value="" disabled>Sélectionner un enfant</option>
                      {children.map(child => (
                          <option key={child.id} value={child.id}>{child.name}</option>
                      ))}
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">2. Type de consultation</label>
                    <div className="grid grid-cols-3 gap-2">
                        {APPOINTMENT_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    setAppointmentType(type);
                                    if(type === AppointmentType.Teleconsultation) {
                                        setSelectedTime(null); // Reset time for teleconsultation
                                    }
                                }}
                                className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors border ${
                                    appointmentType === type ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-text-secondary border-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="reason" className="block text-sm font-semibold text-text-secondary mb-2">3. Motif</label>
                    <input
                        type="text"
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                        placeholder="Ex: Contrôle, Fièvre, Vaccin..."
                        required
                    />
                </div>
            </Card>

            <Card>
                <label className="block text-sm font-semibold text-text-secondary mb-2">4. Choisir une date</label>
                <Calendar 
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                        setSelectedDate(date);
                        if (appointmentType !== AppointmentType.Teleconsultation) {
                            setSelectedTime(null); // Reset time when date changes
                        }
                    }}
                    onMonthChange={setCurrentMonth}
                />
            </Card>
            
            <AnimatePresence>
            {selectedDate && appointmentType !== AppointmentType.Teleconsultation && (
                <motion.div
                    key="time-selector"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <Card>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">5. Choisir un créneau</label>
                        <div className="grid grid-cols-4 gap-2">
                            {AVAILABLE_TIMES.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors border ${
                                        selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-text-secondary border-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {selectedDate && appointmentType === AppointmentType.Teleconsultation && (
                 <motion.div
                    key="teleconsult-info"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                 >
                    <Card className="bg-blue-50 border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 text-blue-500 pt-0.5">
                                <Info className="h-5 w-5"/>
                            </div>
                            <p className="text-sm text-blue-800 font-medium">
                                Ce service est indisponible pour le moment. Le médecin prendra contact avec vous pour convenir d'un créneau.
                            </p>
                        </div>
                    </Card>
                 </motion.div>
            )}
            </AnimatePresence>

            <div className="pt-2">
                <Button 
                    onClick={handleSave} 
                    variant="primary" 
                    className={`w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    icon={Save}
                    disabled={!isFormValid}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default NewAppointmentScreen;
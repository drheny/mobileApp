
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Appointment, View } from '../types';
import Modal from '../components/ui/Modal';

const AppointmentItem: React.FC<{ 
    appointment: Appointment,
    onEdit: (id: number) => void;
    onDelete: (appointment: Appointment) => void;
}> = ({ appointment, onEdit, onDelete }) => {
    const { children } = useContext(AppContext);
    const child = children.find(c => c.id === appointment.childId);
    const isPast = appointment.status === 'passé';

    return (
        <Card className={`mb-4 border-l-4 ${isPast ? 'border-gray-300' : 'border-primary'}`}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <img src={child?.avatar} alt={child?.name} className="h-12 w-12 rounded-full object-cover" />
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-text-primary">{appointment.reason}</p>
                    <p className="text-sm text-text-secondary">Pour <span className="font-semibold">{child?.name}</span> - {appointment.type}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                        <div className="flex items-center space-x-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString('fr-FR', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end justify-between h-full">
                    {isPast ? (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            <span>Passé</span>
                        </div>
                    ) : (
                         <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                             <CheckCircle className="h-3 w-3" />
                            <span>Confirmé</span>
                        </div>
                    )}
                     {!isPast && (
                        <div className="flex items-center space-x-1 mt-2">
                            <button onClick={() => onEdit(appointment.id)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => onDelete(appointment)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const AppointmentsScreen: React.FC = () => {
    const { appointments, setActiveView, selectAppointmentForEdit, deleteAppointment } = useContext(AppContext);
    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

    const sortedAppointments = useMemo(() => {
        return [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [appointments]);

    const upcomingAppointments = sortedAppointments.filter(a => a.status !== 'passé');
    const pastAppointments = sortedAppointments.filter(a => a.status === 'passé');
    
    const appointmentsToShow = filter === 'upcoming' ? upcomingAppointments : pastAppointments;

    const handleEdit = (id: number) => {
        selectAppointmentForEdit(id);
    };

    const handleDeleteRequest = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (appointmentToDelete) {
            deleteAppointment(appointmentToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setAppointmentToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-dark">Rendez-vous</h2>
              <Button onClick={() => setActiveView(View.NewAppointment)} icon={Plus} size="sm">
                  Nouveau
              </Button>
            </div>

            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${filter === 'upcoming' ? 'bg-white text-primary shadow' : 'text-text-secondary'}`}
                >
                    À venir ({upcomingAppointments.length})
                </button>
                <button
                    onClick={() => setFilter('past')}
                    className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${filter === 'past' ? 'bg-white text-primary shadow' : 'text-text-secondary'}`}
                >
                    Passés ({pastAppointments.length})
                </button>
            </div>

            <div>
                {appointmentsToShow.length > 0 ? (
                    appointmentsToShow.map(app => (
                        <AppointmentItem 
                            key={app.id} 
                            appointment={app} 
                            onEdit={handleEdit} 
                            onDelete={handleDeleteRequest} 
                        />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-text-secondary">Aucun rendez-vous {filter === 'upcoming' ? 'à venir' : 'passé'}.</p>
                    </div>
                )}
            </div>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmer la suppression"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleDeleteConfirm} 
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            Supprimer
                        </Button>
                    </>
                }
            >
                <p className="text-text-secondary">
                    Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
                </p>
            </Modal>
        </div>
    );
};

export default AppointmentsScreen;
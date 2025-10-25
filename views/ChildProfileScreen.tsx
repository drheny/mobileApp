
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { View, GrowthRecord, Appointment, Vaccine } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Edit3, HeartPulse, Calendar, Syringe, Save } from 'lucide-react';
import { MOCK_GROWTH_DATA, MOCK_APPOINTMENTS, MOCK_VACCINES } from '../services/mockData';

const calculateAge = (birthDate: string): string => {
  if (!birthDate) return "N/A";
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
};

const InfoCard: React.FC<{icon: React.ElementType, title: string, value: string, subValue?: string}> = ({ icon: Icon, title, value, subValue }) => (
    <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="font-semibold text-text-primary">{value}</p>
            {subValue && <p className="text-xs text-text-secondary">{subValue}</p>}
        </div>
    </div>
);

const ChildProfileScreen: React.FC = () => {
    const { selectedChild, addChild, updateChild, setActiveView } = useContext(AppContext);

    const isEditMode = useMemo(() => !!selectedChild, [selectedChild]);

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatar, setAvatar] = useState('https://picsum.photos/seed/new/200/200');

    useEffect(() => {
        if (isEditMode && selectedChild) {
            setName(selectedChild.name);
            setBirthDate(selectedChild.birthDate);
            setAvatar(selectedChild.avatar);
        }
    }, [isEditMode, selectedChild]);

    const handleSave = () => {
        if (isEditMode && selectedChild) {
            updateChild({ ...selectedChild, name, birthDate, avatar });
        } else {
            addChild({ name, birthDate, avatar });
        }
    };
    
    // Mock data fetching logic
    const childsGrowthData = MOCK_GROWTH_DATA.filter(d => d.childId === selectedChild?.id);
    const lastMeasurement: GrowthRecord | undefined = childsGrowthData[childsGrowthData.length - 1];
    const nextAppointment: Appointment | undefined = MOCK_APPOINTMENTS.find(a => a.childId === selectedChild?.id && a.status === 'confirmé' && new Date(a.date) > new Date());
    const nextVaccine: Vaccine | undefined = MOCK_VACCINES.find(v => v.childId === selectedChild?.id && v.status === 'à faire');
    
    const nextEvent = nextAppointment 
      ? { type: 'Rendez-vous', icon: Calendar, value: nextAppointment.type, date: new Date(nextAppointment.date).toLocaleDateString('fr-FR') }
      : nextVaccine 
      ? { type: 'Vaccin', icon: Syringe, value: nextVaccine.name, date: `Prévu à ${nextVaccine.age}` }
      : { type: 'Aucun', icon: Calendar, value: 'Aucun événement à venir', date: ''};

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => setActiveView(View.Home)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="h-6 w-6 text-text-primary" />
                </button>
                <h2 className="text-2xl font-bold text-dark">{isEditMode ? `Profil de ${selectedChild?.name}` : "Nouveau Profil"}</h2>
            </div>

            <Card>
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <img src={avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
                        <button className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
                            <Edit3 className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nom & Prénom</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="birthdate" className="block text-sm font-medium text-text-secondary mb-1">Date de naissance</label>
                            <input type="date" id="birthdate" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                </div>
            </Card>

            {isEditMode && (
                 <Card className="space-y-4">
                     <h3 className="font-semibold text-text-primary mb-2">Résumé Santé</h3>
                     <InfoCard 
                        icon={HeartPulse} 
                        title="Âge" 
                        value={calculateAge(birthDate)} 
                     />
                     <InfoCard 
                        icon={HeartPulse} 
                        title="Dernières mesures" 
                        value={lastMeasurement ? `${lastMeasurement.weight} kg / ${lastMeasurement.height} cm` : 'N/A'}
                        subValue={lastMeasurement ? `à ${lastMeasurement.age} mois` : ''}
                     />
                      <InfoCard 
                        icon={nextEvent.icon} 
                        title={`Prochain ${nextEvent.type}`} 
                        value={nextEvent.value}
                        subValue={nextEvent.date}
                     />
                 </Card>
            )}

            <div className="space-y-3">
                {isEditMode && (
                    <Button onClick={() => setActiveView(View.Tracker)} variant="outline" className="w-full">
                        Voir le Carnet de Santé
                    </Button>
                )}
                 <Button onClick={handleSave} variant="primary" className="w-full" icon={Save}>
                    {isEditMode ? 'Enregistrer les modifications' : 'Enregistrer le profil'}
                </Button>
            </div>
        </div>
    );
};

export default ChildProfileScreen;
import React, { useState, useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { whoWeightForAge, whoHeightForAge, whoHeadCircumferenceForAge } from '../services/whoGrowthData';
import { AppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { CheckCircle, Clock, Image as ImageIcon, BarChart2, Syringe, HeartPulse, Plus, Bell, Camera, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import type { GrowthRecord, Vaccine, Photo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

type TrackerTab = 'Croissance' | 'Vaccins' | 'Album';
type GrowthMetric = 'weight' | 'height' | 'headCircumference';

const METRIC_CONFIG = {
    weight: { label: 'Poids', unit: 'kg', color: '#4A90E2', whoData: whoWeightForAge },
    height: { label: 'Taille', unit: 'cm', color: '#50E3C2', whoData: whoHeightForAge },
    headCircumference: { label: 'Périmètre Crânien', unit: 'cm', color: '#F5A623', whoData: whoHeadCircumferenceForAge },
};

const AddGrowthRecordForm: React.FC<{
    onSubmit: (record: Omit<GrowthRecord, 'childId' | 'age'>) => void;
}> = ({ onSubmit }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [headCircumference, setHeadCircumference] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && weight && height && headCircumference) {
            onSubmit({
                date,
                weight: parseFloat(weight),
                height: parseFloat(height),
                headCircumference: parseFloat(headCircumference),
            });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Date de la mesure</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Poids (kg)</label>
                <input type="number" step="0.1" placeholder="Ex: 5.4" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Taille (cm)</label>
                <input type="number" step="0.5" placeholder="Ex: 58.5" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Périmètre Crânien (cm)</label>
                <input type="number" step="0.1" placeholder="Ex: 40.2" value={headCircumference} onChange={e => setHeadCircumference(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required/>
            </div>
            <div className="pt-4 flex justify-end">
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
    );
};

const AddVaccineForm: React.FC<{
    onSubmit: (vaccine: Omit<Vaccine, 'id' | 'childId'>) => void;
}> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [status, setStatus] = useState<'à faire' | 'fait'>('à faire');
    const [date, setDate] = useState<string | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
    const [reminder, setReminder] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age) return;
        if (status === 'fait' && !date) {
            alert("Veuillez entrer la date du vaccin.");
            return;
        }
        if (status === 'à faire' && !appointmentDate) {
            alert("Veuillez entrer la date du rendez-vous pour le vaccin.");
            return;
        }

        onSubmit({
            name,
            age,
            status,
            date: status === 'fait' ? date : null,
            appointmentDate: status === 'à faire' ? appointmentDate : null,
            reminder: status === 'à faire' ? reminder : false,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nom du vaccin</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: ROR (1ère dose)" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Âge prévu</label>
                <input type="text" value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 12 mois" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Statut</label>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2"><input type="radio" name="status" value="à faire" checked={status === 'à faire'} onChange={() => setStatus('à faire')} className="text-primary focus:ring-primary"/><span>À faire</span></label>
                    <label className="flex items-center space-x-2"><input type="radio" name="status" value="fait" checked={status === 'fait'} onChange={() => setStatus('fait')} className="text-primary focus:ring-primary"/><span>Fait</span></label>
                </div>
            </div>
            {status === 'fait' && (
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date d'administration</label>
                    <input type="date" value={date || ''} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required />
                </div>
            )}
            {status === 'à faire' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Date du rendez-vous</label>
                        <input type="date" value={appointmentDate || ''} onChange={e => setAppointmentDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" id="reminder" checked={reminder} onChange={e => setReminder(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                        <label htmlFor="reminder" className="text-sm text-text-secondary">Activer un rappel la veille (J-1)</label>
                    </div>
                </>
            )}
            <div className="pt-4 flex justify-end">
                <Button type="submit">Enregistrer le vaccin</Button>
            </div>
        </form>
    );
};

const AddPhotoForm: React.FC<{
    onSubmit: (photo: { date: string, url: string }) => void;
}> = ({ onSubmit }) => {
    const { selectedChild } = useContext(AppContext);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [calculatedAge, setCalculatedAge] = useState('');

    useEffect(() => {
        if (date && selectedChild) {
            const birthDate = new Date(selectedChild.birthDate);
            const photoDate = new Date(date);

            if (photoDate < birthDate) {
                setCalculatedAge('Date invalide');
                return;
            }
            
            let months = (photoDate.getFullYear() - birthDate.getFullYear()) * 12;
            months -= birthDate.getMonth();
            months += photoDate.getMonth();
            
            if (photoDate.getDate() < birthDate.getDate()) {
                months--;
            }
            const ageInMonths = Math.max(0, months);

            if (ageInMonths === 0 && photoDate.getTime() - birthDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
                 setCalculatedAge('Nouveau-né');
                 return;
            }

            const years = Math.floor(ageInMonths / 12);
            const remainingMonths = ageInMonths % 12;
            
            let ageString = '';
            if (years > 0) {
                ageString += `${years} an${years > 1 ? 's' : ''}`;
            }
            if (remainingMonths > 0) {
                if (years > 0) ageString += ' et ';
                ageString += `${remainingMonths} mois`;
            }
            
            setCalculatedAge(ageString || (ageInMonths > 0 ? `${ageInMonths} mois` : 'Nouveau-né'));
        } else {
            setCalculatedAge('');
        }
    }, [date, selectedChild]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && photoFile && preview) {
            onSubmit({ date, url: preview });
        } else {
            alert("Veuillez sélectionner une date et une photo.");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Date de la photo</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Âge de l'enfant (calculé)</label>
                <input
                    type="text"
                    value={calculatedAge}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl"
                    placeholder="Sélectionnez une date"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Télécharger la photo</label>
                 <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                    <div className="space-y-1 text-center">
                        {preview ? (
                            <img src={preview} alt="Aperçu" className="mx-auto h-24 w-24 object-cover rounded-lg"/>
                        ) : (
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>{photoFile ? "Changer la photo" : "Sélectionner une photo"}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                 </div>
            </div>
            <div className="pt-4 flex justify-end">
                <Button type="submit">Enregistrer la Photo</Button>
            </div>
        </form>
    );
};

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (active && payload && payload.length) {
    const config = METRIC_CONFIG[metric as GrowthMetric];
    const data = payload[0].payload;
    const childValue = data[metric];
    
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="font-bold text-sm text-text-primary">{`Âge : ${label} mois`}</p>
        <ul className="mt-1 space-y-1">
          {childValue !== undefined && (
            <li className="flex items-center text-sm font-semibold" style={{ color: config.color }}>
              {`${config.label} : ${childValue.toFixed(1)} ${config.unit}`}
            </li>
          )}
          <li className="text-xs text-text-secondary mt-2 pt-2 border-t border-gray-200">
            {`Médiane OMS (P50) : ${data.p50.toFixed(1)} ${config.unit}`}
          </li>
        </ul>
      </div>
    );
  }
  return null;
};

const GrowthChart: React.FC<{ childData: GrowthRecord[], metric: GrowthMetric }> = ({ childData, metric }) => {
    const config = METRIC_CONFIG[metric];
    
    const combinedData = useMemo(() => {
        const childDataMap = new Map(childData.map(d => [d.age, d]));
        return config.whoData.map(who => {
            const record = childDataMap.get(who.age);
            return {
                ...who,
                [metric]: record ? record[metric] : undefined,
            };
        });
    }, [childData, metric, config.whoData]);

    const percentiles = ['p3', 'p15', 'p50', 'p85', 'p97'];

    return (
        <div className="h-80 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="age" name="Âge (mois)" unit="m" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                        name={config.label}
                        unit={config.unit}
                        stroke="#a0a0a0"
                        fontSize={12}
                        domain={['dataMin - 1', 'dataMax + 2']}
                        allowDataOverflow
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: '3 3' }}
                        content={<CustomTooltip metric={metric} />}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>

                    {percentiles.map(p => (
                        <Line
                            key={p}
                            type="monotone"
                            dataKey={p}
                            stroke="#e0e0e0"
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            dot={false}
                            name={`P${p.substring(1)}`}
                        />
                    ))}

                    <Line
                        type="monotone"
                        dataKey={metric}
                        name={config.label}
                        stroke={config.color}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 7, stroke: config.color, strokeWidth: 2, fill: '#fff' }}
                        connectNulls={false}
                        animationDuration={500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const VaccineItem: React.FC<{ vaccine: Vaccine }> = ({ vaccine }) => {
    const isDone = vaccine.status === 'fait';
    return (
        <li className="p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold text-sm text-text-primary">{vaccine.name}</p>
                <p className="text-xs text-text-secondary">Prévu à {vaccine.age}</p>
            </div>
            {isDone ? (
                <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-xs font-semibold">Fait le {new Date(vaccine.date!).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}</span>
                </div>
            ) : (
                <div className="flex items-center space-x-2 text-amber-600">
                    {vaccine.reminder && <Bell className="h-4 w-4" title="Rappel activé"/>}
                    <Clock className="h-5 w-5" />
                    <span className="text-xs font-semibold">
                        {vaccine.appointmentDate 
                            ? `Prévu le ${new Date(vaccine.appointmentDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}`
                            : 'À faire'
                        }
                    </span>
                </div>
            )}
        </li>
    );
};


const PhotoAlbum: React.FC<{ photos: Photo[], onAddPhoto: () => void }> = ({ photos, onAddPhoto }) => {
    const { selectedChild } = useContext(AppContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const sortedPhotos = useMemo(() => photos.sort((a, b) => a.age - b.age), [photos]);
    const canShare = useMemo(() => 'share' in navigator && 'canShare' in navigator, []);
    
    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex(prev => (prev + newDirection + sortedPhotos.length) % sortedPhotos.length);
    }, [sortedPhotos.length]);
    
    const intervalRef = useRef<number | null>(null);
    
    const startAutoplay = useCallback(() => {
        stopAutoplay();
        intervalRef.current = window.setInterval(() => {
            paginate(1);
        }, 4000); // Change photo every 4 seconds
    }, [paginate]);

    const stopAutoplay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
    
    useEffect(() => {
        if (sortedPhotos.length > 1) {
            startAutoplay();
        }
        return () => stopAutoplay();
    }, [sortedPhotos.length, startAutoplay]);


    if (sortedPhotos.length === 0) {
        return (
            <div className="text-center py-10">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="font-semibold text-text-primary">Commencez votre album photo !</h4>
                <p className="text-sm text-text-secondary mt-2 mb-4">Gardez les plus beaux souvenirs de leur croissance.</p>
                <Button onClick={onAddPhoto} icon={Plus}>Ajouter la première photo</Button>
            </div>
        );
    }
    
    const currentPhoto = sortedPhotos[currentIndex];

    const calculateAgeString = (ageInMonths: number) => {
        if (ageInMonths === 0) return 'Nouveau-né';
        const years = Math.floor(ageInMonths / 12);
        const months = ageInMonths % 12;
        if (years > 0) {
            return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
        }
        return `${months} mois`;
    };

    const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    };

    const handleShare = async () => {
        const ageString = calculateAgeString(currentPhoto.age);
        const childName = selectedChild?.name || 'mon enfant';
        
        try {
            const imageFile = await dataUrlToFile(currentPhoto.url, `photo-${childName}.png`);
            if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
                await navigator.share({
                    files: [imageFile],
                    title: `Photo de ${childName}`,
                    text: `Regarde cette adorable photo de ${childName} à ${ageString} !`,
                });
            } else {
                console.log("Sharing files is not supported on this browser.");
            }
        } catch (error) {
            console.error('Error sharing the photo:', error);
        }
    };


    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9,
        }),
    };
    
    return (
        <div className="space-y-4">
            <div
                className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex}
                        src={currentPhoto.url}
                        custom={direction}
                        variants={variants}
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.4 }
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute h-full w-full object-cover"
                    />
                </AnimatePresence>

                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10"></div>

                 {canShare && (
                    <button onClick={handleShare} className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm transition text-white rounded-full p-2.5 ring-1 ring-white/30 z-20">
                        <Share2 className="h-5 w-5" />
                    </button>
                )}

                <div className="absolute top-4 right-4 text-white text-xs z-20">
                    <p className="drop-shadow-lg">{new Date(currentPhoto.date).toLocaleDateString('fr-FR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm font-semibold z-20">
                    <p className="drop-shadow-lg">{calculateAgeString(currentPhoto.age)}</p>
                </div>
                
                <button onClick={() => paginate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm transition text-white rounded-full p-2 ring-1 ring-white/30 z-20">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={() => paginate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm transition text-white rounded-full p-2 ring-1 ring-white/30 z-20">
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-text-primary">Galerie</h4>
                    <Button onClick={onAddPhoto} icon={Plus} size="sm" variant="outline">Ajouter</Button>
                 </div>
                 <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {sortedPhotos.map((photo, index) => (
                        <div key={photo.id} onClick={() => {
                            stopAutoplay();
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }} className="flex-shrink-0 cursor-pointer group">
                            <img 
                                src={photo.url} 
                                alt={`Photo à ${calculateAgeString(photo.age)}`}
                                className={`w-20 h-20 object-cover rounded-xl transition-all duration-300 border-2 ${currentIndex === index ? 'border-primary scale-105' : 'border-transparent group-hover:border-primary/50'}`}
                            />
                            <p className={`text-center text-xs mt-1 font-medium ${currentIndex === index ? 'text-primary' : 'text-text-secondary'}`}>{calculateAgeString(photo.age)}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};


const TrackerScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TrackerTab>('Croissance');
    const { selectedChild, children, selectChild, growthRecords, addGrowthRecord, vaccines, addVaccine, photos, addPhoto } = useContext(AppContext);
    const [activeGrowthMetric, setActiveGrowthMetric] = useState<GrowthMetric>('weight');
    const [isAddGrowthModalOpen, setAddGrowthModalOpen] = useState(false);
    const [isAddVaccineModalOpen, setAddVaccineModalOpen] = useState(false);
    const [isAddPhotoModalOpen, setAddPhotoModalOpen] = useState(false);


    if (!selectedChild) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <HeartPulse className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-dark">Carnet de Santé Numérique</h3>
                <p className="text-text-secondary mt-2">Veuillez sélectionner un profil d'enfant pour consulter son carnet de santé.</p>
            </div>
        );
    }

    const growthDataForChild = growthRecords.filter(d => d.childId === selectedChild.id);
    const vaccineDataForChild = vaccines.filter(v => v.childId === selectedChild.id);
    const photoDataForChild = photos.filter(p => p.childId === selectedChild.id);
    const lastMeasurement = growthDataForChild.length > 0 ? growthDataForChild[growthDataForChild.length - 1] : null;
    
    const tabs: {name: TrackerTab, icon: React.ElementType}[] = [
        { name: 'Croissance', icon: BarChart2 },
        { name: 'Vaccins', icon: Syringe },
        { name: 'Album', icon: ImageIcon },
    ];

    const handleAddGrowthRecord = (record: Omit<GrowthRecord, 'childId' | 'age'>) => {
        addGrowthRecord(record);
        setAddGrowthModalOpen(false);
    };

    const handleAddVaccine = (vaccine: Omit<Vaccine, 'id' | 'childId'>) => {
        addVaccine(vaccine);
        setAddVaccineModalOpen(false);
    };

     const handleAddPhoto = (photo: { date: string, url: string }) => {
        addPhoto(photo);
        setAddPhotoModalOpen(false);
    };

    const upcomingVaccines = vaccineDataForChild.filter(v => v.status === 'à faire');
    const doneVaccines = vaccineDataForChild.filter(v => v.status === 'fait');

    const GrowthTabContent = (
      <div className="space-y-4">
        <Card>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {(Object.keys(METRIC_CONFIG) as GrowthMetric[]).map(metric => (
                    <button
                        key={metric}
                        onClick={() => setActiveGrowthMetric(metric)}
                        className={`w-full py-2 text-xs font-semibold rounded-md transition-colors ${activeGrowthMetric === metric ? 'bg-white text-primary shadow' : 'text-text-secondary'}`}
                    >
                        {METRIC_CONFIG[metric].label}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                 <GrowthChart childData={growthDataForChild} metric={activeGrowthMetric} />
            </div>
        </Card>
        
        {lastMeasurement && (
            <Card>
                <h4 className="font-semibold mb-3 text-text-primary">Dernières mesures</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-text-secondary">le {new Date(lastMeasurement.date).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}</p>
                        <p className="text-xs text-gray-400">({lastMeasurement.age} mois)</p>
                    </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                            <p className="font-bold text-text-primary">{lastMeasurement.weight} kg</p>
                            <p className="text-text-secondary">Poids</p>
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">{lastMeasurement.height} cm</p>
                            <p className="text-text-secondary">Taille</p>
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">{lastMeasurement.headCircumference} cm</p>
                            <p className="text-text-secondary">PC</p>
                        </div>
                    </div>
                </div>
            </Card>
        )}

        <Button onClick={() => setAddGrowthModalOpen(true)} icon={Plus} variant="outline" className="w-full">
            Ajouter une mesure
        </Button>

        <Modal isOpen={isAddGrowthModalOpen} onClose={() => setAddGrowthModalOpen(false)} title="Ajouter une nouvelle mesure">
            <AddGrowthRecordForm onSubmit={handleAddGrowthRecord} />
        </Modal>
      </div>
    );

    const VaccinesTabContent = (
        <div className="space-y-6">
            <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Vaccins à venir</h4>
                <Card className="p-0">
                    {upcomingVaccines.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {upcomingVaccines.map(v => <VaccineItem key={v.id} vaccine={v} />)}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-sm text-text-secondary">Aucun vaccin à venir.</p>
                    )}
                </Card>
            </div>
            <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Vaccins faits</h4>
                <Card className="p-0">
                    {doneVaccines.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                           {doneVaccines.map(v => <VaccineItem key={v.id} vaccine={v} />)}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-sm text-text-secondary">Aucun vaccin enregistré comme fait.</p>
                    )}
                </Card>
            </div>
            <Button onClick={() => setAddVaccineModalOpen(true)} icon={Plus} variant="outline" className="w-full">
                Ajouter un vaccin
            </Button>
            <Modal isOpen={isAddVaccineModalOpen} onClose={() => setAddVaccineModalOpen(false)} title="Ajouter un vaccin">
                <AddVaccineForm onSubmit={handleAddVaccine} />
            </Modal>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark">Carnet de {selectedChild.name}</h2>
            
            {children.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                    {children.map(child => (
                        <motion.button
                            key={child.id}
                            onClick={() => selectChild(child.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedChild?.id === child.id ? 'bg-primary text-white shadow' : 'bg-gray-100 text-text-secondary'}`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {child.name}
                        </motion.button>
                    ))}
                </div>
            )}

            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
                {tabs.map(tab => (
                    <button 
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab.name ? 'bg-white text-primary shadow' : 'text-text-secondary'}`}
                    >
                       <tab.icon className="h-5 w-5" />
                       <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'Croissance' && GrowthTabContent}
                {activeTab === 'Vaccins' && VaccinesTabContent}
                {activeTab === 'Album' && (
                  <>
                    <PhotoAlbum photos={photoDataForChild} onAddPhoto={() => setAddPhotoModalOpen(true)} />
                    <Modal isOpen={isAddPhotoModalOpen} onClose={() => setAddPhotoModalOpen(false)} title="Ajouter une Photo">
                        <AddPhotoForm onSubmit={handleAddPhoto} />
                    </Modal>
                  </>
                )}
            </div>
        </div>
    );
};

export default TrackerScreen;
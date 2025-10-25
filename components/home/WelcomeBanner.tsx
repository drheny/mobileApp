import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CalendarPlus, MessageSquarePlus, HeartPulse, GalleryHorizontalEnd, Syringe, ClipboardCheck } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Votre Espace Santé',
    description: 'Tout pour le bien-être de vos enfants, à portée de main.',
    background: 'linear-gradient(135deg, #4A90E2, #50E3C2)',
  },
  {
    icon: CalendarPlus,
    title: 'Rendez-vous en Ligne',
    description: 'Prenez et gérez vos rendez-vous en quelques clics.',
    background: 'linear-gradient(135deg, #5DADE2, #48C9B0)',
  },
  {
    icon: ClipboardCheck,
    title: 'Suivi Post-Consultation',
    description: 'Échangez avec votre médecin après une visite.',
    background: 'linear-gradient(135deg, #50E3C2, #F5A623)',
  },
  {
    icon: MessageSquarePlus,
    title: 'Messagerie Urgente',
    description: 'Contactez directement le docteur en cas de besoin.',
    background: 'linear-gradient(135deg, #F5A623, #EC7063)',
  },
  {
    icon: Syringe,
    title: 'Rappels Vaccins',
    description: 'Ne manquez plus aucune date de vaccination importante.',
    background: 'linear-gradient(135deg, #AF7AC5, #4A90E2)',
  },
  {
    icon: HeartPulse,
    title: 'Carnet de Santé Numérique',
    description: 'Suivez la croissance et les vaccins de votre enfant.',
    background: 'linear-gradient(135deg, #EC7063, #4A90E2)',
  },
  {
    icon: GalleryHorizontalEnd,
    title: 'Album Photo Personnalisé',
    description: 'Gardez les plus beaux souvenirs de leur croissance.',
    background: 'linear-gradient(135deg, #48C9B0, #AF7AC5)',
  },
];


const WelcomeBanner: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % features.length);
    }, 5000);
    
    // Cleanup on component unmount
    return () => {
        clearInterval(interval);
    };
  }, []);

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const Icon = features[index].icon;

  return (
    <div
      className="relative text-white p-6 rounded-2xl shadow-lg overflow-hidden h-40 flex flex-col justify-center"
    >
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1, ease: 'easeInOut' },
            backgroundPosition: { duration: 15, ease: 'linear', repeat: Infinity }
          }}
          style={{
            backgroundImage: features[index].background,
            backgroundSize: '200% 200%',
          }}
        />
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex items-center space-x-4 w-full"
          >
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold">{features[index].title}</h2>
                <p className="mt-1 text-sm font-light max-w-xs">{features[index].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {features.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full cursor-pointer"
            onClick={() => setIndex(i)}
            animate={{
              backgroundColor: i === index ? '#ffffff' : '#ffffff80',
              scale: i === index ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;

import React, { useContext, useState } from 'react';
import { UserRole, Child } from '../types';
import { AuthContext, AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

import WelcomeBanner from '../components/home/WelcomeBanner';
import ChildSelector from '../components/home/ChildSelector';
import QuickActions from '../components/home/QuickActions';
import DailyTip from '../components/home/DailyTip';
import CabinetInfo from '../components/home/CabinetInfo';
import NotificationsList from '../components/home/NotificationsList';
import BirthdayBanner from '../components/home/BirthdayBanner';

const HomeScreen: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { selectedChild, children } = useContext(AppContext);
    const [dismissedBirthdays, setDismissedBirthdays] = useState<number[]>([]);
    
    const today = new Date();
    const birthdayChildren = children.filter(child => {
        const birthDate = new Date(child.birthDate);
        return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    }).filter(child => !dismissedBirthdays.includes(child.id));

    const handleDismissBirthday = (childId: number) => {
        setDismissedBirthdays(prev => [...prev, childId]);
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {birthdayChildren.map(child => (
                    <BirthdayBanner key={child.id} child={child} onDismiss={() => handleDismissBirthday(child.id)} />
                ))}
            </AnimatePresence>

            <WelcomeBanner />
            
            <AnimatePresence>
                {user?.role === UserRole.VerifiedPatient && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                       <ChildSelector />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(user?.role === UserRole.Guest || selectedChild) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4, ease: "easeInOut" }}
                    >
                        <QuickActions />
                    </motion.div>
                )}
            </AnimatePresence>
            
            <DailyTip />
            <CabinetInfo />
            <NotificationsList />
        </div>
    );
};

export default HomeScreen;
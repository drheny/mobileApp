import { User, Child, UserRole, Appointment, AppointmentType, GrowthRecord, Vaccine, ContentArticle, Notification, Conversation, Photo } from '../types';
import { Bell, Calendar, Syringe, HeartPulse } from 'lucide-react';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Invité', avatar: 'https://picsum.photos/seed/guest/100/100', role: UserRole.Guest },
  { id: 2, name: 'Amira Ben Ali', avatar: 'https://picsum.photos/seed/amira/100/100', role: UserRole.VerifiedPatient },
];

export const MOCK_CHILDREN: Child[] = [
  { id: 1, name: 'Youssef', avatar: 'https://picsum.photos/seed/youssef/200/200', birthDate: '2022-05-10' },
  { id: 2, name: 'Lina', avatar: 'https://picsum.photos/seed/lina/200/200', birthDate: '2024-01-15' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 1, childId: 1, date: '2024-08-15', time: '10:30', type: AppointmentType.Controle, reason: 'Contrôle des 2 ans', status: 'confirmé' },
    { id: 2, childId: 2, date: '2024-07-28', time: '15:00', type: AppointmentType.Visite, reason: 'Première visite', status: 'confirmé' },
    { id: 3, childId: 1, date: '2024-06-20', time: '11:00', type: AppointmentType.Visite, reason: 'Fièvre', status: 'passé' },
];

export const MOCK_GROWTH_DATA: GrowthRecord[] = [
    // Data for Youssef (id: 1) born 2022-05-10
    { childId: 1, date: '2022-05-10', age: 0, weight: 3.4, height: 50, headCircumference: 35 },
    { childId: 1, date: '2022-07-11', age: 2, weight: 5.1, height: 57, headCircumference: 40 },
    { childId: 1, date: '2022-09-09', age: 4, weight: 6.7, height: 62, headCircumference: 42 },
    { childId: 1, date: '2022-11-10', age: 6, weight: 7.9, height: 66, headCircumference: 43 },
    { childId: 1, date: '2023-02-10', age: 9, weight: 8.9, height: 71, headCircumference: 45 },
    { childId: 1, date: '2023-05-15', age: 12, weight: 9.6, height: 75, headCircumference: 46 },
    { childId: 1, date: '2023-11-10', age: 18, weight: 10.9, height: 81, headCircumference: 47 },
    { childId: 1, date: '2024-05-10', age: 24, weight: 12.3, height: 87, headCircumference: 48 },
    // Data for Lina (id: 2) born 2024-01-15
    { childId: 2, date: '2024-01-15', age: 0, weight: 3.2, height: 49, headCircumference: 34 },
    { childId: 2, date: '2024-03-15', age: 2, weight: 4.9, height: 56, headCircumference: 39 },
    { childId: 2, date: '2024-05-16', age: 4, weight: 6.2, height: 61, headCircumference: 41 },
    { childId: 2, date: '2024-07-15', age: 6, weight: 7.3, height: 65, headCircumference: 42.5 },
];

export const MOCK_VACCINES: Vaccine[] = [
    // Vaccines for Youssef (id: 1)
    { id: 1, childId: 1, name: 'BCG', age: 'Naissance', date: '2022-05-12', appointmentDate: null, status: 'fait', reminder: false },
    { id: 2, childId: 1, name: 'Hépatite B (1ère dose)', age: 'Naissance', date: '2022-05-12', appointmentDate: null, status: 'fait', reminder: false },
    { id: 3, childId: 1, name: 'Pentavalent (1ère dose)', age: '2 mois', date: '2022-07-11', appointmentDate: null, status: 'fait', reminder: false },
    { id: 4, childId: 1, name: 'Polio oral (1ère dose)', age: '2 mois', date: '2022-07-11', appointmentDate: null, status: 'fait', reminder: false },
    { id: 5, childId: 1, name: 'Pentavalent (2ème dose)', age: '3 mois', date: '2022-08-10', appointmentDate: null, status: 'fait', reminder: false },
    { id: 6, childId: 1, name: 'ROR (1ère dose)', age: '12 mois', date: '2023-05-15', appointmentDate: null, status: 'fait', reminder: false },
    { id: 7, childId: 1, name: 'ROR (2ème dose)', age: '18 mois', date: null, appointmentDate: '2023-11-10', status: 'à faire', reminder: true },
    // Vaccines for Lina (id: 2)
    { id: 8, childId: 2, name: 'BCG', age: 'Naissance', date: '2024-01-16', appointmentDate: null, status: 'fait', reminder: false },
    { id: 9, childId: 2, name: 'Hépatite B (1ère dose)', age: 'Naissance', date: '2024-01-16', appointmentDate: null, status: 'fait', reminder: false },
    { id: 10, childId: 2, name: 'Pentavalent (1ère dose)', age: '2 mois', date: '2024-03-15', appointmentDate: null, status: 'fait', reminder: false },
    { id: 11, childId: 2, name: 'Polio oral (1ère dose)', age: '2 mois', date: '2024-03-15', appointmentDate: null, status: 'fait', reminder: false },
    { id: 12, childId: 2, name: 'Pentavalent (2ème dose)', age: '3 mois', date: '2024-04-15', appointmentDate: null, status: 'fait', reminder: false },
    { id: 13, childId: 2, name: 'Pentavalent (3ème dose)', age: '4 mois', date: '2024-05-16', appointmentDate: null, status: 'fait', reminder: false },
    { id: 14, childId: 2, name: 'ROR (1ère dose)', age: '12 mois', date: null, appointmentDate: '2025-01-15', status: 'à faire', reminder: true },
    { id: 15, childId: 2, name: 'ROR (2ème dose)', age: '18 mois', date: null, appointmentDate: '2025-07-15', status: 'à faire', reminder: false },
];

export const MOCK_PHOTOS: Photo[] = [
    // Photos for Youssef (id: 1) born 2022-05-10
    { id: 1, childId: 1, date: '2022-05-11', age: 0, url: 'https://picsum.photos/seed/youssef-newborn/600/600' },
    { id: 2, childId: 1, date: '2022-11-15', age: 6, url: 'https://picsum.photos/seed/youssef-6m/600/600' },
    { id: 3, childId: 1, date: '2023-05-20', age: 12, url: 'https://picsum.photos/seed/youssef-1y/600/600' },
    { id: 4, childId: 1, date: '2024-05-10', age: 24, url: 'https://picsum.photos/seed/youssef-2y/600/600' },
    // Photos for Lina (id: 2) born 2024-01-15
    { id: 5, childId: 2, date: '2024-01-18', age: 0, url: 'https://picsum.photos/seed/lina-newborn/600/600' },
    { id: 6, childId: 2, date: '2024-07-25', age: 6, url: 'https://picsum.photos/seed/lina-6m/600/600' },
];

export const MOCK_CONTENT: ContentArticle[] = [
    { id: 1, title: 'La diversification alimentaire : quand et comment commencer ?', summary: 'Découvrez les étapes clés pour introduire de nouveaux aliments à votre bébé.', type: 'article', thumbnail: 'https://picsum.photos/seed/food/400/200', tags: { age: '4-6 mois', season: 'toutes', interest: 'nutrition' } },
    { id: 2, title: 'Protéger son enfant du soleil', summary: 'Les bons gestes à adopter pour profiter de l\'été en toute sécurité.', type: 'video', thumbnail: 'https://picsum.photos/seed/sun/400/200', tags: { age: 'enfant', season: 'ete', interest: 'immunite' } },
    { id: 3, title: 'Gérer les poussées dentaires', summary: 'Astuces et conseils pour soulager la douleur de bébé.', type: 'article', thumbnail: 'https://picsum.photos/seed/teeth/400/200', tags: { age: '6-12 mois', season: 'toutes', interest: 'developpement' } },
    { id: 4, title: 'Les bienfaits du sommeil pour la croissance', summary: 'Comprendre l\'importance du sommeil pour le développement de votre enfant.', type: 'video', thumbnail: 'https://picsum.photos/seed/sleep/400/200', tags: { age: 'enfant', season: 'toutes', interest: 'psychologie' } },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, icon: Calendar, title: 'Rappel de rendez-vous', description: 'N\'oubliez pas le contrôle de Youssef demain à 10:30.', time: 'il y a 2h', read: false },
    { id: 2, icon: Syringe, title: 'Rappel de vaccination', description: 'Le vaccin ROR (2ème dose) de Youssef est prévu ce mois-ci.', time: 'il y a 1j', read: false },
    { id: 3, icon: HeartPulse, title: 'Nouveau conseil disponible', description: 'Découvrez notre nouveau conseil sur l\'hydratation en été.', time: 'il y a 3j', read: true },
    { id: 4, icon: Bell, title: 'Joyeux Anniversaire Lina !', description: 'Toute l\'équipe souhaite un merveilleux anniversaire à Lina !', time: 'il y a 1sem', read: true },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        childId: 1,
        type: 'urgent',
        subject: 'Fièvre élevée et toux',
        status: 'open',
        read: false,
        messages: [
            { id: 1, sender: 'user', text: 'Bonjour Docteur, Youssef a 39.5 de fièvre depuis ce matin et il tousse beaucoup. Que dois-je faire ?', timestamp: '2024-07-20T10:05:00Z' },
            { id: 2, sender: 'doctor', text: 'Bonjour Madame. Donnez-lui du paracétamol et surveillez. S\'il n\'y a pas d\'amélioration d\'ici ce soir, veuillez prendre rendez-vous pour une consultation.', timestamp: '2024-07-20T10:15:00Z' }
        ]
    },
    {
        id: 2,
        childId: 2,
        type: 'follow-up',
        subject: 'Suivi visite du 28/07',
        status: 'open',
        read: true,
        messages: [
            { id: 1, sender: 'user', text: 'Suite à la visite pour l\'érythème fessier de Lina, la crème que vous avez prescrite semble bien fonctionner. Faut-il continuer le traitement toute la semaine ?', timestamp: '2024-07-29T14:30:00Z' }
        ]
    },
    {
        id: 3,
        childId: 1,
        type: 'follow-up',
        subject: 'Suivi visite du 20/06',
        status: 'closed',
        read: true,
        messages: [
            { id: 1, sender: 'user', text: 'Juste pour vous confirmer que la fièvre de Youssef est bien tombée avec le traitement. Merci beaucoup.', timestamp: '2024-06-22T09:00:00Z' },
            { id: 2, sender: 'doctor', text: 'Excellente nouvelle. N\'hésitez pas si besoin.', timestamp: '2024-06-22T09:30:00Z' }
        ]
    }
];

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { View } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Send, Mic, Image as ImageIcon, Camera, Paperclip } from 'lucide-react';

const PostConsultationFollowUpScreen: React.FC = () => {
    const { setActiveView, children, selectedChild, startConversation } = useContext(AppContext);
    
    const [childId, setChildId] = useState<string>(selectedChild?.id.toString() || children[0]?.id.toString() || '');
    const [consultationDate, setConsultationDate] = useState('');
    const [subject, setSubject] = useState('');
    const [treatment, setTreatment] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!childId || !consultationDate || !subject.trim() || !message.trim()) return;

        const fullMessage = `Traitements prescrits:\n${treatment || 'Aucun'}\n\nMessage:\n${message}`;

        startConversation({
            childId: parseInt(childId),
            type: 'follow-up',
            subject: `Suivi: ${subject} (RDV du ${new Date(consultationDate).toLocaleDateString('fr-FR')})`,
            initialMessage: fullMessage,
        });
    };
    
    const handleAttachment = (type: string) => {
      alert(`Fonctionnalité "${type}" non implémentée pour le moment.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => setActiveView(View.Messages)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="h-6 w-6 text-text-primary" />
                </button>
                <h2 className="text-2xl font-bold text-dark">Suivi Post-Consultation</h2>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="child-select" className="block text-sm font-semibold text-text-secondary mb-2">
                            Enfant concerné :
                        </label>
                        <select
                            id="child-select"
                            value={childId}
                            onChange={(e) => setChildId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary bg-white"
                            required
                        >
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="consultation-date" className="block text-sm font-semibold text-text-secondary mb-2">
                            Date de la consultation :
                        </label>
                        <input
                            type="date"
                            id="consultation-date"
                            value={consultationDate}
                            onChange={(e) => setConsultationDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-text-secondary mb-2">
                            Motif de la consultation :
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            placeholder="Ex: Contrôle des 2 ans, Fièvre..."
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="treatment" className="block text-sm font-semibold text-text-secondary mb-2">
                            Traitements prescrits :
                        </label>
                        <textarea
                            id="treatment"
                            rows={2}
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            placeholder="Ex: Paracétamol, Crème hydratante..."
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-text-secondary mb-2">
                            Votre message :
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            placeholder="Posez votre question ou donnez des nouvelles sur l'évolution..."
                            required
                        />
                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100">
                            <button type="button" onClick={() => handleAttachment('Enregistrement vocal')} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Mic className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={() => handleAttachment('Joindre une photo')} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <ImageIcon className="h-5 w-5" />
                            </button>
                             <button type="button" onClick={() => handleAttachment('Prendre une photo')} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Camera className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={() => handleAttachment('Joindre un fichier')} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Paperclip className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <Button 
                            type="submit"
                            variant="primary" 
                            className="w-full"
                            icon={Send}
                        >
                            Démarrer le suivi
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostConsultationFollowUpScreen;
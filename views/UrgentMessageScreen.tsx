
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { View } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Send, Mic, Image as ImageIcon, Camera, Paperclip } from 'lucide-react';

const UrgentMessageScreen: React.FC = () => {
    const { setActiveView, children, selectedChild, startConversation } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [childId, setChildId] = useState<string>(selectedChild?.id.toString() || children[0]?.id.toString() || '');
    const [subject, setSubject] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !childId || !subject.trim()) return;
        
        startConversation({
            childId: parseInt(childId),
            type: 'urgent',
            subject: subject,
            initialMessage: message
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
                <h2 className="text-2xl font-bold text-dark">Message Urgent</h2>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-amber-700 bg-amber-100 p-3 rounded-xl">
                        <strong>Attention :</strong> Ce service est réservé aux urgences non vitales. En cas d'urgence vitale, contactez le 190.
                    </p>
                    
                    {children.length > 0 && (
                        <div>
                            <label htmlFor="child-select" className="block text-sm font-semibold text-text-secondary mb-2">
                                Ce message concerne :
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
                    )}

                     <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-text-secondary mb-2">
                            Sujet :
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            placeholder="Ex: Fièvre, Toux, Chute..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-text-secondary mb-2">
                            Votre message :
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                            placeholder="Décrivez la situation en détail (symptômes, depuis quand, etc.)"
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
                            className={`w-full ${!message.trim() || !childId || !subject.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            icon={Send}
                            disabled={!message.trim() || !childId || !subject.trim()}
                        >
                            Envoyer le message
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default UrgentMessageScreen;
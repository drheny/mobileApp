
import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Conversation, Message, View } from '../types';
import { ArrowLeft, Send, CheckCircle, Calendar, FileText, Pill, User, Mic, Camera, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end space-x-2 ${isUser ? 'justify-end' : ''}`}
        >
            <div className={`p-3 rounded-2xl max-w-xs md:max-w-md ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-text-primary rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </motion.div>
    );
};

const ConversationContextHeader: React.FC<{ conversation: Conversation; childName?: string }> = ({ conversation, childName }) => {
    const firstUserMessage = useMemo(() => conversation.messages.find(m => m.sender === 'user'), [conversation.messages]);

    if (!firstUserMessage) return null;

    if (conversation.type === 'urgent') {
        return (
            <div className="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <h4 className="font-bold text-amber-800 mb-2">Contexte du Message Urgent</h4>
                <p className="text-amber-900 whitespace-pre-wrap">{firstUserMessage.text}</p>
            </div>
        );
    }

    if (conversation.type === 'follow-up') {
        const contextData = useMemo(() => {
            const subjectMatch = conversation.subject.match(/Suivi: (.*) \(RDV du (.*)\)/);
            const motif = subjectMatch ? subjectMatch[1] : 'Non spécifié';
            const date = subjectMatch ? subjectMatch[2] : 'Non spécifiée';
            
            const messageParts = firstUserMessage.text.split('\n\nMessage:\n');
            const treatmentsText = messageParts[0] || '';
            const initialMessage = messageParts[1] || 'Aucun message initial.';

            const treatments = treatmentsText.replace('Traitements prescrits:\n', '').trim();

            return { motif, date, treatments, initialMessage };
        }, [conversation.subject, firstUserMessage.text]);

        return (
            <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg text-sm space-y-3">
                <h4 className="font-bold text-blue-800">Résumé du Suivi Post-Consultation</h4>
                <div className="grid grid-cols-2 gap-3 text-blue-900">
                    <div className="flex items-start space-x-2">
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div><span className="font-semibold">Patient:</span> {childName}</div>
                    </div>
                     <div className="flex items-start space-x-2">
                        <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div><span className="font-semibold">Date RDV:</span> {contextData.date}</div>
                    </div>
                     <div className="flex items-start space-x-2 col-span-2">
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div><span className="font-semibold">Motif:</span> {contextData.motif}</div>
                    </div>
                     <div className="flex items-start space-x-2 col-span-2">
                        <Pill className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div><span className="font-semibold">Traitements:</span> {contextData.treatments || 'Aucun'}</div>
                    </div>
                </div>
                <div className="pt-2 border-t border-blue-200">
                     <p className="font-semibold text-blue-900 mb-1">Message initial :</p>
                     <p className="text-blue-900 whitespace-pre-wrap bg-blue-100/50 p-2 rounded">{contextData.initialMessage}</p>
                </div>
            </div>
        );
    }

    return null;
};


const ConversationScreen: React.FC = () => {
    const { selectedConversation, children, sendMessage, selectConversation, closeConversation } = useContext(AppContext);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const child = children.find(c => c.id === selectedConversation?.childId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);


    if (!selectedConversation) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary">Sélectionnez une conversation pour l'afficher.</p>
            </div>
        );
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(selectedConversation.id, newMessage);
        setNewMessage('');
    };
    
    const handleAttachment = (type: string) => {
      alert(`Fonctionnalité "${type}" non implémentée pour le moment.`);
    };

    return (
        <div className="flex flex-col h-full bg-white -m-4">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 px-4 py-3 flex items-center border-b border-gray-100">
                <button onClick={() => selectConversation(null)} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                    <ArrowLeft className="h-6 w-6 text-text-primary" />
                </button>
                <img src={child?.avatar} alt={child?.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                <div className="flex-grow">
                    <h2 className="text-base font-bold text-dark truncate">{selectedConversation.subject}</h2>
                    <p className="text-xs text-text-secondary">Pour {child?.name}</p>
                </div>
                 {selectedConversation.status !== 'closed' && (
                    <button
                        onClick={() => closeConversation(selectedConversation.id)}
                        className="ml-2 flex-shrink-0 flex items-center space-x-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-full transition-colors"
                    >
                        <CheckCircle className="h-4 w-4" />
                        <span>Clore</span>
                    </button>
                )}
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                 <AnimatePresence>
                    {selectedConversation && <ConversationContextHeader conversation={selectedConversation} childName={child?.name} />}
                    {selectedConversation.messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-light border-t border-gray-100">
                <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                    <div className="flex-grow flex items-center bg-white border border-gray-300 rounded-3xl px-3 py-1.5 shadow-sm">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-grow bg-transparent focus:outline-none resize-none max-h-24 overflow-y-auto w-full"
                            rows={1}
                        />
                        <button type="button" onClick={() => handleAttachment('Joindre un fichier/photo')} className="p-2 text-gray-500 hover:text-primary rounded-full transition-colors flex-shrink-0">
                            <Paperclip className="h-5 w-5" />
                        </button>
                         <button type="button" onClick={() => handleAttachment('Prendre une photo')} className="p-2 text-gray-500 hover:text-primary rounded-full transition-colors flex-shrink-0">
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                    <button 
                        type={newMessage.trim() ? 'submit' : 'button'}
                        onClick={newMessage.trim() ? undefined : () => handleAttachment('Enregistrement vocal')}
                        className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                        <AnimatePresence mode="popLayout">
                            {newMessage.trim() ? (
                                <motion.div key="send" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 45 }} transition={{ duration: 0.2 }}>
                                    <Send className="h-5 w-5" />
                                </motion.div>
                            ) : (
                                <motion.div key="mic" initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -45 }} transition={{ duration: 0.2 }}>
                                    <Mic className="h-5 w-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ConversationScreen;
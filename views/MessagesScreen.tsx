import React, { useContext, useMemo, useState } from 'react';
import { AppContext, AuthContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MessageSquarePlus, ClipboardCheck, ChevronRight, Video, Trash2 } from 'lucide-react';
import { Conversation, View, UserRole, AppointmentType } from '../types';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal';

const ConversationItem: React.FC<{ conversation: Conversation, onDelete: () => void }> = ({ conversation, onDelete }) => {
    const { children, selectConversation } = useContext(AppContext);
    const child = children.find(c => c.id === conversation.childId);
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    const getStatusInfo = (conv: Conversation) => {
        if (conv.status === 'closed') {
            return { text: 'Cloturé', color: 'bg-gray-200 text-gray-700' };
        }
        const lastMsg = conv.messages[conv.messages.length - 1];
        if (lastMsg.sender === 'user') {
            return { text: 'En attente', color: 'bg-amber-100 text-amber-700' };
        }
        return { text: 'En cours', color: 'bg-green-100 text-green-700' };
    };

    const statusInfo = getStatusInfo(conversation);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 flex items-start space-x-4 hover:bg-light transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
        >
            <div onClick={() => selectConversation(conversation.id)} className="flex-grow flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                    <img src={child?.avatar} alt={child?.name} className="h-12 w-12 rounded-full object-cover" />
                    {!conversation.read && conversation.status === 'open' && (
                        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-white" />
                    )}
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-baseline">
                        <p className="font-bold text-text-primary truncate">{conversation.subject}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {new Date(lastMessage.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary">Pour {child?.name}</p>
                    <div className="flex items-center mt-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 self-center flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
                    <Trash2 className="h-4 w-4" />
                </button>
                <div onClick={() => selectConversation(conversation.id)}>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </motion.div>
    );
};

const MessagesScreen: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { conversations, setActiveView, setInitialAppointmentType, deleteConversation } = useContext(AppContext);
    const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

    const isVerified = user?.role === UserRole.VerifiedPatient;

    const { openConversations, closedConversations } = useMemo(() => {
        const open = conversations.filter(c => c.status === 'open');
        const closed = conversations.filter(c => c.status === 'closed');
        return { openConversations: open, closedConversations: closed };
    }, [conversations]);

    const handleTeleconsultation = () => {
        setInitialAppointmentType(AppointmentType.Teleconsultation);
        setActiveView(View.NewAppointment);
    };

    const handleDeleteConfirm = () => {
        if (conversationToDelete) {
            deleteConversation(conversationToDelete.id);
        }
        setConversationToDelete(null);
    };

    if (!isVerified) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquarePlus className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-dark">Messagerie Sécurisée</h3>
                <p className="text-text-secondary mt-2 max-w-sm">
                    Connectez-vous pour échanger avec le cabinet, poser des questions urgentes ou faire le suivi après une consultation.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark">Messages</h2>

            <Card className="space-y-3">
                <h3 className="font-semibold text-text-primary">Démarrer une nouvelle conversation</h3>
                 <Button onClick={() => setActiveView(View.UrgentMessage)} icon={MessageSquarePlus} className="w-full">
                    Nouveau Message Urgent
                </Button>
                <Button onClick={() => setActiveView(View.PostConsultationFollowUp)} icon={ClipboardCheck} variant="outline" className="w-full">
                    Nouveau Suivi Post-Consultation
                </Button>
                <Button onClick={handleTeleconsultation} icon={Video} variant="outline" className="w-full">
                    Demander une Téléconsultation
                </Button>
            </Card>

            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">En cours</h3>
                <Card className="p-0">
                    {openConversations.length > 0 ? (
                       openConversations.map(convo => <ConversationItem key={convo.id} conversation={convo} onDelete={() => setConversationToDelete(convo)} />)
                    ) : (
                        <p className="p-4 text-center text-sm text-text-secondary">Aucune conversation en cours.</p>
                    )}
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Archivées</h3>
                 <Card className="p-0">
                    {closedConversations.length > 0 ? (
                       closedConversations.map(convo => <ConversationItem key={convo.id} conversation={convo} onDelete={() => setConversationToDelete(convo)} />)
                    ) : (
                        <p className="p-4 text-center text-sm text-text-secondary">Aucune conversation archivée.</p>
                    )}
                </Card>
            </div>

             <Modal
                isOpen={!!conversationToDelete}
                onClose={() => setConversationToDelete(null)}
                title="Supprimer la conversation"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setConversationToDelete(null)}>Annuler</Button>
                        <Button variant="primary" onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
                            Supprimer
                        </Button>
                    </>
                }
            >
                <p className="text-text-secondary">
                    Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
                </p>
            </Modal>
        </div>
    );
};

export default MessagesScreen;
import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { 
  User, UserRole, Child, Appointment, View, Conversation, Message, AppointmentType, GrowthRecord, Vaccine, Photo
} from '../types';
import { 
  MOCK_USERS, MOCK_CHILDREN, MOCK_APPOINTMENTS, MOCK_CONVERSATIONS, MOCK_GROWTH_DATA, MOCK_VACCINES, MOCK_PHOTOS
} from '../services/mockData';

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// App Context
interface AppContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  
  children: Child[];
  selectedChild: Child | null;
  selectChild: (id: number | null) => void;
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (child: Child) => void;

  appointments: Appointment[];
  editingAppointment: Appointment | null;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: number) => void;
  selectAppointmentForEdit: (id: number | null) => void;
  initialAppointmentType: AppointmentType | null;
  setInitialAppointmentType: (type: AppointmentType | null) => void;

  conversations: Conversation[];
  selectedConversation: Conversation | null;
  startConversation: (params: { childId: number; type: 'urgent' | 'follow-up'; subject: string; initialMessage: string }) => void;
  sendMessage: (conversationId: number, text: string) => void;
  selectConversation: (id: number | null) => void;
  deleteConversation: (id: number) => void;
  closeConversation: (id: number) => void;

  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: Omit<GrowthRecord, 'childId' | 'age'>) => void;

  vaccines: Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id' | 'childId'>) => void;

  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'childId' | 'age'>) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// Provider Component
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(MOCK_USERS[1]); // Default to logged in user

  const login = useCallback((role: UserRole) => {
    const userToLogin = MOCK_USERS.find(u => u.role === role);
    setUser(userToLogin || null);
  }, []);

  const logout = useCallback(() => {
    setUser(MOCK_USERS.find(u => u.role === UserRole.Guest) || null);
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  // App State
  const [activeView, setActiveView] = useState<View>(View.Home);
  const [childrenState, setChildrenState] = useState<Child[]>(MOCK_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(MOCK_CHILDREN[0]?.id || null);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [initialAppointmentType, setInitialAppointmentType] = useState<AppointmentType | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(MOCK_GROWTH_DATA);
  const [vaccines, setVaccines] = useState<Vaccine[]>(MOCK_VACCINES);
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);


  const selectedChild = useMemo(() => childrenState.find(c => c.id === selectedChildId) || null, [childrenState, selectedChildId]);
  const editingAppointment = useMemo(() => appointments.find(a => a.id === editingAppointmentId) || null, [appointments, editingAppointmentId]);
  const selectedConversation = useMemo(() => conversations.find(c => c.id === selectedConversationId) || null, [conversations, selectedConversationId]);

  const selectChild = useCallback((id: number | null) => {
    setSelectedChildId(id);
  }, []);

  const addChild = useCallback((child: Omit<Child, 'id'>) => {
    const newChild = { ...child, id: Date.now() };
    setChildrenState(prev => [...prev, newChild]);
    setSelectedChildId(newChild.id);
    setActiveView(View.ChildProfile);
  }, []);

  const updateChild = useCallback((updatedChild: Child) => {
    setChildrenState(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
    setActiveView(View.ChildProfile);
  }, []);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now(),
      status: 'confirmé',
    };
    setAppointments(prev => [...prev, newAppointment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setActiveView(View.Appointments);
  }, []);

  const updateAppointment = useCallback((updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
    setEditingAppointmentId(null);
    setActiveView(View.Appointments);
  }, []);

  const deleteAppointment = useCallback((id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);
  
  const selectAppointmentForEdit = useCallback((id: number | null) => {
      setEditingAppointmentId(id);
      if (id !== null) {
          setActiveView(View.NewAppointment);
      }
  }, []);

  const selectConversation = useCallback((id: number | null) => {
    setSelectedConversationId(id);
    if (id) {
      setConversations(prev => prev.map(c => c.id === id ? {...c, read: true} : c));
      setActiveView(View.Conversation);
    } else {
      setActiveView(View.Messages);
    }
  }, []);

  const startConversation = useCallback((params: { childId: number; type: 'urgent' | 'follow-up'; subject: string; initialMessage: string }) => {
    const newConversation: Conversation = {
      id: Date.now(),
      childId: params.childId,
      type: params.type,
      subject: params.subject,
      status: 'open',
      read: true,
      messages: [
        { id: 1, sender: 'user', text: params.initialMessage, timestamp: new Date().toISOString() }
      ]
    };
    setConversations(prev => [newConversation, ...prev]);
    selectConversation(newConversation.id);
  }, [selectConversation]);
  
  const sendMessage = useCallback((conversationId: number, text: string) => {
    setConversations(prev => {
      return prev.map(convo => {
        if (convo.id === conversationId) {
          const newUserMessage: Message = {
            id: Date.now(),
            sender: 'user',
            text,
            timestamp: new Date().toISOString()
          };
          const newDoctorMessage: Message = {
            id: Date.now() + 1,
            sender: 'doctor',
            text: "Merci pour votre message. Le docteur vous répondra dès que possible.",
            timestamp: new Date(Date.now() + 1000).toISOString()
          };
          return {
            ...convo,
            messages: [...convo.messages, newUserMessage, newDoctorMessage]
          };
        }
        return convo;
      });
    });
  }, []);

  const deleteConversation = useCallback((id: number) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  }, []);

  const closeConversation = useCallback((id: number) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status: 'closed' } : c));
    if (selectedConversationId === id) {
        selectConversation(null);
    }
  }, [selectedConversationId, selectConversation]);
  
  const addGrowthRecord = useCallback((record: Omit<GrowthRecord, 'childId' | 'age'>) => {
    if (!selectedChild) return;
    
    const birthDate = new Date(selectedChild.birthDate);
    const measurementDate = new Date(record.date);
    
    let months = (measurementDate.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += measurementDate.getMonth();
    
    // Adjust for the day of the month
    if (measurementDate.getDate() < birthDate.getDate()) {
        months--;
    }
    
    const ageInMonths = Math.max(0, months);

    const newRecord: GrowthRecord = {
        ...record,
        childId: selectedChild.id,
        age: ageInMonths,
    };
    setGrowthRecords(prev => [...prev, newRecord].sort((a, b) => a.age - b.age));
  }, [selectedChild]);

  const addVaccine = useCallback((vaccine: Omit<Vaccine, 'id' | 'childId'>) => {
    if (!selectedChild) return;

    const newVaccine: Vaccine = {
      ...vaccine,
      id: Date.now(),
      childId: selectedChild.id,
    };
    setVaccines(prev => [...prev, newVaccine]);
  }, [selectedChild]);

  const addPhoto = useCallback((photo: Omit<Photo, 'id' | 'childId' | 'age'>) => {
    if (!selectedChild) return;
    
    const birthDate = new Date(selectedChild.birthDate);
    const photoDate = new Date(photo.date);
    
    let months = (photoDate.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += photoDate.getMonth();
    
    if (photoDate.getDate() < birthDate.getDate()) {
        months--;
    }
    
    const ageInMonths = Math.max(0, months);

    const newPhoto: Photo = {
        ...photo,
        id: Date.now(),
        childId: selectedChild.id,
        age: ageInMonths,
    };
    setPhotos(prev => [...prev, newPhoto].sort((a, b) => a.age - b.age));
  }, [selectedChild]);


  const appContextValue: AppContextType = {
    activeView, setActiveView,
    children: childrenState, selectedChild, selectChild, addChild, updateChild,
    appointments, editingAppointment, addAppointment, updateAppointment, deleteAppointment, selectAppointmentForEdit,
    initialAppointmentType, setInitialAppointmentType,
    conversations, selectedConversation, startConversation, sendMessage, selectConversation,
    deleteConversation, closeConversation,
    growthRecords, addGrowthRecord,
    vaccines, addVaccine,
    photos, addPhoto,
  };

  return React.createElement(AuthContext.Provider, { value: authContextValue },
    React.createElement(AppContext.Provider, { value: appContextValue }, children)
  );
};

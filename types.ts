import type { LucideIcon } from 'lucide-react';

export enum UserRole {
  Guest = 'guest',
  VerifiedPatient = 'verified',
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface Child {
  id: number;
  name: string;
  avatar: string;
  birthDate: string; // YYYY-MM-DD
}

export enum AppointmentType {
  Controle = 'Contrôle',
  Visite = 'Visite',
  Teleconsultation = 'Téléconsultation',
}

export interface Appointment {
  id: number;
  childId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: AppointmentType;
  reason: string;
  status: 'confirmé' | 'passé';
}

export interface GrowthRecord {
  childId: number;
  date: string; // YYYY-MM-DD
  age: number; // in months
  weight: number; // in kg
  height: number; // in cm
  headCircumference: number; // in cm
}

export interface Vaccine {
  id: number;
  childId: number;
  name: string;
  age: string;
  date: string | null; // Administration date (when status is 'fait')
  appointmentDate: string | null; // Appointment date (when status is 'à faire')
  status: 'fait' | 'à faire';
  reminder: boolean;
}

export interface Photo {
  id: number;
  childId: number;
  date: string; // YYYY-MM-DD
  age: number; // in months
  url: string; // data URL or a remote URL
}

export interface ContentArticle {
  id: number;
  title: string;
  summary: string;
  type: 'article' | 'video';
  thumbnail: string;
  tags: {
    age: string;
    season: string;
    interest: string;
  };
}

export interface Notification {
  id: number | string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export type MessageSender = 'user' | 'doctor';

export interface Message {
  id: number;
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  childId: number;
  type: 'urgent' | 'follow-up';
  subject: string;
  messages: Message[];
  status: 'open' | 'closed';
  read: boolean;
}

export enum View {
  Home = 'Accueil',
  Appointments = 'Rendez-vous',
  Messages = 'Messages',
  Library = 'Bibliothèque',
  Tracker = 'Carnet',
  ChildProfile = 'Profil Enfant',
  NewAppointment = 'Nouveau RDV',
  UrgentMessage = 'Message Urgent',
  PostConsultationFollowUp = 'Suivi Post-Consultation',
  Conversation = 'Conversation',
}
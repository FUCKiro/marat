import { Service } from '../types';
import { Heart, Brain, Users, Sparkles, Activity } from 'lucide-react';

export const services: Service[] = [
  {
    title: 'Supporto Psicologico',
    description: 'Offriamo consulenza e supporto psicologico personalizzato per ogni individuo.',
    icon: 'Heart'
  },
  {
    title: 'Terapia Cognitivo-Comportamentale',
    description: 'Interventi mirati per sviluppare strategie di gestione efficaci.',
    icon: 'Brain'
  },
  {
    title: 'Gruppi di Supporto',
    description: 'Attività di gruppo per favorire la socializzazione e la condivisione di esperienze.',
    icon: 'Users'
  },
  {
    title: 'Sviluppo delle Competenze',
    description: 'Programmi personalizzati per valorizzare i talenti individuali.',
    icon: 'Sparkles'
  },
  {
    title: 'Attività Motorie',
    description: 'Attività sportive e motorie adattate alle esigenze individuali.',
    icon: 'Activity'
  }
];
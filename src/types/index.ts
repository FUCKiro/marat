import { IconName } from '../data/icons';

export interface NavItem {
  title: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  fullDescription: string;
  icon: IconName;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  briefDescription: string;
  fullDescription: string;
}

export interface Collaborator {
  name: string;
  role: string;
  image: string;
  briefDescription: string;
  fullDescription: string;
}

export interface User {
  id: string;
  email?: string;
  role: 'admin' | 'operator' | 'patient';
  name: string;
  createdAt: Date;
}

export interface Visit {
  id: string;
  operatorId: string;
  patientId: string;
  date: Date;
  duration: number; // in minutes
  notes?: string;
  createdAt: Date;
}
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
  email: string | null;
  role: 'admin' | 'operator' | 'patient';
  name: string;
  createdAt: Date;
}

export interface BillingInfo {
  parentName: string;
  parentSurname: string;
  fiscalCode: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  phone?: string;
  email?: string;
  vatNumber?: string; // Partita IVA (opzionale)
}

export interface Patient extends User {
  role: 'patient';
  parentName: string; // Nome del genitore/tutore
  parentSurname: string; // Cognome del genitore/tutore
  billingInfo: BillingInfo; // Dati per la fatturazione
  medicalNotes?: string;
}

export interface Visit {
  id: string;
  operatorId: string;
  patientId: string;
  type: 'Psicoterapia' | 'Psicoeducazione' | 'ABA' | 'Logopedia' | 'Neuropsicomotricità' | 'Gruppo' | 'GLO';
  date: Date;
  duration: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TherapyPrice {
  id: string;
  type: 'Psicoterapia' | 'Psicoeducazione' | 'ABA' | 'Logopedia' | 'Neuropsicomotricità' | 'Gruppo' | 'GLO';
  pricePerHour: number;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface InvoiceItem {
  therapyType: string;
  hours: number;
  pricePerHour: number;
  total: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  billingInfo: BillingInfo; // Sostituisce patientEmail con i dati completi di fatturazione
  month: number;
  year: number;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  // Price adjustment: discount (negative) or surcharge (positive)
  adjustmentAmount?: number;
  adjustmentReason?: string;
  status: 'proforma' | 'final' | 'sent' | 'paid' | 'overdue' | 'closed';
  createdAt: Date;
  sentAt?: Date;
  paidAt?: Date;
  dueDate: Date;
  invoiceNumber: string;
  // Email tracking fields
  proformaEmailSentAt?: Date;
  finalEmailSentAt?: Date;
}
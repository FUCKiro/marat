import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Brain, Users, Sparkles, Activity, MessageSquare, GraduationCap, BookOpen } from 'lucide-react';
import { Service } from '../types';

interface Props {
  service: Service;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: Props) {
  const IconComponent = {
    Heart,
    Brain,
    Users,
    Sparkles,
    Activity,
    MessageSquare,
    GraduationCap,
    BookOpen
  }[service.icon];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Chiudi"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex items-start mb-8">
        {IconComponent && (
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <IconComponent className="w-6 h-6 text-teal-600" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h2>
          <p className="text-teal-600 font-medium">{service.description}</p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {service.fullDescription.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}

        <div className="bg-teal-50 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-teal-800 mb-4">
            Caratteristiche del servizio:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-teal-700">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              Valutazione iniziale approfondita
            </li>
            <li className="flex items-center text-teal-700">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              Piano di intervento personalizzato
            </li>
            <li className="flex items-center text-teal-700">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              Monitoraggio costante dei progressi
            </li>
            <li className="flex items-center text-teal-700">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              Supporto continuo alla famiglia
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
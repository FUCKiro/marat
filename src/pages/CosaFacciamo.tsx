import React from 'react';
import Layout from '../components/Layout';
import type { Service } from '../types';
import { services } from '../data/services';
import { Heart, Brain, Users, Sparkles, Activity, MessageSquare, GraduationCap, BookOpen } from 'lucide-react';
import PageBackground3D from '../components/PageBackground3D';
import ServiceModal from '../components/ServiceModal';
import ScrollAnimation from '../components/ScrollAnimation';
import { useState } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

export default function CosaFacciamo() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <Layout>
      <SEO
        title="Cosa Facciamo"
        description="Scopri i servizi specialistici di Maratonda: ABA, psicoterapia, neuropsicomotricità, logopedia e molto altro. Interventi personalizzati per il benessere delle persone neurodiverse."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="waves" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Cosa Facciamo</h1>
          <p className="text-xl">
            Offriamo servizi personalizzati per supportare il benessere delle persone neurodiverse.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service) => {
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
              <ScrollAnimation
                key={service.title} 
                className="bg-white p-8 rounded-lg shadow-lg transform transition-all hover:scale-105"
              >
                <div 
                  className="cursor-pointer" 
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      {IconComponent && <IconComponent className="w-6 h-6 text-teal-600" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
                  </div>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                      Valutazione iniziale personalizzata
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                      Piano di intervento su misura
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                      Monitoraggio costante dei progressi
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Il Nostro Approccio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={0.3} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Valutazione</h3>
              <p className="text-gray-700">
                Analisi approfondita delle esigenze e delle potenzialità individuali
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Pianificazione</h3>
              <p className="text-gray-700">
                Sviluppo di un programma personalizzato e obiettivi specifici
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.5} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Intervento</h3>
              <p className="text-gray-700">
                Attuazione del programma con monitoraggio continuo dei progressi
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedService(null)}
          >
            <ServiceModal 
              service={selectedService} 
              onClose={() => setSelectedService(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
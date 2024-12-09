import React from 'react';
import Layout from '../components/Layout';
import { services } from '../data/services';
import { Heart, Brain, Users, Sparkles, Activity } from 'lucide-react';

export default function CosaFacciamo() {
  const icons = { Heart, Brain, Users, Sparkles, Activity };

  return (
    <Layout>
      <div className="bg-teal-600 text-white py-16">
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
            const IconComponent = icons[service.icon as keyof typeof icons];
            
            return (
              <div key={service.title} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3 text-gray-600">
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
            );
          })}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Il Nostro Approccio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Valutazione</h3>
              <p className="text-gray-600">
                Analisi approfondita delle esigenze e delle potenzialità individuali
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Pianificazione</h3>
              <p className="text-gray-600">
                Sviluppo di un programma personalizzato e obiettivi specifici
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Intervento</h3>
              <p className="text-gray-600">
                Attuazione del programma con monitoraggio continuo dei progressi
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
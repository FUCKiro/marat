import React from 'react';
import Layout from '../components/Layout';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contatti() {
  return (
    <Layout>
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Contatti</h1>
          <p className="text-xl">Siamo qui per aiutarti. Contattaci per qualsiasi informazione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Informazioni di Contatto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Indirizzo</h3>
                  <p className="text-gray-600">
                    Via Example, 123<br />
                    00100 Roma, Italia
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Telefono</h3>
                  <p className="text-gray-600">+39 123 456 7890</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Email</h3>
                  <p className="text-gray-600">info@maratonda.it</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Orari</h3>
                  <p className="text-gray-600">
                    Lunedì - Venerdì: 9:00 - 18:00<br />
                    Sabato: 9:00 - 13:00<br />
                    Domenica: Chiuso
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Scrivici</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Invia Messaggio
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
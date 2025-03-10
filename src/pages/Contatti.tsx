import React from 'react';
import Layout from '../components/Layout';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageBackground3D from '../components/PageBackground3D';
import { useState } from 'react';
import ScrollAnimation from '../components/ScrollAnimation';

interface FormData {
  name: string;
  email: string;
  message: string;
}
import SEO from '../components/SEO';

export default function Contatti() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Qui andrebbe l'integrazione con il backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulazione
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <Layout>
      <SEO
        title="Contatti"
        description="Contatta Maratonda per informazioni sui nostri servizi. Siamo a Roma e offriamo supporto specialistico per persone neurodiverse e le loro famiglie."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="circles" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Contatti</h1>
          <p className="text-xl">Siamo qui per aiutarti. Contattaci per qualsiasi informazione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <ScrollAnimation>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Informazioni di Contatto</h2>
            
              <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Indirizzo</h3>
                  <p className="text-gray-700">
                    <strong>Sede:</strong><br />
                    Largo Bacone, 16<br />
                    00137 Roma
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Telefono</h3>
                  <p className="text-gray-700">+39 351 479 0620</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Email</h3>
                  <p className="text-gray-700">associazionemaratonda@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-teal-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Orari</h3>
                  <p className="text-gray-700">
                    Lunedì - Venerdì: 9:00 - 18:00<br />
                    Sabato: 9:00 - 13:00<br />
                    Domenica: Chiuso
                  </p>
                </div>
              </div>
              </div>
            </ScrollAnimation>
          </div>

          <div>
            <ScrollAnimation delay={0.2}>
              <h2 className="text-3xl font-bold mb-8 text-white">Scrivici</h2>
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="text-green-600 font-medium">
                  Messaggio inviato con successo!
                </div>
              )}
              
              {status === 'error' && (
                <div className="text-red-600 font-medium">
                  Si è verificato un errore. Riprova più tardi.
                </div>
              )}

              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Invio in corso...' : 'Invia Messaggio'}
              </button>
              </form>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </Layout>
  );
}
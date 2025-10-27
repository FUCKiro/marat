import React from 'react';
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
    <>
      <SEO
        title="Contatti — Maratonda (Studio Psicologi a Roma)"
        description="Contatta Maratonda a Roma per valutazioni e interventi specialistici su autismo e neurodiversità. Prenota una prima visita o richiedi informazioni su percorsi ABA, psicoterapia e supporto per famiglie."
        type="contact_point"
      />

      {/* ContactPage structured data */}
      <script type="application/ld+json">{`{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "mainEntity": {
          "@type": "Organization",
          "name": "Maratonda",
          "url": "https://associazione-maratonda.it",
          "email": "associazionemaratonda@gmail.com",
          "telephone": "+39 351 479 0620",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Largo Bacone, 16",
            "addressLocality": "Roma",
            "postalCode": "00137",
            "addressCountry": "IT"
          }
        }
      }`}</script>
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="circles" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Contatti</h1>
          <p className="text-xl">Siamo qui per aiutarti. Contattaci per qualsiasi informazione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 items-start">
            {/* Colonna sinistra - Informazioni di contatto */}
            <div className="xl:col-span-2 space-y-12">
              <ScrollAnimation>
                <div>
                  <h2 className="text-4xl font-bold mb-10 text-gray-800">Informazioni di Contatto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4 flex-shrink-0">
                          <MapPin className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Indirizzo</h3>
                          <p className="text-gray-700 leading-relaxed">
                            <strong>Sede:</strong><br />
                            Largo Bacone, 16<br />
                            00137 Roma
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4 flex-shrink-0">
                          <Phone className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Telefono</h3>
                          <p className="text-gray-700 text-lg font-medium">+39 351 479 0620</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4 flex-shrink-0">
                          <Mail className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Email</h3>
                          <p className="text-gray-700 break-all">associazionemaratonda@gmail.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4 flex-shrink-0">
                          <Clock className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Orari</h3>
                          <p className="text-gray-700 leading-relaxed">
                            Lunedì - Venerdì: 9:00 - 18:00<br />
                            Sabato: 9:00 - 13:00<br />
                            Domenica: Chiuso
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Mappa Google */}
              <ScrollAnimation delay={0.3}>
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-800">Come Raggiungerci</h3>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5935.578689874778!2d12.5590695771453!3d41.94037776151107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6477ac34bc57%3A0x5d29cdf5418e2086!2sLargo%20Bacone%2C%2016%2C%2000137%20Roma%20RM!5e0!3m2!1sit!2sit!4v1758978740026!5m2!1sit!2sit"
                      width="100%" 
                      height="400" 
                      style={{border: 0}} 
                      allowFullScreen={true}
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Colonna destra - Form di contatto */}
            <div className="xl:col-span-1">
              <ScrollAnimation delay={0.2}>
                <div className="sticky top-8">
                  <h2 className="text-4xl font-bold mb-10 text-gray-800">Scrivici</h2>
                  <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 rounded-xl shadow-lg">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-semibold mb-3 text-lg">
                        Nome e Cognome
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-semibold mb-3 text-lg">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-semibold mb-3 text-lg">
                        Messaggio
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-vertical text-lg"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    {status === 'success' && (
                      <div className="p-5 bg-green-50 border-2 border-green-200 rounded-lg">
                        <p className="text-green-700 font-semibold text-lg">
                          ✓ Messaggio inviato con successo!
                        </p>
                      </div>
                    )}
                    
                    {status === 'error' && (
                      <div className="p-5 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="text-red-700 font-semibold text-lg">
                          ✗ Si è verificato un errore. Riprova più tardi.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Invio in corso...' : 'Invia Messaggio'}
                    </button>
                  </form>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
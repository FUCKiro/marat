import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Brain, Users, Sparkles, Activity, MessageSquare, GraduationCap, BookOpen } from 'lucide-react';
import { services } from './data/services';
import Hero3D from './components/Hero3D';
import SEO from './components/SEO';

function App() {
  return (
    <>
      <SEO />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] text-white">
        <Hero3D />
      </section>

      {/* Buttons Section - Outside Hero3D */}
      <section className="relative -mt-20 z-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contatti"
              className="group bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center shadow-lg"
            >
              Contattaci
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/chi-siamo"
              className="bg-teal-600 border-2 border-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 hover:border-teal-700 transition-all shadow-lg"
            >
              Scopri di più
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            I Nostri Servizi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div key={service.title} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">La Nostra Missione</h2>
            <p className="text-xl text-gray-600 mb-8">
              Crediamo che ogni persona sia unica e speciale. Il nostro obiettivo è creare un ambiente
              inclusivo e supportivo dove ogni individuo possa esprimere il proprio potenziale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-teal-600">Inclusività</h3>
                <p className="text-gray-600">Accogliamo e valorizziamo ogni differenza</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-teal-600">Professionalità</h3>
                <p className="text-gray-600">Team di esperti qualificati e aggiornati</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-teal-600">Personalizzazione</h3>
                <p className="text-gray-600">Percorsi su misura per ogni esigenza</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
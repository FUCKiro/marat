import React from 'react';
import Layout from './components/Layout';
import { ArrowRight, Heart, Brain, Users, Sparkles, Activity, MessageSquare, GraduationCap, BookOpen } from 'lucide-react';
import { services } from './data/services';
import Hero3D from './components/Hero3D';

function App() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] text-white flex items-center">
        <Hero3D />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Maratonda
            </h1>
            <p className="text-2xl mb-4">
              Valorizziamo la Neurodiversità
            </p>
            <blockquote className="text-xl mb-12 max-w-2xl mx-auto">
              <p className="italic mb-4">
                "Qui devi correre più che puoi per restare nello stesso posto.
              </p>
              <p className="italic mb-6">
                Se vuoi andare da qualche parte devi correre almeno il doppio!"
              </p>
              <div className="w-16 h-1 bg-white/30 mx-auto"></div>
            </blockquote>
            <p className="text-lg mb-12 opacity-90">
              Un percorso di crescita insieme, passo dopo passo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contatti"
                className="group bg-white/90 backdrop-blur-sm text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-white transition-all inline-flex items-center justify-center"
              >
                Contattaci
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/chi-siamo"
                className="bg-transparent border-2 border-white/70 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all hover:border-white"
              >
                Scopri di più
              </a>
            </div>
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
    </Layout>
  );
}

export default App;
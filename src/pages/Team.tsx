import React from 'react';
import { team } from '../data/team';
import { collaborators } from '../data/collaborators';
import { Users } from 'lucide-react';
import PageBackground3D from '../components/PageBackground3D';
import ScrollAnimation from '../components/ScrollAnimation';
import HoverCard from '../components/HoverCard';
import SEO from '../components/SEO';

export default function Team() {
  return (
    <>
      <SEO
        title="Il Nostro Team"
        description="Conosci il team di professionisti di Maratonda: psicologi, terapisti, logopedisti ed educatori specializzati nel supporto alle persone neurodiverse."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="grid" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Il Nostro Team</h1>
          <p className="text-xl">Professionisti dedicati al tuo benessere.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Esperti in Neurodiversità</h2>
          <p className="text-xl text-white/80">
            Il nostro team multidisciplinare lavora in sinergia per garantire un supporto
            completo e personalizzato a ogni persona che si affida a noi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <ScrollAnimation 
              key={member.name} 
              delay={index * 0.2} 
            >
              <HoverCard
                image={member.image}
                name={member.name}
                role={member.role}
                briefDescription={member.briefDescription}
                fullDescription={member.fullDescription}
                className="shadow-lg"
              />
            </ScrollAnimation>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">I Nostri Collaboratori</h2>
          <p className="text-xl text-white/80">
            Un team di professionisti specializzati che contribuisce al successo dei nostri programmi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {collaborators.map((collaborator, index) => (
            <ScrollAnimation
              key={collaborator.name}
              delay={index * 0.1}
            >
              <HoverCard
                image={collaborator.image}
                name={collaborator.name}
                role={collaborator.role}
                briefDescription={collaborator.briefDescription}
                fullDescription={collaborator.fullDescription}
                className="shadow-lg"
              />
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={0.6} className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vuoi unirti al nostro team?
          </h2>
          <p className="text-gray-700 mb-6">
            Siamo sempre alla ricerca di professionisti appassionati e competenti
            che condividano la nostra missione.
          </p>
          <a
            href="/contatti"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Contattaci
          </a>
        </ScrollAnimation>
      </div>
    </>
  );
}
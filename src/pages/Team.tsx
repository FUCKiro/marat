import React from 'react';
import Layout from '../components/Layout';
import { team } from '../data/team';
import { collaborators } from '../data/collaborators';
import { Users } from 'lucide-react';
import PageBackground3D from '../components/PageBackground3D';
import ScrollAnimation from '../components/ScrollAnimation';

export default function Team() {
  return (
    <Layout>
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
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-700">{member.description}</p>
              </div>
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
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-square">
                <img
                  src={collaborator.image}
                  alt={collaborator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{collaborator.name}</h3>
                <p className="text-teal-600 text-sm font-semibold">{collaborator.role}</p>
              </div>
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
    </Layout>
  );
}
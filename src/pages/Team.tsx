import React from 'react';
import Layout from '../components/Layout';
import { team } from '../data/team';
import { Users } from 'lucide-react';

export default function Team() {
  return (
    <Layout>
      <div className="bg-teal-600 text-white py-16">
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
          <p className="text-xl text-gray-600">
            Il nostro team multidisciplinare lavora in sinergia per garantire un supporto
            completo e personalizzato a ogni persona che si affida a noi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vuoi unirti al nostro team?
          </h2>
          <p className="text-gray-600 mb-6">
            Siamo sempre alla ricerca di professionisti appassionati e competenti
            che condividano la nostra missione.
          </p>
          <a
            href="/contatti"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Contattaci
          </a>
        </div>
      </div>
    </Layout>
  );
}
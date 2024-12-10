import React from 'react';
import Layout from '../components/Layout';
import { Users } from 'lucide-react';

export default function ChiSiamo() {
  return (
    <Layout>
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Chi Siamo</h1>
          <p className="text-xl">La nostra storia, i nostri valori, la nostra missione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">La Nostra Storia</h2>
            <p className="text-gray-600 mb-4">
              Maratonda nasce dalla passione e dall'impegno di un gruppo di professionisti
              che credono nel valore della neurodiversità. Dal 2015, lavoriamo per creare
              un ambiente inclusivo e supportivo dove ogni persona possa esprimere
              il proprio potenziale.
            </p>
            <p className="text-gray-600">
              Il nostro approccio integrato combina diverse discipline e competenze,
              permettendoci di offrire un supporto completo e personalizzato a ogni
              individuo che si rivolge a noi.
            </p>
          </div>
          <div className="bg-teal-100 p-8 rounded-lg">
            <div className="flex items-center justify-center">
              <Users className="w-32 h-32 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">I Nostri Valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Rispetto</h3>
              <p className="text-gray-600">
                Riconosciamo e rispettiamo l'unicità di ogni individuo, valorizzando
                le differenze come fonte di ricchezza.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Competenza</h3>
              <p className="text-gray-600">
                Il nostro team è formato da professionisti qualificati in continuo
                aggiornamento per garantire il miglior supporto possibile.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Innovazione</h3>
              <p className="text-gray-600">
                Adottiamo approcci innovativi e personalizzati, combinando metodologie
                tradizionali e nuove tecnologie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
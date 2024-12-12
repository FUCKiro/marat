import React from 'react';
import Layout from '../components/Layout';
import { Users } from 'lucide-react';
import PageBackground3D from '../components/PageBackground3D';
import ScrollAnimation from '../components/ScrollAnimation';
import SEO from '../components/SEO';

export default function ChiSiamo() {
  return (
    <Layout>
      <SEO
        title="Chi Siamo"
        description="Maratonda è un'associazione dedicata al supporto delle persone neurodiverse, offrendo servizi specialistici e un ambiente accogliente per la crescita e lo sviluppo personale."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="circles" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Chi Siamo</h1>
          <p className="text-xl">La nostra storia, i nostri valori, la nostra missione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Chi Siamo</h2>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 mb-4">
              L'Associazione Maratonda è nata dall'esperienza di professioniste nel settore neuropsicologico,
              con l'obiettivo di creare uno spazio accogliente e condiviso per bambini, adolescenti,
              adulti e le loro famiglie. Ogni percorso è personalizzato, rispettando le unicità e
              accompagnando ciascuno lungo traiettorie di sviluppo uniche e irripetibili.
            </p>
            <p className="text-gray-700">
              Maratonda accoglie l'individuo nella sua unicità, valorizzando le potenzialità nascoste
              e offrendo un ambiente in cui queste possano emergere e fiorire.
            </p>
            <p className="text-gray-700 mt-4">
              L'associazione fornisce servizi specialistici in ambito clinico neuropsicologico,
              tra cui diagnosi, valutazioni e trattamenti neuropsicologici, psicoeducativi,
              neuropsicomotori e logopedici, con un'attenzione particolare a chi vive una
              condizione di neurodiversità.
            </p>
            <p className="text-gray-700 mt-4">
              Oltre ai servizi clinici, Maratonda promuove attività esperienziali, ricreative
              e di integrazione sociale e lavorativa. L'autonomia, l'inclusione e la costruzione
              di relazioni significative sono al centro della sua missione, per migliorare il
              benessere psicofisico e la qualità di vita di ogni individuo.
            </p>
            <p className="text-gray-700 mt-4">
              Maratonda combina professionalità e umanità, trasformando i suoi spazi in luoghi
              di socialità e crescita, dove ognuno trova il proprio posto per esprimersi al meglio.
            </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <img
              src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733930120/grupmar_iwuta6.jpg"
              alt="Il team di Maratonda"
              className="w-full h-auto rounded-lg shadow-xl object-cover"
            />
          </ScrollAnimation>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">I Nostri Valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={0.3} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Rispetto</h3>
              <p className="text-gray-700">
                Riconosciamo e rispettiamo l'unicità di ogni individuo, valorizzando
                le differenze come fonte di ricchezza.
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Competenza</h3>
              <p className="text-gray-700">
                Il nostro team è formato da professionisti qualificati in continuo
                aggiornamento per garantire il miglior supporto possibile.
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.5} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Innovazione</h3>
              <p className="text-gray-700">
                Adottiamo approcci innovativi e personalizzati, combinando metodologie
                tradizionali e nuove tecnologie.
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </Layout>
  );
}
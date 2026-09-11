import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Lightbulb, ArrowRight } from 'lucide-react';

const PageBackground3D = lazy(() => import('../components/PageBackground3D'));
import ScrollAnimation from '../components/ScrollAnimation';
import SEO from '../components/SEO';

export default function ChiSiamo() {
  return (
    <>
      <SEO
        title="Chi Siamo — Maratonda (Studio Psicologi a Roma)"
        description="Scopri Maratonda: uno studio di psicologia a Roma specializzato in neurodiversità e autismo. Il nostro team offre valutazioni, interventi e supporto personalizzato per famiglie e persone di tutte le età."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <Suspense fallback={null}><PageBackground3D pattern="circles" /></Suspense>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Chi Siamo</h1>
          <p className="text-xl">La nostra storia, i nostri valori, la nostra missione.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollAnimation>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg space-y-10">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">La nostra storia</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  L'Associazione Maratonda è nata dall'esperienza di professioniste nel settore neuropsicologico,
                  con l'obiettivo di creare uno spazio accogliente e condiviso per bambini, adolescenti,
                  adulti e le loro famiglie. Ogni percorso è personalizzato, rispettando le unicità e
                  accompagnando ciascuno lungo traiettorie di sviluppo uniche e irripetibili.
                </p>
              </section>
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">La nostra missione</h2>
                <blockquote className="border-l-4 border-teal-600 bg-teal-50 rounded-r-lg pl-5 pr-6 py-4">
                  <p className="text-lg text-teal-900 italic leading-relaxed">
                    Maratonda accoglie l'individuo nella sua unicità, valorizzando le potenzialità nascoste
                    e offrendo un ambiente in cui queste possano emergere e fiorire.
                  </p>
                </blockquote>
                <p className="text-gray-700 leading-relaxed">
                  Maratonda combina professionalità e umanità, trasformando i suoi spazi in luoghi
                  di socialità e crescita, dove ognuno trova il proprio posto per esprimersi al meglio.
                </p>
              </section>
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Cosa facciamo</h2>
                <p className="text-gray-700 leading-relaxed">
                  L'associazione fornisce servizi specialistici in ambito clinico neuropsicologico,
                  tra cui diagnosi, valutazioni e trattamenti neuropsicologici, psicoeducativi,
                  neuropsicomotori e logopedici, con un'attenzione particolare a chi vive una
                  condizione di neurodiversità.
                </p>
              </section>
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Oltre la clinica</h2>
                <p className="text-gray-700 leading-relaxed">
                  Oltre ai servizi clinici, Maratonda promuove attività esperienziali, ricreative
                  e di integrazione sociale e lavorativa. L'autonomia, l'inclusione e la costruzione
                  di relazioni significative sono al centro della sua missione, per migliorare il
                  benessere psicofisico e la qualità di vita di ogni individuo.
                </p>
              </section>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2} className="md:sticky md:top-8 self-start">
            <img
              src="/gruppo-maratonda.jpg"
              alt="Il team di Maratonda"
              className="w-[93%] h-auto rounded-lg shadow-xl object-cover mx-auto"
            />
          </ScrollAnimation>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">I Nostri Valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={0.3} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Rispetto</h3>
              <p className="text-gray-600">
                Riconosciamo e rispettiamo l'unicità di ogni individuo, valorizzando
                le differenze come fonte di ricchezza.
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Competenza</h3>
              <p className="text-gray-600">
                Il nostro team è formato da professionisti qualificati in continuo
                aggiornamento per garantire il miglior supporto possibile.
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.5} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Innovazione</h3>
              <p className="text-gray-600">
                Adottiamo approcci innovativi e personalizzati, combinando metodologie
                tradizionali e nuove tecnologie.
              </p>
            </ScrollAnimation>
          </div>
        </div>

        <ScrollAnimation delay={0.2} className="mt-16">
          <div className="bg-teal-600 rounded-2xl px-8 py-12 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Vuoi conoscerci meglio?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Scopri i professionisti che compongono il nostro team oppure scrivici:
              saremo felici di rispondere alle tue domande.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/team"
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center shadow-lg"
              >
                Scopri il nostro team
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/contatti"
                className="border-2 border-white/70 px-8 py-3 rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all inline-flex items-center justify-center"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </>
  );
}
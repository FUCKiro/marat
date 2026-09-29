import { lazy, Suspense } from 'react';
import { Instagram } from 'lucide-react';
import SEO from '../components/SEO';
import ScrollAnimation from '../components/ScrollAnimation';
import InstagramEmbed from '../components/InstagramEmbed';
import { instagramPosts, INSTAGRAM_PROFILE_URL } from '../data/instagramPosts';

const PageBackground3D = lazy(() => import('../components/PageBackground3D'));

export default function Progetto() {
  return (
    <>
      <SEO
        title="ZenZazionale! — Yoga e mindfulness per ragazzi con autismo | Maratonda"
        description="ZenZazionale! è il progetto di Maratonda dedicato a ragazzi e ragazze con disturbo dello spettro autistico e alle loro famiglie: yoga adattato, mindfulness e movimento. Finanziato dal Bando per lo Sport 2025 della Fondazione Baroni."
      />
      <div className="bg-teal-600 text-white py-16">
        <Suspense fallback={null}><PageBackground3D pattern="circles" /></Suspense>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">ZenZazionale!</h1>
          <p className="text-xl">Yoga, mindfulness e movimento per ragazzi con spettro autistico e le loro famiglie.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <ScrollAnimation>
          <div className="max-w-3xl mx-auto bg-white/90 p-8 rounded-lg shadow-lg space-y-4 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-800">Un nuovo progetto di Maratonda</h2>
            <p>
              Siamo felici di raccontarvi l'avvio di un nuovo progetto di Maratonda dedicato a ragazzi
              e ragazze con disturbo dello spettro autistico e alle loro famiglie.
            </p>
            <p>
              Uno spazio in cui lo yoga, la mindfulness e il movimento diventano strumenti per ascoltare
              il proprio corpo, riconoscere le emozioni, sperimentare nuove strategie di regolazione e
              stare insieme agli altri.
            </p>
            <p>
              Perché non esiste un solo modo di sentire, di muoversi, di comunicare o di stare nel mondo.
              E proprio per questo vogliamo costruire uno spazio capace di accogliere ogni persona nella
              sua unicità.
            </p>
            <p>
              Attraverso attività di yoga adattato, respirazione, mindfulness e percorsi motori
              strutturati, accompagneremo i partecipanti in un percorso di scoperta e crescita, lavorando
              anche insieme alle famiglie per portare le strategie apprese nella quotidianità.
            </p>
            <p className="font-medium text-teal-700">
              Un tappetino. Un respiro. Un movimento. Un piccolo passo alla volta.
            </p>
            <p>
              ZenZazionale! nasce per trasformare questi piccoli passi in occasioni di benessere,
              autonomia, relazione e partecipazione.
            </p>
            <p className="italic">Perché lo sport è di tutti. E ogni modo di sentire merita il suo spazio.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-200">
              <img
                src="/fondazione_baroni/FONDAZIONEBARONI_LOGO.jpg"
                alt="Logo Fondazione Baroni"
                className="h-20 w-auto object-contain"
              />
              <p className="text-sm text-gray-600">
                Il progetto è realizzato da Maratonda Società Cooperativa Sociale e finanziato
                nell'ambito del Bando per lo Sport 2025 della Fondazione Baroni.
              </p>
            </div>
          </div>
        </ScrollAnimation>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Dal nostro Instagram</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {instagramPosts.map((url) => (
              <InstagramEmbed key={url} url={url} />
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              Seguici su Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

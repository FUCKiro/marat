import SEO from '../components/SEO';

export default function Autismo() {
  return (
    <>
      <SEO
        title="Autismo - Servizi specialistici a Roma"
        description="Maratonda offre valutazione e interventi specialistici per disturbi dello spettro autistico a Roma: percorsi ABA, supporto psicoterapico, neuropsicomotricità e interventi educativi personalizzati."
        type="article"
      />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose">
          <h1>Interventi per l'autismo a Roma</h1>
          <p>
            A Maratonda offriamo percorsi multidisciplinari per bambini, adolescenti e adulti
            con disturbo dello spettro autistico. Il nostro approccio integra valutazione
            diagnostica, interventi basati su evidenze (es. ABA), psicoterapia e supporto
            per le famiglie.
          </p>

          <h2>Cosa offriamo</h2>
          <ul>
            <li>Valutazione diagnostica e neuropsicologica</li>
            <li>Piani educativi e interventi ABA individualizzati</li>
            <li>Supporto psicoterapico per bambini, adolescenti e adulti</li>
            <li>Consulenza e formazione per famiglie e scuole</li>
            <li>Neuropsicomotricità e logopedia</li>
          </ul>

          <h2>Perché scegliere Maratonda</h2>
          <p>
            Siamo uno studio con professionisti qualificati, esperienza nel lavoro con
            neurodiversità e attenzione alla personalizzazione del percorso. Siamo a Roma
            in Largo Bacone 16 — contattaci per una prima valutazione.
          </p>

          <div className="mt-8">
            <a href="/contatti" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg">Contattaci</a>
          </div>
        </div>
      </main>
    </>
  );
}

import PageBackground3D from '../components/PageBackground3D';
import ScrollAnimation from '../components/ScrollAnimation';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Informativa sulla privacy di Maratonda: scopri come trattiamo e proteggiamo i tuoi dati personali nel rispetto della normativa vigente."
        type="article"
      />
      <div className="bg-teal-600 text-white py-16">
        <PageBackground3D pattern="grid" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl">Informativa sul trattamento dei dati personali</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <ScrollAnimation>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Informativa sulla Privacy</h2>
            <div className="space-y-6 text-gray-700">
              <p>
                La presente informativa descrive le modalità di gestione del sito web di Maratonda in riferimento al trattamento dei dati personali degli utenti che lo consultano.
              </p>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Titolare del Trattamento</h3>
                <p>
                  Il titolare del trattamento è Maratonda, con sede in Via Example, 123 - 00100 Roma.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Tipologia di Dati Raccolti</h3>
                <p>
                  I dati personali raccolti attraverso questo sito includono:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Dati di navigazione</li>
                  <li>Dati forniti volontariamente dall'utente</li>
                  <li>Cookie tecnici necessari al funzionamento del sito</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Finalità del Trattamento</h3>
                <p>
                  I dati personali sono trattati per le seguenti finalità:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Gestione delle richieste di contatto</li>
                  <li>Invio di comunicazioni relative ai servizi richiesti</li>
                  <li>Adempimento degli obblighi di legge</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">4. Base Giuridica del Trattamento</h3>
                <p>
                  Il trattamento dei dati personali si fonda sul consenso dell'interessato e/o sull'esecuzione di un contratto di cui l'interessato è parte.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">5. Diritti dell'Interessato</h3>
                <p>
                  Gli interessati hanno il diritto di:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Accedere ai propri dati personali</li>
                  <li>Chiederne la rettifica o la cancellazione</li>
                  <li>Richiedere la limitazione del trattamento</li>
                  <li>Opporsi al trattamento</li>
                  <li>Richiedere la portabilità dei dati</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">6. Contatti</h3>
                <p>
                  Per esercitare i propri diritti o per qualsiasi informazione relativa al trattamento dei dati personali, è possibile contattare il Titolare all'indirizzo email: associazionemaratonda@gmail.com
                </p>
              </section>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </>
  );
}
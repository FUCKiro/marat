import SEO from '../components/SEO';

export default function Autismo() {
  const faq = [
    {
      question: "Che cos'è il disturbo dello spettro autistico (ASD)?",
      answer:
        "Il disturbo dello spettro autistico è una condizione del neurosviluppo caratterizzata da difficoltà nella comunicazione sociale e comportamenti ripetitivi o interessi ristretti. Si manifesta con livelli diversi di gravità e richiede valutazione specialistica per identificare il percorso più adatto.",
    },
    {
      question: "Quali interventi offrite per l'autismo a Maratonda?",
      answer:
        "Offriamo valutazione diagnostica, interventi educativi e terapeutici basati su evidenze (incluso l'approccio ABA quando indicato), percorsi di psicoterapia, neuropsicomotricità, logopedia e supporto alle famiglie e alle scuole.",
    },
    {
      question: "A che età è consigliabile richiedere una valutazione?",
      answer:
        "È consigliabile richiedere una valutazione appena emergono preoccupazioni: l'intervento precoce migliora significativamente gli esiti. Ci occupiamo di bambini in età prescolare, scolastica, adolescenti e adulti.",
    },
    {
      question: "Offrite percorsi per l'inclusione scolastica?",
      answer:
        "Sì. Collaboriamo con le famiglie e le scuole per predisporre Piani Educativi Individualizzati (PEI), formazione per insegnanti e interventi specifici in classe o in setting individuale.",
    },
    {
      question: "Come posso prenotare una prima visita a Roma?",
      answer:
        "Puoi contattarci via email a associazionemaratonda@gmail.com o telefonicamente al +39 351 479 0620. Oppure utilizza il modulo nella pagina Contatti per richiedere una prima valutazione.",
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={"Autismo a Roma — Maratonda | Studio di psicologi specializzati"}
        description={
          "Maratonda è uno studio a Roma specializzato in autismo e neurodiversità: valutazione diagnostica, interventi ABA, psicoterapia, neuropsicomotricità e supporto alle famiglie. Contattaci per una prima valutazione."
        }
        type="article"
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://associazione-maratonda.it/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Autismo',
                'item': 'https://associazione-maratonda.it/autismo'
              }
            ]
          })
        }}
      />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose">
          <h1>Interventi per il disturbo dello spettro autistico (ASD) a Roma</h1>

          <p>
            A <strong>Maratonda</strong> forniamo percorsi multidisciplinari per persone con
            disturbo dello spettro autistico. Il nostro approccio integra valutazione
            specialistica, interventi educativi e terapeutici basati su evidenze e un forte
            supporto alle famiglie. Lavoriamo con bambini, adolescenti e adulti per favorire
            l'autonomia, la partecipazione sociale e il benessere psicologico.
          </p>

          <h2>Cosa offriamo</h2>
          <ul>
            <li>
              <strong>Valutazione diagnostica e neuropsicologica</strong> per comprendere il
              profilo funzionale e le esigenze individuali.
            </li>
            <li>
              <strong>Interventi ABA individualizzati</strong> quando indicati, con programmi
              strutturati e monitoraggio degli obiettivi.
            </li>
            <li>
              <strong>Psicoterapia</strong> individuale e di supporto per le famiglie.
            </li>
            <li>
              <strong>Neuropsicomotricità e logopedia</strong> per potenziare sviluppo motorio e
              comunicazione.
            </li>
            <li>
              <strong>Consulenza scolastica e formazione</strong> per insegnanti e operatori.
            </li>
          </ul>

          <h2>Perché scegliere Maratonda a Roma</h2>
          <p>
            I nostri professionisti hanno esperienza nell'ambito delle neurodiversità e
            costruiscono percorsi personalizzati basati sui punti di forza della persona. Lavoriamo in sinergia con la famiglia e la scuola per garantire continuità educativa e terapeutica.
          </p>

          <h2>Come funziona una prima valutazione</h2>
          <p>
            La prima valutazione prevede un colloquio clinico, osservazione diretta e
            strumenti diagnostici standardizzati. Al termine della valutazione viene
            proposto un piano di intervento con obiettivi chiari e tempi di verifica.
          </p>

          <h2>Risorse e supporto per le famiglie</h2>
          <p>
            Offriamo sessioni di counseling familiare, gruppi di supporto e percorsi di
            formazione per genitori e insegnanti, con l'obiettivo di trasferire strategie
            pratiche e sostenere il benessere familiare.
          </p>

          <div className="mt-8">
            <a href="/contatti" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg">Prenota una valutazione</a>
          </div>

          <h2 className="mt-12">Domande frequenti (FAQ)</h2>
          {faq.map((f) => (
            <div key={f.question} className="mb-6">
              <h3 className="text-lg font-semibold">{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}

          {/* JSON-LD FAQ */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </div>
      </main>
    </>
  );
}

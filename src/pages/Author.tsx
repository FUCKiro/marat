import React from 'react';
import { User, Quote } from 'lucide-react';

const Author = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="md:w-1/3">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622741/Gino_seppia_bbiqrg.jpg"
                  alt="Luigi Boccilli"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h1 className="text-4xl font-serif text-[#8B4513] mb-4">Luigi Boccilli</h1>
              <p className="text-xl text-[#DEB887] mb-6">Poeta Romanesco</p>
              <div className="prose prose-lg">
                <p className="text-[#5C4033] italic">
                  «Il creare un qualcosa in romanesco mi gratifica tanto, stante il suo farmi vivere la mia Roma "cultural-popolare"… purtroppo in via d'estinzione»
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-serif text-[#8B4513] mb-4 animate-slide-in">L'autore... modestia a parte</h2>
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
              Luigi Boccilli, un omuncoletto di bassa statura nato a Roma nel 1932, amante della "sua" Roma, della romanità e della romaneschità, ha seguito fin dalla prima infanzia le orme culturali di quella ch'egli usa tuttora chiamare «Rometta mia».
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '200ms' }}>
              "Amore", questo, che lo ha indotto a elaborare in vernacolo romanesco quasi 2.000 sonetti, oltre 1.000 dei quali "caudati" a modo suo, come rilavabile da "Uno per tutti", 17° Libro della "Collana" posta alla fine del presente sito.
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '300ms' }}>
              Lieto d'essere riuscito in quella che qualcuno ha definito una vera impresa "per tipologia e quantità", è comunque rattristato al pensiero che i propri lavori precipiteranno nel nulla assoluto, vista la ormai quasi totale assenza di Lettori, oggi quasi tutti essendo "disperatamente" impegnati a dedicare il proprio tempo libero per acquisire una "magnifica abilità" nel giocare con gli ipad… anche a costo di conquistarsi una "misera incultura".
            </p>

            <div className="bg-[#FDF5E6] p-6 rounded-lg my-8 animate-slide-in" style={{ animationDelay: '400ms' }}>
              <p className="text-[#5C4033] mb-0">
                E pensare che "appena" 40 anni fa (Anni Ottanta, come dunque dire ai tempi di… Nerone), persino Giornali quali "Il Messaggero", "Il Tempo", "L'Umanità" ed altri, parlarono di lui in termini positivi, come si può rilevare dalle Recensioni riportate nel succitato "Uno per tutti".
              </p>
            </div>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '500ms' }}>
              Né qui può mancare il giudizio a suo tempo espresso da un… qualcuno che, per tematiche e qualità, i suoi versi romaneschi erano da collocarsi immediatamente dopo quelli del Belli e del Trilussa! Un concetto, questo, cui egli aveva risposto: «Beh… sì, questo giudizio non può che farmi piacere, ma penso che qualcun altro ne avrà elaborati meglio di me». S'era trattato d'una risposta volta a significarne una (solo apparente) umiltà o non piuttosto…? Bah!…
            </p>

            <blockquote className="border-l-4 border-[#8B4513] pl-4 my-8 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <Quote className="h-8 w-8 text-[#8B4513] mb-2" />
              <p className="italic text-[#8B4513]">«Il creare un qualcosa in romanesco mi gratifica tanto, stante il suo farmi vivere la mia Roma "cultural-popolare"… purtroppo in via d'estinzione»</p>
            </blockquote>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '600ms' }}>
              Né a questo riguardo non si può certo dire che avesse torto, visto che radio e Tv, beneficamente capaci di unificare l'italico idioma, hanno anche purtroppo "ucciso" la secolare cultura insita nei dialetti.
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '700ms' }}>
              D'altronde questa è la vita: tutto ciò che nasce… prima o poi "deve" morire.
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '800ms' }}>
              E così sia!
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '900ms' }}>
              In tutta la sua vita si è sempre impegnato nel mondo della poesia narrativa, a 16 anni in quella in lingua, pere proseguire poi imperterrito in quella romanesca, sempre in forma "analitico-satirico-pungente", quasi a evidente manifestazione… d'esser nato Sociologo.
            </p>

            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '300ms' }}>
              Professionalmente realizzatosi nel mondo delle Tranvie romane, nel 1976 si diplomò come privatista alle Magistrali di Stato, cinque anni dopo laureandosi in Sociologia presso "La Sapienza" di Roma, con una tesi di laurea in Antropologia Culturale.
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '500ms' }}>
              Nel 1985 ebbe la gioia d'esser definito, dal "Corriere della Sera" del 4 gennaio e da "Il Tempo" del successivo 13 giugno: «Tranviere di professione, Sociologo per vocazione, Poeta per amore».
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1000ms' }}>
              Davvero bello, no?
            </p>

            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1100ms' }}>
              Alla fine degli anni Ottanta, con l'«Associazione per la Tutela dell'Integrità di Roma» cui aveva dato vita unitamente ad altri cinque Soci, riuscì a conservare al Campidoglio il Territorio ostiense.
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1200ms' }}>
              Dal 1983 al 1998 ha collaborato come Sociologo con la Cattedra di Medicina Sociale dell'Università "La Sapienza" di Roma, conducendo per oltre un decennio i corsi di "Protezione Civile" (come riportato nella presentazione che seguirà).
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1300ms' }}>
              Alla fine della propria attività tranvierara (1957-1992), all'inizio della quale molti erano usi guardarlo dall'alto in basso (e… non solo per la sua bassa statura!), ebbe la ventura di vedersi osservato dal basso in alto:
            </p>
            
            <ul className="list-disc pl-6 text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1400ms' }}>
              <li>grazie alla credibilità acquisita con la laurea in Sociologia;</li>
              <li>per le poesie nel frattempo pubblicate;</li>
              <li>pei "bei" risultati conseguiti al lavoro, al cui riguardo basta consultare o scaricare il libro "Storia di un imbroglio", ove lo si preferisca.</li>
            </ul>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1500ms' }}>
              Si considera fortunato, per aver finora vissuto la propria "vecchiaia" in continua effervescenza culturale (o pseudo-tale), come può rilevarsi dalle opere in versi e in prosa riportate nel presente sito: "finora", già, visto che, a 88 anni compiuti, comincia a perdere la propria tradizionale "voglia di fare… di fare… di fare!".
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1600ms' }}>
              Peccato!
            </p>
            
            <p className="text-[#5C4033] mb-6 animate-slide-in" style={{ animationDelay: '1700ms' }}>
              Peccato davvero, già, ma, si sa, questo è il regalo della (cosiddetta) "Madre Natura" ove si abbia la fortuna di arrivare alla – comunque beatifica! – vecchiaia; davvero beatifica, almeno ove la si voglia considerare sulla scia dei seguenti due aforismi elaborati dallo stesso Autore e regolarmente riportati libro numero 7 ("L'Aforismario") della "Collana" qui stesso presentata:
            </p>

            <div className="mt-8 border-t border-[#DEB887] pt-8">
              <blockquote className="text-center italic text-[#8B4513] animate-slide-in" style={{ animationDelay: '800ms' }}>
                <p className="mb-4">"La vecchiaia è una brutta malattia ma… guai a non averla!"</p>
                <p className="mb-4">Perché, dopo tutto...</p>
                <p>"Per non soffrire dei mali della vecchiaia basta (basta, già!…) morire giovani!"</p>
                <p className="mt-4">D'altronde questa è la vita.</p>
                <p>Questa, già!</p>
              </blockquote>
            </div>

            <h2 className="text-2xl font-serif text-[#8B4513] mb-6 mt-12">Premi e Riconoscimenti</h2>
            <p className="text-[#5C4033] mb-6 italic">
              Nella sua vita culturale ha avuto la fortuna di godere dei seguenti graditi riconoscimenti:
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-[#FDF5E6] rounded-lg hover:shadow-md transition-shadow duration-700">
                <h3 className="text-[#8B4513] font-serif mb-2">1984</h3>
                <ul className="list-disc pl-6 text-[#5C4033] space-y-4">
                  <li>3 dicembre - Prima Mostra Itinerante Polisportiva Autofilotranvieri Roma: «Al Maestro Boccilli Luigi, per la notevole collaborazione e generoso contributo a favore della lotta contro il tumore».</li>
                  <li>21 dicembre - A Villa Pamphili, "Riconoscimenti speciali di merito" per "Ar galoppo" e "Sta Fede in cocci".</li>
                  <li>31 dicembre - 1° Premio "Libreria Croce", con il Patrocinio dell'Assessorato alla Cultura della Regione Lazio, per "W la Befana".</li>
                </ul>
              </div>

              <div className="p-4 bg-[#FDF5E6] rounded-lg hover:shadow-md transition-shadow duration-700">
                <h3 className="text-[#8B4513] font-serif mb-2">1986</h3>
                <ul className="list-disc pl-6 text-[#5C4033] space-y-4">
                  <li>22 marzo - Targa d'oro per la poesia dall'Accademia Tiberina.</li>
                  <li>17 maggio - Pericle d'oro: «Luigi Boccilli, poeta romanesco della migliore tempra, che ripropone una Roma mai completamente sparita e anzi eterna, soprattutto per la minuta esistenza che fermenta fra le sue quinte».</li>
                  <li>22 maggio - Premio Galilei.</li>
                  <li>23 agosto - Primo classificato al Premio Histonium, con poesia in lingua: "L'Emigrante": «Nel verso limpido e armonio del Boccilli, l'emigrato ritrova tutta la sua struttura interiore e la profondità dei sentimenti, attraverso i quali si staglia all'orizzonte della terra straniera quale autentico gigante di sacrificio e laboriosità».</li>
                  <li>1 ottobre - Conferimento titolo di "Accademico Tiberino".</li>
                  <li>4 ottobre - "Targa d'Oro Arte e Cultura" del Consiglio Regionale del Lazio.</li>
                  <li>16 novembre - Da Accademia Tiberina, "Omaggio a Petrolini".</li>
                  <li>30 novembre - "Gran Premio Internazionale Cavalieri di Malta".</li>
                  <li>10 dicembre - Dal "Centro Letterario del Lazio" "Premio Speciale per la poesia romanesca".</li>
                </ul>
              </div>

              <div className="p-4 bg-[#FDF5E6] rounded-lg hover:shadow-md transition-shadow duration-700">
                <h3 className="text-[#8B4513] font-serif mb-2">1987-1988</h3>
                <ul className="list-disc pl-6 text-[#5C4033] space-y-4">
                  <li>26 gennaio 1987 - "Premio Garzia Loca", con cerimonia nella Sala Protomoteca del Campidoglio.</li>
                  <li>21 ottobre 1988 - Dal Comune di Guidonia Montecelio, Città dell'Aria: «... La Sua opera, frutto di profonda cultura, erudizione, conoscenza tecnica e soprattutto di vero amore per il dialetto romanesco, è stata molto apprezzata sia dai cittadini che l'hanno ascoltata dalla sua viva voce, sia dai componenti della Giunta e del Consiglio comunale cui Ella ha voluto farne dono...».</li>
                  <li>16 novembre 1988 - I classificato "Premio Baratti" per la poesia dialettale.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#FDF5E6] rounded-lg hover:shadow-md transition-shadow duration-700">
                <h3 className="text-[#8B4513] font-serif mb-2">1993-2012</h3>
                <ul className="list-disc pl-6 text-[#5C4033] space-y-4">
                  <li>5 ottobre 1993 - Medaglia d'oro Atac «In riconoscimento dell'attività svolta per l'Azienda».</li>
                  <li>22 settembre 2001 - Dall'Histonium, "Premio Cultura alla carriera".</li>
                  <li>16 agosto 2012 - Primo classificato nella Sezione "B" del V Concorso per la poesia in lingua e dialettale "Nuova Arcobaleno" di San Martino in Pensilis (Cb), con la silloge "I segreti dell'animo". Motivazione: «È una raccolta di 15 sonetti che si presentano in uno spirito salace, disincantato, libero, a tratti furbesco, una costante questa della poesia romanesca che conferisce a tutta la raccolta un tocco di studiata intelligenza e quindi di gradevolezza che intriga e alleggerisce gli elementi tematici. / Con vividezza e competenza denotanti una quotidiana e minuziosa informazione, il poeta rappresenta in un realismo nudo di maschera, gli accadimenti politici di questi nostri giorni inquietanti. / È a tratti una satira velenosa, direttamente proporzionale alla impossibilità di vedere spiragli di luce o barlumi di redenzione nei cattivi costumi e nella pessima gestione della res publica da parte di uomini politici che agiscono solo in risposta alle richieste del proprio ego insaziabile. / Tutti i sonetti diventano fonti storiche attendibili, in un linguaggio poetico che riproduce articolazioni del romanesco dei quartieri, difficile da trovare nella parlata d'oggi. / Un patrimonio, quindi, da valorizzare e salvaguardare, in uno stile tradizionale che scaturisce, senza ornamento, alterazioni, accorgimenti sintattici esteriori o troncamenti di licenza, se non l'aggiunta di un "caudato" (di sua invenzione), che allarga il senso della poesia e le conferisce una nota comica che crea un gradevole retrogusto dolce-amaro».</li>
                  <li>22 settembre 2012 - Dall'Histonium, "Premio d'oro per Meriti Professionali e Letterari": «Esperto funzionario per anni dell'Azienda Tranviaria di Roma, appassionato ricercatore nel settore antropo-sociologico, attivo collaboratore dell'Università "La Sapienza", Presidente di Giuria del Concorso "Histonium" per la sezione del "racconto inedito", è anche fine poeta soprattutto di sonetti romaneschi, attraverso i quali affronta il tema della malvagità umana, e profondo scrittore di opere di carattere etico, sociale e politico».</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Author;
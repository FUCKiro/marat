import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollTop } from '../hooks/useScrollTop';

export interface Book {
  id: number;
  title: string;
  cover: string;
  description: string;
  pdfUrl: string;
  year: string;
}

const books: Book[] = [
  {
    id: 0,
    title: "Er Paradiso Terestre",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622741/er-paradiso_r46rw0.jpg",
    description: "Si tratta di 120 sonetti elaborati in significativa consecutio, tale da renderli una sorta di poema volto a rappresentare l'umana malvagità per come rappresentata dalla Bibbia.",
    pdfUrl: "/assets/pdfs/er-paradiso-terestre.pdf",
    year: "1985"
  },
  {
    id: 1,
    title: "Signori in carrozza",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622742/cofanetto_gioejc.jpg",
    description: "Spaccati d'epoca 'a cavallo' del Pubblico trasporto capitolino. Un lavoro più unico che raro, elaborato sulla scia di oltre 2.300 fonti originali dal Quattrocento in poi; edito in tre volumi in formato A4 per un totale di pp. 1.008, arricchiti con 600 foto d'epoca.",
    pdfUrl: "/assets/pdfs/signori-in-carrozza.pdf",
    year: "2023"
  },
  {
    id: 2,
    title: "Tranvie e Tranvieri",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622743/Tranvie_kq03xt.jpg",
    description: "Tesi di laurea dell'Autore, avente per oggetto una ricerca sperimentale riguardante i valori che all'epoca (1981) caratterizzavano i Dipendenti dell'Atac come 'Ceto Medio'.",
    pdfUrl: "/assets/pdfs/tranvie-e-tranvieri.pdf",
    year: "1981"
  },
  {
    id: 3,
    title: "Ar galoppo",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622746/Ar-Galoppo_ofggnt.jpg",
    description: "Storia del trasporto romano elaborata con 138 sonetti romaneschi. Il tutto inizia a partire dal 1565, quando Papa Pio IV diede vita alla «Compagnia Confraternita dei Cocchieri», con sede in San Tommaso a Monte Cenci.",
    pdfUrl: "/assets/pdfs/ar-galoppo.pdf",
    year: "2021"
  },
  {
    id: 4,
    title: "Sta fede in cocci",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622743/sta-fede_zmmsxx.jpg",
    description: "Una serie di sonetti romaneschi suddivisa in due parti: la prima, dedicata a tematiche religiose, la seconda a una miscellanea di argomenti che vanno dallo sportivo al politico e al sociale.",
    pdfUrl: "/assets/pdfs/sta-fede-in-cocci.pdf",
    year: "2020"
  },
  {
    id: 5,
    title: "La Protezione Civile",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622740/protezione-civile_iuzzoq.jpg",
    description: "In un volume di pp. 324 vi è riportato il frutto di oltre un decennio di Corsi di Perfezionamento in 'Protezione Civile' condotti dall'Autore presso la Cattedra di Medicina Sociale.",
    pdfUrl: "/assets/pdfs/protezione-civile.pdf",
    year: "2019"
  },
  {
    id: 6,
    title: "Strani dialoghi sui 'massimi sistemi'",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622746/Optimized-Copertina_Strani_I_Serie_grlazx.jpg",
    description: "Lavoro elaborato in soli nove giorni nel giugno/luglio del 2000, concludendolo poi alla vigilia della pubblicazione con l'Appendice. L'oggetto è la Politica, o, meglio, una pOLITICA ormai divenuta tutta una me…lma.",
    pdfUrl: "/assets/pdfs/strani-dialoghi.pdf",
    year: "2000"
  },
  {
    id: 7,
    title: "Sugar Gall – L'Orco delle (anti)Favole",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622744/sugar-gall_ktijsh.jpg",
    description: "Un Orco originariamente amabile e buono, poi trasformato dalla (cosiddetta) 'Madre Natura' in ben altro Orco… davvero orco!",
    pdfUrl: "/assets/pdfs/sugar-gall.pdf",
    year: "2015"
  },
  {
    id: 8,
    title: "Storia di un imbroglio",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/storia-di-un-umbroglio_ulcevd.jpg",
    description: "Elaborato sulla scia della gestione delle rimesse Atac 'Collatina' e 'Grottarossa', dove l'Autore affrontò vincendole (come tutto documentato) tante clientelari nefandezze.",
    pdfUrl: "/assets/pdfs/storia-di-un-imbroglio.pdf",
    year: "2010"
  },
  {
    id: 9,
    title: "È proprio 'na rEPUBBRICA!…",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622746/na-repubrrica_zvuyia.jpg",
    description: "Vi si tratta, in poesia romanesca, delle incongruenze d'una italica Costituzione definita la 'più bella del mondo' mentre… Ma lasciamo andare, va'!",
    pdfUrl: "/assets/pdfs/na-repubbrica.pdf",
    year: "2016"
  },
  {
    id: 10,
    title: "Re Giorgio",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622741/re-giorgio-optimized_jcnr6s.jpg",
    description: "Giorgio Napolitano, nato reuccio, per essere stato generato da Umberto II di Savoia con una (sperabilmente per lui) sua amabile scopata, con la Contessa di Napoli, Carolina Bobbio.",
    pdfUrl: "/assets/pdfs/re-giorgio.pdf",
    year: "2014"
  },
  {
    id: 11,
    title: "Er Bambolo… L'Erdere… Er 'Douple Face'",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622746/er-bambolo_pvadlh.jpg",
    description: "Si tratta di 76 sonetti dedicati a Matteo Renzi, qui amorevolmente divenuto 'Er Bambolo, L'Erede, Er Douple Face', come specificatamente potrà rilevarsi dal testo.",
    pdfUrl: "/assets/pdfs/er-bambolo.pdf",
    year: "2017"
  },
  {
    id: 12,
    title: "Er BOSSolo der Ca'",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622743/er-bossolo_dbdpcm.jpg",
    description: "Un'opera dedicata a Mario Bossi che, ODIANDO tutto ciò che non sia 'Padano', è a sua volta altrettanto odiato da chi vorrebbe ancora sperare – malgrado tutto!… – in una vera italica Unità.",
    pdfUrl: "/assets/pdfs/er-bossolo.pdf",
    year: "2019"
  },
  {
    id: 13,
    title: "Er Cacazibetto",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/er-cacazibetto_gzgoy7.jpg",
    description: "'Er Cacazibetto', come dire il sottoscritto, come dire una nullità proiettata nel tempo della… nullità'! Un conglomerato di versi che partendo dalla propria adolescenza, si proiettano sino alla sua vecchiaia, in analisi spesso satiriche pur ove e quando ilari e giocose.",
    pdfUrl: "/assets/pdfs/er-cacazibetto.pdf",
    year: "2018"
  },
  {
    id: 14,
    title: "Er Montagnardo",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622742/er-montagnardo_lb36in.jpg",
    description: "Sonetti dedicai al nazional MONTagnardo, maleficamente distintosi nel realizzare un sistema politco-sociale (dis)equitario. Dopo avere promesso rigore ed equità, ha infatti attuato solo il primo (dis)valore, tra l'altro paradossalmente (e disonestamente) a danno delle classi meno agiate.",
    pdfUrl: "#",
    year: "2013"
  },
  {
    id: 15,
    title: "Papa Francesco",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622742/papa-francesco_xsjyzg.jpg",
    description: "Papa Francesco, ben altro papa (ovviamente a parere del sottoscritto) rispetto a tanti e tanti altri, a cominciare dal Suo condannare certi (dis)ecclesiastici comportamenti riguardanti il vil danaro e il gentil sesso, tali da rendere fin troppo veritiero il detto 'predicar bene e razzolar male'.",
    pdfUrl: "#",
    year: "2015"
  },
  {
    id: 16,
    title: "Fede e Religione",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622739/fede-e-relegione_gsjvgh.jpg",
    description: "Una problematica, quella della Fede, che continuerà ad affliggere chi, portato alla razionalità, non potrà non rifiutare affermazioni legate ad una (comunque meravigliosa) fantasiosità.",
    pdfUrl: "#",
    year: "2016"
  },
  {
    id: 17,
    title: "L'Aforismario",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622743/aforismario_u1fywc.jpg",
    description: "Sonetti elaborati sulla scia di 168 Aforismi (103 dei quali dell'Autore), per lo più concernenti abitudini, virtù e vizi per come comunemente vissuti, meravigliosi messaggi di vita.",
    pdfUrl: "#",
    year: "2017"
  },
  {
    id: 18,
    title: "La BERLikkeide",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622741/berlikkeide_xqmtlo.jpg",
    description: "In oltre 230 sonetti romaneschi vengono osservati alcuni più significativi momenti esistenziali del 'bel' personaggio sottinteso nel titolo. Ovviamente mi scuso con chi crede ancora nelle sue 'belle' qualità cui, cui io stesso avevo creduto al suo esordio politico… al punto di dargli il…'Benvenuto', ma poi… Bah!…",
    pdfUrl: "#",
    year: "2012"
  },
  {
    id: 19,
    title: "Sberleffi da 'na lingua biforcuta",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622740/sberleffi_nhwprd.jpg",
    description: "Una serie di sonetti ispirata dall'amore per la minuta osservazione di quanto ci circonda effettuata attraverso il vernacolo della mia infanzia, frutto dunque d'una Roma che… purtroppo non c'è più!",
    pdfUrl: "#",
    year: "2014"
  },
  {
    id: 20,
    title: "Fior de cojonelle sdilinguate",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622741/fior-de-cojonelle_hg0nda.jpg",
    description: "Si tratta di elaborazioni sonettistiche spazianti su tematiche diverse, da quelle individuali (per lo più emotive) a quelle sociali, troppo spesso, purtroppo, putride e nocive.",
    pdfUrl: "#",
    year: "2011"
  },
  {
    id: 21,
    title: "'Emozioni' e 'Rabbia' nell'(anti)Favola",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622740/emozioni-e-rabbia_oykb9q.jpg",
    description: "'C'era una volta': così inizia la Favola ma… Ma qui si tratta di (anti)Favole suddivise in due cicli: da quello 'dell'emozione' al cospetto di tanti piccoli eventi della vita quotidiana, a quello 'della rabbia', volto a rappresentare l'odierno svincolo emotivo e affettivo del Popolo di Bengodi dal mondo della politica.",
    pdfUrl: "#",
    year: "2010"
  },
  {
    id: 22,
    title: "Frammenti di vita",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/frammenri_we6syu.jpg",
    description: "Quindici brani estrapolati da 'Emozioni e rabbia nell'(anti)Favola', adattati per i bambini delle ultime classi della scuola elementare, dedicati a 'Ai Bambini di età compresa fra i cinque e i novant'anni'.",
    pdfUrl: "#",
    year: "2009"
  },
  {
    id: 23,
    title: "Roma Monnezza",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622744/roma-monnezza_ch2igj.jpg",
    description: "Un lavoro che affronta la sudiceria delle strade, dovuta più a chi le insudicia che non a chi non possa pulirle a fondo; lavoro che ha avuto la fortuna d'essere portato in teatro, riscuotendo – ovviamente solo in loco – un vero grande successo.",
    pdfUrl: "#",
    year: "2008"
  },
  {
    id: 24,
    title: "Javhé e Allâh – Negli spazi siderali",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622744/javhe_nae9zx.jpg",
    description: "Una 'Dualità', quella di cui trattasi, elaborata sulla scia d'un iniziale incontro avvenuto negli ammassi stellari fra Jahvé e Allâh, come dire un duplice appellativo per indicarne l'unica Entità.",
    pdfUrl: "#",
    year: "2007"
  },
  {
    id: 25,
    title: "Uno per tutti!…",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/uno-per-tutti_dp45y3.jpg",
    description: "È l'ultimo libro della Collana, sintesi dei 16 che lo precedono, di tutti comprendendo le Premesse e le considerazioni introduttive, gli Epiteti 'amorevolmente' donati ai più lerci politicastri nazionali, nonché il Glossario.",
    pdfUrl: "#",
    year: "2022"
  },
  {
    id: 26,
    title: "Storia dell'ATAC",
    cover: "https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622746/Storia-Atac_zd4ebe.jpg",
    description: "Storia dell'Atac, tratta da «Signori in carrozza», fatta ovvia esclusione dei Capitoli «Il biondo Fiume», «Diligenze e landò» e «Il Mostro di Ferro», coi quali l'Azienda capitolina ha mai avuto a che fare.",
    pdfUrl: "#",
    year: "2020"
  }
];

const Works = () => {
  const scrollToTop = useScrollTop();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-[#8B4513] text-center mb-12 animate-fade-in">Le Opere</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="bg-white rounded-lg shadow-xl overflow-hidden hover-scale animate-fade-in group"
            style={{ animationDelay: `${book.id * 100}ms` }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-contain bg-[#FDF5E6] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#8B4513] mb-2 line-clamp-2 min-h-[3.5rem]">{book.title}</h2>
              <p className="text-sm text-[#DEB887] mb-4">{book.year}</p>
              <p className="text-[#5C4033] mb-6 line-clamp-4">{book.description}</p>
              
              <Link
                to={`/opere/${book.id}`}
                className="inline-flex items-center px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#654321] transition-all duration-700 hover:shadow-lg transform hover:-translate-y-1 text-lg"
                onClick={scrollToTop}
              >
                <span>Leggi di più</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works

export { books }
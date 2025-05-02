import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ParadisoTerestre = () => {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#8B4513] mb-6">Da un "Paradiso" forse tutt'altro che "paradisiaco" a…</h2>
      <div className="space-y-8">
        <p className="text-[#5C4033] mb-8 text-lg leading-relaxed animate-slide-in">
          Si tratta di 120 sonetti elaborati in una consecutio, che li rende una sorta di poema volto a rappresentare l'umana malvagità per come è rappresentata dalla Bibbia.
        </p>
        
        <a
          href="https://www.amazon.it/Er-Paradiso-Terestre-Luigi-Boccilli/dp/B0CQPLJS7P/ref=tmm_pap_swatch_0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#FF8C00] transition-all duration-700 hover:shadow-lg transform hover:-translate-y-1 mb-8"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Acquista su Amazon
        </a>
        
        <p>Il tutto è introdotto con il seguente sonetto…</p>
        
        <div className="bg-[#FDF5E6] p-8 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-serif text-[#8B4513] mb-4">DIO T'ARINGRAZIO</h3>
          <div className="italic text-[#5C4033] font-serif">
            <div className="flex flex-col space-y-8">
              <div className="space-y-1">
                <p className="ml-8">«Dio t'aringrazio, piacio e ciò successo</p>
                <p className="ml-8">puro, si questo è certo, nun sò un asso,</p>
                <p className="ml-8">piacio e piacenno faccio un ber fracasso</p>
                <p className="ml-8">senza cercà nemnanco un compromesso.</p>
              </div>
              
              <div className="space-y-1">
                <p className="ml-8">"Tranvie e Tranvieri" e… via "Ar galoppo", appresso</p>
                <p className="ml-8">"Sta fede in cocci": è tutto 'no sconquasso</p>
                <p className="ml-8">co cui la quale soffro e me rilasso,</p>
                <p className="ml-8">co cui la quale mai fo er sottomesso.</p>
              </div>
              
              <div className="space-y-1">
                <p className="ml-8">Posso esse incondiviso e er più discusso,</p>
                <p className="ml-8">sentimme sollevato o drento a un fosso,</p>
                <p className="ml-8">te dico Grazie, Dio, che ciò sto lusso</p>
              </div>
              
              <div className="space-y-1">
                <p className="ml-8">Ch'è quello de sfogamme a più nun posso:</p>
                <p className="ml-8">sfogamme puro poi, si pe rifrusso,</p>
                <p className="ml-8">me rosico ner còre e dentro a l'osso».</p>
              </div>
            </div>
          </div>
          <p className="text-right mt-4 text-[#8B4513]">Roma, 17 dicembre 1985</p>
        </div>
        
        <div className="mt-12">
          <p className="mb-6">
            I titoli dei 120 sonetti, elaborati in sestine endecasillabiche con rime assonanti in ABBACC tipo 
            (qui solo per esemplificare "onna-enna-anna"; "ari-uri-eri"; "alo-elo-olo"), hanno quindi anch'essi 
            dato corpo a un "Indice" di senso compiuto, come può rilevarsi da quel che segue:
          </p>
          
          <div className="space-y-4 bg-[#FDF5E6] p-6 rounded-lg">
            {Array.from({ length: 20 }, (_, i) => i * 6).map((startIndex) => {
              const currentGroupIndex = startIndex / 6;
              return (
                <div key={startIndex} className="mb-8">
                  <ol start={startIndex + 1} className="list-decimal list-inside space-y-2 text-[#5C4033]">
                    {[
                      ["Er vòto più assoluto Lo circonna", "Pensa e ripensa a tutta la faccenna", "Quinni se fa un progetto da leggenna", "E crea l'ACEA pe tanta… baraonna", "Se monta un firmamento che Lo osanna", "Separa l'acque e fa la prima ghianna!"],
                      ["Poi fionna in celo stelle e luminari!", "Fa ucelli alati e pesci chiaroscuri", "E pe urtimo, fra un un sacco de scongiuri,", "Fa Adamo, e' re de tutti li cazzari", "Ma nu' J'abbasta avé tanti pensieri", "Pensanno a lei Se inventa guai più seri"],
                      ["«Ma si la fo è pe faje… un be' rigalo».", "«Sì‑sì… che poi a la fine è un gran sfacelo».", "Tant'è ch'er Padr'Adamo, a bruciapelo", "Sentennose un socché lì ar… battipalo", "Incomincia cor facce er miccarolo", "Senza perantro fallo lui da solo."],
                      ["Ce prova poi cor dì: «Bella paciocca!…»", "Ma e' risurtato è quello… e lei se cricca", "Dio guarda e vede, pensa e se lambicca", "Je provibisce er melo, pòra cocca!…", "Ce casca, se lo magna e, porca vacca!…", "Je tocca annà frammezzo a la bujacca."],
                      ["Ce proveno cor dije: «Opri un'inchiesta»", "Che possi alleggerije la batosta!…", "Ma n' c'è niente da fà!… «Quanto Te costa", "«Signò, campà co gente come a questa.", "«Però si mo je dài sta bella susta", "«Lo so, già pensi a un fatto che li aggusta»."],
                      ["E vanno scarzi e gnudi pe la Tera", "Strippannose pe coje la natura", "Limannose 'gnitanto a l'ogna… dura.", "Poi Dio vò doni e propio in sta magnera", "Capisce chi L'imbroja e Lo raggira", "Chi invece dà cor còre e quello ammira!"],
                      ["Caino n' ce vò stà e scanna er fratello", "Va p'er monno e ce semmina er bacillo", "De la marvagità. Co lo specillo", "Diopadre l'analizza sur più bello", "Manna er diluvio e sarva a rompicollo", "Er solo ch'è rimasto a fà… da pollo."],
                      ["Quanta ne butta giù da le bocchette", "Der celo!… Quanta da le cataratte!…", "E l'Arca attracca ar porto d'Araratte", "Er monte fra li monti e fra le vette.", "Riscegneno e Noè fra le ricotte", "Inventa er vino e poi… je fa da botte."],
                      ["Però… manco er diluvio!… E quela mole", "Che vònno fà innarzannola a Babele", "Ce mostra l'omo pronto a fà 'na stele", "A l'Io che Dio je mischia le parole", "Cusì la gente blatera scurile", "Meno s'intenne e più diventa ostile."],
                      ["Giacobbe, er fio d'Isacco er fìo d'Abramo", "Giacobbe, er dritto, frega e fa er brasfemo", "Pe questo è mejo l'antro, quello… scemo", "Poi c'è Giusepp'ebreo e si nun zaramo", "Dina e Sichemme, un… vero gentilomo!", "Inzomma indove sta sto superomo?…"],
                      ["Basta pensà a li froci de Ghimora!…", "Ma tanto l'omo è… quello e nun impara.", "«Signò, Tu lo perdoni e lui… rizzara", "«Je fai da Dio e da Padre e lui… T'accora.", "«Je dài er Zagaja che su la frontiera", "«D'Egitto taja er mare e la scojera"],
                      ["«E lui, 'gnisempre tristo e più spergiuro", "«Te pianta pe 'na vacca tutta d'oro!…».", "'Na vacca che, squajata immezzo ar còro", "Mosè je fa scolà facenno er duro", "mostrannose ACCUSì 'n gran vampiro", "Finché zagaja l'urtimo respiro."],
                      ["A Gerico Yahweh fa er trombettiere", "Er che nun è der tutto regolare", "Poi sur Giordano j'opre puro er mare", "Ma co li Filiste… je fa er cristiere", "Finché je manna Jack lo squartatore", "Er danne pe eccellenza e scopatore"],
                      ["Che, manco a dillo, poi pe fà er fregnone", "Se fa fregà!… Ma è propio fra ste scene", "Che nasce quer che a tutti più conviene", "L'idea de fà 'no Stato e 'na Nazione.", "Pe falla un pastorello pìa una fune", "Gioca a serciate e canta fra le dune."],
                      ["Morto Saulle, l'unto der Signore", "È Davide che lì da bervedere", "Se frega Betzabea, poi vò er bracere", "Che manco quello!… Doppo, er più mijore", "È er granne Salamone: granne, eppure…", "Adora dìi der cacchio e fregature!"],
                      ["Yahweh – e me pare giusto!… – s'arinfregna", "Mannannoli in esilio a Babilogna", "Quanno Lionferne poi fa la carogna", "Giuditta se sprofuma la… consegna", "E insieme co un'ancella va a pedagna", "Da quello che mo è e' re de Gran Bretagna."],
                      ["Je taja la capoccia E a brija sciorta", "Torna a Betulia e er popolo s'esarta.", "Ester va sposa a Serze e lo coarta", "Facennoce capì \"Chi\" fa da scorta", "Quer Dio che pija e dà, che te sconcerta", "Ma er tutto pe fà un'anima più operta."],
                      ["«Perdoname, Signò, si fo er cazzaccio", "«Ma bè la sai la storia de st'impiccio", "«Quella che immezzo a tutto sto pasticcio", "«Solo l'ebrei nun vanno mai a casaccio", "«Pe via che cianno er Libro p'igni approccio", "«Bono pe chi sa legge e n' fa er bamboccio!»."],
                      ["Basta pijacce Sara co Tobia", "E Giobbe 'na pazienza tutt'ebrea", "Quinni da li Proverbi quarch'idea", "Che t'aricchisce tutto in povesia", "Roba der Padreterno, roba Sua", "Che dunque nun pò fà, nun pò la bua."],
                      ["Se tratta de fà tue quele sorgenti", "Bevenno l'acqua pura de le fonti", "Bona però sortanto si ce conti", "Sicuro che a la fine n' te ne penti.", "Potrai però innarzatte su l'istinti", "Solo co intendimenti che n' sò finti."]
                    ][currentGroupIndex].map((line, lineIndex) => (
                      <li key={lineIndex} className="ml-8">{line}</li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ParadisoTerestre;
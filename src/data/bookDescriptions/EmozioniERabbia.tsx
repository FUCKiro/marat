import React from 'react';

const EmozioniERabbia = () => {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#8B4513] mb-6">"C'era una volta": così inizia la Favola ma...</h2>
      <div className="space-y-8">
        <div className="bg-[#FDF5E6] p-8 rounded-lg shadow-md mb-12">
          <h3 className="text-xl font-serif text-[#8B4513] mb-6">Dedica</h3>
          <div className="text-center italic text-[#5C4033]">
            <p>A Te…</p>
            <p>A Te, chiunque Tu sia…</p>
            <p>A Te che ti accingi a leggere</p>
            <p>sperabilmente con amore e passione</p>
            <p>le presenti (anti)Favole…</p>
            <p>perché anche Tu – come già l'autore –</p>
            <p>abbia a riflettere</p>
            <p>sulle tante contraddizioni dell'animo umano</p>
            <p>e farne tesoro.</p>
          </div>
        </div>

        <p className="text-[#5C4033]">
          La serie di dette (anti)Favole è suddivisa in due cicli:
        </p>

        <ul className="list-none space-y-4 text-[#5C4033]">
          <li className="flex items-start">
            <span className="text-[#8B4513] font-serif mr-2">•</span>
            <span className="italic font-serif">"Dell'emozione"</span>
            <span className="ml-2">ove vengono affrontati piccoli eventi della vita quotidiana.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#8B4513] font-serif mr-2">•</span>
            <span className="italic font-serif">"Della rabbia"</span>
            <span className="ml-2">volto a rappresentare l'odierno svincolo emotivo e affettivo del Popolo di Bengodi dal mondo della politica.</span>
          </li>
        </ul>

        <p className="text-[#5C4033]">
          Per una più significativa e rapida presa di cognizione degli argomenti trattati, possiamo qui rifarci ai titoli di quanto insito nei relativi cicli:
        </p>

        <div className="space-y-8 mt-8">
          <div className="bg-[#FDF5E6] p-8 rounded-lg">
            <h4 className="text-xl font-serif text-[#8B4513] mb-4">"Dell'emozione"</h4>
            <p className="text-[#5C4033] mb-6">
              Nel quale vengono trattati piccoli fatti quotidiani, tipo «A tutta birra incontro alla morte», con il valente pilota destinato a schiantarsi contro una quercia secolare; «Il Bottegaio… sbottegato», desolatamente diretto verso il fallimento della propria attività svolta senza la dovuta preparazione e/o attitudine; «Il libero amore» con quanto consegue, ove gli stessi mirabili istinti… bestiali non siano mirati al bene primario dell'unione e comunione familiare; e così via, in linea coi seguenti ulteriori titoli:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#5C4033] italic">
              <div className="space-y-2">
                <p>Il valente Pilota</p>
                <p>L'Enciclopedico… ignorante</p>
                <p>Morir di noia</p>
                <p>Il Re degli Amici</p>
                <p>Relatività del tempo</p>
                <p>Vecchia brutta strega</p>
                <p>Il Prodigo… intemperante</p>
                <p>L'Energumeno… smidollato</p>
              </div>
              <div className="space-y-2">
                <p>Il Libero Arbitrio</p>
                <p>A suon di ramazza!…</p>
                <p>La giustizia del ca'!…</p>
                <p>L'Ira del Giusto</p>
                <p>… Fino a prova contraria</p>
                <p>La dolce… Signora</p>
                <p>Sporco Bianco!…</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FDF5E6] p-8 rounded-lg">
            <h4 className="text-xl font-serif text-[#8B4513] mb-4">"Della rabbia"</h4>
            <p className="text-[#5C4033] mb-6">
              I cui protagonisti sono i Butteri o Bufali (i politici) della bella Bengodi. Il tutto trova riscontro nei seguenti titoli:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#5C4033] italic">
              <div className="space-y-2">
                <p>L'Ideologizzato</p>
                <p>Bengodi fai schifo!…</p>
                <p>Dal Papa-re a…</p>
                <p>Bagatellae Res</p>
                <p>Le Mestizie d'un Popolo</p>
                <p>La Rivoluzione dei polli</p>
                <p>Dai Martiri dell'Idea…</p>
                <p>… Alla Favola dell'Alternanza</p>
              </div>
              <div className="space-y-2">
                <p>… Alla Repubblica delle Banane!</p>
                <p>Da Mercante a Cow Boy…</p>
                <p>Da Cow Boy a Leader Maximo…</p>
                <p>Da Leader Maximo a Buttero disarcionato</p>
                <p>Il Buttero torna in sella</p>
                <p>Salute… Sanità!</p>
                <p>La Colt a Stelle e Strisce</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center my-8">* * *</div>

        <p className="text-[#5C4033]">
          Nel loro insieme, si tratta dunque d'una serie di (anti)Favole che, stimolando il sorriso, tendono a sollecitare il Lettore a riflettere – come forse "qualcuno" già farà su tante umane – butteriche e non – pusillanimità.
        </p>
      </div>
    </>
  );
};

export default EmozioniERabbia;
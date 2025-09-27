import React from 'react';

const SignoriInCarrozza = () => {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#8B4513] mb-6">Spaccati d'epoca "a cavallo" del pubblico trasporto capitolino</h2>
      <div className="space-y-8">
        <p>
          Elaborato sulla scia di oltre 2.300 fonti, frutto d'un venticinquennio di ricerche effettuate su testi e documenti originali dal Quattrocento, fu edito nel 2013 (il Terzo Libro ristampato nel 2015) in formato A4, per un totale di pp. 1.008, con 600 foto d'epoca molte delle quali mai pubblicate prima.
        </p>
        
        <p>
          Diversamente da quanto il titolo lascerebbe intendere non si tratta della storia del trasporto (la quale v'è comunque inclusa), ma di eventi di particolare significato tratti dai solchi di ruote (in legno, ferro e gomma) lasciati impressi sulle vie di Roma, mentre il sottotitolo "Spaccati d'epoca" vuole intenderne lo spirito dei tempi andati.
        </p>
        
        <p>
          Proprio per le sopra indicate atipicità, nonché per una narrazione auspicabilmente semplice e chiara, l'autore spera di coinvolgere l'attenzione del Lettore e di riscuoterne un piccolo plauso.
        </p>
        
        <p>
          Oltre alla citata "Casanatense", ne è in possesso l'Università di Cambridge di Londra (che nel 2014 lo accolse fra le proprie pubblicazioni pur dichiarando di rifiutarle per lo più), oltre – per legge – le Biblioteche "Centrali" di Roma e di Firenze.
        </p>
        
        <div className="mt-12">
          <h2 className="text-2xl font-serif text-[#8B4513] mb-6">I tre volumi dell'opera</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative aspect-[3/4] bg-[#FDF5E6] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-700">
              <img
                src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/Optimized-Libro_I_wrfsmt.jpg"
                alt="Volume I"
                className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[3/4] bg-[#FDF5E6] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-700">
              <img
                src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622743/Optimized-Libro_II_pumy4k.jpg"
                alt="Volume II"
                className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[3/4] bg-[#FDF5E6] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-700">
              <img
                src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744622745/Optimized-Libro_III_sk090h.jpg"
                alt="Volume III"
                className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignoriInCarrozza;
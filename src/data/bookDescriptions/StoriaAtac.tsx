import React from 'react';

const StoriaAtac = () => {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#8B4513] mb-6">Una piccola Storia d'Italia attraverso l'ATAC</h2>
      <div className="space-y-8">
        <p className="text-center italic text-[#8B4513] mb-8">
          Inedito
        </p>
        
        <p className="text-[#5C4033]">
          Storia dell'Atac, tratta da «Signori in carrozza», fatta ovvia esclusione dei Capitoli «Il biondo Fiume», «Diligenze e landò» e «Il Mostro di Ferro», coi quali l'Azienda capitolina ha mai avuto a che fare.
        </p>
        
        <p className="text-[#5C4033]">
          Le basi di partenza risalgono comunque al 1845 (dunque 65 anni prima della sua costituzione), quando il primo Omnibus a cavalli aveva collegato Piazza Venezia con la Basilica di San Paolo fuori le Mura, per proseguire poi con le piccole Imprese di trasporto fagocitate dalla "Società Romana Tramways Omnibus", sorta di progenitrice privata dell'Azienda Municipalizzata.
        </p>
        
        <div className="bg-[#FDF5E6] p-8 rounded-lg shadow-md my-12">
          <h3 className="text-xl font-serif text-[#8B4513] mb-6">Evoluzione del nome</h3>
          <ul className="list-none space-y-4 text-[#5C4033]">
            <li className="flex items-start">
              <span className="text-[#8B4513] font-serif mr-2">•</span>
              <span>1910: costituita come "A.A.T.M." (Azienda Autonoma Tranvie Municipali)</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B4513] font-serif mr-2">•</span>
              <span>Poco dopo divenne "A.T.M."</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B4513] font-serif mr-2">•</span>
              <span>Durante il fascismo: "A.T.A.G" (Azienda Tranvie e Autobus del Governatorato)</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B4513] font-serif mr-2">•</span>
              <span>1944: "A.T.A.C." (Azienda Tranvie e Autobus del Comune)</span>
            </li>
          </ul>
        </div>
        
        <p className="text-[#5C4033]">
          Ove dovesse venir edita, darebbe luogo ad un volume di pp. 660, composto di 1.582 fonti, 709 voci d'indice e 398 foto, molte delle quali mai pubblicate.
        </p>
      </div>
    </>
  );
};

export default StoriaAtac;
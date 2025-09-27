import React from 'react';

const ProtezioneCivile = () => {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#8B4513] mb-6">Situazione di rischio, calamità, grande emergenza</h2>
      <div className="space-y-8">
        <p className="text-center italic text-[#8B4513] mb-8">
          Edito nel 1995 dall'Università "La Sapienza" coi tipi della "Libreria Biomedica Internazionale" di Roma
        </p>
        
        <p>
          In un volume di pp. 324 vi è riportato il frutto di oltre un decennio di Corsi di Perfezionamento in Protezione Civile condotti dall'Autore presso la Cattedra di Medicina Sociale.
        </p>
        
        <p>
          Vi è riportato l'organigramma della Protezione Civile istituita nel 1982 da Giuseppe Zamberletti, riconosciuto come il padre fondatore della moderna "Protezione Civile" italiana.
        </p>
        
        <p>
          Vi sono inoltre analizzate le problematiche riguardanti le calamità naturali: rischi sismici, vulcanici, industriali, nucleari, ecologici, chimici, biologici, idrogeologici e così via.
        </p>
        
        <div className="bg-[#FDF5E6] p-6 rounded-lg my-8">
          <p className="text-[#8B4513] mb-4">Il tutto, allo scopo di raggiungere l'obiettivo della prevenzione:</p>
          <ul className="list-disc pl-6 text-[#5C4033] space-y-2">
            <li>primaria: tale ove e quando l'evento accada;</li>
            <li>secondaria: nel corso dell'evento;</li>
            <li>terziaria: nell'immediato, medio e lungo termine dall'inizio dell'accadimento.</li>
          </ul>
        </div>
        
        <p>
          Corsi che, dopo tanti anni, continuano a lasciare impresso nel cuore dell'Autore, oltre al piacere per averli condotti, anche quello del caro ricordo del Direttore di Cattedra, Prof. Walter Nicoletti, e del caro Amico dr. Vincenzo Gemelli, purtroppo ambedue venuti a mancare.
        </p>
        
        <p>
          Certo, è bello conservare tali ricordi nel cuore ma…
        </p>
        
        <p className="text-[#8B4513] text-lg italic text-center mt-8">
          Ma quanto grande è la sofferenza nel ricordare chi ormai non c'è più!
        </p>
      </div>
    </>
  );
};

export default ProtezioneCivile;
import React from 'react';
import { Book, Mail } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="bg-white rounded-lg shadow-xl p-8 prose prose-lg mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="md:w-1/3">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1744636047/gino_v29tdo.jpg"
                  alt="Luigi Boccilli"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="flex items-center gap-4 mb-6">
                <Book className="h-12 w-12 text-[#8B4513]" />
                <h1 className="text-4xl font-serif text-[#8B4513]">
                  Benvenuti nel Mondo di Luigi Boccilli
                </h1>
              </div>
              
              <div className="text-[#5C4033] space-y-6 leading-relaxed">
                <p className="italic text-lg">
                  "Tranviere di professione, Sociologo per vocazione, Poeta per amore"
                </p>
                <p>
                  Il presente sito mira a diffondere quanto via via pubblicato da Luigi Boccilli a partire dagli anni 1980, periodo in cui, da giornali nazionali – tra i quali "Il Messaggero", "Il Tempo", "Il Corriere della Sera" e così via – ebbe il piacere di ricevere gratificanti tributi letterari.
                </p>
              </div>
            </div>
          </div>
        
          <div className="text-[#5C4033] space-y-6 leading-relaxed">
            <p className="text-lg">
              Tra le opere più significative troviamo "Tranvie e Tranvieri – Evoluzione e Valori" (sua tesi di laurea), "Ar galoppo", "Sta fede in cocci" e "Er Paradiso terestre" (quest'ultimo da lui stesso ritenuto quanto di meglio sia riuscito a elaborare in poesia romanesca).
            </p>
            
            <p>
              Tra 'altro fu di sicuro la beatifica attribuzione di "Tranviere di professione, Sociologo per vocazione, Poeta per amore" conferitagli dal "Messaggero" e da "Il Tempo", a consentirgli di diffondere migliaia delle citate opere fra i Cittadini romani. Dopo di allora, però…
            </p>
            
            <p>
              Dopo di allora, tutto si è ristretto nel suo piccolo ambito, visto che stampa e Tv hanno scelto di promozionare non solo (come giusto) veri capolavori, ma anche quanto pubblicato… solo da "Figli di Papà".
            </p>
            
            <p>
              D'altronde questa è la vita, per cui… " prendere o lasciare", come suol dirsi.
            </p>
            
            <p>
              Chi lo desidera, può quindi scaricare gratuitamente tutte le opere dell'Autore qui riportate, con l'auspicio (dunque non l'obbligo!…) di comunicarlo alla mail:
            </p>
            
            <div className="flex items-center justify-center space-x-2 py-4">
              <Mail className="h-5 w-5 text-[#8B4513]" />
              <span className="text-[#8B4513] font-medium">lboccilli@gmail.com</span>
            </div>
            
            <p>
              facendola poi auspicabilmente seguire da due parole di critica, positiva o negativa ch'essa abbia ad essere.
            </p>
            
            <div className="text-center mt-8 pt-6 border-t border-[#DEB887]">
              <p className="text-[#8B4513] font-serif">
                Grazie e Buona lettura!
              </p>
              <p className="text-[#8B4513] font-serif text-lg mt-2">
                Luigi Boccilli
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#8B4513] text-[#FDF5E6] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-2">
          <p className="text-sm">Dati riservati e non riproducibili</p>
          <p className="text-sm">
            Ideato e Sviluppato da{' '}
            <a 
              href="https://www.fabiolarocca.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-[#DEB887] transition-colors duration-700"
            >
              Fabio La Rocca
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
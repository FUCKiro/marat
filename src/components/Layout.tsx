import React from 'react';
import { navigation } from '../data/navigation';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-600 text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8" />
              <span className="text-xl font-semibold">Maratonda</span>
            </a>
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-teal-200 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          {/* Mobile Menu */}
          <div
            className={`${
              isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            } md:hidden transition-all duration-300 ease-in-out overflow-hidden`}
          >
            <div className="py-4 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block hover:text-teal-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >{item.title}</a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-teal-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Maratonda</h3>
              <p className="text-teal-200">
                Supportiamo il benessere delle persone neurodiverse attraverso un approccio integrato e personalizzato.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contatti</h3>
              <p className="text-teal-200">Email: info@maratonda.it</p>
              <p className="text-teal-200">Tel: +39 123 456 7890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Orari</h3>
              <p className="text-teal-200">Lun - Ven: 9:00 - 18:00</p>
              <p className="text-teal-200">Sab: 9:00 - 13:00</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-700 text-center text-teal-200">
            <p>&copy; {new Date().getFullYear()} Maratonda. Tutti i diritti riservati.</p>
            <p className="mt-2">
              Sviluppato da{' '}
              <a 
                href="https://fabiolarocca.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-teal-100 transition-colors"
              >
                Fabio La Rocca
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
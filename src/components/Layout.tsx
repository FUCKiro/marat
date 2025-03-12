import React from 'react';
import { navigation } from '../data/navigation';
import { Heart, Menu, X, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CookieConsent from './CookieConsent';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-600 text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img 
                src="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png"
                alt="Maratonda Logo"
                className="w-12 h-12 rounded-full"
              />
              <span className="text-xl font-bold">Maratonda</span>
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
              {currentUser ? (
                <a
                  href="/dashboard"
                  className="hover:text-teal-200 transition-colors"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/login"
                  className="hover:text-teal-200 transition-colors"
                >
                  Accedi
                </a>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Maratonda</h3>
              <p className="text-teal-200">
                Supportiamo il benessere delle persone neurodiverse attraverso un approccio integrato e personalizzato.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contatti</h3>
              <p className="text-teal-200">Email: associazionemaratonda@gmail.com</p>
              <p className="text-teal-200">Tel: +39 351 479 0620</p>
              <div className="mt-2">
                <p className="text-teal-200 font-semibold">Sede:</p>
                <p className="text-teal-200">Largo Bacone, 16</p>
                <p className="text-teal-200">00137 Roma</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Partner Istituzionali</h3>
              <p className="text-teal-200 italic">Coming Soon</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Orari</h3>
              <p className="text-teal-200">Lun - Ven: 9:00 - 18:00</p>
              <p className="text-teal-200">Sab: 9:00 - 13:00</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-700 flex flex-col md:flex-row justify-between items-center text-teal-200">
            <p>&copy; {new Date().getFullYear()} Maratonda. Tutti i diritti riservati.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="mx-4">|</span>
              <span>Progetto grafico di </span>
              <a 
                href="https://fabiolarocca.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-teal-100 transition-colors"
              >
                Fabio La Rocca
              </a>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
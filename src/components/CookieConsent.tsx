import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-700">
                  Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. 
                  Continuando a navigare, accetti la nostra{' '}
                  <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={acceptCookies}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Accetta
                </button>
                <button
                  onClick={acceptCookies}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Chiudi"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
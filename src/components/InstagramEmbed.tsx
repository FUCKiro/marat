import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = 'https://www.instagram.com/embed.js';

function loadScript(onReady: () => void) {
  if (window.instgrm) {
    onReady();
    return;
  }
  let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }
  script.addEventListener('load', onReady, { once: true });
}

export default function InstagramEmbed({ url }: { url: string }) {
  const [consent, setConsent] = useState(() => Cookies.get('cookie-consent') === 'accepted');

  useEffect(() => {
    if (!consent) return;
    loadScript(() => window.instgrm?.Embeds.process());
  }, [consent, url]);

  const accept = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setConsent(true);
  };

  if (!consent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-4">
        <p className="text-gray-600">
          Per visualizzare questo post è necessario accettare i cookie di Instagram.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={accept}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Accetta e mostra
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-700 underline px-5 py-2"
          >
            Apri su Instagram
          </a>
        </div>
      </div>
    );
  }

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: '#fff', border: 0, borderRadius: 8, margin: '0 auto', maxWidth: 540, minWidth: 280, width: '100%' }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        Visualizza il post su Instagram
      </a>
    </blockquote>
  );
}

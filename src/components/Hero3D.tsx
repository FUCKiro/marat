import { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: React.CSSProperties;
        loading?: string;
        'events-target'?: string;
      };
    }
  }
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Add CSS to hide Spline watermark and improve appearance
    const style = document.createElement('style');
    style.textContent = `
      spline-viewer {
        position: relative;
      }
      spline-viewer::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 120px;
        height: 30px;
        background: linear-gradient(to right, transparent, #0d9488);
        z-index: 10;
        pointer-events: none;
      }
      /* Hide the Spline watermark more directly */
      spline-viewer iframe {
        position: relative;
      }
      spline-viewer [style*="position: absolute"][style*="bottom"][style*="right"] {
        display: none !important;
      }
      /* Ensure smooth loading */
      spline-viewer canvas {
        transition: opacity 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    // Load Spline viewer script
    const loadSplineViewer = async () => {
      if (!document.querySelector('script[src*="spline-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.18/build/spline-viewer.js';
        
        return new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    loadSplineViewer().then(() => {
      // Wait a bit for the component to be defined
      setTimeout(() => {
        if (viewerRef.current) {
          // Force a reload of the scene
          viewerRef.current.load();
        }
      }, 100);
    }).catch(console.error);

    // Cleanup function
    return () => {
      // Remove the style element when component unmounts
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(el => {
        if (el.textContent?.includes('spline-viewer')) {
          el.remove();
        }
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <div ref={containerRef} className="w-full h-full">
        <spline-viewer 
          ref={viewerRef}
          url="https://prod.spline.design/puZuGi5La-6FHfvr/scene.splinecode"
          loading="eager"
          events-target="global"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
}
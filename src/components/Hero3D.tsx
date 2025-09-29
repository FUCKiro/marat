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

  useEffect(() => {
    // Load Spline viewer script
    const loadSplineViewer = async () => {
      if (!document.querySelector('script[src*="spline-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.19/build/spline-viewer.js';
        
        return new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    loadSplineViewer().then(() => {
      // Spline viewer will automatically load the scene when the url prop is set
    }).catch(console.error);

    // Prevent scroll on mobile when interacting with the 3D scene
    const container = containerRef.current;
    if (container) {
      const preventScroll = (e: TouchEvent) => {
        e.preventDefault();
      };

      const preventScrollStart = (e: TouchEvent) => {
        e.preventDefault();
      };

      // Add touch event listeners to prevent scrolling
      container.addEventListener('touchstart', preventScrollStart, { passive: false });
      container.addEventListener('touchmove', preventScroll, { passive: false });
      container.addEventListener('touchend', preventScroll, { passive: false });

      return () => {
        container.removeEventListener('touchstart', preventScrollStart);
        container.removeEventListener('touchmove', preventScroll);
        container.removeEventListener('touchend', preventScroll);
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <div 
        ref={containerRef} 
        className="w-full h-full touch-none bg-gradient-to-br from-teal-600 to-teal-800"
        style={{ touchAction: 'none' }}
      >
        <spline-viewer 
          url="https://prod.spline.design/Ln0o0JyxBOoJyN1G/scene.splinecode"
          loading="eager"
          events-target="global"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}
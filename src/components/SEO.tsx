import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://associazione-maratonda.it';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = 'Associazione Maratonda - Studio di Psicologia a Roma',
  description = 'Maratonda è uno studio di psicologia a Roma specializzato in autismo e neurodiversità. Offriamo valutazione, interventi ABA, psicoterapia e percorsi su misura per bambini, adolescenti e adulti.',
  image = `${BASE_URL}/og-image.jpg`,
  url,
  type = 'website'
}: Props) {
  const location = useLocation();
  const canonicalUrl = url ?? `${BASE_URL}${location.pathname}`;
  const siteTitle = title.includes('Maratonda') ? title : `${title} | Maratonda`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Maratonda" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

  {/* Google Search Console verification */}
  <meta name="google-site-verification" content="RWFKrU1Jn6q7rCkirNv5j0KWtSQcmq5ywoTZOXq7-yg" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0D9488" />
      <meta name="keywords" content="studio psicologi Roma, psicologo autismo Roma, psicologi Roma, terapia autismo Roma, ABA Roma, neurodiversità, psicoterapia, neuropsicomotricità, logopedia, Maratonda" />
      <meta name="author" content="Maratonda" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="it" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png" />
      <link rel="apple-touch-icon" type="image/png" href="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png" />

      {/* Structured Data (LocalBusiness) to help Google index as local psychologist studio */}
      <script type="application/ld+json">{`{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Maratonda",
        "image": "${image}",
        "@id": "${BASE_URL}",
        "url": "${BASE_URL}",
        "telephone": "+39 351 479 0620",
        "email": "associazionemaratonda@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Largo Bacone, 16",
          "addressLocality": "Roma",
          "postalCode": "00137",
          "addressCountry": "IT"
        },
        "description": "${description}",
        "openingHours": ["Mo-Fr 09:00-18:00","Sa 09:00-13:00"],
        "areaServed": {"@type": "City","name": "Roma"},
        "service": [
          {"@type": "Service", "name": "Valutazione e trattamento dell'autismo"},
          {"@type": "Service", "name": "Interventi ABA"},
          {"@type": "Service", "name": "Psicoterapia individuale e familiare"},
          {"@type": "Service", "name": "Neuropsicomotricità e logopedia"}
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+39 351 479 0620",
            "contactType": "customer service",
            "email": "associazionemaratonda@gmail.com",
            "areaServed": "IT",
            "availableLanguage": ["it"]
          }
        ],
        "sameAs": [
          "https://www.instagram.com/associazionemaratonda/?hl=it",
          "https://www.facebook.com/AssociazioneMaratonda/?locale=it_IT"
        ]
      }`}</script>
    </Helmet>
  );
}
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = 'Maratonda - Valorizziamo la Neurodiversità',
  description = 'Maratonda offre servizi specialistici per persone neurodiverse, con un approccio integrato che include ABA, psicoterapia, neuropsicomotricità e logopedia. Un ambiente accogliente per bambini, adolescenti e adulti.',
  image = 'https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png',
  url = 'https://maratonda.it',
  type = 'website'
}: Props) {
  const siteTitle = title.includes('Maratonda') ? title : `${title} | Maratonda`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Maratonda" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0D9488" />
      <meta name="keywords" content="neurodiversità, ABA, psicoterapia, neuropsicomotricità, logopedia, Roma, terapia, sviluppo, inclusione" />
      <meta name="author" content="Maratonda" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="it" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png" />
      <link rel="apple-touch-icon" type="image/png" href="https://res.cloudinary.com/dlc5g3cjb/image/upload/v1733848053/Maratonda_logo_tz9x92.png" />
    </Helmet>
  );
}
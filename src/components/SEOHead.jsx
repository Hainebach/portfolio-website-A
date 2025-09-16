import Head from 'next/head';

export default function SEOHead({ metadata }) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
      {metadata.author && <meta name="author" content={metadata.author} />}
      
      {/* Favicon */}
      <link rel="icon" href={metadata.favicon} />
      
      {/* No Index */}
      {metadata.noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:type" content={metadata.openGraph.type} />
      {metadata.openGraph.image && <meta property="og:image" content={metadata.openGraph.image} />}
      {metadata.openGraph.url && <meta property="og:url" content={metadata.openGraph.url} />}
      <meta property="og:site_name" content={metadata.openGraph.siteName} />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      {metadata.twitter.image && <meta name="twitter:image" content={metadata.twitter.image} />}
    </Head>
  );
}

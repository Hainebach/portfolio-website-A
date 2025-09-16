import Head from "next/head";

export default function SEOHead({ metadata }) {
  // Ensure favicon URL is properly formatted
  const faviconUrl =
    metadata.favicon && metadata.favicon !== "/favicon.ico"
      ? metadata.favicon.startsWith("//")
        ? `https:${metadata.favicon}`
        : metadata.favicon
      : "/favicon.ico";

  // Add cache-busting parameter for Contentful favicons
  const faviconWithCacheBust =
    faviconUrl !== "/favicon.ico"
      ? `${faviconUrl}?v=${Date.now()}&refresh=true`
      : faviconUrl;

  console.log("SEOHead favicon URL:", faviconWithCacheBust); // Debug log

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && (
        <meta name="keywords" content={metadata.keywords} />
      )}
      {metadata.author && <meta name="author" content={metadata.author} />}

      {/* Favicon - multiple formats for better browser support */}
      <link rel="icon" type="image/x-icon" href={faviconWithCacheBust} />
      <link rel="icon" type="image/ico" href={faviconWithCacheBust} />
      <link rel="shortcut icon" href={faviconWithCacheBust} />
      <link rel="apple-touch-icon" href={faviconWithCacheBust} />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={faviconWithCacheBust}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={faviconWithCacheBust}
      />
      {/* Force favicon refresh */}
      <meta name="msapplication-TileImage" content={faviconWithCacheBust} />

      {/* No Index */}
      {metadata.noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta
        property="og:description"
        content={metadata.openGraph.description}
      />
      <meta property="og:type" content={metadata.openGraph.type} />
      {metadata.openGraph.image && (
        <meta property="og:image" content={metadata.openGraph.image} />
      )}
      {metadata.openGraph.url && (
        <meta property="og:url" content={metadata.openGraph.url} />
      )}
      <meta property="og:site_name" content={metadata.openGraph.siteName} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      {metadata.twitter.image && (
        <meta name="twitter:image" content={metadata.twitter.image} />
      )}
    </Head>
  );
}

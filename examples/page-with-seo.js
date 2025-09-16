// Example usage in pages/index.js or any page
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { fetchSiteSettings, fetchSEOMetadata, generatePageMetadata } from '../lib/contentful-seo';

export default function HomePage() {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    async function loadMetadata() {
      const siteSettings = await fetchSiteSettings();
      const seoMetadata = await fetchSEOMetadata('home'); // Try to match by page identifier
      
      const pageMetadata = generatePageMetadata(
        siteSettings,
        seoMetadata,
        'Portfolio', // Default title for this page
        'Welcome to my portfolio showcasing my creative work.' // Default description
      );
      
      setMetadata(pageMetadata);
    }
    
    loadMetadata();
  }, []);

  return (
    <>
      {metadata && <SEOHead metadata={metadata} />}
      {/* Your page content */}
      <div>
        <h1>Welcome to My Portfolio</h1>
        {/* Rest of your content */}
      </div>
    </>
  );
}

// For static generation, you could also use getStaticProps:
export async function getStaticProps() {
  const siteSettings = await fetchSiteSettings();
  const seoMetadata = await fetchSEOMetadata('home'); // Try to match by page identifier
  
  const metadata = generatePageMetadata(
    siteSettings,
    seoMetadata,
    'Portfolio',
    'Welcome to my portfolio showcasing my creative work.'
  );

  return {
    props: {
      metadata,
    },
    revalidate: 60, // Revalidate every minute
  };
}

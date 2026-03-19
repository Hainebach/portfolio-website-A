import Image from "next/image";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import { fetchEntries } from "../../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  fetchSiteSettings,
  fetchSEOMetadata,
  generatePageMetadata,
} from "../../lib/contentful-seo";

export async function getStaticProps() {
  const entries = await fetchEntries("landingPage");
  const landingPage = entries[0];

  const homepageText = landingPage.fields.homepageText;
  const buttonText = landingPage.fields.buttonText;
  const homepageLogo = landingPage.fields.homepageLogo;

  // Fetch SEO data
  const siteSettings = await fetchSiteSettings();
  const seoMetadata = await fetchSEOMetadata(); // Get default SEO metadata

  const metadata = generatePageMetadata(
    siteSettings,
    seoMetadata,
    "Home", // Default title for home page
    "Freelance designer specializing in visual identity, publications, and digital experiences.", // Default description
  );

  return {
    props: {
      homepageText,
      buttonText,
      homepageLogo,
      metadata,
    },
    revalidate: 10, // ISR: revalidate every 10 seconds
  };
}

export default function Home({
  homepageText,
  buttonText,
  homepageLogo,
  metadata,
}) {
  return (
    <>
      <SEOHead metadata={metadata} />
      <main className="relative w-full h-[calc(100vh-90px)] mt-[90px] md:h-[calc(100vh-80px)] md:mt-[80px] bg-black overflow-hidden">
        <div className="flex flex-col items-center pt-20 md:pt-32">
          {/* Homepage Text */}
          {homepageText && (
            <div className="text-white text-center mb-8 w-auto md:w-auto px-2 md:px-4 text-4xl md:text-6xl md:leading-relaxed whitespace-pre-line">
              {documentToReactComponents(homepageText)}
            </div>
          )}

          {/* Button Text Link */}
          {buttonText && (
            <Link
              href="/work"
              className="text-white mb-12 text-3xl md:text-4xl hover:underline"
            >
              {buttonText}
            </Link>
          )}

          {/* Homepage Logo */}
          {homepageLogo && homepageLogo.fields?.file?.url && (
            <Link href="/work" className="logo-hover cursor-pointer">
              <div className="relative w-48 h-48 md:w-72 md:h-72">
                <Image
                  src={`https:${homepageLogo.fields.file.url}`}
                  alt="Homepage Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 192px, 288px"
                />
              </div>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

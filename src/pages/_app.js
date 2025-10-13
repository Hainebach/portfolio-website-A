import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import "@/styles/Header.css";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { fetchEntries } from "../../lib/contentful";
import {
  fetchSiteSettings,
  fetchSEOMetadata,
  generatePageMetadata,
} from "../../lib/contentful-seo";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/Container";
import { ptSerif } from "../lib/fonts";

export default function App({ Component, pageProps }) {
  const [projects, setProjects] = useState([]);
  const [globalMetadata, setGlobalMetadata] = useState(null);
  const router = useRouter();
  const isIndexPage = router.pathname === "/";

  useEffect(() => {
    const getProjects = async () => {
      const entries = await fetchEntries("project");
      setProjects(entries);
    };
    getProjects();

    // Load global metadata for favicon and basic site info
    const loadGlobalMetadata = async () => {
      try {
        const siteSettings = await fetchSiteSettings();
        const defaultSEO = await fetchSEOMetadata();

        const metadata = generatePageMetadata(
          siteSettings,
          defaultSEO,
          siteSettings?.siteName || "Green Graphik",
          siteSettings?.siteDescription || "Amichai Green Graphic designer"
        );

        setGlobalMetadata(metadata);
      } catch (error) {
        console.error("Error loading global metadata:", error);
      }
    };

    loadGlobalMetadata();
  }, []);

  // Use page-specific metadata if available, otherwise use global metadata
  const metadata = pageProps.metadata || globalMetadata;

  // If running on Vercel preview, ensure we don't get indexed
  const isPreviewEnv = process.env.VERCEL_ENV === "preview";
  const effectiveMetadata = metadata
    ? { ...metadata, noIndex: Boolean(metadata.noIndex) || isPreviewEnv }
    : null;

  return (
    <div>
      {/* Global SEO - will be overridden by page-specific SEO if present */}
      {effectiveMetadata && !pageProps.metadata && (
        <SEOHead metadata={effectiveMetadata} />
      )}

      <AnimatePresence mode="wait">
        <div key={router.route}>
          <Header />
          {isIndexPage ? (
            <Component {...pageProps} projects={projects} />
          ) : (
            <Container>
              <Component {...pageProps} projects={projects} />
            </Container>
          )}
          {!isIndexPage && <Footer />}
          {isPreviewEnv && (
            <div
              aria-label="Preview environment"
              className="fixed right-3 bottom-16 md:bottom-6 z-[9999] pointer-events-none select-none rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-md"
            >
              Preview
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}

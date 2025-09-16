import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchEntries } from "@/../lib/contentful";
import { fetchSiteSettings } from "@/../lib/contentful-seo";
import Container from "./Container";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false); // Force visible for testing
  const [imprintTitle, setImprintTitle] = useState("Imprint");
  const [datenschutzTitle, setDatenschutzTitle] = useState("Privacy Policy");
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    // Fetch footer data from Contentful
    async function fetchFooterData() {
      try {
        // Fetch site settings
        const siteSettings = await fetchSiteSettings();
        if (siteSettings?.siteName) {
          setSiteName(siteSettings.siteName);
        }

        // Fetch imprint title (using englishTitle field)
        const imprintEntries = await fetchEntries("imprint");
        const imprintData = imprintEntries[0]?.fields;
        if (imprintData && imprintData.englishTitle) {
          setImprintTitle(imprintData.englishTitle);
        }

        // Fetch datenschutz title (using title field)
        const datenschutzEntries = await fetchEntries("datenschutz");
        const datenschutzData = datenschutzEntries[0]?.fields;
        if (datenschutzData && datenschutzData.title) {
          setDatenschutzTitle(datenschutzData.title);
        }
      } catch (error) {
        console.error("Error fetching footer links:", error);
      }
    }
    fetchFooterData();

    // Set up scroll listener to toggle back-to-top button
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backToTop = () => {
    console.log("Back to top button clicked");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full md:bg-backgroundColor bg-transparent z-10">
      <Container>
        <div className="flex justify-between items-center py-4">
          {showBackToTop ? (
            <button
              onClick={backToTop}
              className="hover:opacity-75 transition-opacity duration-200 focus:outline-none p-1"
              aria-label="Back to top"
            >
              <Image
                src="/images/Back_to_top.png"
                alt="Back to top"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
            </button>
          ) : (
            <div></div>
          )}

          {/* Footer Links */}
          <div className="prose text-text-secondary">
            <Link href="/imprint" className="hover:text-text-primary">
              {imprintTitle}
            </Link>
            {" | "}
            <Link href="/datenschutz" className="hover:text-text-primary">
              {datenschutzTitle}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

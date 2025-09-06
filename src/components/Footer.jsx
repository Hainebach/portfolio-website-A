import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchEntries } from "@/../lib/contentful";
import Container from "./Container";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false); // Force visible for testing
  const [imprintTitle, setImprintTitle] = useState("Imprint");
  const [datenschutzTitle, setDatenschutzTitle] = useState("Privacy Policy");

  useEffect(() => {
    // Fetch footer data from Contentful
    async function fetchFooterData() {
      try {
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
              className=" text-text-secondary hover:text-text-primary font-bold focus:outline-none p-1"
              aria-label="Back to top"
            >
              ^ Back to top
            </button>
          ) : (
            <div></div>
          )}

          {/* Footer Links */}
          <div className="text-sm text-text-secondary">
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

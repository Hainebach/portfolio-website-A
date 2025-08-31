import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchEntries } from "@/../lib/contentful";
import Container from "./Container";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="fixed bottom-0 left-4 right-4 flex justify-between items-center p-4 bg-white">
      <Container>
        <div className="flex justify-between items-center p-4">
          {showBackToTop ? (
            <button
              onClick={backToTop}
              className="text-gray-500 hover:text-black focus:outline-none"
              aria-label="Back to top"
            >
              <span className="material-symbols-outlined text-3xl">
                arrow_circle_up
              </span>
            </button>
          ) : (
            <div></div>
          )}

          {/* Footer Links */}
          <div className="text-sm text-gray-400">
            <Link href="/imprint" className="hover:text-black">
              {imprintTitle}
            </Link>
            {" | "}
            <Link href="/datenschutz" className="hover:text-black">
              {datenschutzTitle}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

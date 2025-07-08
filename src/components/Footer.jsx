import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchEntries } from "@/../lib/contentful";

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
    <footer className="fixed bottom-4 left-4 right-4 flex justify-between items-center p-4 bg-opacity-100">
      {/* Back to Top Button (visible only on scroll) */}
      {showBackToTop ? (
        <button
          onClick={backToTop}
          className="text-sm text-gray-500 hover:text-black focus:outline-none"
        >
          ^ Back to top
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
    </footer>
  );
}

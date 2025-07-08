import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/Header.css";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { fetchEntries } from "@../../../lib/contentful";
import { AnimatePresence, motion } from "framer-motion";

export default function App({ Component, pageProps }) {
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  const isIndexPage = router.pathname === "/";

  useEffect(() => {
    const getProjects = async () => {
      const entries = await fetchEntries("project");
      setProjects(entries);
    };
    getProjects();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isIndexPage && <Header />}
      <motion.main
        key={router.route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`${isIndexPage ? "" : "py-6 px-12 mt-10"}`}
      >
        <Component {...pageProps} projects={projects} />
        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}

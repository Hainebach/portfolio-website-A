import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/Header.css";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { fetchEntries } from "@../../../lib/contentful";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/Container";

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
      </div>
    </AnimatePresence>
  );
}

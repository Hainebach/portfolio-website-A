import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchHeader } from "../../lib/contentful";
import MenuIcon from "./MenuIcon";
import Container from "./Container";
import DarkModeToggleButton from "./DarkModeToggleButton"; // Uncomment to enable dark mode toggle

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const getHeaderData = async () => {
      const data = await fetchHeader();
      setHeaderData(data);
    };
    getHeaderData();
  }, []);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  if (!headerData) {
    return null; // Render nothing until data is loaded
  }

  const { title, logo, navigationLinks, blackText, grayText } = headerData;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <header className="header relative w-full bg-white dark:bg-black">
      <Container>
        <div className="flex items-center justify-between">
          <div className="md:hidden z-20">
            <button
              onClick={toggleMenu}
              className="text-secondaryGray outline-none p-2"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-6 h-6 text-black" />
            </button>
          </div>
          <Link
            className="header-title hover:scale-75 duration-200 mx-auto"
            href="/"
          >
            {logo && logo.fields?.file?.url ? (
              <div className="image-container">
                <Image
                  src={`https:${logo.fields.file.url}`}
                  alt={title}
                  fill
                  className="h-20 object-contain"
                />
              </div>
            ) : (
              title
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navigationLinks.map(({ fields: { label, url } }, index) => (
              <React.Fragment key={url}>
                <Link
                  className={`nav-link hover:font-semibold text-2xl ${
                    router.pathname === url
                      ? "text-gray-400 pointer-events-none cursor-default"
                      : ""
                  }`}
                  href={url}
                >
                  {label}
                </Link>
                {index < navigationLinks.length - 1 && (
                  <span className="text-2xl text-gray-400">|</span>
                )}
              </React.Fragment>
            ))}
            {/* <DarkModeToggleButton /> */}
          </nav>
        </div>
      </Container>
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-20 left-0 right-0 w-full bg-[rgb(var(--background-rgb))] shadow-md p-4 z-50 text-left md:hidden"
        >
          <Container>
            <nav className="flex flex-col space-y-4">
              {navigationLinks.map(({ fields: { label, url } }) => (
                <Link
                  key={url}
                  className={`nav-link hover:font-semibold text-2xl ${
                    router.pathname === url
                      ? "text-secondaryGray pointer-events-none cursor-default"
                      : ""
                  }`}
                  href={url}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {/* <DarkModeToggleButton /> */}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchHeader } from "../../lib/contentful";
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
    <header className="header fixed top-0 w-full bg-white">
      <Container>
        {/* Desktop layout */}
        <div className="hidden md:flex items-center w-full relative pt-16 pb-10">
          {/* Left side text - positioned normally */}
          <div className="flex items-center space-x-4 whitespace-nowrap">
            <Link href="/" className="flex items-center space-x-4">
              {blackText && (
                <span className="font-bold text-text-primary text-base md-lg:text-lg lg:text-xl xl2:text-2xl whitespace-nowrap hover:opacity-75 transition-opacity cursor-pointer">
                  {blackText}
                </span>
              )}
              {grayText && (
                <span className="text-text-secondary text-base md-lg:text-lg lg:text-xl xl2:text-2xl whitespace-nowrap hover:opacity-75 transition-opacity cursor-pointer">
                  {grayText}
                </span>
              )}
            </Link>
          </div>

          {/* Logo - absolutely centered horizontally only */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <Link className="header-title" href="/">
              {logo && logo.fields?.file?.url ? (
                <div className="logo-container">
                  <Image
                    src={`https:${logo.fields.file.url}`}
                    alt={title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                title
              )}
            </Link>
          </div>

          {/* Right side navigation - positioned at the end */}
          <nav className="flex items-center whitespace-nowrap ml-auto">
            {navigationLinks.map(({ fields: { label, url } }, index) => (
              <React.Fragment key={url}>
                <Link
                  className={`nav-link text-lg lg:text-xl xl2:text-2xl whitespace-nowrap ${
                    index === navigationLinks.length - 1
                      ? "pl-3 lg:pl-4"
                      : "px-3 lg:px-4"
                  } ${
                    router.pathname === url
                      ? "text-text-primary font-bold pointer-events-none cursor-default"
                      : "text-text-secondary"
                  }`}
                  href={url}
                >
                  {label}
                </Link>
                {index < navigationLinks.length - 1 && (
                  <span className="text-lg lg:text-xl xl2:text-2xl text-text-secondary">
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
            {/* <DarkModeToggleButton /> */}
          </nav>
        </div>
        {/* Mobile layout */}
        <div className="md:hidden w-full flex items-center py-4">
          {/* Burger menu on the left */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={toggleMenu}
              className="text-text-secondary outline-none"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <Image
                src="/images/Hamburger_icon.svg.png"
                alt="Menu"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </button>
          </div>

          {/* Centered text content */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-1 px-4">
            {blackText && (
              <span className="font-bold text-text-primary text-sm sm:text-base text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {blackText}
              </span>
            )}
            {grayText && (
              <span className="text-text-secondary text-sm sm:text-base text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {grayText}
              </span>
            )}
          </div>

          {/* Empty space on the right to balance the layout */}
          <div className="flex-shrink-0 w-8"></div>
        </div>
      </Container>
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-20 left-0 right-0 w-full bg-[rgb(var(--background-rgb))] p-4 z-50 text-left md:hidden"
        >
          <Container>
            <nav className="flex flex-col space-y-4">
              {navigationLinks.map(({ fields: { label, url } }) => (
                <Link
                  key={url}
                  className={`nav-link text-2xl ${
                    router.pathname === url
                      ? "text-text-primary font-bold pointer-events-none cursor-default"
                      : "text-text-secondary hover:font-semibold"
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

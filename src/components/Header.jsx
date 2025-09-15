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
    <header className="header fixed top-0 w-full bg-white">
      <Container>
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 whitespace-nowrap">
            {blackText && (
              <span className="font-bold text-text-primary  text-lg lg:text-xl xl2:text-2xl whitespace-nowrap">
                {blackText}
              </span>
            )}
            {grayText && (
              <span className="text-text-secondary  text-lg lg:text-xl xl2:text-2xl whitespace-nowrap">
                {grayText}
              </span>
            )}
            <Link className="header-title" href="/">
              {logo && logo.fields?.file?.url ? (
                <div className="image-container">
                  <Image
                    src={`https:${logo.fields.file.url}`}
                    alt={title}
                    fill
                    className="h-14 md:h-15 lg:h-17 xl:h-19 xl2:h-20 object-contain"
                  />
                </div>
              ) : (
                title
              )}
            </Link>
          </div>
          <nav className="flex items-center space-x-3 lg:space-x-4 whitespace-nowrap">
            {navigationLinks.map(({ fields: { label, url } }, index) => (
              <React.Fragment key={url}>
                <Link
                  className={`nav-link text-lg lg:text-xl xl2:text-2xl whitespace-nowrap ${
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
        <div className="md:hidden w-full flex flex-col items-center pt-2 pb-2">
          <div className="grid grid-cols-3 items-center w-full mb-2">
            <div className="col-span-1">
              <button
                onClick={toggleMenu}
                className="text-text-secondary outline-none p-1"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                <MenuIcon className="w-6 h-6 text-black" />
              </button>
            </div>
            <div className="col-span-1 text-center">
              <Link
                className="header-title hover:scale-75 duration-200"
                href="/"
              >
                {logo && logo.fields?.file?.url ? (
                  <div className="image-container">
                    <Image
                      src={`https:${logo.fields.file.url}`}
                      alt={title}
                      fill
                      className="h-10 sm:h-12 object-contain"
                    />
                  </div>
                ) : (
                  title
                )}
              </Link>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Stacked text layout for mobile */}
          <div className="flex flex-col items-center space-y-1 w-full">
            {blackText && (
              <span className="font-bold text-text-primary  text-sm sm:text-base text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {blackText}
              </span>
            )}
            {grayText && (
              <span className="text-text-secondary  text-sm sm:text-base text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {grayText}
              </span>
            )}
          </div>
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

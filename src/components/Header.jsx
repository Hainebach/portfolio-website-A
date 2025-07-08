import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchHeader } from "../../lib/contentful";
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

  const { title, logo, navigationLinks } = headerData;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <Link className="header-title hover:scale-75 duration-200" href="/">
        {logo && logo.fields?.file?.url ? (
          <div className="image-container">
            <Image
              src={`https:${logo.fields.file.url}`}
              alt={title}
              fill // Specify height
              className="h-20 object-contain"
            />
          </div>
        ) : (
          title
        )}
      </Link>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-secondaryGray outline-none"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          ☰
        </button>
      </div>
      <nav className="hidden md:flex items-center space-x-4">
        {navigationLinks.map(({ fields: { label, url }, index }) => (
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
        {/* <DarkModeToggleButton /> (uncomment to enable dark mode)*/}
      </nav>
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-16 right-4 bg-backgroundColor shadow-md rounded-lg p-4 z-50 text-right md:hidden"
        >
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
        </div>
      )}
    </header>
  );
}

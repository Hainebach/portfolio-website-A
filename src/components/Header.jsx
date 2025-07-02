import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DarkModeToggleButton from "./DarkModeToggleButton";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const navLinks = [
    { href: "/work", label: "work" },
    { href: "/about", label: "about" },
    { href: "/contact", label: "contact" },
  ];

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

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

  return (
    <header className="header">
      <Link className="header-title hover:scale-50 duration-200" href="/work">
        Amichai Green
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
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            className={`nav-link hover:font-semibold ${
              router.pathname === href
                ? "text-secondaryGray pointer-events-none cursor-default"
                : ""
            }`}
            href={href}
          >
            {label}
          </Link>
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
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                className={`nav-link hover:font-semibold ${
                  router.pathname === href
                    ? "text-secondaryGray pointer-events-none cursor-default"
                    : ""
                }`}
                href={href}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
            <DarkModeToggleButton />
          </nav>
        </div>
      )}
    </header>
  );
}

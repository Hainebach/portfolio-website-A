import React, { useState, useRef } from "react";
import Image from "next/image";
import { fetchEntries } from "../../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ReactMarkdown from "react-markdown";
import { FaInstagram } from "react-icons/fa";

export async function getStaticProps() {
  const entries = await fetchEntries("about");
  const aboutData = entries[0]?.fields;

  return {
    props: {
      info: {
        fields: aboutData,
      },
    },
    revalidate: 30, // Revalidate every 30 seconds
  };
}

export default function About({ info }) {
  const [activeSection, setActiveSection] = useState("about");
  const contentRef = useRef(null);

  const { name, about, references, email, image, cv, instagramLink } =
    info.fields;

  const sections = {
    about: documentToReactComponents(about),
    references: documentToReactComponents(references),
    ...(cv && { cv: <ReactMarkdown>{cv}</ReactMarkdown> }),
  };

  const toggleSection = (section) => {
    setActiveSection(section);

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getTitle = (key) => {
    if (key === "cv") {
      return "CV";
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // filepath: /Users/yoavhainebach/projects/portfolio-website-A/src/pages/about.js
  return (
    <div className="page-content flex flex-col md:flex-row min-h-screen pb-16">
      {/* Left side - Image and Navigation */}
      <div className="w-full md:w-1/3 p-8 bg-backgroundColor flex flex-col items-center justify-start">
        <div className="md:sticky md:top-8">
          <Image
            src={`https:${image.fields.file.url}`}
            alt={name}
            width={300}
            height={300}
            className="rounded mb-6"
          />

          {/* Navigation - hidden on mobile, visible on desktop */}
          <div className="hidden md:flex space-x-4 mb-6 justify-center">
            {Object.keys(sections).map((key) => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={`text-lg font-medium transition-colors ${
                  activeSection === key
                    ? "text-primaryGray font-semibold"
                    : "text-secondaryGray hover:text-midGray"
                }`}
              >
                {getTitle(key)}
              </button>
            ))}
          </div>

          {instagramLink && (
            <div className="flex justify-center">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondaryGray hover:text-primaryGray"
              >
                <FaInstagram size={30} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-2/3 p-8">
        <h1 className="text-4xl font-bold mb-8 text-midGray">{name}</h1>

        {/* Desktop content - with toggle */}
        <div className="hidden md:block">
          <div
            ref={contentRef}
            className="prose prose-lg max-w-none text-justify text-secondaryGray prose-strong:text-primaryGray"
          >
            {Object.keys(sections).map(
              (key) =>
                activeSection === key && <div key={key}>{sections[key]}</div>
            )}
          </div>
        </div>

        {/* Mobile content - show about and references in sequence */}
        <div className="md:hidden space-y-8">
          <div className="prose prose-lg max-w-none text-justify text-secondaryGray prose-strong:text-primaryGray">
            {sections.about}
          </div>
          <div className="prose prose-lg max-w-none text-justify text-secondaryGray prose-strong:text-primaryGray">
            <h2 className="text-2xl font-bold mb-4 text-midGray">References</h2>
            {sections.references}
          </div>
          {cv && (
            <div className="prose prose-lg max-w-none text-justify text-secondaryGray prose-strong:text-primaryGray">
              <h2 className="text-2xl font-bold mb-4 text-midGray">CV</h2>
              {sections.cv}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

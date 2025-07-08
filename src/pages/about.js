import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchEntries } from "../../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ReactMarkdown from "react-markdown";
import { FaInstagram } from "react-icons/fa";

export default function About() {
  const [info, setInfo] = useState(null);
  const [activeSection, setActiveSection] = useState("about");
  const contentRef = useRef(null);

  useEffect(() => {
    const getInfo = async () => {
      const entries = await fetchEntries("about");
      setInfo(entries[0]);
    };
    getInfo();
  }, []);

  if (!info) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image and Navigation */}
      <div className="w-1/3 p-8 flex flex-col items-center justify-start">
        <div className="sticky top-8">
          <Image
            src={`https:${image.fields.file.url}`}
            alt={name}
            width={300}
            height={300}
            className="rounded mb-6"
          />

          <div className="flex space-x-4 mb-6 justify-center">
            {Object.keys(sections).map((key) => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={`text-lg font-medium transition-colors ${
                  activeSection === key
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
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
                className="text-gray-500 hover:text-gray-900"
              >
                <FaInstagram size={30} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Content (2/3 width) */}
      <div className="w-2/3 p-8">
        <h1 className="text-4xl font-bold mb-8 text-midGray">{name}</h1>

        {/* Content area */}
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
    </div>
  );
}

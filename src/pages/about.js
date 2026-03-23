import React, { useState } from "react";
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

  const {
    name,
    about,
    references,
    email,
    image,
    cv,
    instagramLink,
    clientLogos,
  } = info.fields;

  const sections = {
    about: documentToReactComponents(about),
    references: documentToReactComponents(references),
    ...(cv && { cv: <ReactMarkdown>{cv}</ReactMarkdown> }),
  };

  const ClientLogosGrid = ({ logos }) => (
    <div className="grid grid-cols-3 md:grid-cols-4 w-full gap-8 mt-16">
      {logos?.map((logo, index) => (
        <div key={index} className="relative h-20 w-20">
          <Image
            src={`https:${logo.fields.file.url}`}
            alt={`Client logo ${index + 1}`}
            fill
            className="object-contain"
            sizes="33vw"
          />
        </div>
      ))}
    </div>
  );

  const toggleSection = (section) => {
    setActiveSection(section);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const getTitle = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="page-content flex flex-col md:flex-row min-h-screen pb-16">
      {/* Left side - Image and Navigation */}
      <div className="w-full md:w-1/3 p-8 md:pl-0 bg-backgroundColor flex flex-col items-start justify-start">
        <div className="md:sticky md:top-44">
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
                    ? "text-text-primary font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {getTitle(key)}
              </button>
            ))}
          </div>

          {/* {instagramLink && (
            <div className="flex justify-center">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary"
              >
                <FaInstagram size={30} />
              </a>
            </div>
          )} */}
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-2/3 md:p-8 md:pr-0">
        <h1 className="font-bold mb-8 text-text-primary">{name}</h1>

        {/* Desktop content - with toggle */}
        <div className="hidden md:block">
          <div className="prose text-lg max-w-none">
            {Object.keys(sections).map(
              (key) =>
                activeSection === key && (
                  <div key={key}>
                    {sections[key]}
                    {key === "about" &&
                      clientLogos &&
                      clientLogos.length > 0 && (
                        <ClientLogosGrid logos={clientLogos} />
                      )}
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Mobile content - show about and references in sequence */}
        <div className="md:hidden space-y-8">
          <div className="prose text-lg max-w-none">{sections.about}</div>
          <div className="prose text-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">
              References
            </h2>
            {sections.references}
            {/* Client Logos Grid - Mobile */}
            {clientLogos && clientLogos.length > 0 && (
              <ClientLogosGrid logos={clientLogos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

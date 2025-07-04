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
    return key.charAt(0).toLowerCase() + key.slice(1);
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-4xl md:max-w-4xl md:p-8 p-0 rounded md:shadow-md shadow-none h-[950px] overflow-hidden ">
        <div className="flex justify-center">
          <Image
            src={`https:${image.fields.file.url}`}
            alt={name}
            objectFit="cover"
            width={200}
            height={200}
            className="rounded"
          />
        </div>
        <div className="flex flex-col items-center justify-center pt-4 h-[calc(100%-200px)]">
          <div className="flex flex-row justify-around text-xl w-full max-w-3xl pb-4 mb-4">
            {Object.keys(sections).map((key) => (
              <button key={key}>
                <h3
                  className="font-semibold hover:font-bold cursor-pointer"
                  onClick={() => toggleSection(key)}
                >
                  {getTitle(key)}
                </h3>
              </button>
            ))}
          </div>

          <div
            ref={contentRef} // Attach ref to the content container
            className="md:max-w-6xl w-full text-justify h-[580px] overflow-y-auto"
          >
            {Object.keys(sections).map(
              (key) =>
                activeSection === key && (
                  <div
                    className="font-light prose md:prose-lg prose-sm text-secondaryGray prose-strong:text-primaryGray mx-auto"
                    key={key}
                  >
                    {sections[key]}
                  </div>
                )
            )}
          </div>

          {instagramLink && (
            <div className="mt-4 justify-center ">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-500 hover:text-gray-900`}
              >
                <FaInstagram size={30} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

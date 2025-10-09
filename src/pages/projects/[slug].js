import { useState, useEffect, useCallback } from "react";
import { fetchEntries } from "../../../lib/contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Zoom, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/zoom";

// Component for collapsible description text
function CollapsibleDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert rich text to plain text for character counting
  const getPlainText = (richText) => {
    if (!richText || !richText.content) return "";

    const extractText = (node) => {
      if (node.nodeType === "text") {
        return node.value;
      }
      if (node.content) {
        return node.content.map(extractText).join("");
      }
      return "";
    };

    return richText.content.map(extractText).join("");
  };

  const plainText = getPlainText(description);
  const shouldTruncate = plainText.length > 70;
  const truncatedText = plainText.substring(0, 70);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6">
      <div className="text-xl prose max-w-none">
        {/* Mobile view with collapsible text */}
        <div className="md:hidden">
          {shouldTruncate && !isExpanded ? (
            <div>
              <p>
                {truncatedText}...{" "}
                <button
                  onClick={toggleExpanded}
                  className="text-text-secondary hover:text-text-primary underline text-sm mt-2 transition-colors"
                >
                  Show more
                </button>
              </p>
            </div>
          ) : (
            <div>
              <div
                onClick={shouldTruncate ? toggleExpanded : undefined}
                className={shouldTruncate ? "cursor-pointer" : ""}
              >
                {documentToReactComponents(description)}
              </div>
              {shouldTruncate && isExpanded && (
                <button
                  onClick={toggleExpanded}
                  className="text-text-secondary hover:text-text-primary underline text-sm mt-2 transition-colors"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop view - always show full text */}
        <div className="hidden md:block">
          {documentToReactComponents(description)}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const entries = await fetchEntries("project");
  console.log("fetched entries: ", entries);

  const paths = entries.map((entry) => ({
    params: { slug: entry.fields.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const entries = await fetchEntries("project");
  const project = entries.find((entry) => entry.fields.slug === params.slug);
  if (!project) {
    return {
      notFound: true,
    };
  }

  const projects = entries.filter((entry) => entry.fields.slug !== params.slug);

  return {
    props: { project },
    revalidate: 30, // Add revalidation for consistency
  };
}

export default function ProjectPage({ project, projects }) {
  const { title, image, year, technique, description, link, linkTitle } =
    project.fields;
  const [selectedImage, setSelectedImage] = useState(null);
  const [swiperRef, setSwiperRef] = useState(null);

  const handleClick = (index) => {
    setSelectedImage(index);
    document.body.classList.add("modal-open");
    // Navigate to the selected slide when Swiper is available
    setTimeout(() => {
      if (swiperRef) {
        swiperRef.slideTo(index);
      }
    }, 100);
  };

  const handleClose = () => {
    setSelectedImage(null);
    document.body.classList.remove("modal-open");
  };

  // Keyboard navigation handled by Swiper

  return (
    <>
      <div className="page-content flex flex-col md:flex-row min-h-screen pb-16">
        {/* Text section - Full width on mobile, 1/3 on desktop */}
        <div className="w-full md:w-1/3 p-8 pl-0 bg-backgroundColor md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="mb-6">
            <Link
              href="/work"
              className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors group"
            >
              <span className="text-lg mr-2 pl-1 group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>
          </div>
          <h1 className="font-bold mb-4 text-text-primary">{title}</h1>
          <div className="text-sm mb-4 text-text-secondary space-y-2">
            {technique && (
              <p>
                <strong className="text-text-primary">Technique:</strong>{" "}
                {technique}
              </p>
            )}
            {year && <p>{year}</p>}
            {description && (
              <CollapsibleDescription description={description} />
            )}
            {link && (
              <div className="mt-6">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary underline text-lg font-medium transition-colors"
                >
                  {linkTitle || "Link to project"}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Images section - Full width on mobile, 2/3 on desktop */}
        <div className="w-full md:w-2/3 p-4 md:p-8 md:pr-0 space-y-8">
          {image.map((img, index) => (
            <div key={img.sys.id || index} className="mb-8">
              <div className="border-2">
                <Image
                  src={`https:${img.fields.file.url}`}
                  alt={img.fields.title || title}
                  width={img.fields.file.details.image.width}
                  height={img.fields.file.details.image.height}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => handleClick(index)}
                />
              </div>
              {/* Title centered under the image */}
              {img.fields.title && (
                <h3 className="text-lg mt-2 text-center text-text-secondary font-medium">
                  {img.fields.title}
                </h3>
              )}
              {img.fields.description && (
                <p className="text-text-secondary mt-2 text-center">
                  {img.fields.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Swiper Modal for enlarged image view */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-4xl z-50 hover:text-gray-300 transition-colors"
          >
            ×
          </button>

          {/* Swiper carousel */}
          <Swiper
            modules={[Navigation, Zoom, Keyboard]}
            initialSlide={selectedImage}
            spaceBetween={0}
            slidesPerView={1}
            zoom={{
              maxRatio: 4,
              minRatio: 1,
            }}
            keyboard={{
              enabled: true,
              onlyInViewport: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            onSwiper={setSwiperRef}
            className="w-full h-full"
          >
            {image.map((img, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center"
              >
                <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                  <Image
                    src={`https:${img.fields.file.url}`}
                    alt={img.fields.title || title}
                    fill
                    style={{ objectFit: "contain" }}
                    className="object-contain"
                  />
                </div>

                {/* Image info overlay */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center max-w-md px-4">
                  <h2 className="text-white text-lg md:text-xl font-bold mb-2">
                    {img.fields.title}
                  </h2>
                  {img.fields.description && (
                    <p className="text-gray-300 text-sm md:text-base">
                      {img.fields.description}
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-6xl md:text-8xl z-50 hover:text-gray-300 transition-colors">
            ‹
          </button>
          <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-6xl md:text-8xl z-50 hover:text-gray-300 transition-colors">
            ›
          </button>
        </div>
      )}
    </>
  );
}

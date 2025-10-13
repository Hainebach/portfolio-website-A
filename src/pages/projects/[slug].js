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

  const handleClose = useCallback(() => {
    console.log("handleClose called"); // Debug log
    console.log("Current selectedImage:", selectedImage); // Debug log

    // Temporarily disable swiper events to prevent interference
    if (swiperRef) {
      console.log("Disabling swiper events"); // Debug log
      swiperRef.off("slideChange");
    }

    setSelectedImage(null);
    console.log("setSelectedImage(null) called"); // Debug log
    document.body.classList.remove("modal-open");
  }, [selectedImage, swiperRef]);

  // Add Escape key support
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("Key pressed:", event.key, "selectedImage:", selectedImage); // Debug log
      if (event.key === "Escape" && selectedImage !== null) {
        console.log("Escape key handler firing"); // Debug log
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, handleClose]);

  // Debug log for selectedImage state
  console.log("Component render - selectedImage:", selectedImage);

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
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={(e) => {
            console.log("Background clicked", e.target); // Debug log
            console.log("Event currentTarget:", e.currentTarget); // Debug log
            if (e.target === e.currentTarget) {
              console.log("Target matches currentTarget, calling handleClose"); // Debug log
              handleClose();
            } else {
              console.log("Target does not match currentTarget, not closing"); // Debug log
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              console.log("Close button clicked"); // Debug log
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 text-white text-4xl z-50 hover:text-gray-300 transition-colors"
          >
            ×
          </button>

          {/* Modal content wrapper */}
          <div
            className="relative w-full h-full max-w-[98vw] max-h-[96vh] flex items-center justify-center"
            onClick={(e) => {
              console.log("Modal content wrapper clicked", e.target); // Debug log
              // Close if clicking on the wrapper itself (not its children)
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <div className="w-full h-full flex flex-col md:grid md:grid-rows-[minmax(0,1fr)_auto] md:gap-4">
              <div className="relative flex-1 flex items-center justify-center md:grid md:grid-cols-[minmax(2.5rem,8vw)_minmax(0,1fr)_minmax(2.5rem,8vw)] md:items-center md:gap-2">
                {/* Custom navigation buttons - hidden on mobile, anchored in side gutters on desktop */}
                <button
                  className="swiper-button-prev-custom hidden md:flex absolute md:static left-2 top-1/2 -translate-y-1/2 text-white text-5xl sm:text-6xl md:col-start-1 md:col-end-2 md:justify-center md:items-center md:h-full md:text-6xl lg:text-7xl xl:text-[8rem] md:transform-none z-50 hover:text-gray-300 transition-colors"
                  onClick={(e) => {
                    console.log("Previous button clicked"); // Debug log
                    e.stopPropagation();
                  }}
                >
                  ‹
                </button>

                {/* Swiper carousel */}
                <Swiper
                  modules={[Navigation, Zoom, Keyboard]}
                  initialSlide={selectedImage}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  zoom={{
                    maxRatio: 4,
                    minRatio: 1,
                  }}
                  keyboard={{
                    enabled: true,
                    onlyInViewport: false,
                    pageUpDown: false,
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  onSwiper={setSwiperRef}
                  onSlideChange={(swiper) => {
                    console.log(
                      "Swiper onSlideChange fired, realIndex:",
                      swiper.realIndex,
                      "selectedImage:",
                      selectedImage
                    ); // Debug log
                    if (selectedImage !== null) {
                      setSelectedImage(swiper.realIndex);
                    }
                  }}
                  onClick={(e) => {
                    console.log("Swiper clicked", e.target); // Debug log
                    // Check if the click is outside the image
                    const target = e.target;
                    if (!target) return; // Safety check

                    const isImage =
                      (target.tagName && target.tagName === "IMG") ||
                      (target.closest && target.closest("img"));
                    const isPrevButton =
                      (target.classList &&
                        target.classList.contains(
                          "swiper-button-prev-custom"
                        )) ||
                      (target.closest &&
                        target.closest(".swiper-button-prev-custom"));
                    const isNextButton =
                      (target.classList &&
                        target.classList.contains(
                          "swiper-button-next-custom"
                        )) ||
                      (target.closest &&
                        target.closest(".swiper-button-next-custom"));

                    if (!isImage && !isPrevButton && !isNextButton) {
                      console.log("Clicked outside image, closing modal"); // Debug log
                      handleClose();
                    }
                  }}
                  className="w-full h-full
                    md:col-start-2 md:col-end-3
                    md:!w-full md:!h-full md:!max-w-full md:!max-h-[88vh]
                    lg:!max-h-[92vh]
                    xl:!max-h-[94vh]"
                >
                  {image.map((img, index) => (
                    <SwiperSlide
                      key={index}
                      className="flex items-center justify-center"
                      onClick={(e) => {
                        console.log("SwiperSlide clicked", e.target); // Debug log
                        // Close if clicking on the slide but not on the image or navigation
                        const target = e.target;
                        if (!target) return; // Safety check

                        const isImage =
                          (target.tagName && target.tagName === "IMG") ||
                          (target.closest && target.closest("img"));
                        const isPrevButton =
                          (target.classList &&
                            target.classList.contains(
                              "swiper-button-prev-custom"
                            )) ||
                          (target.closest &&
                            target.closest(".swiper-button-prev-custom"));
                        const isNextButton =
                          (target.classList &&
                            target.classList.contains(
                              "swiper-button-next-custom"
                            )) ||
                          (target.closest &&
                            target.closest(".swiper-button-next-custom"));

                        if (!isImage && !isPrevButton && !isNextButton) {
                          console.log(
                            "Clicked on slide background, closing modal"
                          ); // Debug log
                          handleClose();
                        }
                      }}
                    >
                      <div
                        className="swiper-zoom-container flex items-center justify-center 
          h-full w-full
          md:h-full md:w-full"
                        onClick={(e) => {
                          console.log("Zoom container clicked", e.target); // Debug log
                          // Close if clicking on the zoom container but not on the image or navigation
                          const target = e.target;
                          if (!target) return; // Safety check

                          const isImage =
                            (target.tagName && target.tagName === "IMG") ||
                            (target.closest && target.closest("img"));
                          const isPrevButton =
                            (target.classList &&
                              target.classList.contains(
                                "swiper-button-prev-custom"
                              )) ||
                            (target.closest &&
                              target.closest(".swiper-button-prev-custom"));
                          const isNextButton =
                            (target.classList &&
                              target.classList.contains(
                                "swiper-button-next-custom"
                              )) ||
                            (target.closest &&
                              target.closest(".swiper-button-next-custom"));

                          if (!isImage && !isPrevButton && !isNextButton) {
                            console.log(
                              "Clicked on zoom container background, closing modal"
                            ); // Debug log
                            handleClose();
                          }
                        }}
                      >
                        <Image
                          src={`https:${img.fields.file.url}`}
                          alt={img.fields.title || title}
                          width={img.fields.file.details.image.width}
                          height={img.fields.file.details.image.height}
                          style={{
                            objectFit: "contain",
                            maxWidth: "100vw",
                            maxHeight: "100vh",
                          }}
                          className="object-contain !max-w-full !max-h-full
                        md:!max-w-full md:!max-h-full"
                          onClick={(e) => {
                            console.log("Image clicked", e.target); // Debug log
                            // Prevent closing when clicking directly on the image
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button
                  className="swiper-button-next-custom hidden md:flex absolute md:static right-2 top-1/2 -translate-y-1/2 text-white text-5xl sm:text-6xl md:col-start-3 md:col-end-4 md:justify-center md:items-center md:h-full md:text-6xl lg:text-7xl xl:text-[8rem] md:transform-none z-50 hover:text-gray-300 transition-colors"
                  onClick={(e) => {
                    console.log("Next button clicked"); // Debug log
                    e.stopPropagation();
                  }}
                >
                  ›
                </button>
              </div>

              {/* Title positioned below the image on desktop */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-sm px-4 z-50 md:static md:bottom-auto md:left-auto md:translate-x-0 md:col-span-3 md:w-full md:max-w-3xl md:px-8 md:text-center md:mx-auto md:py-4 md:transform-none">
                <h2 className="text-white text-sm md:text-lg lg:text-xl xl:text-2xl font-normal mb-1">
                  {image[selectedImage]?.fields?.title}
                </h2>
                {image[selectedImage]?.fields?.description && (
                  <p className="text-gray-300 text-xs md:text-sm lg:text-base xl:text-lg">
                    {image[selectedImage].fields.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

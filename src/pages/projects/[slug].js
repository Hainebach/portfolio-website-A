import { useState, useEffect, useCallback } from "react";
import { fetchEntries } from "../../../lib/contentful";
import { useGesture } from "react-use-gesture";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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
  };
}

export default function ProjectPage({ project, projects }) {
  const { title, image, year, technique, description } = project.fields;
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (index) => {
    setSelectedImage(index);
    document.body.classList.add("modal-open");
  };

  const handleClose = () => {
    setSelectedImage(null);
    document.body.classList.remove("modal-open");
  };

  const handleNext = useCallback(() => {
    setSelectedImage((prevIndex) => (prevIndex + 1) % image.length);
  }, [image.length]);

  const handlePrev = useCallback(() => {
    setSelectedImage(
      (prevIndex) => (prevIndex - 1 + image.length) % image.length
    );
  }, [image.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImage !== null) {
        switch (event.key) {
          case "ArrowRight":
            handleNext();
            break;
          case "ArrowLeft":
            handlePrev();
            break;
          case "Escape":
            handleClose();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, handleNext, handlePrev]);

  const bind = useGesture({
    onDrag: ({ direction: [xDir], distance, velocity }) => {
      if (velocity > 0.2) {
        if (xDir > 0) {
          handlePrev();
        } else if (xDir < 0) {
          handleNext();
        }
      }
    },
  });

  return (
    <>
      <div className="page-content flex flex-col md:flex-row min-h-screen pb-16">
        {/* Text section - Full width on mobile, 1/3 on desktop */}
        <div className="w-full md:w-1/3 p-8 bg-[rgb(var(--background-rgb))] md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4 text-midGray">{title}</h1>
          <div className="text-sm mb-4 text-secondaryGray space-y-2">
            {technique && (
              <p>
                <strong>Technique:</strong> {technique}
              </p>
            )}
            {year && <p>{year}</p>}
            {description && (
              <div className="mt-6">
                <div className="text-xl text-gray-700">
                  {documentToReactComponents(description)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images section - Full width on mobile, 2/3 on desktop */}
        <div className="w-full md:w-2/3 p-4 md:p-8 space-y-8">
          {image.map((img, index) => (
            <div key={img.sys.id || index} className="mb-8">
              <Image
                src={`https:${img.fields.file.url}`}
                alt={img.fields.title || title}
                width={img.fields.file.details.image.width}
                height={img.fields.file.details.image.height}
                className="w-full h-auto cursor-pointer"
                onClick={() => handleClick(index)}
              />
              {/* {img.fields.title && (
                <h3 className="text-lg mt-4 text-center">{img.fields.title}</h3>
              )} */}
              {img.fields.description && (
                <p className="text-secondaryGray mt-2 text-center">
                  {img.fields.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for enlarged image view */}
      {selectedImage !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={handleClose}
          ></div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            ×
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-4 text-white text-2xl z-50"
          >
            ‹
          </button>
          <div
            className="relative w-3/4 h-3/4 pb-2 bg-transparent flex items-center justify-center"
            {...bind()}
          >
            <Image
              src={`https:${image[selectedImage].fields.file.url}`}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              className="object-contain"
            />
          </div>
          {/* <div className="absolute bottom-7 text-center z-50 bg-transparent p-4">
            <h2 className="text-lg font-bold pt-4 text-white">
              {image[selectedImage].fields.title}
            </h2>
            <p className="text-sm text-gray-300">
              {image[selectedImage].fields.description}
            </p>
          </div> */}
          <button
            onClick={handleNext}
            className="absolute right-4 text-white text-2xl z-50"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

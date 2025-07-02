import { useState, useEffect, useCallback } from "react";
import { fetchEntries } from "../../../lib/contentful";
import { useGesture } from "react-use-gesture";
import Image from "next/image";
import Footer from "@/components/Footer";

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
  const { title, image, year, size, technique, tags } = project.fields;
  const [selectedImage, setSelectedImage] = useState(null);
  // console.log("project fields: ", project.fields);

  const handleClick = (index) => {
    setSelectedImage(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
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
      <div className="sticky top-0 bg-[rgb(var(--background-rgb))] pt-2">
        <h1 className="text-3xl font-bold mb-4 text-midGray">{title}</h1>
        <p className="text-sm mb-4 text-secondaryGray">
          {technique} {year && `| ${year}`}
        </p>
      </div>

      <div className="grid grid-cols-2  md:grid-cols-3 gap-6">
        {image.map((img, index) => (
          <Image
            key={img.sys.id || index}
            src={`https:${img.fields.file.url}`}
            alt={title}
            loading="lazy"
            width={img.fields.file.details.image.width}
            height={img.fields.file.details.image.height}
            className="w-full h-auto cursor-pointer"
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-background-color-opacity"
            onClick={handleClose}
          ></div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray text-2xl z-50"
          >
            ×
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-4 text-gray text-2xl z-50"
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
          <div className="absolute bottom-7 text-center  z-50 bg-transparent p-4">
            <h2 className="text-lg font-bold pt-4 text-primaryGray">
              {image[selectedImage].fields.title}
            </h2>
            <p className="text-sm text-midGray">
              {image[selectedImage].fields.description}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="absolute right-4 text-gray text-2xl z-50"
          >
            ›
          </button>
        </div>
      )}
      <Footer project={project} projects={projects} />
    </>
  );
}

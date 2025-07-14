import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Work({ projects }) {
  const sortedProjects = [...projects].sort(
    (a, b) => a.fields.sortOrder - b.fields.sortOrder
  ); // for the client to be able to sort through sortOrder field on contentful (option instead of the next line)
  // const sortedProjects = [...projects].sort(() => Math.random() - 0.5);
  return (
    <div className="page-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-8">
      {sortedProjects.map((project) => (
        <Link
          key={project.sys.id}
          href={`/projects/${project.fields.slug}`}
          className="block"
        >
          <div className="relative w-full overflow-hidden aspect-w-1 aspect-h-1 border">
            <Image
              src={`https:${project.fields.thumbnail.fields.file.url}`}
              alt={project.fields.title}
              className="absolute inset-0 w-full h-full object-cover"
              objectFit="cover"
              width={300}
              height={300}
              unoptimized={
                project.fields.thumbnail.fields.file.contentType === "image/gif"
              }
            />
          </div>
          {/* <h2 className="text-center mt-2">{project.fields.title}</h2> */}
        </Link>
      ))}
    </div>
  );
}

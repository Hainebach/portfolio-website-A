import React from "react";
import { fetchEntries } from "../../lib/contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export async function getStaticProps() {
  const entries = await fetchEntries("about");
  const aboutData = entries[0]?.fields;

  return {
    props: {
      contactData: {
        contactText: aboutData.contact,
        contactImage: aboutData.contactImage,
        name: aboutData.name,
        email: aboutData.email,
        phone: aboutData.phoneNumber,
      },
    },
    revalidate: 30, // Revalidate every 30 seconds
  };
}

export default function Contact({ contactData }) {
  const { name, email, phone, contactText, contactImage } = contactData;

  return (
    <div className="page-content flex flex-col md:flex-row min-h-screen pb-20">
      {/* Left side - Image only (full width on mobile, 1/3 on desktop) */}
      <div className="w-full md:w-1/3 py-8 px-0 md:pr-0 md:pt-8 md:pb-0 bg-backgroundColor flex flex-col items-start justify-start">
        <div className="md:sticky md:top-44">
          {contactImage && (
            <Image
              src={`https:${contactImage.fields.file.url}`}
              alt="Contact Image"
              width={300}
              height={300}
              className="rounded mb-6"
            />
          )}
        </div>
      </div>

      {/* Right side - Contact Text and Contact Info (full width on mobile, 2/3 on desktop) */}
      <div className="w-full md:w-2/3 py-8 px-0 md:p-8 md:pr-0">
        <h1 className="font-bold mb-8 text-text-primary">Contact</h1>

        {/* Contact Text */}
        <div className="prose max-w-none mb-8">
          {documentToReactComponents(contactText)}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-text-primary">{name}</p>
          <a
            href={`mailto:${email}`}
            className="text-lg text-text-secondary hover:text-text-primary underline block transition-colors"
          >
            {email}
          </a>
          <p className="text-lg text-text-secondary">{phone}</p>
        </div>
      </div>
    </div>
  );
}

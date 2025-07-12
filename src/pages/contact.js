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
  };
}

export default function Contact({ contactData }) {
  const { name, email, phone, contactText, contactImage } = contactData;

  return (
    <div className="flex flex-col md:flex-row min-h-screen pb-20">
      {/* Left side - Image only (full width on mobile, 1/3 on desktop) */}
      <div className="w-full md:w-1/3 p-8 flex flex-col items-center justify-start">
        <div className="md:sticky md:top-8">
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
      <div className="w-full md:w-2/3 p-8">
        <h1 className="text-4xl font-bold mb-8 text-midGray">Contact</h1>

        {/* Contact Text */}
        <div className="prose prose-lg max-w-none text-secondaryGray prose-strong:text-primaryGray mb-8">
          {documentToReactComponents(contactText)}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">{name}</p>
          <p className="text-lg text-gray-600">{email}</p>
          <p className="text-lg text-gray-600">{phone}</p>
        </div>
      </div>
    </div>
  );
}

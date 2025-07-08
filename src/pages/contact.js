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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Contact</h1>
        {contactImage && (
          <div className="mb-4">
            <Image
              src={`https:${contactImage.fields.file.url}`}
              alt="Contact Image"
              width={200}
              height={200}
            />
          </div>
        )}
        <div className="text-lg mb-4">
          {documentToReactComponents(contactText)} {/* Render Rich Text */}
        </div>
        <p className="text-lg mb-2">{name}</p>
        <p className="text-lg mb-2">{email}</p>
        <p className="text-lg mb-2">{phone}</p>
      </div>
    </div>
  );
}

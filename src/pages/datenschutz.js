import React from "react";
import { fetchEntries } from "../../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export async function getStaticProps() {
  // Fetch the first entry of the "datenschutz" content type
  const entries = await fetchEntries("datenschutz");
  const datenschutzData = entries[0]?.fields || {};

  return {
    props: {
      datenschutzData: {
        english: datenschutzData.englishText || null,
        german: datenschutzData.germanText || null,
      },
    },
  };
}

export default function Datenschutz({ datenschutzData }) {
  const { english, german } = datenschutzData;

  return (
    <div className="container mx-auto p-8">
      {english && (
        <>
          <h1 className="font-bold mb-4 text-text-primary">Privacy Policy</h1>
          <div className="prose prose-lg mb-8">
            {documentToReactComponents(english)}
          </div>
        </>
      )}
      {german && (
        <>
          <h1 className="font-bold mb-4 text-text-primary">Datenschutz</h1>
          <div className="prose mb-8">{documentToReactComponents(german)}</div>
        </>
      )}
    </div>
  );
}

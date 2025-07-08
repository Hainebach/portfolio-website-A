import React from "react";
import { fetchEntries } from "../../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export async function getStaticProps() {
  // Fetch the first entry of the "imprint" content type
  const entries = await fetchEntries("imprint");
  const imprintData = entries[0]?.fields || {};

  return {
    props: {
      imprintData: {
        englishTitle: imprintData.englishTitle || null,
        englishText: imprintData.englishText || null,
        germanTitle: imprintData.germanTitle || null,
        germanText: imprintData.germanText || null,
      },
    },
  };
}

export default function Imprint({ imprintData }) {
  const { englishTitle, englishText, germanTitle, germanText } = imprintData;

  return (
    <div className="container mx-auto p-8">
      {englishText && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {englishTitle ? englishTitle : "Imprint"}
          </h1>
          <div className="prose">{documentToReactComponents(englishText)}</div>
        </section>
      )}

      {germanText && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {germanTitle ? germanTitle : "Impressum"}
          </h1>
          <div className="prose">{documentToReactComponents(germanText)}</div>
        </section>
      )}
    </div>
  );
}

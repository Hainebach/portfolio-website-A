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
    <div className="mx-auto pt-20 pb-12">
      {englishText && (
        <section className="mb-12">
          <h1 className="font-bold mb-4 text-text-primary">
            {englishTitle ? englishTitle : "Imprint"}
          </h1>
          <div className="prose">{documentToReactComponents(englishText)}</div>
        </section>
      )}

      {germanText && (
        <section className="mb-12">
          <h1 className="font-bold mb-4 text-text-primary">
            {germanTitle ? germanTitle : "Impressum"}
          </h1>
          <div className="prose">{documentToReactComponents(germanText)}</div>
        </section>
      )}
    </div>
  );
}

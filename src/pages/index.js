import Image from "next/image";
import { fetchEntries } from "../../lib/contentful";

export async function getStaticProps() {
  const entries = await fetchEntries("landingPage");
  const landingPage = entries[0];
  const images = landingPage.fields.randomImage || [];
  let selectedImage = images[0];

  if (images.length > 1) {
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * images.length);
    selectedImage = images[randomIndex];
  }

  return {
    props: {
      image: selectedImage,
    },
    revalidate: 10, // ISR: revalidate every 10 seconds
  };
}

export default function Home({ image }) {
  return (
    <main className="w-full h-screen pt-20 md:pt-24 overflow-hidden">
      <div className="relative w-full h-full">
        {image && image.fields?.file?.url && (
          <Image
            src={`https:${image.fields.file.url}`}
            fill
            quality={100}
            alt="Random landing image"
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
      </div>
    </main>
  );
}

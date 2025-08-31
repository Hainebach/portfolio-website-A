import Link from "next/link";
import Image from "next/image";
import { fetchEntries } from "../../lib/contentful";

export async function getStaticProps() {
  const entries = await fetchEntries("landingPage");
  const landingPage = entries[0];
  return {
    props: {
      landingPage: landingPage.fields,
    },
  };
}

export default function Home({ landingPage }) {
  const { title, backgroundImage } = landingPage;

  return (
    <main className="relative h-screen w-full">
      <Image
        src={`https:${backgroundImage.fields.file.url}`}
        fill
        quality={100}
        alt="background Image"
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* <div className="relative z-10 flex items-center justify-center h-full">
        <Link
          className="text-[rgb(var(--background-rgb))] hover:scale-150 duration-300 text-lg"
          href={"/work"}
        >
          {title.toLowerCase()}
        </Link>
      </div> */}
    </main>
  );
}

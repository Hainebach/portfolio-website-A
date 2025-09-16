// lib/contentful-seo.js
import { fetchEntries } from "./contentful";

// Fetch site settings (should only be one entry)
export async function fetchSiteSettings() {
  try {
    const entries = await fetchEntries("siteSettings");
    console.log("Site settings entries:", entries); // Debug log
    return entries[0]?.fields || null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

// Fetch SEO metadata entries (we'll match by page title or return default)
export async function fetchSEOMetadata(pageIdentifier = null) {
  try {
    const entries = await fetchEntries("seoMetadata");
    console.log("SEO metadata entries:", entries); // Debug log

    // If no specific page identifier, return the first/default entry
    if (!pageIdentifier) {
      return entries[0]?.fields || null;
    }

    // Try to match by page title or return first entry as fallback
    const matchedEntry = entries.find((entry) =>
      entry.fields.pageTitle
        ?.toLowerCase()
        .includes(pageIdentifier.toLowerCase())
    );

    return matchedEntry?.fields || entries[0]?.fields || null;
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
    return null;
  }
}

// Generate complete metadata for a page
export function generatePageMetadata(
  siteSettings,
  seoMetadata,
  defaultTitle = "",
  defaultDescription = ""
) {
  const siteName = siteSettings?.siteName || "Green Graphik";
  const siteDescription =
    siteSettings?.siteDescription || "Amichai Green Graphic designer";
  const siteUrl = siteSettings?.siteUrl || "https://green-grafik.vercel.app";
  const socialImage = siteSettings?.socialImage?.fields?.file?.url || "";
  const author = siteSettings?.author || "Amichai Green";
  const favicon = siteSettings?.favicon?.fields?.file?.url || "/favicon.ico";

  // Debug log to see what favicon URL we're getting
  console.log("Favicon from siteSettings:", favicon);
  console.log("Full siteSettings:", siteSettings);

  // Use SEO metadata if available, otherwise fall back to defaults
  const title = seoMetadata?.pageTitle || defaultTitle || siteName;
  const description =
    seoMetadata?.metaDescription || defaultDescription || siteDescription;
  const socialTitle = seoMetadata?.socialTitle || title;
  const socialDesc = seoMetadata?.socialDescription || description;
  const noIndex = seoMetadata?.noIndex || false;
  const keywords = seoMetadata?.keywords?.join(", ") || "";

  return {
    title: title === siteName ? title : `${title} | ${siteName}`,
    description,
    keywords,
    noIndex,
    favicon: favicon.startsWith("//") ? `https:${favicon}` : favicon,
    openGraph: {
      title: socialTitle,
      description: socialDesc,
      image: socialImage ? `https:${socialImage}` : "",
      url: siteUrl,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDesc,
      image: socialImage ? `https:${socialImage}` : "",
    },
    author,
  };
}

import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// export const fetchEntries = async (contentType) => {
//   const entries = await client.getEntries({
//     content_type: contentType,
//   });
//   return entries.items;
// };
export const fetchEntries = async (contentType) => {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      include: 2, // Include linked assets up to 2 levels deep
    });
    if (!entries.items.length) {
      console.error(`No entries found for content type: ${contentType}`);
    }
    return entries.items;
  } catch (error) {
    console.error("Error fetching entries:", error.message);
    return [];
  }
};

export const fetchHeader = async () => {
  try {
    const entries = await client.getEntries({
      content_type: "header",
      include: 2, // Include linked assets up to 2 levels deep
    });
    return entries.items[0]?.fields; // Return the first header entry's fields
  } catch (error) {
    console.error("Error fetching header:", error.message);
    return null;
  }
};

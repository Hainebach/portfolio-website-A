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

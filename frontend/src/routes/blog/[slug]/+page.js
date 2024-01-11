/** @type {import('./$types').PageLoad} */
import { error } from "@sveltejs/kit";
import getDirectusInstance from "$lib/directus";
export async function load({ fetch, params,parent }) {
  const { token } = await parent();
  const directus = await getDirectusInstance(fetch,token);
  try {
    return {
      post: await directus.readItem("posts", params.slug, {
        fields: ["*", { "*": ["*"] }],
      }),
    };
  } catch (err) {
    error(404, "Post not found");
  }
}

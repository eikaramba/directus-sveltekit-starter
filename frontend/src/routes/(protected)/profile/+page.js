import getDirectusInstance from "$lib/directus";
import { readMe } from "@directus/sdk";
import { error } from "@sveltejs/kit";
export async function load({ parent, fetch }) {
  const { token } = await parent();
  const directus = getDirectusInstance(fetch, token);
  try {
    return {
      user: await directus.request(
        readMe({
          fields: ["*"],
        })
      ),
    };
  } catch (err) {
    error(404, "User not found");
  }
}

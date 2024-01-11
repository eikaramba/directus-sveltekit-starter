/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/directus';
import { error } from "@sveltejs/kit";
export async function load({fetch,parent}) {
	const { token } = await parent();
	const directus = await getDirectusInstance(fetch,token);
	try {
		return {
			posts: await directus.readItems('posts', {
				fields: ['slug', 'title', 'publish_date', { 'author': [ 'name' ] }],
				sort: ['-publish_date']
			})
		};
	} catch (err) {
		error(404, "Blog not found");
	}
}
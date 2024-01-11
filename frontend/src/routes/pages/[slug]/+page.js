/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
export async function load({fetch,params,parent}) {
	const { token } = await parent();
	const directus = getDirectusInstance(fetch,token);
	try {
		return {
			page: await directus.readItem('pages', params.slug)
		};
	} catch (err) {
		error(404, 'Page not found');
	}
}
/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/directus';
export async function load({fetch,parent}) {
	const { token } = await parent();
	const directus = getDirectusInstance(fetch,token);
    return {
		global: await directus.readItems('global')
	};
}
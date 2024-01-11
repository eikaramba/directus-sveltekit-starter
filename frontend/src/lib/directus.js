import { createDirectus, rest, authentication  } from "@directus/sdk";
import { readItems, readItem, updateItem, updateUser, createItem, deleteItem } from "@directus/sdk";
import { PUBLIC_APIURL,PUBLIC_COOKIE_DOMAIN } from '$env/static/public';

function getDirectusInstance(fetch,token) {

  const options = fetch ? { globals: { fetch } } : {};

  const directus = createDirectus(PUBLIC_APIURL, options)
  .with(authentication('cookie', { credentials: 'include' }))
  .with(rest());

  if(token) directus.setToken(token);

  directus.updateUser = async (id, query) => directus.request(updateUser(id, query));
  directus.updateItem = async (collection, id, query) => directus.request(updateItem(collection, id, query));
  directus.readItems = async (collection, query) => directus.request(readItems(collection, query));
  directus.readItem = async (collection, id, query) => directus.request(readItem(collection, id, query));
  directus.createItem = async (collection, query) => directus.request(createItem(collection, query));
  directus.deleteItem = async (collection, id) => directus.request(deleteItem(collection, id));

  return directus;
}
export default getDirectusInstance;

export const constructCookieOpts = (age) => {
	return {

			'domain': PUBLIC_COOKIE_DOMAIN,
			// send cookie for every page
			'path': '/',
			// server side only cookie so you can't use `document.cookie`
			'httpOnly': true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			'sameSite': "strict",
			// only sent over HTTPS in production
			'secure': process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			'maxAge': age
		}
	}

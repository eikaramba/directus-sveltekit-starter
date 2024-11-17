import { redirect,fail} from '@sveltejs/kit';
import {PUBLIC_APIURL } from '$env/static/public';
import { constructCookieOpts } from '$lib/directus';


const REFRESH_TOKEN_TTL = 7; // in days - sync this with the Setting from Directus. see https://docs.directus.io/self-hosted/config-options.html#security

// This makes sure that the login page is only available if the user is not logged in yet
export const load = async ({ locals,url }) => {
	if (locals.token) redirect(302, '/profile')
	return {};
}

// This calls the Directus API login endpoint
const loginUser = async (request,email,password) => {
	let req = await fetch(`${PUBLIC_APIURL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'user-agent':request.headers.get("user-agent"),
		},
		body: JSON.stringify({
			email,
			password
		})
	});
	if(req.status >= 300){
		throw new Error(await req.text());
	}
	req = await req.json();
	return req.data;
}


const login = async ({ cookies, request, url }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');
	const redirectedFrom = url.searchParams.get('redirectedFrom');
	
	try {
		let tokens = await loginUser(request,email,password);

		// save cookies
		cookies.set('access_token',tokens.access_token, constructCookieOpts(Math.floor(tokens.expires/1000)));
		cookies.set('refresh_token', tokens.refresh_token, constructCookieOpts(60 * 60 * 24 * REFRESH_TOKEN_TTL));
	} catch (err) {
		return fail(400, { message: err.message});
	}

	// redirect to the page the user was trying to access before. If there is no such page, redirect to the profile page
	redirect(302, redirectedFrom ? redirectedFrom : `/profile`)
}

const register = async ({ cookies, request, url }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');
	const redirectedFrom = url.searchParams.get('redirectedFrom')
	
	//a) First create the user
	let signupRequest = await fetch(`${PUBLIC_APIURL}/users/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'user-agent':request.headers.get("user-agent")
		},
		body: JSON.stringify({
			email,
			password
		})
	});
	if(signupRequest.status >= 300){
		return fail(400, { message: await signupRequest.text() });
	}
	
	try {
		// b) then login the user as usual
		let tokens = await loginUser(request,email,password);
		
		// save cookies
		cookies.set('access_token',tokens.access_token, constructCookieOpts(Math.floor(tokens.expires/1000)));
		cookies.set('refresh_token', tokens.refresh_token, constructCookieOpts(60 * 60 * 24 * REFRESH_TOKEN_TTL));
	} catch (err) {
		return fail(400, { message: err.message });
	}
	
	redirect(302, redirectedFrom ? redirectedFrom : `/profile`)
}
export const actions = { login,register }
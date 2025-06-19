import jwt from "jsonwebtoken";
import { PUBLIC_APIURL } from '$env/static/public';
import { redirect} from '@sveltejs/kit';
import { constructCookieOpts } from '$lib/directus';

const TOKEN_EXPIRATION_BUFFER = 300;

// exchange the refresh token for an access token
async function refreshAccessToken(cookies) {
    let res = await fetch(PUBLIC_APIURL + "/auth/refresh", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
    });
  
    if (res.status >= 200) {
      cookies.delete('refresh_token', { path:'/' });
      cookies.delete('access_token', { path:'/' });
      throw new Error("Refresh Token Status != 200");
    }
    let data = (await res.json()).data;
  
    cookies.set("refresh_token", data.refresh_token, constructCookieOpts(60 * 60 * 24 * 30));
    cookies.set("access_token", data.access_token, constructCookieOpts(Math.floor(data.expires/1000)));
  }

function isTokenExpired(jwtPayload){
    return jwtPayload?.exp < Math.floor(Date.now()/1000) + TOKEN_EXPIRATION_BUFFER;
}

function shouldProtectRoute(url) {
    return url.split("/").includes("(protected)")
}

export async function handle({event, resolve}) {
    const { cookies,url } = event
    
    if (cookies.get('access_token') || cookies.get('refresh_token')) {
        let jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false;
  
        //check if token is expired and renew it if necessary
        if (isTokenExpired(jwtPayload) || !cookies.get('access_token')) {
          try {
            await refreshAccessToken(cookies);
            jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false;
          } catch (err) {
            cookies.delete('refresh_token', { path:'/' });
            cookies.delete('access_token', { path:'/' });
          }
        }
        
        event.locals.user = jwtPayload?.id;
        event.locals.token = cookies.get('access_token');
    }

    if (event.route.id && shouldProtectRoute(event.route.id) && !event.locals.user) {
        redirect(302,`/signin?redirectedFrom=${encodeURIComponent(url.pathname)}`)
    }

    return await resolve(event, {
        filterSerializedResponseHeaders: (key, value) => {
            return key.toLowerCase() === 'content-type'
        }
    });
}
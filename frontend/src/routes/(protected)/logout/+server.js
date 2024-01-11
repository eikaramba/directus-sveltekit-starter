import { redirect,error} from '@sveltejs/kit';
import {PUBLIC_APIURL} from '$env/static/public';

export async function GET({locals,request,cookies}) {
  try {
    if(cookies.get('refresh_token'))
      await fetch(`${PUBLIC_APIURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-agent':request.headers.get("user-agent"),
          'x-forwarded-for':request.headers.get('x-forwarded-for') ?? ' 127.0.0.1'
        },
        body: JSON.stringify({ refresh_token: cookies.get('refresh_token') })
      });
  } catch (err) {
    error(400,err);
  }
  
  cookies.delete('refresh_token', { path:'/' });
  cookies.delete('access_token', { path:'/' });

  redirect(302,`/signin`);
}

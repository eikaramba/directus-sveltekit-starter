<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { page } from '$app/stores';
    let email,password;
	export let form;
	const redirectedFrom = $page.url.searchParams.get('redirectedFrom')

</script>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form
	action="?/login{redirectedFrom?`&redirectedFrom=${redirectedFrom}`:''}"
	method="POST">
	<div>
		<label for="email">Email</label>
		<input id="email" name="email" type="text" bind:value={email}	
		/>
	</div>

	<div>
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required bind:value={password}	
		/>
	</div>

	<button type="submit">Log in</button>
	<button formaction="?/register{redirectedFrom?`&redirectedFrom=${redirectedFrom}`:''}">Register</button>
</form>
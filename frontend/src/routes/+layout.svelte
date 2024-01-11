<script>
    export let data;
    import getDirectusInstance from '$lib/directus';
	import { setContext } from 'svelte';

    // Make directus available to all components via Context API
    const directus = getDirectusInstance(fetch,data.token)
    setContext('directus', directus);

</script>

<a href="/">Home</a>
<a href="/pages/about">About</a>
<a href="/pages/conduct">Code of Conduct</a>
<a href="/pages/privacy">Privacy Policy</a>
<a href="/blog">Blog</a>

{#if data.token}
    <a href="/logout" data-sveltekit-preload-data="off">logout</a>
{:else}
    <a href="/signin">signin</a>
{/if}

<div>
    <slot></slot>
</div>
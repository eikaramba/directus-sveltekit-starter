<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import {PUBLIC_APIURL} from '$env/static/public';
</script>
<img src="{PUBLIC_APIURL}/assets/{data.post.image.filename_disk}?width=600" alt="">
<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
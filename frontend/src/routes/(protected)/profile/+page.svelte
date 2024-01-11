<script>
	import { getContext } from 'svelte';
  import { updateMe } from '@directus/sdk';
  export let data;
  
	const directus = getContext('directus');

  async function changeEmail() {
    await directus.request(updateMe({email:data.user.email}))
  }

</script>
  
<p>this is only visible if you are logged in</p>

<div>
  <label for="email">Your E-Mail</label>
  <input bind:value={data.user.email} required type="email" autocomplete="email" autocapitalize="off" />
  <button on:click={changeEmail}>Change Email</button>
</div>
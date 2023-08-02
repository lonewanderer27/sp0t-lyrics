<script lang="ts">
	export let data;
	const { derived, server, lyrics } = data;
	import { Button, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { Icon } from 'svelte-ionicons';
	import { goto } from '$app/navigation';

	console.log('song info: ', derived);
</script>

<title>{derived.title}</title>

<Navbar
	title={derived.title}
	titleClass="w-[15rem]  truncate"
	subtitle={derived.artist_names}
	subtitleClass="w-22 truncate"
	class="top-0 sticky px-4"
	outline={false}
	translucent={true}
>
	<NavbarBackLink slot="left" onClick={() => goto('/')} showText={false} />
	<Button slot="right" clear>
		<Icon name="share-social-outline" />
	</Button>
</Navbar>
<div class="font-bold text-2xl px-6 pt-6 pb-20">
	{#each lyrics.derived as lyric}
		<p
			class={` ${
				lyric.type === 'annotation' ? `mt-${lyric.index == 0 ? ' mt-8' : ' mt-20'} mb-4` : 'my-3'
			}`}
		>
			{lyric.text}
		</p>
	{/each}
</div>

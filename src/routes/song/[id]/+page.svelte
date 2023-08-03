<script lang="ts">
	export let data;
	const { song, lyrics } = data;
	import { Button, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { Icon } from 'svelte-ionicons';
	import { goto } from '$app/navigation';
	import { audioLyrics, audioLyricsInfo, selectedLyrics } from '../../../stores/lyrics.js';

	console.log('song info: ', song.song);

	// if it's not the same song, reset the selected lyrics
	if ($audioLyrics !== lyrics.lyrics) {
		$selectedLyrics = []
	}

	// set the current audio lyrics to the lyrics of this song
	$audioLyrics = lyrics.lyrics; 

	// set the current audio info to the info of this song
	(async () => {
		$audioLyricsInfo = await song.song;
	})();

	const handleSelectLyrics = () => {
		goto("/lyrics/" + song.song.id + "?url=" + song.song.path);
	}

	$: console.log("audio lyrics info: ", $audioLyricsInfo)
</script>

{#await song.song}
...
{:then song}
	<title>{song.title}</title>

	<Navbar
		title={song.title}
		titleClass="w-[15rem]  truncate"
		subtitle={song.artist_names}
		subtitleClass="w-22 truncate"
		class="top-0 sticky px-4"
		outline={false}
		translucent={true}
	>
		<NavbarBackLink slot="left" onClick={() => goto('/')} showText={false} />
		<Button slot="right" clear onClick={handleSelectLyrics}>
			<Icon name="share-social-outline" />
		</Button>
	</Navbar>
{/await}
<div class="font-bold text-2xl px-6 pt-6 pb-20">
	{#each lyrics.lyrics as lyric}
		<p
			class={` ${
				lyric.type === 'annotation' ? `mt-${lyric.index == 0 ? ' mt-8' : ' mt-20'} mb-4` : 'my-3'
			}`}
		>
			{lyric.text}
		</p>
	{/each}
</div>

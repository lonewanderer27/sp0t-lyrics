<script lang="ts">
	import { Navbar, NavbarBackLink } from 'konsta/svelte';
	import {
		currentlySelecting,
		audioLyrics,
		audioLyricsInfo,
		selectedLyrics
	} from '../../../stores/lyrics';
	import { goto } from '$app/navigation';
	import { find } from 'lodash';

	const handleBack = () => {
		goto(`/song/${$audioLyricsInfo.id}?url=${$audioLyricsInfo.path}`);
	};

	const findLyric = (i: number) => {
		const index = $selectedLyrics.findIndex((lyric) => lyric.index === i);

		// not selected
		if (index === -1) {
			return false;
		} else {
			return true;
		}
	};

	const toggleSelect = (i: number) => {
		// check if it's already selected
		const found = findLyric(i);

		// if it's not selected, add it to the list
		if (!found) {
			$selectedLyrics = [...$selectedLyrics, $audioLyrics.find((lyric) => lyric.index === i)!];
		}

		// if it's selected, remove it from the list
		if (found) {
			$selectedLyrics = $selectedLyrics.filter((lyric) => lyric.index !== i);
		}
	};

	$: console.log('selected lyrics: ', $selectedLyrics);
</script>

<Navbar title="Select Lyrics" subtitle={$selectedLyrics.length + ' lines selected'}>
	<NavbarBackLink slot="left" onClick={handleBack} />
</Navbar>

<div class="font-bold text-2xl px-6 pt-6">
	{#each $audioLyrics as lyric, index}
		{#if lyric.type === 'lyric'}
			<label class="swap my-4">
				<input type="checkbox" on:click={() => toggleSelect(index)} checked={findLyric(index)} />
				<div class="swap-on text-secondary">{lyric.text}</div>
				<div class="swap-off text-neutral">{lyric.text}</div>
			</label>
		{/if}
	{/each}
</div>

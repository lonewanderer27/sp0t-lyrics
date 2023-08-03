<script lang="ts">
	import { Navbar, NavbarBackLink } from 'konsta/svelte';
	import { audioLyrics, audioLyricsInfo, selectedLyrics } from '../../../stores/lyrics';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

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

<Navbar
	title="Select Lyrics"
	subtitle={$selectedLyrics.length <= 7
		? $selectedLyrics.length + ' lines selected'
		: 'Maximum lines selected'}
	class={`px-4`}
>
	<NavbarBackLink slot="left" onClick={handleBack} />
</Navbar>

<div
	class={`font-bold text-2xl px-6 pt-6 ${
		$page.url.pathname.split('/')[1].includes('lyrics') && $audioLyricsInfo ? 'pb-40' : 'pb-20'
	} pb-20`}
>
	{#each $audioLyrics as lyric, index}
		{#if lyric.type === 'lyric'}
			<label class="swap my-1">
				<input type="checkbox" on:click={() => toggleSelect(index)} checked={findLyric(index)} />
				<div class="swap-on text-secondary bg-neutral-content rounded-lg p-2">{lyric.text}</div>
				<div class="swap-off text-neutral p-2">{lyric.text}</div>
			</label>
		{/if}
	{/each}
</div>

<div
	class={`left-0 ${
		$page.url.pathname.split('/')[1] === 'lyrics' ? 'bottom-20' : 'bottom-0'
	} fixed h-15 w-full flex justify-center`}
>
	<button
		class={`btn ${
			$selectedLyrics.length == 0 || $selectedLyrics.length > 7 ? 'btn-disabled' : 'btn-secondary'
		}`}>Continue</button
	>
</div>

<script lang="ts">
	import { ListItem } from 'konsta/svelte';
	import type { Result } from '../../types/Genius/search';
	import { goto } from '$app/navigation';
	import { Icon } from 'svelte-ionicons';
	import { playingAudioURLStore, isPlayingStore, playingAudioInfoStore } from '../../stores/music';
	import { useQueryClient, createQuery } from '@tanstack/svelte-query';
	import { GeniusServices } from '$lib/services/genius.service';
	import { page } from '$app/stores';

	export let song: Result;
	let songURL: string | undefined;

	// get information about the song
	$: query = createQuery({
		queryKey: [song.id],
		queryFn: async () => await GeniusServices.getSong(song.id)
	});

	// get the song url
	$: songURL = $query?.data?.song?.media.find((m) => m.provider === 'youtube')?.url;
	// let hovered = false;

	const handlePlay = async () => {
		if ($playingAudioURLStore === songURL && $isPlayingStore) {
			// pause
			console.log('pause');
			$isPlayingStore = false;
		} else {
			if (songURL != undefined) {
				// set the playing audio url to this song's URL
				// then we trigger a refetch of the query in Player.svelte
				// which then plays the song and shows the player
				// and sets $isPlaying to true
				$playingAudioURLStore = songURL!;

				// set the playing audio info to this song
				$playingAudioInfoStore = song;
			}
		}
	};

	const handleClick = () => {
		let query = new URLSearchParams($page.url.searchParams.toString())
		query.set('url', song.path?.toString()!)
		goto(`/song/${song.id}?${query.toString()}`)
	}
</script>

<ListItem link onClick={handleClick}>
	<p slot="title" class={`line-clamp-1 ${$isPlayingStore && $playingAudioURLStore === songURL ? "text-secondary" : ""}`}>{song.title}</p>
	<p slot="subtitle" class="line-clamp-1">{song.artist_names}</p>
	<img
		slot="media"
		src={song.header_image_thumbnail_url}
		alt={song.title}
		class="w-12 h-12 rounded-md"
	/>
	<div slot="after" class="mb-[-1.5rem]">
		{#if songURL !== undefined}
			<button
				class="btn btn-ghost btn-square"
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();
					handlePlay();
				}}
			>
				<Icon name="play-circle-outline" width="30" height="30" />
			</button>
		{/if}
	</div>
</ListItem>

<script lang="ts">
	import { ListItem } from 'konsta/svelte';
	import type { Result } from '../../types/Genius/search';
	import { goto } from '$app/navigation';
	import { Icon } from 'svelte-ionicons';
	import { playingAudioURLStore, isPlayingStore, playingAudioInfoStore } from '../../stores/music';
	import { useQueryClient, createQuery } from '@tanstack/svelte-query';
	import { GeniusServices } from '$lib/services/genius.service';

	const queryClient = useQueryClient();

	export let song: Result;
	let songURL: string | undefined;

	// get information about the song
	$: query = createQuery({
		queryKey: [song.id],
		queryFn: async () => await GeniusServices.getSong(song.id)
	});

	// get the song url
	$: songURL = $query?.data?.derived?.media.find((m) => m.provider === 'youtube')?.url;
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
</script>

<div>
	<ListItem
		title={song.title}
		subtitle={song.artist_names}
		onClick={() => goto(`/song/${song.id}`)}
	>
		<img
			slot="media"
			src={song.header_image_thumbnail_url}
			alt={song.title}
			class="w-12 h-12 rounded-md"
		/>
		<div slot="after">
			{#if songURL !== undefined}
			<button class="btn btn-ghost" on:click={e => {
				e.stopPropagation();
				e.preventDefault();
				handlePlay();
			}}>
				<Icon name="play-circle-outline" width="30" height="30" />
			</button>
			{/if}
		</div>
	</ListItem>
</div>

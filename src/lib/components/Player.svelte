<script lang="ts">
	import { List, ListItem } from 'konsta/svelte';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import 'media-chrome';
	import { playingAudioURLStore, playingAudioInfoStore, isPlayingStore } from '../../stores/music';
import { YoutubeServices } from '$lib/services/youtube.service';

	$: query = createQuery({
		queryKey: [$playingAudioURLStore],
		queryFn: async () => {
			console.log('fetching audio: ', $playingAudioURLStore);
			return await YoutubeServices.getAudio($playingAudioURLStore);
		},
		refetchOnWindowFocus: false,
		enabled: $playingAudioURLStore !== ''
	});
</script>

{#if $playingAudioInfoStore != undefined}
<List class="left-0 bottom-[-32px] fixed backdrop-blur-xl z-50 w-full px-3 my-0">
	<ListItem onClick={() => goto(`/song/${$playingAudioInfoStore.id}`)}>
		<p slot="title" class="line-clamp-1">{$playingAudioInfoStore.title}</p>
		<p slot="subtitle" class="line-clamp-1">{$playingAudioInfoStore.artist_names}</p>
		<img
			slot="media"
			src={$playingAudioInfoStore.header_image_thumbnail_url}
			alt={$playingAudioInfoStore.title}
			class="w-12 h-12 rounded-md"
		/>
		<div slot="after" class="mb-[-1.5rem]">
			{#if $query.isLoading === true}
				<span class="loading loading-ring loading-md" />
			{/if}

			{#if $query.isSuccess}
				<media-controller audio>
					<audio
						slot="media"
						src={$query?.data?.derived}
						autoplay
						on:pause={() => ($isPlayingStore = false)}
						on:playing={() => ($isPlayingStore = true)}
						on:click={(e) => e.stopPropagation()}
					/>
					<media-control-bar>
						<media-play-button />
					</media-control-bar>
				</media-controller>
			{/if}
		</div>
	</ListItem>
</List>
{/if}

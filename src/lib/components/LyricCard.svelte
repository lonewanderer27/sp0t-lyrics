<script lang="ts">
	import type { LyricType } from '../../types';
	export let headerImageThumbnailUrl: string;
	export let title: string;
	export let artistNames: string;
	export let selectedLyrics: LyricType[];
	export let showSpotifyLogo: boolean;
</script>

<div id="lyric-card-container" class="p-10 flex flex-col justify-center">
	<div id="lyric-card" class="lyric-card p-5 shadow-xl bg-base-100 rounded-xl">
		<div class="lyric-card-header flex">
			<div class="lyric-card-image mr-4">
				<img src={headerImageThumbnailUrl} alt={title} class="w-10 h-auto rounded-sm" />
			</div>
			<div>
				<p class="lyric-card-title font-semibold truncate">{title}</p>
				<p class="lyric-card-artist text-xs">{artistNames}</p>
			</div>
		</div>
		<div class="lyric-card-body mt-5">
			{#each selectedLyrics as lyric}
				<p class="lyric-card-line text-2xl font-bold my-2">
					{lyric.text}
				</p>
			{/each}
		</div>
		{#if showSpotifyLogo}
			<div class="lyric-card-footer mt-5 grayscale">
				<img
					src="/spotify_logo_with_text.png"
					style="width: 5rem; height: auto"
					alt="Spotify Logo"
				/>
			</div>
		{/if}
	</div>
</div>

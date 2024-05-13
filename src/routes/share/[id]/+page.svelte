<script lang="ts">
	export let song;
	import type { LyricType } from '../../../types/index.d.ts';
	import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
	import { Navbar, NavbarBackLink, Page, Button } from 'konsta/svelte';
	import { audioLyricsInfo, selectedLyrics, audioLyrics } from '../../../stores/lyrics';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Icon } from 'svelte-ionicons';
	import html2canvas from 'html2canvas';
	import LyricCard from '$lib/components/LyricCard.svelte';

	// execute this code when the page is loaded
	$: () => {
		// check if audioLyricsInfo is empty
		if (!$audioLyricsInfo) {
			console.log('audioLyricsInfo is empty');

			// attempt to populate it from what the server sent us
			$audioLyricsInfo = song.song;

			// set the current audio info to the info of this song
			(async () => {
				$audioLyricsInfo = await song.song;
			})();
		}

		// check if audioLyrics is empty
		if ($audioLyrics.length === 0) {
			console.log('audioLyrics is empty');

			// attempt to populate it from what the server sent us
			$audioLyrics = song.lyrics;
		}

		// check if selected lyrics is empty
		if ($selectedLyrics.length === 0) {
			// try to load the selected lyrics from the query parameter
			const lyrics = $page.url.searchParams.get('lyrics');

			// if the lyrics is not empty
			if (lyrics) {
				// set the selected lyrics to the lyrics from the query parameter
				$selectedLyrics = JSON.parse(lyrics);
			}
		}
	};

	const handleBack = () => {
		// save the song id from the url
		const id = $page.url.pathname.split('/')[2];

		// save all the query parameters
		let query = new URLSearchParams($page.url.searchParams.toString());

		// go back to the song page with the song id and the query parameters
		goto(`/lyrics/${id}?${query.toString()}`);
	};

	const fixLineHeightIssues = () => {
		const style = document.createElement('style');
		document.head.appendChild(style);

		// fix the line height issues
		style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

		// reverse the line height fix via cleanup function
		return () => {
			style.remove();
		};
	};

	const getImage = async () => {
		// fetch the viewport meta tag
		const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

		// save the current viewport content
		const viewportContent = viewport.content;

		// set the viewport content to the width of the screen
		viewport.content = 'width=device-width, initial-scale=1';

		// fix line height issues
		const cleanup = fixLineHeightIssues();

		// wait for the next tick
		const canvas = await html2canvas(document.getElementById('lyric-card-container')!, {
			proxy: '/api/proxy/image',
			backgroundColor: null
		});

		// set the viewport content back to the original
		viewport.content = viewportContent;

		// cleanup the line height fix
		cleanup();
		return canvas.toDataURL('image/png');
	};

	const genImage = async () => {
		const node = document.getElementById('lyric-card-container')!;
		const dataUrl = await toPng(node, {
			backgroundColor: 'transparent',
		});

		// return the data url
		return dataUrl;
	};

	const download = async () => {
		const fakeLink = window.document.createElement('a');
		fakeLink.style.display = 'none';

		// construct the filename

		// get the selected lyrics
		const lyrics = $selectedLyrics.map((lyric: LyricType) => lyric.text);

		// construct a filename from the artist name and the title, and add the selected lyrics
		const filename = `${$audioLyricsInfo.artist_names} - ${
			$audioLyricsInfo.title
		} - lyrics - ${lyrics.join(' ')}`;

		fakeLink.download = `${filename}.png`;
		fakeLink.href = await getImage();
		fakeLink.click();
	};
</script>

<Page>
	<Navbar title="Share Lyrics" class="px-4">
		<NavbarBackLink slot="left" onClick={handleBack} />
		<Button clear slot="right" onClick={download}>
			<Icon name="cloud-download-outline" />
		</Button>
	</Navbar>

	<LyricCard
		headerImageThumbnailUrl={$audioLyricsInfo.header_image_thumbnail_url}
		title={$audioLyricsInfo.title}
		artistNames={$audioLyricsInfo.artist_names}
		selectedLyrics={$selectedLyrics}
		showSpotifyLogo={true}
	/>

	<div class="w-full flex justify-center">
		<div class="grid grid-cols-6 text-center">
			<button class="btn col-span-2 flex flex-col px-8 items-center">
				<Icon name="logo-facebook" />
				<span>Story</span>
			</button>
			<button class="btn col-span-2 flex flex-col px-8 items-center">
				<Icon name="logo-twitter" />
				<span>Tweet</span>
			</button>
			<button class="btn col-span-2 flex flex-col px-8 items-center">
				<Icon name="logo-instagram" />
				<span>Story</span>
			</button>
		</div>
	</div>
</Page>

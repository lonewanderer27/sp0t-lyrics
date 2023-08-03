<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Page, List, Block, Preloader } from 'konsta/svelte';
	import { GeniusServices } from '$lib/services/genius.service';
	import SongItem from '$lib/components/SongItem.svelte';
	let searchTerm = '';
	let debouncedSearchTerm = '';
	let searching = false;
	let timeout: number;

	const handleInput = () => {
		searching = false;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(handleSearch, 500);
	};

	const handleSearch = () => {
		debouncedSearchTerm = searchTerm;
		console.log(searchTerm);
	};

	$: query = createQuery({
		queryKey: [debouncedSearchTerm],
		queryFn: async () => await GeniusServices.search(debouncedSearchTerm),
		refetchOnWindowFocus: false
	});

	$: console.log('songs data:', $query.data?.songs);
</script>

<title>Sp0tify Lyrics</title>

<div class="px-3 pt-3 pb-10">
	<List>
		<input
			class="input input-bordered w-11/12 my-5 mx-3"
			placeholder="Search lyrics or song title"
			on:input={handleInput}
			bind:value={searchTerm}
		/>

		{#if $query.isLoading}
			<Block>
				<div class="text-center">
					<Preloader />
				</div>
			</Block>
		{/if}	

		{#if $query.isSuccess}
			{#each $query.data?.songs as song}
			<SongItem {song} />
		{/each}
		{/if}
	</List>	
</div>
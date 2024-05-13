<script lang="ts">
    import {createQuery} from '@tanstack/svelte-query';
    import {Page, List, Block, Preloader} from 'konsta/svelte';
    import {GeniusServices} from '$lib/services/genius.service';
    import SongItem from '$lib/components/SongItem.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    console.log('searchParams: ', $page.url.searchParams.toString());

    let searchTerm = $page.url.searchParams.get('q')?.toString() ?? "";
    let debouncedSearchTerm = $page.url.searchParams.get('q')?.toString() ?? '';
    let timeout: NodeJS.Timeout | null = null;

    const handleInput = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(handleSearch, 500);
    };

    const handleSearch = () => {
        debouncedSearchTerm = searchTerm;
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set('q', debouncedSearchTerm);
        goto(`?${query.toString()}`);
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

<Page>
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
            <Preloader/>
          </div>
        </Block>
      {/if}

      {#if $query.isSuccess}
        {#each $query.data?.songs as song}
          <SongItem {song}/>
        {/each}
      {/if}
    </List>
  </div>
</Page>
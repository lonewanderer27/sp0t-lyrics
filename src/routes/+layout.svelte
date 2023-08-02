<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import { App } from 'konsta/svelte';
	import { navigating } from '$app/stores';
	import { isPlayingStore } from '../stores/music';

	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';

	import Player from '$lib/components/Player.svelte';

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	// Tanstack Query
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<App theme="ios">
		<slot class={`${$isPlayingStore === true ? 'pb-10' : ''}`} />
		<Player />
	</App>
</QueryClientProvider>

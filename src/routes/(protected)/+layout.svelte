<script lang="ts">
	import { authState } from '#lib/auth.svelte.ts';
	import Spinner from '#lib/components/ui/spinner/spinner.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../$types';

	let checkingAuth = $state<boolean>(true);

	let { children }: LayoutProps = $props();

	onMount(() => {
		if (!authState.isAuthenticated) {
			goto(resolve('login'));
			return;
		}
		checkingAuth = false;
	});
</script>

{#if !checkingAuth}
	{@render children()}
{:else}
	<Spinner />
{/if}

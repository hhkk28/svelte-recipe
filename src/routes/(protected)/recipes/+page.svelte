<script lang="ts">
	import { Spinner } from '#lib/components/ui/spinner/index.ts';
	import RecipeCard from './recipe-card.svelte';
	import { api } from '#lib/api.ts';
	import type { Recipe } from '#lib/types/recipe.ts';

	type RecipesResponse = {
		recipes: Recipe[];
		total: number;
		skip: number;
		limit: number;
	};

	export async function fetchAllRecipes(query: string): Promise<Recipe[]> {
		const endpoint = `/recipes/search?${new URLSearchParams({ q: query, limit: '9', skip: '0' })}`;
		const { data, error } = await api.get<RecipesResponse>(endpoint);

		if (error) {
			throw error;
		}

		return data?.recipes ?? [];
	}

	let promise = $state(fetchAllRecipes(''));
</script>

<svelte:head>
	<title>Recipes</title>
	<meta name="description" content="Browse your saved recipes." />
</svelte:head>

<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<header class="mb-8">
		<p class="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
			Recipe collection
		</p>
		<h1 class="mt-2 font-heading text-4xl font-semibold tracking-tight">Recipes</h1>
	</header>
	<section
		aria-label="Recipes"
		class="grid max-w-md gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3"
	>
		{#await promise}
			<Spinner />
		{:then recipes}
			{#each recipes as recipe (recipe.id)}
				<RecipeCard {recipe} href={`/recipe/${recipe.id}`} />
			{/each}
		{:catch}
			Failed to fetch recipes, try again
		{/await}
	</section>
</main>

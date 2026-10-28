<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, Clock, Flame, Star, Users } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.ts';
	import { api } from '#lib/api.ts';
	import type { Recipe } from '#lib/types/recipe.ts';

	// this is to show the recipe name inside the head tags
	// svelte doesn't allow rendering head tags inside template blocks
	let recipeName = $state('recipe');

	async function fetchRecipeById(id: string): Promise<Recipe> {
		const endpoint = `/recipes/${id}`;
		const { data, error } = await api.get<Recipe>(endpoint);
		if (error) {
			throw error;
		}
		recipeName = data.name;
		return data;
	}

	let promise = $state(fetchRecipeById(page.params.slug!));
</script>

<svelte:head>
	<title>{recipeName} | Recipes</title>
	<meta name="description" content={`How to make ${recipeName}.`} />
</svelte:head>
{#await promise}
	<Spinner />
{:then recipe}
	<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<Breadcrumb class="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>{recipe.name}</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
		<div class="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
			<div class="space-y-8">
				<header>
					<div class="mb-3 flex flex-wrap gap-x-4 gap-y-1">
						<Badge variant="secondary">{recipe.cuisine}</Badge>
						<Badge variant="secondary">{recipe.difficulty}</Badge>
						{#each recipe.mealType as mealType (mealType)}
							<Badge variant="secondary">{mealType}</Badge>
						{/each}
					</div>
					<h1 class="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
						{recipe.name}
					</h1>
					<div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
						<span class="flex items-center gap-2"
							><Clock /> {recipe.cookTimeMinutes + recipe.prepTimeMinutes} minutes total</span
						>
						<span class="flex items-center gap-2"><Users /> {recipe.servings} servings</span>
						<span class="flex items-center gap-2"
							><Star /> {recipe.rating} ({recipe.reviewCount} reviews)</span
						>
					</div>
				</header>

				<img src={recipe.image} alt={recipe.name} class="aspect-video w-full object-cover" />

				<Card>
					<CardHeader>
						<CardTitle class="font-heading text-3xl">Instructions</CardTitle>
						<CardDescription>Follow these steps to make {recipe.name}.</CardDescription>
					</CardHeader>
					<CardContent>
						<ol class="space-y-5">
							{#each recipe.instructions as instruction, index}
								<li class="flex gap-4">
									<span
										class="flex size-7 shrink-0 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground"
										>{index + 1}</span
									>
									<p class="pt-0.5 leading-7">{instruction}</p>
								</li>
							{/each}
						</ol>
					</CardContent>
				</Card>
			</div>

			<aside class="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle class="font-heading text-3xl">Ingredients</CardTitle>
						<CardDescription>For {recipe.servings} servings</CardDescription>
					</CardHeader>
					<CardContent>
						<ul class="space-y-3">
							{#each recipe.ingredients as ingredient}
								<li class="flex gap-3 leading-6"><span aria-hidden="true">—</span>{ingredient}</li>
							{/each}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle class="font-heading text-3xl">Recipe details</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4 text-muted-foreground">
						<div class="flex items-center justify-between">
							<span>Prep time</span><span class="text-foreground">{recipe.prepTimeMinutes} min</span
							>
						</div>
						<Separator />
						<div class="flex items-center justify-between">
							<span>Cook time</span><span class="text-foreground">{recipe.cookTimeMinutes} min</span
							>
						</div>
						<Separator />
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-2"><Flame /> Calories</span><span
								class="text-foreground">{recipe.caloriesPerServing} per serving</span
							>
						</div>
					</CardContent>
				</Card>

				<div class="flex flex-wrap gap-x-4 gap-y-1">
					{#each recipe.tags as tag}
						<Badge variant="secondary">{tag}</Badge>
					{/each}
				</div>
			</aside>
		</div>
		<Button href="/recipes" variant="outline" class="mt-8"><ArrowLeft /> Back to recipes</Button>
	</main>
{:catch}
	Unable to fetch the recipe
{/await}

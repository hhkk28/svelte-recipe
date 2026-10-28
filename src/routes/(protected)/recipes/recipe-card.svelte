<script lang="ts">
	import { ArrowRight, Clock, Star, Users } from '@lucide/svelte';
	import type { Recipe } from '$lib/types/recipe.ts';

	import { AspectRatio } from '$lib/components/ui/aspect-ratio/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';

	let { recipe, href }: { recipe: Recipe; href: string } = $props();

	let totalTime = $derived(recipe.prepTimeMinutes + recipe.cookTimeMinutes);
</script>

<Card class="h-full">
	<AspectRatio ratio={16 / 9}>
		<img src={recipe.image} alt={recipe.name} class="size-full object-cover" />
	</AspectRatio>

	<CardHeader>
		<div class="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
			<Badge variant="secondary">{recipe.cuisine}</Badge>
			<Badge variant="secondary">{recipe.difficulty}</Badge>
		</div>
		<CardTitle class="font-heading text-2xl">{recipe.name}</CardTitle>
	</CardHeader>

	<CardContent class="space-y-4">
		<div class="grid grid-cols-3 gap-3 text-muted-foreground">
			<div class="flex items-center gap-2"><Clock /> <span>{totalTime} min</span></div>
			<div class="flex items-center gap-2"><Users /> <span>{recipe.servings} servings</span></div>
			<div class="flex items-center gap-2">
				<Star /> <span>{recipe.rating} ({recipe.reviewCount})</span>
			</div>
		</div>
		<div class="flex flex-wrap gap-x-4 gap-y-1">
			{#each recipe.tags as tag (tag)}
				<Badge variant="secondary">{tag}</Badge>
			{/each}
		</div>
	</CardContent>

	<CardFooter class="mt-auto">
		<Button {href} class="w-full">
			View recipe <ArrowRight />
		</Button>
	</CardFooter>
</Card>

<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import Button from '#lib/components/ui/button/button.svelte';
	import * as Card from '#lib/components/ui/card/index.ts';
	import Input from '#lib/components/ui/input/input.svelte';
	import Label from '#lib/components/ui/label/label.svelte';
	import { api } from '#lib/api.ts';
	import { Spinner } from '#lib/components/ui/spinner/index.ts';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authState } from '#lib/auth.svelte.ts';

	let username = $state('');
	let password = $state('');
	let loginError = $state('');
	let isLoggingIn = $state(false);

	interface LoginSuccessResponse {
		accessToken: string;
		refreshToken: string;
		id: number;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		gender: string;
		image: string;
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		loginError = '';
		isLoggingIn = true;
		const { data, error } = await api.post<LoginSuccessResponse>('/auth/login', {
			username,
			password
		});

		isLoggingIn = false;
		if (error) {
			loginError = error.message;
		} else if (data) {
			if (browser) {
				authState.signIn(data.accessToken)
				goto(resolve("recipes"))
			}
		}
	}

</script>

<svelte:head>
	<title>Login | Recipe Manager</title>
</svelte:head>

<main class="grid h-screen w-screen place-content-center">
	<Card.Root class="w-xl">
		<Card.Header>
			<Card.Title>Login to your account</Card.Title>
			<Card.Description>
				Enter your email and password to login and manage your recipes
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleLogin}>
				<div class="mb-6">
					<Label for="username">Username</Label>
					<Input type="text" id="username" placeholder="your username" bind:value={username} />
				</div>
				<div class="mb-6">
					<Label for="password">Password</Label>
					<Input type="password" id="password" placeholder="your password" bind:value={password} />
				</div>
				{#if loginError !== ''}
					<Alert.Root variant="destructive" class="mb-6 w-full">
						<CircleAlertIcon />
						<Alert.Title>{loginError}</Alert.Title>
					</Alert.Root>
				{/if}
				<Button type="submit">
					{#if isLoggingIn}
						<Spinner /> Logging In...
					{:else}
						Login
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</main>

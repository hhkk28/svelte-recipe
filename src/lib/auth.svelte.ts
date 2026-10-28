import { browser } from '$app/env';

class AuthState {
	token = $state<string | null>(null);

	constructor() {
		if (browser) {
			this.token = localStorage.getItem('accessToken');
		}
	}

	get isAuthenticated() {
		return this.token !== null;
	}

	signIn(token: string) {
		this.token = token;
		localStorage.setItem('accessToken', token);
	}

	signOut() {
		this.token = null;
		localStorage.removeItem('accessToken');
	}
}

export const authState = new AuthState();

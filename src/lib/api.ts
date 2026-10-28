import axios, { type AxiosRequestConfig } from 'axios';

type ApiResponse<TData, TError> =
	{ data: TData; error: null; status: number } | { data: null; error: TError; status?: number };

interface DefaultApiError {
	message: string;
}

const client = axios.create({
	baseURL: 'https://dummyjson.com'
});

async function request<TData, TError = unknown>(
	config: AxiosRequestConfig
): Promise<ApiResponse<TData, TError>> {
	try {
		const res = await client.request<TData>(config);
		return { data: res.data, error: null, status: res.status };
	} catch (err) {
		if (axios.isAxiosError<TError>(err)) {
			return {
				data: null,
				error: (err.response?.data ?? err.message) as TError,
				status: err.response?.status
			};
		}
		throw err;
	}
}

export const api = {
	get: <TData, TError = DefaultApiError>(url: string, config?: AxiosRequestConfig) =>
		request<TData, TError>({ method: 'GET', url, ...config }),

	post: <TData, TError = DefaultApiError>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig
	) => request<TData, TError>({ method: 'POST', url, data, ...config }),

	put: <TData, TError = DefaultApiError>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig
	) => request<TData, TError>({ method: 'PUT', url, data, ...config }),

	delete: <TData, TError = DefaultApiError>(url: string, config?: AxiosRequestConfig) =>
		request<TData, TError>({ method: 'DELETE', url, ...config })
};

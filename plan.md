### Project Concept: _“RecipeLab”_

You will build an app with two primary workflows:

1. **Explore & Filter (GET):** Search recipes by keyword, filter by tag/meal type, and click a recipe to fetch and view its full details.
2. **Submit a Recipe (POST):** A multi-input form with validation that sends JSON to the API, disables buttons while loading, and renders the newly created recipe returned by the server.
3. **Authentication & Protected Areas:** Sign in through a login page, retain client-side session state, and restrict recipe-management pages to authenticated users.

### What Svelte Concepts You Will Learn

| Skill                      | How You'll Implement It                                                                                                                                            |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form Inputs & Bindings** | Use `bind:value` for text inputs, numbers, and `<select>` dropdowns; `bind:group` for radio buttons (e.g., Difficulty: Easy/Medium/Hard).                          |
| **Form Submission**        | Use `onsubmit` on the `<form>` to prevent default reload, validate fields, and trigger the `POST` request.                                                         |
| **`{#await}` Block**       | Use Svelte’s native `{#await promise}` syntax to handle Loading, Resolved, and Error states cleanly without writing messy `if (isLoading)` boilerplate everywhere. |
| **Search & Query Params**  | Trigger dynamic fetches as query params change (`/recipes/search?q=pasta` or `/recipes/tag/Italian`).                                                              |
| **Client-Side Validation** | Disable the submit button until required fields are valid and show real-time error hints.                                                                          |
| **SPA Routing & Auth Guards** | Use SvelteKit route groups, dynamic route parameters, and a protected layout to guard authenticated pages in the client-rendered app.                              |

---

### The API Endpoints to Use (No Key Needed)

- **Search recipes:**  
  `GET https://dummyjson.com/recipes/search?q={query}`
- **Get recipe tags (for your dropdown filter):**  
  `GET https://dummyjson.com/recipes/tags`
- **Get single recipe details:**  
  `GET https://dummyjson.com/recipes/{id}`
- **Simulate adding a new recipe:**  
  `POST https://dummyjson.com/recipes/add`  
  _(Accepts JSON payload like `{ name: '...', ingredients: [...], prepTimeMinutes: 20 }` and returns the newly created object with an ID)._

---

### Implementation Roadmap

#### Phase 0: Authentication & App Routing

- Keep the application client-rendered with `export const ssr = false` in `src/routes/+layout.ts`.
- Build a `/login` page with email and password fields, validation, and a sign-in action.
- Store the authenticated session/token in a client-side auth module (for example, `src/lib/auth.svelte.ts`) and restore it from `localStorage` when the app starts.
- Group authenticated pages under `src/routes/(protected)/`. Add an auth-checking `+layout.svelte` in that group which redirects unauthenticated users to `/login`.
- Add a sign-out action that clears the stored session and returns the user to `/login`.
- Create dynamic recipe routes such as `src/routes/(protected)/recipe/[slug]/+page.svelte`, which resolve to `/recipe/:slug` without exposing `(protected)` in the URL.
- Protect API requests separately by sending the session token and validating it on the backend. Client-side route guards only protect the UI, not the API or data itself.

#### Phase 1: Search & Filter Form (GET)

- Build a search bar and a category `<select>` dropdown.
- Practice Svelte's native `{#await}` block for fetching data:

#### Phase 2: Recipe Detail View

- When clicking a recipe in the list, fetch its full instructions via `/recipes/{id}`.
- Handle potential 404 or network errors gracefully with UI feedback.

#### Phase 3: The "Create Recipe" Form (POST)

- Build a modal or separate view with a form containing:
  - Recipe name (`<input type="text">`)
  - Prep time in minutes (`<input type="number">`)
  - Difficulty level (`<input type="radio">` with `bind:group`)
  - Comma-separated ingredients string that you parse into an array before sending.
- Implement form state management:
  - An `isSubmitting` flag to disable inputs and show a spinner.
  - Validation rules (e.g., name must be at least 3 characters, prep time > 0).
- Send the `POST` request:

### Why this is better than typical tutorials

You will encounter the exact problems real-world SPAs face:

- How to avoid spamming the API on every keystroke.
- How to keep the UI responsive while waiting for network responses.
- How to format user input before sending it as a JSON payload.
- How to handle server errors without crashing the application.

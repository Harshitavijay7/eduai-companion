# Connect IntelliLearn Chat to the existing backend

## Scope
- Preserve the current Chat page layout, routes, theme, and interactions.
- Use the existing API service rather than adding dependencies or changing the backend.

## Changes
1. Update the existing API client default URL to `http://localhost:5000` while retaining the `VITE_API_URL` override.
2. Change the chat request to `POST /ask` with `{ question }` and type the expected `{ question, answer }` response.
3. Replace the demo reply in the Chat page with the real request while keeping immediate user messages, loading animation, auto-scroll, markdown rendering, and empty-input prevention.
4. Show a clear AI-side error message and notification if the backend is unavailable or returns an invalid answer.
5. Confirm the current dependency list and Vite configuration need no unnecessary changes, then verify the preview build status and chat request behavior as far as the local backend permits.

## Technical details
- Keep TanStack Router and the existing frontend structure unchanged.
- Keep the existing file attachment presentation frontend-only; `/ask` receives only the question as specified.
- The stop control will hide/cancel the pending frontend request where supported, without changing the backend.

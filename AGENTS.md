<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The frontend API client defaults to the existing Express service at `http://localhost:5000`, with `VITE_API_URL` as the deployment override, so environment changes do not require UI edits.
- The chat route uses its own viewport-height workspace instead of the shared app sidebar and top navigation, because duplicating that chrome obscures chat history and messages.

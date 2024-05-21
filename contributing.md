# How to contribute

Checkout to the appropriate branch `frontend` or `backend` and then follow this standard git commit message format:
`<type>(<scope>): <subject>`

For more information, see our [commit standard guidelines](#commit-standard-guidelines).



## Commit standard guidelines

### `type`
Choose an appropriate type for your commit from the following options:
- `build`: Changes related to building the code, e.g., adding npm dependencies or external libraries.
- `chore`: Changes that do not affect the external user, e.g., updating the `.gitignore` file or `.prettierrc` file.
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation-related changes.
- `refactor`: Code that neither fixes a bug nor adds a feature, e.g., semantic changes like renaming a variable or function.
- `perf`: Code that improves performance.
- `style`: Code that is related to styling.
- `test`: Adding new tests or making changes to existing tests.

### `scope`
The scope field is optional and should be a noun that represents the part of the codebase affected by the commit, such as `login` for changes to the login page. Use `global` or `all` if the commit affects multiple areas.

### `subject`
The subject should be a concise description of the commit, written in the imperative present tense. Do not end with a period, and do not capitalize the first letter.

Examples:
- `add login page`
- `fix bug in search functionality`

# Code Style and Formatting Rules

This rule dictates the code style and formatting standards to be followed by all AI agents when creating or modifying files in this repository.

## Formatting Standards

- **Indentation**: Use **spaces** instead of tabs. Indent size is **2 spaces**.
- **Line Endings**: Always use **LF** (`\n`).
- **Final Newline**: Ensure all files end with a single empty line.
- **Trailing Whitespace**: Remove all trailing whitespace (except in `.md` files).
- **Quotes**:
  - Use **single quotes** (`'`) for JavaScript, TypeScript, and CSS strings/imports.
  - Use **double quotes** (`"`) for JSX/TSX attributes.

## Verification

- Ensure all files are formatted with **Prettier** according to the `.prettierrc` configuration.
- Ensure all code matches quality rules defined in `eslint.config.mjs`.
- Run the following commands locally to verify and fix files:
  - Check formatting: `npm run format:check`
  - Fix formatting: `npm run format:write`
  - Run lint checks: `npm run lint`
  - Fix lint issues: `npm run lint:fix`

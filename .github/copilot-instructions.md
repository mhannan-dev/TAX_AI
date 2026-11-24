# MH Coding Instructions

## Project

- Laravel 13, PHP 8.3, React 18, Inertia.js v2, TypeScript, Tailwind CSS, Pest, and Laravel Pint.
- Preserve existing routes and keep the MH Tax & Invoice Autopilot UI consistent.
- Reuse existing pages and components under `resources/js/Pages` and `resources/js/Components`.

## Implementation

- Make precise, complete, maintainable changes.
- Follow established project conventions and inspect nearby code before editing.
- Use named routes, Form Requests, readonly DTOs, and focused Action or Service classes.
- Keep controllers responsible for request/response orchestration rather than business logic.
- Use database transactions and row locks for approval state transitions.
- Preserve tenant isolation and the human-in-the-loop approval requirement.
- Do not introduce dependencies or change database schemas without approval.
- Never commit secrets or sensitive client information.

## Frontend

- Use strongly typed React and Inertia props.
- Reuse Tailwind and Radix UI components.
- Include responsive layouts, focus states, labels, ARIA attributes, loading states, empty states, and confirmation dialogs.
- Do not use gradients or imply that AI posting is automatic.
- Format $ amounts, VAT rates, dates, and confidence values consistently.

## Tests and Verification

- Add or update Pest feature tests for meaningful request behavior and failure modes.
- Run the narrowest relevant test suite.
- Run `npm run build` after frontend changes.
- Run `vendor/bin/pint --format agent` after PHP changes.

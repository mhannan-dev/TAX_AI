# Tax Autopilot

A pre-accounting workspace for reviewing invoices, managing journal proposals, and looking up tax policy sources. Built with Laravel, React, and Inertia, with an explicit human approval step before an invoice is marked as posted.

## Current features

- Dashboard showing document activity, pending approvals, and VAT totals.
- PDF, JPG, and PNG invoice uploads up to 10 MB, with document previews when the stored file is available.
- Invoice review pages with line items, totals, and processing states.
- Rule-based account suggestions and journal proposal review.
- Human approval or rejection, including reviewer details, timestamps, and rejection notes. Approval decisions use transactions and row locks to prevent resolving a proposal twice.
- Knowledge library for policy excerpts and source references.
- Tax Copilot drawer with keyword lookup across source excerpts available on the current page.
- Registration, login, logout, password recovery, profile updates, and password visibility controls.
- Local-only **Quick demo login** that fills the demo credentials; the user clicks **Log in** to submit.
- Repeatable seeders for a demo organization, chart of accounts, invoices, approval history, and knowledge sources.

## Implementation status

This repository currently implements the review workflow and a seeded demonstration workspace. Uploaded documents are stored with a `queued` status; automated extraction is not connected. Journal suggestions use vendor-name rules rather than a model call.

The Laravel AI SDK is configured to use DeepSeek for text generation by default. Tax Copilot currently performs keyword lookup and displays source excerpts; it does not yet generate AI answers. Approval marks invoices as posted inside this application; no external accounting integration is connected.

## Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP 8.3+, Laravel 13 |
| Frontend | React 18, TypeScript, Inertia.js 2 |
| UI | Tailwind CSS 3, Radix UI, Lucide icons |
| Build | Vite 8 |
| AI integration | Laravel AI SDK, DeepSeek text provider |
| Database | SQLite by default |
| Testing and formatting | Pest 4, Laravel Pint |

## Local setup

Requirements: PHP 8.3 or newer with Laravel's required extensions and PDO SQLite, Composer, and Node.js 20.19+ or 22.12+ with npm.

```bash
git clone https://github.com/mhannan-dev/TAX_AI.git
cd TAX_AI
composer run setup
php artisan db:seed --no-interaction
php artisan storage:link
```

`composer run setup` installs PHP and JavaScript dependencies, creates `.env` if missing, generates the application key, runs migrations, and builds the frontend. The default environment uses SQLite and database-backed sessions, cache, and queues. If using another database, configure its connection in `.env` before running setup.

Start the development processes:

```bash
composer run dev
```

Alternatively, run the backend and frontend in separate terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Open the application address printed by the backend server. Seed the demo workspace before exploring the invoice and approval screens.

## Demo login

The demo seeder creates this development account:

| Field | Value |
| --- | --- |
| Email | `admin@yopmail.com` |
| Password | `password` |

With `APP_ENV=local`, click **Quick demo login** on the login page to fill both fields, then click **Log in**. The button does not submit the form or bypass password validation. Demo credentials are not supplied to the login page outside the local environment.

Seeders preserve existing records. Re-seeding will not reset an existing user's changed password or overwrite approval decisions. These public demo credentials are intended for a disposable local workspace.

## DeepSeek configuration

Set `DEEPSEEK_API_KEY` in your local `.env` or the deployment environment's secret settings. Keep real keys out of source control and frontend variables.

The text provider defaults to DeepSeek in `config/ai.php`. Optional environment settings are:

```dotenv
AI_DEFAULT_PROVIDER=deepseek
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

After changing environment settings, clear cached configuration:

```bash
php artisan config:clear
```

The demo review workflow and source lookup can run without an API key because they do not currently call an AI provider. Image, audio, embedding, and other provider defaults are configured separately from text generation.

## Verification

Run the PHP test suite:

```bash
php artisan test --compact
```

Run focused authentication and workflow checks:

```bash
php artisan test --compact tests/Feature/Auth
php artisan test --compact tests/Feature/WorkflowTest.php
```

Check TypeScript and build frontend assets:

```bash
npm run build
```

Format changed PHP files:

```bash
php vendor/bin/pint --dirty --format agent
```

## Project layout

- `app/Http/Controllers` — authentication and workflow endpoints.
- `app/Actions` and `app/Data` — approval operations and structured decision input.
- `app/Models` — users, organizations, invoices, accounts, approvals, and knowledge chunks.
- `resources/js/Pages` — Inertia pages.
- `resources/js/Components` — shared UI and workflow components.
- `database/seeders` — repeatable demo workspace setup.
- `config/ai.php` — AI provider configuration.
- `tests/Feature` — authentication, profile, seeding, and workflow regression tests.

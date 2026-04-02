# NovaTask Tracker

Lightweight task tracking for NovaTech Solutions. This prototype uses Next.js with local storage persistence.

## Usage

Run the app locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. Tasks are saved automatically in local storage.

## Features

1. Add tasks with required titles and optional descriptions.
2. Mark tasks as completed or reopen them.
3. Delete tasks when no longer needed.
4. Data persists across refreshes in the same browser.

## Maintenance

Local storage key:
`novatech_tasks_v1` in the browser's local storage.

To reset all tasks:
Clear the `novatech_tasks_v1` key in local storage or clear the site's storage.

To change the UI copy or layout:
Edit `app/page.js`.

To adjust the theme or typography:
Edit `app/globals.css` and `app/layout.js`.

## Build

```bash
npm run build
npm start
```

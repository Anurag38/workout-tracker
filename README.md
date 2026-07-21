# LiftLog

LiftLog is a lightweight, iPhone-first workout tracker that works offline and
keeps its data on the device. It is a static Progressive Web App designed for
GitHub Pages.

## Local development

```bash
pnpm install
pnpm dev
```

Run `pnpm build` to create the static site in `dist/`. Workouts, templates,
and settings are stored in IndexedDB. Use Settings → Data to export a portable
JSON backup.

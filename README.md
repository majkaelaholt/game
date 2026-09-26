# Velvet Hour: After Dark — Arcade Cut

A static cozy RPG/life-sim built for GitHub Pages. No framework, package manager, database, or build command is required.

## Deploy on GitHub Pages

Put these files together in the same folder:

- `index.html`
- `styles.css`
- `game.js`

If your GitHub Pages site deploys from the repository root, replace the current game files there and push/commit. If it deploys from `/docs`, put all three files in `/docs` instead.

The game saves with `localStorage`, so progress stays in the same browser + GitHub Pages domain. This Arcade Cut intentionally keeps the same save key as After Dark, so an existing After Dark save on the same deployed URL should load and gain the new mastery/Flow data automatically.

## What Arcade Cut changes

Every energy/time activity is now playable rather than a passive stat button. The build includes minigames for skincare, reading, gaming, tidying, thrifting, bargain hunting, NPC conversations, arcade play, perfume training, conservatory exploration, Archive research, rare-book hunting, Night Market appraisal, commissions, mysteries, perfume blending, baking, styling, piano, scent deduction, and pets.

Performance produces a 0–100 score and rank. Each activity tracks plays, best score, average score, and up to three mastery stars. Mastery stars permanently improve rewards. Good runs build **Flow**, which further boosts rewards for the current night; Flow resets when the day ends, but mastery does not.

## Files

- `index.html` — page structure
- `styles.css` — visual design + minigame UI
- `game.js` — game state, content, minigames, progression, saving

There are no external dependencies, so the game also works offline once the files are local.

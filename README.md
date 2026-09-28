# Velvet Hour — The House on Nocturne Street

A campaign-first cozy puzzle RPG built as a static site for GitHub Pages.

## What changed in the overhaul

The earlier Velvet Hour builds had a lot of systems, but they were too flat and too available at once. This version is organized around one clear campaign:

1. Restore **The Front Room**
2. Build **The Scent Bar**
3. Open **The Night Kitchen**
4. Solve **The Locked Archive**
5. Host **The Moonlight Opening**

Each chapter:
- introduces one room at a time;
- gives a short objective list with a visible recommended next action;
- uses minigames to advance specific objectives;
- ends in a chapter-finale challenge;
- unlocks the next room, NPC, and keepsake.

There are only four permanent navigation areas: **House, Mission, People, Journal**. Everything else exists inside the house as gameplay rather than as competing app screens.

## Core loop

- Start each night with 3 actions.
- Follow the recommended chapter objective or choose another objective from the same chapter.
- Every action is a mental minigame: sorting, deduction, styling logic, fragrance classification, formula balancing, recipe sequencing, fraction math, costing, pattern recognition, or dialogue reasoning.
- B-rank or better advances most chapter objectives.
- End the night whenever you want; there is no streak or deadline punishment.
- Finish all chapter objectives to unlock the finale.

## GitHub Pages deployment

Upload these files to the same folder in your repository:

- `index.html`
- `styles.css`
- `game.js`

Then enable GitHub Pages for that branch/folder if it is not already enabled. There is no npm install, framework, build step, backend, or external dependency.

## Saves

The new campaign uses localStorage key:

`velvetHouse_nocturne_v1`

This is intentionally separate from the older Arcade/Director's Cut save because the progression model was rebuilt. If an older `velvetHourMak_v2` save exists in the same browser/domain, a small **Legacy Trunk** gift is detected at the beginning, but the old progression is not forced into the new campaign structure.

The in-game menu includes JSON save export/import.

## Testing performed

- JavaScript syntax validation with Node.
- Static validation that every inline click handler points to a defined function.
- Automated logic smoke test that completes all five campaign chapters, every chapter finale, and the Moonlight Opening using correct solutions.
- Browser render tests at desktop and 390px mobile widths with no page errors using an injected Chromium test harness.


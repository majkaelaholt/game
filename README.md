# Velvet Hour: After Dark — Director's Cut

A cozy after-hours life-sim / RPG built as a static web game for GitHub Pages.

## Files
- `index.html` — game shell and screens
- `styles.css` — full UI, map, scenes, responsive layout, minigame themes
- `game.js` — save system, progression, story, minigames, night builds, world logic

## Deploy on GitHub Pages
1. Back up/export your current Velvet Hour save if you want an extra safety copy.
2. Replace the old game files in your GitHub Pages repo with the files in this folder.
3. Commit and push.
4. If Pages uses the repository root, make sure `index.html` is at the root. If Pages uses `/docs`, put all three files in `/docs` instead.
5. Open the same GitHub Pages URL and hard-refresh if the old CSS is cached.

The game keeps the existing `velvetHourMak_v2` localStorage save key, so deploying this over the Arcade Cut at the same domain/path should preserve the current save in that browser.

## Director's Cut additions
- One navigation system: left game rail on desktop, bottom dock + More drawer on mobile
- RPG-style HUD with level/XP, time blocks, resources, Flow, and Vibe
- Scene art and distinct screen identities instead of one repeated dashboard look
- Visual Velvet City overworld with unlockable district nodes
- Themed minigame rooms (perfume, skincare, archive, arcade, baking, shopping, social, pets)
- Unique room stages for Studio, Style, Apartment, People, Progress, and Calendar
- Night Intent builds with temporary bonuses
- End-of-night results screen and rank
- Quest progress bars, richer rarity styling, animated results, and improved mobile layout

## No build tools required
There is no npm, framework, backend, API key, or dependency. GitHub Pages can serve these files directly.

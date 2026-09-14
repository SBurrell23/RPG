# THE VERROW

A first-person dungeon RPG with **no combat in it anywhere**. You walk, you talk, and you
choose. Ten floors, ten Wards, three heartbeats of grace.

Built in vanilla JavaScript on three.js. **There are no asset files in this repository** —
every surface texture and its normal map is generated pixel by pixel at load, every figure,
prop and room is assembled from primitives, and every sound (the drones, the thunder, the
footsteps, the voices) is synthesised in the Web Audio graph as you hear it.

---

## The premise

Two hundred years ago the world began to forget itself. Names peeled off things first. Then
roads forgot where they went. Then people forgot the faces of people they loved, and then
that there had been a face at all. They call it the Thinning.

In the salt flats of Caudmere there is a black hexagonal plinth the size of a cathedral, and
beneath it, driven point-down into the earth, a tower called the Verrow. It was once the
**Cadence**: an engine-cathedral that measured and circulated the world's remembering the
way a heart circulates blood. Ten floors. Ten functions. Ten Wards. Then it stopped.

Once a generation the plinth opens and one person may go down. You are that person. You are
told three things and then the salt closes over you:

1. There are ten floors. The tenth holds the Cadence itself.
2. You have three heartbeats of grace.
3. Nothing in the Verrow will lie to you. This is not a kindness.

## How it plays

Every floor is a hand-authored branching story laid out as a real dungeon. From the entry
room the paths fan out two or three ways, fork again, and eventually funnel back to a single
stair down. Talking to someone opens doors, closes others, gives you items, takes your gold,
or costs you a heartbeat.

- **Dead ends** cost you a heart and put you somewhere else. Every one of them is telegraphed
  by somebody, somewhere, earlier on the floor — if you were listening.
- **Ward Tokens** are earned by finishing a floor by its hardest and most demanding route,
  which always costs something real. There are ten. What they are for becomes clear at the
  bottom.
- **Five Petitioner classes** — Warden, Ashcaller, Coinwright, Hollow Saint, Cartographer —
  each open doors the others cannot, and each hear things the others do not. Every floor is
  finishable by any class, but not by the same route.
- **Four endings**, plus the one the tower gives you if you run out of heartbeats.

Nothing is procedural. The same story always builds the same tower.

### Controls

| | |
|---|---|
| `W` `A` `S` `D` | move |
| Mouse | look (click to capture the pointer) |
| `Shift` | hurry |
| `E` | speak to whoever you are standing in front of |
| `Tab` | satchel, codex and character sheet |
| `Esc` | pause |
| `F3` | performance overlay |
| `1`–`9` | pick a dialogue option by number |

## Running it

No build step, no dependencies to install. It needs to be served over HTTP (ES modules do
not load from `file://`):

```bash
node tools/serve.mjs
```

Then open <http://localhost:5173>. The branch maps are at
<http://localhost:5173/debug.html>.

To check every floor file against the schema:

```bash
node tools/validate.mjs
```

## What's in here

```
index.html            the game
debug.html            branch maps — a real floor plan of every level
styles.css            all interface styling
src/
  main.js             game controller: floor loading, rooms, interaction, progression
  engine/
    renderer.js       render pipeline — MSAA on the composer target, bloom, ACES output
    textures.js       procedural albedo + normal + roughness generation
    audio.js          every sound in the game, synthesised
    player.js         pointer-lock look, collide-and-slide movement, view bob, footsteps
    settings.js       persisted settings and the schema the menu is generated from
  world/
    layout.js         solves an authored room graph into a floor plan (A* corridor routing)
    builder.js        room shells, doorways, corridors, doors, lighting rig, collision
    props.js          30 set-piece builders
    npc.js            12 procedural body forms
    materials.js      themed material factory
  game/
    state.js          the run: hearts, gold, items, flags, codex, save/load
    effects.js        the effect interpreter story choices drive
  ui/                 hud, dialogue, panels, title screen, icons
  data/
    floors/           floor1.js … floor10.js — the story
    themes.js         per-floor palette, lighting plan and atmosphere
    items.js          global item catalogue
    classes.js        the five Petitioners
    endings.js        the bottom of the tower
tools/
  validate.mjs        schema, graph, vocabulary and soft-lock validation
  serve.mjs           zero-dependency static server
docs/
  STORY_SPEC.md       the lore bible and the data contract every floor obeys
vendor/three/         three.js r170 and the four post-processing passes it uses
```

### The layout solver

Story files declare rooms and which rooms they connect to. They never declare coordinates.
`src/world/layout.js` assigns each room a cell in a layered grid — column is distance from
the entry, row is ordered by barycentre to minimise crossings — then routes every connection
as a corridor using A\* over a coarse grid where room cells are solid and the gaps between
them are open lanes. Corridors therefore cannot pass through rooms, and every connection gets
its own doorway where one is available. The validator asserts both.

### The lighting

Each floor has a `lightPlan` (sconce, pendant, floor, volume or none), a fog colour and
density, an ambient and hemisphere pair, a cool bounce fill so shadows are not pure black,
and its own bloom threshold. Lights are budgeted at runtime: only rooms adjacent to the one
you are standing in are lit at all, and of those the nearest N get shadow maps, where N comes
from the graphics settings. Point light intensities are in candela — three.js has used
physical units since r155 — and are scaled from the themes' perceptual numbers by a single
constant in `builder.js`.

### Storage on a shared origin

Every GitHub Pages project site belonging to one account is served from the same
origin, so every game deployed under `<user>.github.io` shares a single
`localStorage` bucket. `src/engine/storage.js` is the only module that touches it:

- every key is prefixed `verrow:`, so a neighbouring game's `save` or `settings`
  cannot collide with ours;
- nothing outside that prefix is ever read, written, enumerated or removed — there
  is deliberately no "clear everything" path, since on a shared origin that would
  destroy another game's data;
- everything read back is treated as untrusted. Settings values are validated
  against the schema (wrong type → default, out of range → clamped, unknown option
  → default) and saves are structurally checked before use, so a half-written value
  or a same-named key from another app degrades to defaults instead of breaking the
  title screen;
- storage being unavailable or full (private window, blocked site data, another
  game having exhausted the quota) is handled — the game runs unsaved.

Keys from the pre-namespace build are migrated automatically on first load.

## Content

171 rooms, 115 speaking characters, ~43,000 words of dialogue, 10 floor themes,
30 prop builders, 12 NPC body forms, 17 procedural surface types and 27 synthesised sounds.

## Licence

MIT.

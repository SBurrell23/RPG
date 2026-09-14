# THE VERROW — Story Data Specification

This document is the contract every floor file must satisfy. It is both the lore bible and
the technical schema. Read all of it before writing a floor.

---

## PART 1 — THE LORE BIBLE

### The world

The world is **Caudmere**, a continent of salt flats, drowned cities and slow weather.
Two hundred years ago the world began to **forget itself** — not metaphorically. Names
peeled off things first. Then roads forgot where they went. Then people forgot the faces
of people they loved, and then that there had been a face at all. Whole provinces have
gone *quiet* — still inhabited, but by people who can no longer say what they are doing or
why, and who do not find this strange.

The forgetting is called **the Thinning**.

### The Verrow

The Verrow is a tower driven **point-down** into the Caudmere salt. Only its base shows
above ground — a black hexagonal plinth the size of a cathedral. Everything else is below.

It was once **the Cadence**: an engine-cathedral that measured, stored and rationed the
world's remembering. The Cadence did not create memory; it *circulated* it, the way a
heart circulates blood. Ten floors, ten functions, ten Wards. Then, two hundred years ago,
the Cadence **broke** — or stopped — or chose to stop. Nobody above ground knows which.

When it stopped, the tower sealed itself. Each of its ten floors locked behind a **Ward**,
and each Ward is not a lock but a **question**. A Ward opens for whoever answers it — not
correctly, there is no correct, but *completely*. The tower wants to know what you are.

### The Petitioner

You are a **Petitioner**. Once a generation the plinth opens and one person may go down.
Petitioners go down. Petitioners do not come back. You are told, at the mouth, three things:

1. There are ten floors. The tenth holds the Cadence itself.
2. You have three heartbeats of grace. (Mechanically: three hearts. Lose all three and the
   tower keeps you.)
3. Nothing in the Verrow will lie to you. This is not a kindness. A thing that cannot lie
   can still be *wrong*, and can still tell you a true thing for a reason of its own.

### The residents

Nothing in the Verrow is a monster and **there is no combat in this game, ever**. The
residents are what happens to a person, a machine, or an idea when it is kept somewhere
that remembers perfectly for two hundred years. They are:

- **The Kept** — people who came down as Petitioners and stopped. They are not dead. They
  have simply been *filed*. Many of them are excellent conversationalists.
- **Functions** — the Cadence's own organs, wearing bodies because bodies are a convenient
  interface. A door-opening subroutine that has had two centuries alone becomes a
  personality, and usually a strange one.
- **Residue** — memories that got loose. They drift, they repeat, they want to be witnessed.
  Some of them are hungry in a way that has nothing to do with eating.
- **The Salt-Born** — things the Caudmere salt grew on its own in the dark, using the
  tower's leaked memory as a pattern. They are the only residents that were never anything
  else, and they are *proud of it*.

### The Ward Tokens

Each floor, completed by its deepest and most demanding branch, yields a **Ward Token** —
a hexagonal chit of black glass with one word fired into it. Ten Tokens exist. The tokens
are the tower's way of noting that you answered a Ward *completely* rather than merely
getting past it. Carrying all ten opens the third ending on floor ten.

Every floor is completable without its Token. The Token is the reward for the hard road.

### Tone

High fantasy, but dry, strange, and specific. The residents are funny in a bone-deep,
matter-of-fact way, and then abruptly not funny. Avoid: grandiose villain monologues,
"chosen one" flattery, modern slang, quest-marker speech ("Bring me 5 rat tails"). Prefer:
concrete sensory detail, characters with small fixations, bargains with real costs,
information that turns out to matter three rooms later.

Nobody explains the plot at you. The plot is assembled by the player out of overheard,
offered, and purchased fragments.

### The floors

| # | Name | Theme key | Ward question | Feel |
|---|------|-----------|---------------|------|
| 1 | The Salt Vestibule | `salt` | *What did you bring?* | Pale crystalline halls, brine pools, wind. Teaching floor. |
| 2 | The Kennels of Unmade Things | `warren` | *What will you feed?* | Low hot fur-and-bone warrens, amber light, things breathing in the dark. |
| 3 | The Sunken Archive | `archive` | *What will you read?* | Flooded library, green underwater light, drifting pages, drowned librarians. |
| 4 | The Foundry of Small Gods | `foundry` | *What will you make?* | Molten forge, chains, half-cooled deities on racks, orange and iron. |
| 5 | The Garden Under Glass | `garden` | *What will you let grow?* | Bioluminescent overgrowth under cracked glass, violet and teal, spores. |
| 6 | The Clockmarch | `clockwork` | *What will you keep on time?* | Brass gear-halls, cold white light, rooms that rotate, punctual residents. |
| 7 | The Choir of Thin Walls | `choir` | *What will you say aloud?* | Paper and mirror halls, pale blue, everything echoes, walls listen. |
| 8 | The Ossuary Court | `ossuary` | *Who will you owe?* | Bone cathedral, a court of dead nobles still holding session, purple and bonewhite. |
| 9 | The Storm Ledger | `storm` | *What will you pay?* | Open sky impossibly underground, rain, lightning, a ledger nobody balances. |
| 10 | The Cadence | `cadence` | *Will you be remembered, or will you remember?* | The reading room. Gold and void. The Chair. The Lamp. |

### The five Petitioner classes

Choices may gate on class. Use class gates **sparingly and rewardingly** — roughly one to
three class-gated choices per floor, spread across different classes, never gating the only
path forward.

| id | Name | Fantasy | Gate flavor |
|----|------|---------|-------------|
| `warden` | **Warden** | Oathbound soldier of a dissolved order. Bears the Iron Pact signet. | Can invoke an oath, stand surety, refuse to move, intimidate without violence. |
| `ashcaller` | **Ashcaller** | Reads and burns. Carries the Emberglass Lens. | Can read dead script, ignite, see heat and residue, speak to fire. |
| `coinwright` | **Coinwright** | Debt-mage and locksmith. Starts richer; owns the Skeleton Sigil. | Can appraise, pick, forge a receipt, spot a swindle, name a true price. |
| `hollow-saint` | **Hollow Saint** | Priest of a god that already forgot them. Carries the Empty Reliquary. | Can bless, hear the dead, take on another's pain, refuse a blessing. |
| `cartographer` | **Cartographer** | Maps places that aren't. Carries the Blind Astrolabe. | Can find the true shape of a room, recall a route, know where a door goes. |

---

## PART 2 — THE TECHNICAL SCHEMA

### File shape

One file per floor: `src/data/floors/floorN.js`, ES module, single default export.

```js
export default {
  id: 3,
  name: "The Sunken Archive",
  theme: "archive",
  subtitle: "Ward the Third — What will you read?",
  intro: "Two or three sentences shown on the floor title card as the player arrives.",
  entry: "f3_entry",
  items: { /* floor-local item definitions, see Items */ },
  rooms: [ /* Room objects */ ]
};
```

Every id in a floor **must** be prefixed `fN_` (e.g. `f3_entry`, `f3_west_gallery`) so ids
are globally unique across floors. Flags must be prefixed too (`f3_burned_index`).
Item ids are global and **not** prefixed (`brass_key`, `drowned_lantern`).

### Room

```js
{
  id: "f3_gallery",
  name: "The West Gallery",           // shown on the HUD when entered
  kind: "hub",                        // see Room kinds
  size: "large",                      // tiny|small|medium|large|grand|hall|vault
  desc: "One sentence of narration shown as a subtitle when first entered.",
  props: ["shelves", "water", "pillars"],   // 0-4 entries from the Prop vocabulary
  onEnter: [ /* Effects, fired once, the first time the player enters */ ],
  onEnterAlways: [ /* Effects, fired every time the player enters */ ],
  npc: { /* NPC or omit */ },
  doors: [
    { to: "f3_stair", locked: true, label: "The Brass Grate" },
    { to: "f3_entry" }                // unlocked, auto-labelled
  ]
}
```

- **`doors`** define the physical graph. A door is drawn between the two rooms and the
  corridor is built automatically. Doors are **undirected for geometry** but the `locked`
  flag lives on the authored side; declare each connection **once**, from whichever room
  the player reaches first. Do not declare the reverse.
- A door with `locked: true` cannot be walked through until an effect unlocks it.
- Every room except `entry` must be reachable through `doors` from the entry room. A room
  reachable only by teleport still needs at least one door edge for layout — give it a
  `locked: true` door that is never unlocked if you want it teleport-only.
- `secret: true` on a door hides it entirely (no visible frame) until unlocked.

**Room kinds** (affects lighting accents, HUD icon and debug colouring):
`entry`, `hub`, `branch`, `deadend`, `shrine`, `shop`, `vault`, `exit`, `corridor`.

**Sizes** → interior footprint: `tiny` 8×8, `small` 12×12, `medium` 17×17, `large` 24×24,
`grand` 34×34, `hall` 30×14 (long axis), `vault` 17×17 with a doubled ceiling.

### NPC

```js
npc: {
  id: "f3_quilla",
  name: "Quilla",
  title: "the Unfinished Sentence",   // shown under the name
  form: "robed",                      // see Form vocabulary
  palette: { robe:"#26384c", trim:"#7fd8cb", skin:"#d9c5a8", glow:"#6fe8d4" },
  voice: "low",                       // low|mid|high|dry|bell|choral|broken — drives the speech blip synth
  greet: [
    "First page of dialogue shown when you talk to them.",
    "Second page. Keep pages to 1-3 sentences; the player clicks through."
  ],
  idle: [ "Said when you talk again with nothing left to choose." ],
  choices: [ /* Choice objects */ ]
}
```

`form` vocabulary: `robed`, `hunched`, `tall`, `floating`, `armored`, `beast`, `child`,
`construct`, `wisp`, `twin`, `winged`, `coiled`.

`palette` keys are all optional; supply at least `robe` and `glow`.

### Choice

```js
{
  id: "f3_c_burn",
  text: "Burn the index.",                     // the button label, imperative, <= 60 chars
  require: {                                    // all fields optional; ALL must pass
    class: ["ashcaller", "warden"],             // any-of
    items: ["emberglass_lens"],                 // all-of, player must hold each
    gold: 20,                                   // player must have at least this much
    flags: ["f3_saw_the_stacks"],               // all-of must be set
    notFlags: ["f3_burned_index"],              // none-of may be set
    minHearts: 2
  },
  lockedText: "(You would need a flame that remembers.)",  // greyed-out label when
                                                // require fails. OMIT to hide the choice
                                                // entirely instead.
  once: true,                                   // default true; false = repeatable
  reply: [ "What the NPC says afterwards.", "Another page." ],
  effects: [ /* Effects */ ]
}
```

Order choices from safest to most consequential. **Always** leave the player at least one
choice that does not require anything, in every conversation, or they can be softlocked.

### Effects

| Effect | Meaning |
|---|---|
| `{ t:"unlock", to:"f3_stair" }` | Unlock every door leading to that room. |
| `{ t:"lock", to:"f3_gallery" }` | Re-lock every door leading to that room. |
| `{ t:"item", id:"brass_key", n:1 }` | Give (positive `n`) or take (negative) an item. |
| `{ t:"gold", n:-15 }` | Add or subtract gold. Never let gold go below 0 — gate with `require.gold`. |
| `{ t:"heart", n:-1 }` | Lose (or with positive `n`, restore, capped at 3) a heart. |
| `{ t:"flag", id:"f3_burned_index", v:true }` | Set/clear a story flag. `v` defaults true. |
| `{ t:"move", to:"f3_hub" }` | Teleport the player to the centre of that room. |
| `{ t:"say", text:"The water goes still." }` | Narration toast, italic, centre screen. |
| `{ t:"sound", id:"chime" }` | One of: `chime`, `stone`, `bell`, `crack`, `water`, `fire`, `gear`, `whisper`, `coin`, `heartloss`, `unlock`, `wrong`. |
| `{ t:"shop", stock:[{item:"rope",price:12}], buys:[{item:"salt_shard",price:20}] }` | Open the trade panel. |
| `{ t:"floorEnd", token:true }` | Complete the floor. `token:true` awards the Ward Token. |
| `{ t:"ending", id:"chair" }` | **Floor 10 only.** |
| `{ t:"codex", id:"f3_thinning", title:"On the Thinning", text:"..." }` | Add a lore entry to the codex. |

Effects run in array order.

### Items

Global item catalogue lives in `src/data/items.js`. Floors may declare their own in the
floor file's `items` map; these are merged at load. Shape:

```js
items: {
  drowned_lantern: {
    name: "Drowned Lantern",
    kind: "relic",               // key|relic|tool|trade|consumable|token
    desc: "Still lit. The flame is on the inside of the glass.",
    value: 40,                   // base gold value for shops
    icon: "lantern",             // see Icon vocabulary
    tint: "#7fd8cb"
  }
}
```

Icon vocabulary: `key`, `lantern`, `book`, `coin`, `gem`, `bone`, `blade`, `cup`, `ring`,
`scroll`, `seed`, `gear`, `mask`, `bell`, `feather`, `vial`, `eye`, `hex`, `thread`, `star`.

### Prop vocabulary

Use only these. 0–4 per room.

`pillars` `brazier` `water` `rubble` `shelves` `statue` `altar` `chains` `gears` `banners`
`crystals` `roots` `bones` `cages` `forge` `mirrors` `table` `well` `throne` `stairs`
`sarcophagi` `pipes` `spores` `rain` `candles` `bookstacks` `hanginglights` `glass`
`sand` `machine`

---

## PART 3 — FLOOR STRUCTURE RULES

These are hard requirements. A floor that breaks them will fail validation.

1. **Size.** 14–20 rooms per floor. At least 7 of them have an NPC.
2. **One entry.** `entry` room, `kind:"entry"`, holds the floor's first NPC. That NPC's
   choices are the first fork.
3. **Branch and re-converge.** From the entry the graph fans out — 2 or 3 ways at the first
   fork, each of which forks again — and then all live paths funnel back to a single
   `kind:"exit"` room. It is a wide diamond, not a tree with many leaves.
4. **The Ward Token path.** Exactly one route through the floor is the "complete" answer to
   the Ward. Reaching the exit by that route calls `{t:"floorEnd", token:true}`. Every other
   live route calls `{t:"floorEnd"}` with no token. The token route should require either
   a real sacrifice (gold, an item, a heart) or a piece of knowledge found on a side branch.
5. **Dead ends.** 2–4 per floor, `kind:"deadend"`. A dead end must never be a soft-lock. On
   entry (or via the NPC there) it costs the player **one heart** and then either teleports
   them back to a live room, or unlocks a door onward — pick per dead end, vary it.
   Telegraph dead ends: an earlier NPC should have given the player a way to know.
6. **Economy.** A floor should net the player roughly +30 to +70 gold if they explore, and
   offer at least one thing worth more than they can afford, so gold carries forward.
   Include at least one `shop` NPC per floor from floor 2 onward.
7. **Continuity.** Floors may reference earlier floors' flags in `require.flags` — this is
   encouraged for floor 5+ — but **must remain completable if those flags are unset.**
   Never require a flag from another floor on the only path forward.
8. **Carried items.** Anything you hand the player can come with them. Items from floors 1–9
   that floor 10 checks for are listed at the bottom of this document; if your floor is one
   of the ones listed as the source, you must actually grant that item on some route.
9. **Voice.** Each NPC needs one fixation, one verbal tic, and one thing they will not
   discuss. Write them as people, not signposts.
10. **Length.** Aim for 1,500–3,000 words of actual dialogue per floor. This is a talking
    game; the words are the content.

### Cross-floor item contracts

These items must be obtainable on the given floor (on some branch, not necessarily the
token branch). Floor 10 checks for them.

| Floor | Item id | Name |
|---|---|---|
| 1 | `salt_shard` | Vestibule Salt Shard |
| 2 | `unmade_collar` | Collar of the Unmade |
| 3 | `drowned_page` | Page From the Drowned Index |
| 4 | `cooling_godling` | A Godling, Cooling |
| 5 | `glass_seed` | Seed Under Glass |
| 6 | `stopped_tooth` | A Tooth From a Stopped Gear |
| 7 | `held_note` | A Note, Still Held |
| 8 | `owed_favor` | A Favour, Written Down |
| 9 | `storm_receipt` | Receipt For One Storm |

And each floor's token item id is `ward_token_N` (e.g. `ward_token_3`) — the engine grants
this automatically on `{t:"floorEnd", token:true}`, so do **not** grant it yourself.

---

## PART 4 — WORKED EXAMPLE

A miniature floor (too small to pass validation, but structurally correct in every way):

```js
export default {
  id: 99,
  name: "The Example Landing",
  theme: "salt",
  subtitle: "Ward the Ninety-Ninth — Does this compile?",
  intro: "A short stone landing that exists only to demonstrate a schema.",
  entry: "f99_entry",
  items: {
    chalk_stub: {
      name: "Stub of Chalk", kind: "tool", value: 6, icon: "seed", tint: "#e8e2d0",
      desc: "Worn to a nub. Someone was counting something."
    }
  },
  rooms: [
    {
      id: "f99_entry",
      name: "The Landing",
      kind: "entry",
      size: "medium",
      desc: "Salt has grown over the doorframe like frost that decided to stay.",
      props: ["brazier", "sand"],
      npc: {
        id: "f99_marrow", name: "Marrow", title: "the Doorkeeper",
        form: "hunched", voice: "dry",
        palette: { robe: "#3a3630", trim: "#c9b27a", glow: "#ffb46b" },
        greet: [
          "Marrow does not look up. \"Two doors. One of them is honest.\"",
          "\"I won't tell you which. I'll tell you what it costs to ask.\""
        ],
        idle: [ "\"Still here. Still two doors.\"" ],
        choices: [
          {
            id: "f99_c_pay",
            text: "Pay to ask which door is honest.",
            require: { gold: 10 },
            lockedText: "(Ten gold. You do not have ten gold.)",
            reply: [ "\"The left one. It's honest about being a mistake.\"" ],
            effects: [
              { t: "gold", n: -10 },
              { t: "flag", id: "f99_knows" },
              { t: "unlock", to: "f99_right" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f99_c_oath",
            text: "Swear the Iron Pact on the threshold.",
            require: { class: ["warden"] },
            reply: [ "Marrow finally looks up. \"...That order's dissolved.\" A pause. \"Left.\"" ],
            effects: [
              { t: "flag", id: "f99_knows" },
              { t: "unlock", to: "f99_right" },
              { t: "item", id: "chalk_stub", n: 1 }
            ]
          },
          {
            id: "f99_c_leave",
            text: "Say nothing and try a door.",
            reply: [ "\"Mm.\"" ],
            effects: [ { t: "unlock", to: "f99_left" } ]
          }
        ]
      },
      doors: [
        { to: "f99_left", locked: true, label: "The Left Door" },
        { to: "f99_right", locked: true, label: "The Right Door" }
      ]
    },
    {
      id: "f99_left",
      name: "The Honest Mistake",
      kind: "deadend",
      size: "small",
      desc: "The room ends. It has the decency to end quickly.",
      props: ["rubble"],
      onEnter: [
        { t: "say", text: "Salt closes over the door behind you, and something takes its tithe." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "move", to: "f99_entry" },
        { t: "unlock", to: "f99_right" }
      ],
      doors: []
    },
    {
      id: "f99_right",
      name: "The Stair",
      kind: "exit",
      size: "small",
      desc: "Steps, going down, which here means up.",
      props: ["stairs"],
      npc: {
        id: "f99_stair", name: "The Stair", title: "", form: "wisp", voice: "bell",
        palette: { robe: "#1d2a33", glow: "#9fe4ff" },
        greet: [ "The stair is waiting. It has been waiting." ],
        idle: [ "It is still waiting." ],
        choices: [
          {
            id: "f99_c_desc_token",
            text: "Descend, carrying the chalk.",
            require: { items: ["chalk_stub"] },
            reply: [ "The chalk goes soft and warm, and is gone." ],
            effects: [ { t: "item", id: "chalk_stub", n: -1 }, { t: "floorEnd", token: true } ]
          },
          {
            id: "f99_c_desc",
            text: "Descend.",
            reply: [ "You descend." ],
            effects: [ { t: "floorEnd" } ]
          }
        ]
      },
      doors: []
    }
  ]
};
```

---

## PART 5 — CHECKLIST BEFORE YOU SUBMIT

- [ ] 14–20 rooms, 7+ with NPCs.
- [ ] Every id prefixed `fN_`; item ids unprefixed and lowercase_snake.
- [ ] Every room reachable from `entry` via `doors` (treat doors as undirected).
- [ ] Each connection declared exactly **once** (no reverse duplicates).
- [ ] Exactly one `kind:"exit"` room; exactly one route calls `floorEnd` with `token:true`.
- [ ] 2–4 dead ends, each costing a heart and each providing an escape.
- [ ] Every conversation has at least one choice with no `require`.
- [ ] Every `require.items` / `require.gold` choice has a `lockedText` or is intentionally hidden.
- [ ] Every item referenced by `{t:"item"}` exists in the global catalogue or the floor's `items`.
- [ ] Every `unlock`/`lock`/`move` target is a real room id in this floor.
- [ ] The cross-floor contract item for this floor is obtainable.
- [ ] 1,500–3,000 words of dialogue. No combat. Nobody lies.

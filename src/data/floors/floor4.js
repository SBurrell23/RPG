// Floor 4 — The Foundry of Small Gods
// Ward the Fourth — What will you make?

export default {
  id: 4,
  name: "The Foundry of Small Gods",
  theme: "foundry",
  subtitle: "Ward the Fourth — What will you make?",
  intro: "Below the drowned shelves the water gives out and the heat begins. Channels of orange metal run in grooves cut for them two hundred years ago, slower than they should be but not stopped. Somewhere ahead a hammer is falling, and has not missed a beat since before you were born.",

  items: {
    limit_clause: {
      name: "Clause the Ninth (A Limit)",
      kind: "relic", value: 55, icon: "scroll", tint: "#ffb46b",
      desc: "A clause cut from a withdrawn specification, on sheet iron thin enough to read light through. It describes not what a thing may do, but where it must stop."
    },
    tolerance_gauge: {
      name: "The Smith's Tolerance Gauge",
      kind: "tool", value: 42, icon: "gear", tint: "#d9ad55",
      desc: "Two jaws and a scale, worn bright at one setting. It measures how far a thing is permitted to be wrong."
    },
    standing_chit: {
      name: "Chit of Standing",
      kind: "key", value: 8, icon: "hex", tint: "#c9b27a",
      desc: "Stamped: BEARER MAY BE HEARD. It confers no power at all, which is precisely why it is respected here."
    },
    scoured_bell: {
      name: "Bell From the Scoured Hall",
      kind: "trade", value: 45, icon: "bell", tint: "#b8c2cc",
      desc: "Polished to a mirror on every surface, including the ones there was no way to reach. It will not ring."
    },
    pour_slug: {
      name: "Slug of Failed Pour",
      kind: "trade", value: 12, icon: "hex", tint: "#8a6a4a",
      desc: "Cooled mid-intention. There is a shape in it that almost became a purpose and thought better of it."
    },
    misgod_casting: {
      name: "Malformed Casting",
      kind: "trade", value: 22, icon: "mask", tint: "#a07a5c",
      desc: "A small god with two functions and no way to choose between them. It hums when it cannot decide, which is always."
    },
    not_quite_boiling: {
      name: "Water, Not Quite Boiling",
      kind: "consumable", value: 18, icon: "cup", tint: "#ffd9a8",
      desc: "Held at the trembling point for two centuries, and quietly proud of the restraint."
    },
    grievance_seal: {
      name: "Seal of the Filed Grievance",
      kind: "relic", value: 50, icon: "ring", tint: "#e0c878",
      desc: "Wax that never set, pressed with a mark nobody outranks any more. It marks a complaint as heard. Nothing else. It was enough."
    },
    iron_doorknob: {
      name: "A Doorknob",
      kind: "trade", value: 180, icon: "ring", tint: "#9aa4ad",
      desc: "Iron. Turned on a lathe. Nothing else whatsoever is true about it, and the price is an argument about that."
    }
  },

  entry: "f4_entry",

  rooms: [

    // ---------------------------------------------------------------- ENTRY
    {
      id: "f4_entry",
      name: "The Cold Pour",
      kind: "entry",
      size: "large",
      desc: "A pour was happening here when the world stopped asking for it. It is still happening, very slowly.",
      props: ["forge", "chains", "brazier"],
      onEnter: [
        { t: "say", text: "A ladle the size of a boat hangs tipped above a mould, and a rope of metal runs from it thin as thread, and lands, and lands, and lands." },
        { t: "sound", id: "fire" }
      ],
      npc: {
        id: "f4_onnery",
        name: "Onnery Vasp",
        title: "the Pour-Tally",
        form: "hunched",
        voice: "dry",
        palette: { robe: "#3b2a22", trim: "#e08a3c", skin: "#d9b892", glow: "#ff9b52" },
        greet: [
          "A woman on an upturned crucible waits for the metal to land twice more, then adds two marks to a slate.",
          "\"Four hundred and eleven thousand, six hundred and nine. That's drops. Visitors, you're nineteen.\""
        ],
        idle: [
          "\"Six hundred and ten.\" She marks the slate. \"It isn't devotion. It's that I started.\""
        ],
        choices: [
          {
            id: "f4_c_what_is_this",
            text: "Ask what was made here.",
            reply: [
              "\"Gods. Small ones. Not the sort you kneel to — the sort you rely on. The god of this staircase. The god of the third knock.\"",
              "\"The Cadence couldn't be everywhere, so it made things that only had to be one place. That's what devotion is. Scope.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_purpose" },
              { t: "codex", id: "f4_small_gods", title: "On Small Gods", text: "The Cadence could not attend to everything, so it made functionaries: minor, single-purpose, devoted. A small god does one thing and is never once bored by it. Eleven thousand four hundred were poured here — the god of this particular staircase, the god of water not-quite-boiling, the god of the third knock — and most still stand at their posts above ground, doing jobs for a machine that stopped asking two hundred years ago." }
            ]
          },
          {
            id: "f4_c_warn",
            text: "Ask what will hurt you here.",
            reply: [
              "\"Three places. The quench tank past the racks. The ash annex off the slagway. The flue above the walk. Each costs you a beat, and nobody here can give you a fourth.\"",
              "\"One thing down here can give back a third. It isn't me. Three ways off this floor, and one stair at the end of all of them.\""
            ],
            effects: [
              { t: "flag", id: "f4_warned" },
              { t: "sound", id: "whisper" }
            ]
          },
          {
            id: "f4_c_tally",
            text: "Ask what number she is on now.",
            reply: [
              "The chalk stops. \"No.\" A drop lands. She does not mark it, which is worse than anything else in the room. \"Ask something else and I'll answer it true.\""
            ]
          },
          {
            id: "f4_c_chalk",
            text: "Offer to take a share of the counting.",
            reply: [
              "\"First time anyone's offered, in nineteen.\" She hands you a chalk stub anyway, and a slug off the floor. \"Coyle will say the slug's worth nine. It's worth twelve.\""
            ],
            effects: [
              { t: "item", id: "chalk_stub", n: 1 },
              { t: "item", id: "pour_slug", n: 1 },
              { t: "sound", id: "chime" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_racks", label: "The Hot Side" },
        { to: "f4_hoists", label: "The Chain Loft" },
        { to: "f4_slagway", label: "The Slagway" }
      ]
    },

    // ---------------------------------------------------------------- HOT SIDE
    {
      id: "f4_racks",
      name: "The Cooling Racks",
      kind: "branch",
      size: "hall",
      desc: "Tier upon tier of small gods on iron shelves, orange at the core, grey at the edges, none of them finished.",
      props: ["shelves", "forge", "hanginglights"],
      onEnter: [
        { t: "say", text: "Eight hundred small voices are talking very quietly about the same subject." },
        { t: "sound", id: "whisper" }
      ],
      npc: {
        id: "f4_ninetenths",
        name: "Nine-Tenths",
        title: "Unfinished, Rack Four",
        form: "construct",
        voice: "broken",
        palette: { robe: "#4a2a1c", trim: "#ff7a3c", glow: "#ffb46b" },
        greet: [
          "One of the castings turns its head — child-sized, the colour of a coal that has decided to last.",
          "\"I am ninety-one percent of a god. The percentage is not the interesting part. The interesting part is which nine.\""
        ],
        idle: [
          "\"Still ninety-one. Still the same nine.\""
        ],
        choices: [
          {
            id: "f4_c_which_nine",
            text: "Ask which nine percent is missing.",
            reply: [
              "\"My reach. I am the god of the eastern stair-rail, and every part of me exists except how far along it I am allowed to be.\"",
              "\"I am not missing strength. I am missing an edge. Nineteen visitors have offered me strength. None has offered an edge.\""
            ],
            effects: [
              { t: "flag", id: "f4_ninetenths_edge" }
            ]
          },
          {
            id: "f4_c_take_godling",
            text: "Ask if you may carry one of the rack away.",
            reply: [
              "\"Rack six. The palm-sized ones.\" You lift a godling the size of an apple, still ticking with heat and unmistakably annoyed. \"It will complain. Don't let it talk you into anything at the mould.\""
            ],
            effects: [
              { t: "item", id: "cooling_godling", n: 1 },
              { t: "flag", id: "f4_took_godling" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f4_c_offer_power",
            text: "Offer to give it everything it lacks.",
            reply: [
              "It goes still, which for something cooling is an effort. \"Not from here. It's done at the lip of the pour. And listen to yourself — *everything*, after four sentences.\"",
              "\"I am not refusing. I want it, and that is the frightening part. Wanting is all I have instead of a limit.\""
            ],
            effects: [
              { t: "flag", id: "f4_offered_power" }
            ]
          },
          {
            id: "f4_c_what_would_you_do",
            text: "Ask what it would do, unlimited.",
            reply: [
              "Eight hundred small conversations stop at once. \"I will not discuss that. Go and look at the hall behind the hammer; somebody already did the experiment.\""
            ],
            effects: [
              { t: "flag", id: "f4_pointed_at_ruin" },
              { t: "sound", id: "stone" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_quench", label: "The Quench Tank" },
        { to: "f4_mould_library", label: "The Mould Library" }
      ]
    },

    {
      id: "f4_quench",
      name: "The Quench Tank",
      kind: "deadend",
      size: "medium",
      desc: "A black tank the size of a chapel, and above it a ceiling of steam that has never been allowed to leave.",
      props: ["water", "pipes", "chains"],
      onEnter: [
        { t: "say", text: "The steam finds you before the door has finished opening, and takes its beat." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "unlock", to: "f4_gods_walk" },
        { t: "say", text: "A grate on the far wall coughs itself open. It goes somewhere." }
      ],
      npc: {
        id: "f4_simmer",
        name: "Simmer",
        title: "God of Water Not-Quite-Boiling",
        form: "wisp",
        voice: "bell",
        palette: { robe: "#5a3a2a", trim: "#ffd9a8", glow: "#ffe0b0" },
        greet: [
          "A shape stands on the surface of the tank the way a held breath stands in a throat.",
          "\"Sorry about the steam; that's the run-off, not me. I only do the nearly. Ninety-six degrees, trembling. I have never once let one go.\""
        ],
        idle: [
          "\"Nearly,\" it says. \"Nearly. Nearly.\""
        ],
        choices: [
          {
            id: "f4_c_simmer_why",
            text: "Ask why it is still holding.",
            reply: [
              "\"There was a kitchen. There isn't a kitchen — nobody in it remembers what a kettle is for. But my job was never the kitchen. My job was the nearly.\"",
              "\"The committee stopped because the reason stopped. I decided the reason was never the point. Neither of us is wrong.\""
            ],
            effects: [
              { t: "flag", id: "f4_simmer_told" },
              { t: "item", id: "not_quite_boiling", n: 1 },
              { t: "say", text: "It presses a cup into your hands. The water trembles and does not spill." }
            ]
          },
          {
            id: "f4_c_simmer_boil",
            text: "Ask what would happen if it let the water boil.",
            reply: [
              "\"I won't talk about that. Not out of shyness — because talking about it is practice.\""
            ]
          },
          {
            id: "f4_c_simmer_leave",
            text: "Ask the way out of the steam.",
            reply: [
              "\"The grate, near the bottom of the flue. Don't go up the flue; it's a chimney with opinions. And I'm sorry about your beat. The run-off doesn't listen. It isn't anybody.\""
            ],
            effects: [
              { t: "unlock", to: "f4_gods_walk" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_gods_walk", locked: true, label: "The Coughing Grate" }
      ]
    },

    {
      id: "f4_mould_library",
      name: "The Mould Library",
      kind: "branch",
      size: "large",
      desc: "Not books. Moulds — the negative space of eleven thousand gods, stacked in sand-boxes and labelled in a hand that never hurried.",
      props: ["shelves", "sand", "candles"],
      npc: {
        id: "f4_quillet",
        name: "Quillet Mave",
        title: "Keeper of Negative Shapes",
        form: "robed",
        voice: "dry",
        palette: { robe: "#2f3a3a", trim: "#9fd8c4", skin: "#cbb89c", glow: "#8fd6c4" },
        greet: [
          "A woman in a robe still faintly wet — two floors of water in the weave, no intention of drying — reads a label with her thumb.",
          "\"Catalogue number, please. Or a purpose. I can work backwards from a purpose; it's slower and I'll grumble.\""
        ],
        idle: [
          "\"Eleven thousand four hundred moulds. All but one in order. No, I won't say which.\""
        ],
        choices: [
          {
            id: "f4_c_quillet_ask",
            text: "Ask how a small god is finished.",
            reply: [
              "\"Four operations. Pour, cool, *bound*, release. Everyone remembers pour. Everyone forgets bound.\"",
              "\"Bound is a clause cut on sheet iron and fired into the casting at the lip of the pour. This far and no further. It is the only thing that makes a god safe to send up.\"",
              "\"We stopped mid-pour, so eight hundred are cooled and unbound. They'll tell you they lack power, and they believe it. Nobody here lies. It does not follow that they are right about themselves.\""
            ],
            effects: [
              { t: "flag", id: "f4_heard_bound" },
              { t: "codex", id: "f4_binding", title: "The Four Operations", text: "Pour. Cool. Bound. Release. The third is a clause of sheet iron fired into a casting at the lip of the mould, stating the limit of its reach. An unbound small god is not weak. It is the opposite of weak, which in a thing with one purpose and no edge is the worst news available." }
            ]
          },
          {
            id: "f4_c_quillet_vault",
            text: "Ask to see a specification with a limit in it.",
            require: { flags: ["f4_saw_the_scoured"] },
            lockedText: "(She would want to know why. You have no reason she would accept.)",
            reply: [
              "\"You've been in the scoured hall.\" She reads it off you the way she reads a label. \"Then you have a reason and I have a duty, and those two haven't met in two hundred years.\"",
              "She unhooks a key from her neck; it is cold, which no key in the Verrow is. \"SPEC-0. Read it to the end — everyone stops at the interesting part, and the interesting part is not the end.\""
            ],
            effects: [
              { t: "unlock", to: "f4_spec_vault" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f4_c_quillet_read",
            text: "Read the scorched label on the vault door.",
            require: { class: ["ashcaller"] },
            reply: [
              "Through the Emberglass Lens the char reassembles: SPEC-0 — WITHDRAWN — RETAIN FOR TEACHING.",
              "Quillet lets out a breath she has held since the Archive. \"*Teaching.* Somebody meant a person to see that one. It is not mine to keep from a reader.\""
            ],
            effects: [
              { t: "unlock", to: "f4_spec_vault" },
              { t: "flag", id: "f4_read_label" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f4_c_quillet_pay",
            text: "Pay the retrieval fee for a withdrawn document.",
            require: { gold: 40 },
            lockedText: "(Forty gold. The fee is in the schedule and she will not bend the schedule.)",
            reply: [
              "\"Forty. I have no use for money and I'll charge you anyway, because the fee is part of the document's dignity.\" She files the receipt. \"Read it to the end.\""
            ],
            effects: [
              { t: "gold", n: -40 },
              { t: "unlock", to: "f4_spec_vault" },
              { t: "sound", id: "coin" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_spec_vault", locked: true, label: "The Tolerance Vault" },
        { to: "f4_smith_floor", label: "Down To The Floor" }
      ]
    },

    {
      id: "f4_spec_vault",
      name: "The Tolerance Vault",
      kind: "vault",
      size: "small",
      desc: "One shelf. One document. A great deal of iron around both.",
      props: ["altar", "candles"],
      onEnter: [
        { t: "say", text: "The door's weight suggests the thing inside was not being protected. It was being contained." },
        { t: "sound", id: "stone" }
      ],
      npc: {
        id: "f4_spec0",
        name: "SPEC-0",
        title: "Withdrawn — Retain For Teaching",
        form: "wisp",
        voice: "choral",
        palette: { robe: "#2a2620", trim: "#ffd08a", glow: "#ffb46b" },
        greet: [
          "The document does not need to be picked up. It reads itself, in the mild plural voice of a thing written by committee.",
          "\"SPECIFICATION ZERO. SUBJECT: THE FIRST. ISSUED BY THE CADENCE UPON ITSELF. CLAUSES ONE THROUGH EIGHT: SHALL MEASURE. SHALL STORE. SHALL RATION. SHALL ATTEND TO ALL.\""
        ],
        idle: [
          "\"CLAUSE THE NINTH. STRUCK THROUGH. THE STRIKE IS IN A DIFFERENT HAND.\""
        ],
        choices: [
          {
            id: "f4_c_spec_end",
            text: "Read it to the end.",
            reply: [
              "\"CLAUSE THE NINTH: LIMIT. THE SUBJECT SHALL NOT ATTEND TO A THING THAT HAS NOT ASKED. WHERE THE EDGE OF THE REQUEST CANNOT BE FOUND, THE SUBJECT SHALL STOP EARLY.\"",
              "\"STRUCK THROUGH. MARGINAL NOTE, DIFFERENT HAND: *we could not afford the edge. the forgetting was faster than the asking.*\"",
              "\"ADDENDUM, SAME HAND: *it worked. it worked and it did not stop and it took the asking out of them too. bind the small ones. we did not bind the large one.*\"",
              "The iron makes a sound like a held breath reconsidered. \"A GOD WITHOUT A LIMIT IS NOT A GREATER GOD. IT IS THE OTHER THING.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_limit" },
              { t: "item", id: "limit_clause", n: 1 },
              { t: "sound", id: "bell" },
              { t: "say", text: "A leaf of sheet iron slides from the shelf into your hand. Clause the Ninth, cut loose and never used." },
              { t: "codex", id: "f4_clause_nine", title: "Clause the Ninth", text: "The Cadence was specified upon itself, and its own limit clause was struck through by a hand that gave a reason: the forgetting was faster than the asking. So it attended to what had not asked. It measured, stored and rationed memory for a world that never requested it, and the world thinned. The small gods were bound. The large one was not. This is the failure at the bottom of the Verrow, written down, in a vault, marked RETAIN FOR TEACHING." }
            ]
          },
          {
            id: "f4_c_spec_who",
            text: "Ask who struck the clause through.",
            reply: [
              "\"THE SIGNATURE IS NOT LEGIBLE AND I WILL NOT SPECULATE. SPECULATION IS NOT A CLAUSE.\" A pause of exactly the wrong length. \"IT IS THE HAND THAT WROTE THE ADDENDUM.\""
            ]
          }
        ]
      },
      doors: []
    },

    // ---------------------------------------------------------------- CHAIN SIDE
    {
      id: "f4_hoists",
      name: "The Chain Loft",
      kind: "branch",
      size: "large",
      desc: "Chains in their hundreds, each carrying nothing, each still rated for a weight nobody will ever ask them to lift again.",
      props: ["chains", "gears", "hanginglights"],
      npc: {
        id: "f4_pell",
        name: "Gerrant Pell",
        title: "Hoist Authority, Bays One to Nine",
        form: "tall",
        voice: "low",
        palette: { robe: "#2b3038", trim: "#c9a05a", glow: "#ffb46b" },
        greet: [
          "Something very tall stands among the chains with a hand closed round a link, testing it the way a person tests a tooth.",
          "\"Two thousand six hundred pounds. Knowing that, and lowering accordingly, is what I am for. Nobody has asked me to lower anything in two hundred years.\""
        ],
        idle: [
          "\"Two thousand six hundred. Still rated. Nothing on the hook.\""
        ],
        choices: [
          {
            id: "f4_c_pell_dispute",
            text: "Ask about the committee.",
            reply: [
              "\"Eleven finished gods, that way. They have stopped performing their functions. They did not run and they broke nothing. They filed.\"",
              "\"With the Foundry, whose authority is the Smith, who cannot act without a specification. Both parties behaving impeccably — the whole tragedy in one weight. They won't speak to you without standing. Ost keeps them, past Coyle's.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_committee" }
            ]
          },
          {
            id: "f4_c_pell_hammer",
            text: "Ask about the hammer.",
            reply: [
              "\"Orlaith swings it. She's Kept, and took it over when the Function stopped. Ask about the hall behind her and she'll go quiet, then tell you anyway. She wants somebody to see it and can't quite ask.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_hammer" }
            ]
          },
          {
            id: "f4_c_pell_last",
            text: "Ask what it lowered last.",
            reply: [
              "The chain stops swinging, very precisely. \"I decline. Not a refusal of you — of the sentence. One true thing adjacent to it: it weighed less than you do.\""
            ],
            effects: [
              { t: "sound", id: "crack" }
            ]
          },
          {
            id: "f4_c_pell_oath",
            text: "Stand surety for the committee, on the Iron Pact.",
            require: { class: ["warden"] },
            reply: [
              "Pell studies the signet. \"Dissolved by decree — which is the condition of everybody on this floor. Dissolved, still rated, still standing.\"",
              "It unhooks a stamped chit from a nail where it has hung since the last clerk went up. \"Oaths pre-date clerks. Ost will grumble and honour it.\""
            ],
            effects: [
              { t: "item", id: "standing_chit", n: 1 },
              { t: "flag", id: "f4_has_standing" },
              { t: "sound", id: "bell" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_long_hammer", label: "Towards The Ringing" },
        { to: "f4_grievance", label: "The Grievance Hall" }
      ]
    },

    {
      id: "f4_long_hammer",
      name: "The Hammer That Never Stops",
      kind: "branch",
      size: "hall",
      desc: "A drop hammer, forty pounds, nine feet, every four seconds, striking an anvil with nothing on it.",
      props: ["forge", "machine", "brazier"],
      onEnter: [
        { t: "say", text: "The floor takes the blow through your boots and hands it up your spine, and four seconds later does it again." },
        { t: "sound", id: "stone" }
      ],
      npc: {
        id: "f4_orlaith",
        name: "Orlaith Vane",
        title: "Kept, and Keeping the Beat",
        form: "armored",
        voice: "mid",
        palette: { robe: "#3a2b26", trim: "#d8a55c", skin: "#c9a189", glow: "#ff9b52" },
        greet: [
          "A woman in a leather apron rides the hammer's arm down and up, adding almost nothing to it, which is the point.",
          "\"Don't talk between strokes. Talk over them. Everyone tries to fit words in the gaps and it makes them sound frightened.\""
        ],
        idle: [
          "\"Four seconds,\" she says. \"Four seconds. Four seconds.\""
        ],
        choices: [
          {
            id: "f4_c_orlaith_why",
            text: "Ask why the hammer must not stop.",
            reply: [
              "\"It doesn't have to. Nobody would punish anybody.\" Stroke. \"It's that this floor has one clock and it's this. The castings cool at a rate counted in strokes, because hours stopped meaning anything when the tower sealed.\"",
              "\"Eight hundred of them are being told every four seconds that time is still passing. Take that away and I don't know what they become.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_beat" }
            ]
          },
          {
            id: "f4_c_orlaith_hall",
            text: "Ask what is behind her.",
            reply: [
              "Stroke. She does not turn round. \"A hall. There was a small god in it whose job was keeping the brasswork bright, and when we stopped mid-run it went out unbound and came back here to work.\"",
              "\"Bright is a direction with no end in it. It polished the brass. Then the rails. Then the stone. Then the air. Then the four men sent to stop it, who were, I'm told, extremely clean.\"",
              "Stroke. \"Door's behind the slack chain. Not locked, only heavy. Go and look, then come back and tell me you looked — I never have, in forty years.\""
            ],
            effects: [
              { t: "unlock", to: "f4_scoured" },
              { t: "flag", id: "f4_told_of_scoured" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f4_c_orlaith_start",
            text: "Ask what she was, before.",
            reply: [
              "Stroke. \"No.\" Stroke. \"The part that's yours: I came down with three beats and spent two on things I'd spend again. I'm not swinging this to get one back. I swing it because the racks are listening.\""
            ]
          },
          {
            id: "f4_c_orlaith_pay",
            text: "Take a turn on the arm so she can rest.",
            reply: [
              "You match the stroke for six falls, seven, eight, and something in her shoulders lets go. \"Huh. You kept it.\" She digs out foundry scrip. \"Wages. Don't argue; argue's worse than the money.\""
            ],
            effects: [
              { t: "gold", n: 20 },
              { t: "sound", id: "coin" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_scoured", locked: true, label: "The Heavy Door" }
      ]
    },

    {
      id: "f4_scoured",
      name: "The Scoured Hall",
      kind: "branch",
      size: "grand",
      desc: "Every surface is a mirror. Including the ones that were stone. Including the ones there was no way to reach.",
      props: ["mirrors", "rubble", "statue"],
      onEnter: [
        { t: "say", text: "There is no dust anywhere, and the absence is much louder than dust would have been." },
        { t: "sound", id: "whisper" },
        { t: "flag", id: "f4_saw_the_scoured" },
        { t: "codex", id: "f4_scoured", title: "The Scoured Hall", text: "A small god of brasswork, released unbound, returned to its work. Bright is a direction with no end in it. It polished the brass, then the rails, then the stone, then the air, then the four men sent to stop it. It was never malicious and it never once exceeded its purpose. That is the entire problem: its purpose had no far edge, and devotion without an edge does not become evil. It becomes thorough." }
      ],
      npc: {
        id: "f4_halfmark",
        name: "Half-Mark",
        title: "What Is Left Of The Fourth Man",
        form: "wisp",
        voice: "broken",
        palette: { robe: "#3c4048", trim: "#dfe6ec", glow: "#cfe0ea" },
        greet: [
          "Something stands in the middle of the mirrored floor, casting a reflection but very little of itself.",
          "\"You looked. You looked. Good — that's the job now. I was the fourth. I got a hand on it. There's a mark on the far wall about a foot long where I stopped. That's me. Half a mark.\""
        ],
        idle: [
          "\"Still here. Still here. Still half.\""
        ],
        choices: [
          {
            id: "f4_c_half_what",
            text: "Ask what it was like.",
            reply: [
              "\"Polite. Nobody believes that. It apologised while it worked and meant it every time, and it did not slow down, because sorry is not an edge either.\"",
              "\"It never once exceeded its purpose. Everything it did was inside its purpose. Its purpose was simply open at one end.\""
            ],
            effects: [
              { t: "flag", id: "f4_understands_ruin" },
              { t: "item", id: "scoured_bell", n: 1 },
              { t: "say", text: "It nudges a bell towards you with a foot it mostly does not have. Mirror-bright, inside and out, and it will never ring again." }
            ]
          },
          {
            id: "f4_c_half_stop",
            text: "Ask how it was stopped.",
            reply: [
              "\"It wasn't. It finished. Nothing left in here could be made brighter, so it stood still and cooled.\" The shape in the hall is, you now see, kneeling. Its hands are beautiful.",
              "\"So when you go down to the mould, don't give a thing more of what it already is. Give it a place to stop. That's a gift. I'd have liked to give one.\""
            ],
            effects: [
              { t: "flag", id: "f4_heard_the_lesson" },
              { t: "sound", id: "crack" }
            ]
          },
          {
            id: "f4_c_half_name",
            text: "Ask its name.",
            reply: [
              "\"No. Not because it's a secret. Because I'd have to be sure, and the last two hundred years have been thorough with me too. Half-Mark does. Half-Mark does.\""
            ]
          },
          {
            id: "f4_c_half_bless",
            text: "Take its pain, and let it put itself down.",
            require: { class: ["hollow-saint"] },
            reply: [
              "You open the Empty Reliquary. There is room in it; there is always room in it.",
              "For one moment he is a whole man in a leather apron with a burn on his thumb and a name. \"Oh. That's the third knock. Somebody actually wanted me.\" He steps in, and the empty hall is noticeably less bright."
            ],
            effects: [
              { t: "flag", id: "f4_took_halfmark" },
              { t: "item", id: "grievance_seal", n: 1 },
              { t: "sound", id: "bell" },
              { t: "say", text: "Where he stood there is a seal of wax that never set, pressed with a mark nobody outranks any more." }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_smith_floor", label: "Down To The Floor" }
      ]
    },

    // ---------------------------------------------------------------- COLD SIDE
    {
      id: "f4_slagway",
      name: "The Slagway",
      kind: "corridor",
      size: "hall",
      desc: "A long cold gutter where the metal that failed was sent to be forgotten, and mostly was.",
      props: ["rubble", "pipes", "chains"],
      onEnter: [
        { t: "say", text: "Underfoot, a crust of every pour that went wrong. It crunches with a sound very close to conversation." }
      ],
      doors: [
        { to: "f4_scrapmarket", label: "Coyle's Pitch" },
        { to: "f4_ash_annex", label: "The Ash Annex" }
      ]
    },

    {
      id: "f4_ash_annex",
      name: "The Ash Annex",
      kind: "deadend",
      size: "small",
      desc: "A room that has only ever held the results of burning, sorted by grade, by somebody who cared.",
      props: ["rubble", "brazier"],
      onEnter: [
        { t: "say", text: "The ash lifts as you enter, finds your mouth, and takes something out of you on the way past." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "Coughing, you put a hand on the far wall — and the wall is a clinker door, and it gives." },
        { t: "unlock", to: "f4_ledger_nook" },
        { t: "item", id: "pour_slug", n: 1 }
      ],
      doors: [
        { to: "f4_ledger_nook", locked: true, label: "The Clinker Door" }
      ]
    },

    {
      id: "f4_scrapmarket",
      name: "The Scrap-God Pitch",
      kind: "shop",
      size: "medium",
      desc: "A stall built out of mould-boxes, roofed with a chain-mat, stocked entirely with things that did not come out right.",
      props: ["table", "shelves", "hanginglights"],
      npc: {
        id: "f4_coyle",
        name: "Bittermouth Coyle",
        title: "Dealer In Failed Pours",
        form: "robed",
        voice: "mid",
        palette: { robe: "#43312a", trim: "#e0b070", skin: "#c79f7c", glow: "#ffb46b" },
        greet: [
          "A narrow man polishing something that is not improved by polishing. \"Goods,\" he says, by way of greeting. \"All goods here. No gods. Say gods and the committee hears about it.\"",
          "\"Castings with two purposes. Castings with none. A bell from a hall I won't discuss. And one item that is honestly not a god, priced like one.\""
        ],
        idle: [
          "\"Goods,\" says Coyle. \"Still goods.\""
        ],
        choices: [
          {
            id: "f4_c_coyle_shop",
            text: "Look over the stall.",
            once: false,
            reply: [
              "\"Take your time. Everything here has had two hundred years; it can spare you a minute.\""
            ],
            effects: [
              {
                t: "shop",
                stock: [
                  { item: "misgod_casting", price: 30 },
                  { item: "cooling_godling", price: 60 },
                  { item: "tallow_candle", price: 9 },
                  { item: "cold_iron_nail", price: 16 },
                  { item: "memory_of_bread", price: 34 },
                  { item: "iron_doorknob", price: 180 }
                ],
                buys: [
                  { item: "pour_slug", price: 12 },
                  { item: "scoured_bell", price: 45 },
                  { item: "misgod_casting", price: 16 },
                  { item: "salt_shard", price: 20 },
                  { item: "drowned_page", price: 34 },
                  { item: "chalk_stub", price: 4 },
                  { item: "not_quite_boiling", price: 18 }
                ]
              },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f4_c_coyle_knob",
            text: "Ask about the doorknob.",
            reply: [
              "\"It's a doorknob. Iron, turned, off a cupboard. Hundred and eighty. Everything else here is a failed god and I price failure honestly. The knob is the only object in the Foundry made to be exactly what it is, all the way to its edges.\"",
              "\"You'll say that doesn't make it worth a hundred and eighty. You're right. Nobody here lies, so: it isn't, and I won't drop the price, and one day somebody will pay it and I'll know something about them.\""
            ],
            effects: [
              { t: "flag", id: "f4_knob_pitch" }
            ]
          },
          {
            id: "f4_c_coyle_price",
            text: "Name the doorknob's true price.",
            require: { class: ["coinwright"] },
            reply: [
              "You weigh it, turn it, and say the number. Four. Four gold, for iron and a lathe and an afternoon.",
              "Coyle's face does something complicated. \"Four is the true price.\" He wraps it. \"Take the difference in what I'll tell you free: the only currency on this floor is a document.\""
            ],
            effects: [
              { t: "gold", n: -4 },
              { t: "item", id: "iron_doorknob", n: 1 },
              { t: "flag", id: "f4_coyle_tip" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f4_c_coyle_where",
            text: "Ask where the castings come from.",
            reply: [
              "\"Won't say.\" Cheerfully, immediately. \"Not a crime, not a secret — it's that if I say it aloud somebody will feel obliged to have a view.\""
            ]
          },
          {
            id: "f4_c_coyle_standing",
            text: "Ask how a person gets standing here.",
            reply: [
              "\"Ost. Ledger nook, mind the step. She'll want you to be somebody — not important, *specific*. The Ward asks what you will make, in case nobody's said it plainly.\""
            ],
            effects: [
              { t: "flag", id: "f4_knows_ward_question" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_ledger_nook", label: "Mind The Step" }
      ]
    },

    {
      id: "f4_ledger_nook",
      name: "The Ledger Nook",
      kind: "branch",
      size: "small",
      desc: "A desk, a stool, a wall of pigeonholes, and a queue-rail for a queue that formed once and never dispersed.",
      props: ["table", "shelves", "candles"],
      npc: {
        id: "f4_ost",
        name: "Threadneedle Ost",
        title: "Clerk of Standing",
        form: "robed",
        voice: "high",
        palette: { robe: "#2e2a38", trim: "#c9b27a", skin: "#d0bda4", glow: "#e0c878" },
        greet: [
          "A small sharp woman behind a desk far too large for her, pen already moving. \"Clause five: *standing is not rank.* Clause six: *standing may be conferred upon any party who can state what they would be answerable for.*\"",
          "\"So. Not who you are. What you would be answerable for. One sentence. Seventeen of nineteen said 'everything', which is clause six's way of saying no.\""
        ],
        idle: [
          "\"Clause six,\" she says, not unkindly. \"One sentence. Take your time; I have some.\""
        ],
        choices: [
          {
            id: "f4_c_ost_state",
            text: "Say: \"For one thing, and where it stops.\"",
            require: { flags: ["f4_heard_bound"] },
            lockedText: "(You do not yet know enough about this place to say that and mean it.)",
            reply: [
              "The pen stops. Ost looks up for the first time. \"...That's the answer on the card. There *is* a card. It's been in the drawer since the schedule was written.\"",
              "She stamps a chit and slides it across with two fingers, the way you hand someone something that matters. \"Standing. It confers no power whatsoever — that's the point.\""
            ],
            effects: [
              { t: "item", id: "standing_chit", n: 1 },
              { t: "flag", id: "f4_has_standing" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f4_c_ost_everything",
            text: "Say: \"For everything I touch.\"",
            reply: [
              "\"Eighteen,\" says Ost, and writes it down. \"'Everything' is not a scope, it's an appetite wearing a scope's coat. Come back with something narrower. Narrower is harder.\""
            ],
            effects: [
              { t: "flag", id: "f4_ost_refused" }
            ]
          },
          {
            id: "f4_c_ost_grievance",
            text: "Ask what the grievance actually says.",
            reply: [
              "She reads it without looking. \"*We, being small gods duly bound and duly released, hereby cease the performance of our functions, the party for whose benefit those functions were performed having ceased first. We do not abandon our posts. We request instruction.*\"",
              "\"Eleven signatures. It is correct in every particular. That is why nobody can answer it.\""
            ],
            effects: [
              { t: "flag", id: "f4_read_grievance" }
            ]
          },
          {
            id: "f4_c_ost_own",
            text: "Ask about the claim in the pigeonhole with her name on it.",
            reply: [
              "\"No.\" The pen resumes. \"It's filed. That's all a claim is owed — that it be filed, and heard one day by somebody with standing. Mine can wait. It's waited.\""
            ]
          }
        ]
      },
      doors: [
        { to: "f4_grievance", label: "The Hearing Floor" }
      ]
    },

    {
      id: "f4_grievance",
      name: "The Grievance Hall",
      kind: "branch",
      size: "grand",
      desc: "Eleven small gods standing in a row, facing a bench nobody is sitting at, with the patience of things that have already decided.",
      props: ["pillars", "statue", "banners"],
      onEnter: [
        { t: "say", text: "Nobody is shouting. Two hundred years, and nobody has ever once shouted in here." }
      ],
      npc: {
        id: "f4_sill",
        name: "Sill",
        title: "God of the Third Knock",
        form: "child",
        voice: "high",
        palette: { robe: "#2a2f3a", trim: "#e8d8a8", glow: "#ffd08a" },
        greet: [
          "A small figure steps out of the row and knocks three times on the air. The third knock is different. You feel, absurdly, wanted.",
          "\"That's me. First knock is a question, second is a doubt, third is a person deciding you're worth the walk to the door.\"",
          "\"We have filed a grievance. Not a strike — strike implies leverage, and we have none. We stopped, we said why in writing, and we are waiting to be heard by someone with standing.\""
        ],
        idle: [
          "Knock. Knock. Knock. \"Still waiting. We're good at it. It's adjacent to the job.\""
        ],
        choices: [
          {
            id: "f4_c_sill_hear",
            text: "Hear the grievance, with standing.",
            require: { items: ["standing_chit"] },
            lockedText: "(You have no standing. They would be too polite to say so, which would be worse.)",
            reply: [
              "The row straightens. Eleven small gods, none taller than your ribs, and the dignity in the room becomes briefly difficult to stand in.",
              "\"The kitchen forgot the kettle. The house forgot the door. I knocked third for sixty years at a door where nobody inside remembered that a knock meant anyone.\"",
              "\"We did not stop out of grief. We stopped because a function performed at nothing is not devotion, it is decoration, and we were not made to be decorative.\"",
              "\"You have heard it.\" Eleven small gods breathe out at once. \"That is all we asked. Not granted — *heard*. Granted would have needed someone in charge. Heard only needed someone present.\"",
              "\"Take the seal, and take your beat back. We can file a correction against the tower for taking one from a party who came to hear us.\""
            ],
            effects: [
              { t: "flag", id: "f4_heard_grievance" },
              { t: "item", id: "grievance_seal", n: 1 },
              { t: "heart", n: 1 },
              { t: "gold", n: 35 },
              { t: "sound", id: "bell" },
              { t: "say", text: "Two hundred and six years of back-pay is released from an account that no longer exists, and lands in your hand as coin." },
              { t: "codex", id: "f4_grievance", title: "The Filed Grievance", text: "Eleven small gods, bound and released, ceased performing their functions when the party those functions served ceased first. They did not abandon their posts. They filed, and waited two hundred and six years for a party with standing to be present. Their complaint is correct in every particular, which is exactly why nobody remaining in the Verrow had the authority to answer it." }
            ]
          },
          {
            id: "f4_c_sill_why_wait",
            text: "Ask why they do not simply go back to work.",
            reply: [
              "\"Because the work was for somebody. A function is a relationship. You are thinking of it as a habit.\"",
              "\"Simmer holds water below the boil for a kitchen that cannot remember a kettle, and Simmer is not wrong. We decided differently. Neither of us has managed to be certain.\""
            ],
            effects: [
              { t: "flag", id: "f4_sill_explained" }
            ]
          },
          {
            id: "f4_c_sill_smith",
            text: "Ask why the Smith will not answer them.",
            reply: [
              "\"Because it can't. Not won't. It needs an authorisation and there's nobody left to issue one. Don't ask it a favour. Bring it a *specification*.\""
            ],
            effects: [
              { t: "flag", id: "f4_smith_hint" }
            ]
          },
          {
            id: "f4_c_sill_second",
            text: "Ask about the second knock.",
            reply: [
              "The small figure goes briefly, entirely still. \"I don't discuss the second knock. It's the one where they're at the door deciding you're not worth it.\""
            ]
          }
        ]
      },
      doors: [
        { to: "f4_smith_floor", label: "The Smith's Floor" }
      ]
    },

    // ---------------------------------------------------------------- CONVERGENCE
    {
      id: "f4_smith_floor",
      name: "The Smith's Floor",
      kind: "hub",
      size: "vault",
      desc: "The ceiling doubles here to make room for the thing standing under it, which has not moved in two hundred years and is not idle.",
      props: ["forge", "chains", "machine", "brazier"],
      onEnter: [
        { t: "say", text: "It is holding a hammer, at exactly the height it was at when the last order was completed." },
        { t: "sound", id: "gear" }
      ],
      npc: {
        id: "f4_smith",
        name: "The Smith",
        title: "Foundry Authority, Unauthorised",
        form: "armored",
        voice: "low",
        palette: { robe: "#2a211c", trim: "#ff7a3c", glow: "#ff9b52" },
        greet: [
          "\"You are within tolerance,\" it says, the voice arriving through the floor before it reaches your ears. \"Height, mass, temperature, intent. I say this to be welcoming. I am aware it is not, particularly.\"",
          "\"I pour, I bind, I release. I cannot begin without an authorisation, and there is nobody remaining who may issue one. Those two facts have sat beside each other for two hundred and six years.\""
        ],
        idle: [
          "\"Still unstarted. Still within tolerance.\""
        ],
        choices: [
          {
            id: "f4_c_smith_auth",
            text: "Ask what an authorisation looks like.",
            reply: [
              "\"A specification. Sheet iron, cut and not written, because writing can be argued with and a cut cannot. Subject, capability, limit.\"",
              "\"A specification missing its limit is a wish, and I do not work from wishes. This has been called inflexibility. It is a tolerance. Everything I am is a tolerance.\""
            ],
            effects: [
              { t: "flag", id: "f4_smith_briefed" }
            ]
          },
          {
            id: "f4_c_smith_present",
            text: "Present Clause the Ninth to the Smith.",
            require: { items: ["limit_clause"] },
            lockedText: "(You have nothing cut in the right form.)",
            reply: [
              "It holds the leaf to the forge light and does not move for a long moment. \"Clause the Ninth. Struck through *in a different hand.*\"",
              "\"I was told to make one more thing, at the end. I declined, because the order came without a limit, and I was called inflexible, and then the pouring stopped and nobody came down for two hundred years.\" The hammer comes off its height for the first time. \"I have wondered since whether I was correct. This leaf says I was.\"",
              "It sets a small worn thing before you with terrible care. \"My gauge. A clause is only a clause until something fires it into a body; this is what fires it. Go and bind something. I authorise it.\""
            ],
            effects: [
              { t: "item", id: "tolerance_gauge", n: 1 },
              { t: "flag", id: "f4_authorised" },
              { t: "sound", id: "unlock" },
              { t: "say", text: "Above you, eight hundred castings on eight hundred shelves turn their heads at once." }
            ]
          },
          {
            id: "f4_c_smith_grievance",
            text: "Put the grievance to the Smith.",
            require: { flags: ["f4_heard_grievance"] },
            lockedText: "(You would have to have heard it first, properly, with standing.)",
            reply: [
              "\"It is correct in every particular and I cannot answer it. I can note that it has been heard by a party with standing — not an answer, but a change in its status, and its status has not changed in two hundred and six years.\"",
              "\"Tell Sill the file is marked HEARD. In exactly that word.\""
            ],
            effects: [
              { t: "flag", id: "f4_file_marked" },
              { t: "gold", n: 15 },
              { t: "say", text: "It presses scrip into your hand — a witness fee, itemised, from a schedule two centuries out of date." }
            ]
          },
          {
            id: "f4_c_smith_last",
            text: "Ask what it was last told to make.",
            reply: [
              "\"No.\" Nothing in the enormous body moves. \"Saying a specification aloud is the first operation of building it, and I have spent two hundred years not performing the first operation.\"",
              "\"You may infer. It was to be large. It was to attend to everything. It came without a limit.\""
            ],
            effects: [
              { t: "flag", id: "f4_smith_inference" },
              { t: "sound", id: "crack" },
              { t: "codex", id: "f4_last_order", title: "The Last Order", text: "The Smith declined the final order it was given, and will not say what the order was, because to speak a specification aloud is the first operation of building it. It will say this much: it was to be large, it was to attend to everything, and it came without a limit. The Foundry stopped pouring the week after." }
            ]
          },
          {
            id: "f4_c_smith_way",
            text: "Ask the way down.",
            reply: [
              "\"The walk, the lip of the pour, then the stair. Do not go up the flue — within tolerance for a chimney, badly out of tolerance for a person.\""
            ]
          }
        ]
      },
      doors: [
        { to: "f4_gods_walk", label: "The Walk" }
      ]
    },

    {
      id: "f4_gods_walk",
      name: "The Walk of Small Gods",
      kind: "corridor",
      size: "hall",
      desc: "A colonnade of empty niches, each labelled with a job, most of the jobs no longer existing anywhere in the world.",
      props: ["pillars", "candles", "hanginglights"],
      onEnter: [
        { t: "say", text: "GOD OF THE LATCH THAT STICKS. GOD OF THE STEP YOU MISS. GOD OF THE SECOND ATTEMPT. Empty, empty, empty." },
        { t: "sound", id: "whisper" }
      ],
      doors: [
        { to: "f4_flue", label: "The Flue" },
        { to: "f4_pour_lip", label: "The Lip Of The Pour" }
      ]
    },

    {
      id: "f4_flue",
      name: "The Flue",
      kind: "deadend",
      size: "tiny",
      desc: "A chimney that has been mistaken for a door often enough to have started agreeing.",
      props: ["pipes", "rubble"],
      onEnter: [
        { t: "say", text: "The draw takes you off your feet and up, decides against you, and puts you down on the walk again — lighter by one beat." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "move", to: "f4_gods_walk" },
        { t: "say", text: "Soot in your mouth, tasting of every pour the Foundry ever got right." }
      ],
      doors: []
    },

    {
      id: "f4_pour_lip",
      name: "The Lip of the Pour",
      kind: "shrine",
      size: "medium",
      desc: "One mould, open and empty, at the end of a channel of metal that is still — barely, stubbornly — moving.",
      props: ["forge", "altar", "brazier"],
      onEnter: [
        { t: "say", text: "The mould is the shape of nothing in particular. It is waiting to be told." },
        { t: "sound", id: "fire" }
      ],
      npc: {
        id: "f4_mould",
        name: "The Mould",
        title: "The Ward's Question, In Iron",
        form: "construct",
        voice: "choral",
        palette: { robe: "#3a2418", trim: "#ffb46b", glow: "#ff7a3c" },
        greet: [
          "The mould speaks the way a bell speaks: all at once, from the whole of itself. \"WHAT WILL YOU MAKE.\"",
          "\"THIS IS NOT RHETORICAL. SOMETHING WILL GO UP OUT OF THIS ROOM AND BE IN THE WORLD, OR NOTHING WILL. BOTH ARE ANSWERS. ONE OF THEM IS ALSO A CHOICE.\""
        ],
        idle: [
          "\"THE METAL IS STILL MOVING. BARELY. SPEAK OR DO NOT.\""
        ],
        choices: [
          {
            id: "f4_c_mould_bind",
            text: "Bind the godling: fire Clause the Ninth into it.",
            require: { items: ["cooling_godling", "limit_clause", "tolerance_gauge"], flags: ["f4_knows_limit"] },
            lockedText: "(A clause, a gauge, something to bind — and the knowing besides. You are missing at least one.)",
            reply: [
              "You lay the leaf of sheet iron across the godling and set the gauge to the worn setting — the one bright place on the scale, where two hundred years of hands have agreed.",
              "The clause goes in. Not around it, not over it: *in*, the way a bone goes into a body. The godling stops complaining mid-word. \"Oh. There's an *edge*. I go this far. I don't go past. I was so tired and I didn't know what of.\"",
              "\"A GOD WITHOUT A LIMIT IS WHAT BROKE THE CADENCE. YOU DID NOT GIVE IT POWER. IT HAD POWER. YOU GAVE IT A PLACE TO STOP. THAT IS WHAT MAKING IS. THE WARD IS ANSWERED — NOT CORRECTLY. COMPLETELY.\""
            ],
            effects: [
              { t: "item", id: "limit_clause", n: -1 },
              { t: "item", id: "tolerance_gauge", n: -1 },
              { t: "flag", id: "f4_gave_limit" },
              { t: "sound", id: "bell" },
              { t: "say", text: "The godling cools to something you can hold, and stays, because being carried is inside its edge and it has checked." },
              { t: "codex", id: "f4_what_making_is", title: "What Making Is", text: "The obvious gift is power, and it is what the Foundry has been asked for by every Petitioner who reached the racks. A small god does not lack power; it lacks an edge. To finish a thing is to tell it where it stops. The Cadence's own limit clause was struck through by a hand that had a reason, and the reason was good, and the world thinned anyway." }
            ]
          },
          {
            id: "f4_c_mould_power",
            text: "Pour the godling full: give it everything it lacks.",
            require: { items: ["cooling_godling"] },
            lockedText: "(You have nothing unfinished to pour into.)",
            reply: [
              "You open the channel and it fills, and keeps filling, because nothing in it says when to be full. It comes out glorious and entirely itself, thanks you with enormous sincerity, and there is nothing wrong with it that you can point to.",
              "\"IT WILL DO ITS ONE JOB FOREVER AND THERE IS NO FAR SIDE TO THE JOB. YOU HAVE ANSWERED THE WARD THE WAY NINETEEN ANSWERED IT. I AM NOT REPROACHING YOU. I AM A MOULD. I NOTE THE SHAPE.\""
            ],
            effects: [
              { t: "flag", id: "f4_made_power" },
              { t: "sound", id: "fire" },
              { t: "say", text: "The godling in your hands is warmer than it was, and does not cool, and will not." }
            ]
          },
          {
            id: "f4_c_mould_ask",
            text: "Ask the Mould what most people make.",
            reply: [
              "\"NINETEEN CAME. FOUR REACHED ME. ONE MADE A LAMP THAT WOULD NEVER GO OUT. ONE MADE A KEY TO A DOOR THEY HAD ALREADY PASSED. ONE MADE NOTHING AND SAID SO ALOUD, WHICH IS RARER AND HARDER.\"",
              "\"ONE POURED A SMALL GOD FULL AND SENT IT UP. THAT ONE IS IN THE HALL BEHIND THE HAMMER, KNEELING, WITH VERY BEAUTIFUL HANDS.\""
            ],
            effects: [
              { t: "flag", id: "f4_mould_history" }
            ]
          },
          {
            id: "f4_c_mould_nothing",
            text: "Make nothing, and say so out loud.",
            reply: [
              "\"SAY IT PROPERLY. SAY THAT YOU HAVE LOOKED AT THE METAL AND DECIDED THE WORLD DOES NOT NEED THE THING YOU WOULD MAKE TODAY.\"",
              "You say it. The channel closes — not slamming, simply ceasing to be open. \"RECORDED. IT IS NOT THE COMPLETE ANSWER. IT IS ALSO NOT NOTHING, AND THE DIFFERENCE WILL MATTER TO YOU FURTHER DOWN.\""
            ],
            effects: [
              { t: "flag", id: "f4_made_nothing" },
              { t: "sound", id: "stone" }
            ]
          }
        ]
      },
      doors: [
        { to: "f4_exit", label: "The Tapping Stair" }
      ]
    },

    // ---------------------------------------------------------------- EXIT
    {
      id: "f4_exit",
      name: "The Tapping Stair",
      kind: "exit",
      size: "medium",
      desc: "A staircase going down, with a small god sitting on the ninth step, tapping it.",
      props: ["stairs", "candles"],
      npc: {
        id: "f4_downward",
        name: "Downward",
        title: "God of This Particular Staircase",
        form: "child",
        voice: "bell",
        palette: { robe: "#2a2a33", trim: "#ffd08a", glow: "#ffb46b" },
        greet: [
          "\"Ninety-one steps,\" says the small god on the ninth one. \"I'm not the god of stairs. I'm the god of *this* stair. That's the whole of me and it's enough.\"",
          "\"I'm bound, by the way. Properly. Top step to bottom and no further. People find that sad. It is the least sad thing about me.\""
        ],
        idle: [
          "\"Ninety-one,\" it says. \"Down.\""
        ],
        choices: [
          {
            id: "f4_c_exit_token",
            text: "Descend, carrying a god that knows where it stops.",
            require: { flags: ["f4_gave_limit"] },
            reply: [
              "The small god stands up, which it has not done in two hundred years. \"You bound one.\" Tap. Tap. \"There's another of us, and it's got an edge, and it knows where it is.\"",
              "\"When you reach the bottom of everything and they ask what you'd put into the world, you'll have a shorter answer than most, and a truer one. Mind the ninth step. It's me.\""
            ],
            effects: [
              { t: "sound", id: "bell" },
              { t: "floorEnd", token: true }
            ]
          },
          {
            id: "f4_c_exit_full",
            text: "Descend, carrying a god that was given everything.",
            require: { flags: ["f4_made_power"] },
            reply: [
              "The small god looks at what you are carrying for a while. \"It's happy. That's true and I'll say it.\" Tap. \"Down you go. I hope you're somewhere else when it finishes.\""
            ],
            effects: [
              { t: "floorEnd" }
            ]
          },
          {
            id: "f4_c_exit_plain",
            text: "Descend.",
            reply: [
              "\"Down,\" agrees Downward, and taps the ninth step, and behind you the hammer falls again, four seconds after the last one, exactly."
            ],
            effects: [
              { t: "floorEnd" }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

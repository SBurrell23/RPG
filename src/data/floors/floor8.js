// Floor 8 — The Ossuary Court
// Ward the Eighth — Who will you owe?

export default {
  id: 8,
  name: "The Ossuary Court",
  theme: "ossuary",
  subtitle: "Ward the Eighth — Who will you owe?",
  intro:
    "The stair lets out under a vault of ribs, and the ribs are load-bearing. Candles burn without heat " +
    "down a nave of bonewhite and deep purple. Ahead, in a session never adjourned in two hundred years, " +
    "a court is still politely waiting for a party who no longer exists.",
  entry: "f8_entry",

  items: {
    writ_of_attendance: {
      name: "Writ of Attendance",
      kind: "trade",
      value: 4,
      icon: "scroll",
      tint: "#d8cfe6",
      desc: "Entered, timed, countersigned. It proves you were here, which is smaller than it sounds and larger than you would like."
    },
    writ_of_assumption: {
      name: "Writ of Assumption",
      kind: "relic",
      value: 0,
      icon: "scroll",
      tint: "#b98cd8",
      desc: "A blank instrument for taking on another party's obligation. The debtor's line is very long, as though whoever ruled the paper expected the name to need room."
    },
    forged_quittance: {
      name: "Quittance, Forged",
      kind: "trade",
      value: 40,
      icon: "scroll",
      tint: "#c8b08a",
      desc: "Correct in every particular except the one where it is not true. The creditor's name is in a hand that matches your own."
    },
    sealed_quittance: {
      name: "Quittance in Gold",
      kind: "relic",
      value: 150,
      icon: "coin",
      tint: "#e8c86a",
      desc: "A discharge bought outright and stamped through. It records that the obligation was extinguished, and not by whom. That is what paying is for."
    },
    muniment_key: {
      name: "Muniment Key",
      kind: "key",
      value: 30,
      icon: "key",
      tint: "#cbb6d8",
      desc: "Cut from a shoulder blade. Opens the room where the houses keep the deeds they no longer have anyone to leave."
    },
    paid_ring: {
      name: "Ring of a Paid Debt",
      kind: "relic",
      value: 55,
      icon: "ring",
      tint: "#efe2f2",
      desc: "Worn by a creditor satisfied in full. It confers the right to leave, and has conferred it uninterrupted for two hundred and six years."
    },
    court_summons: {
      name: "Summons in Full Session",
      kind: "trade",
      value: 10,
      icon: "bell",
      tint: "#cbb0e0",
      desc: "Your name under a column headed PARTIES APPEARING. Reading it makes the back of your neck cold in a way the air does not account for."
    }
  },

  rooms: [
    // ------------------------------------------------------------------ ENTRY
    {
      id: "f8_entry",
      name: "The Adjournment Porch",
      kind: "entry",
      size: "medium",
      desc: "A porch of stacked femurs and purple felt, swept clean, with a ledger open on a lectern nobody is standing at.",
      props: ["pillars", "banners", "candles"],
      onEnter: [
        { t: "say", text: "Every candle here burns and none of them are warm." },
        { t: "sound", id: "bell" }
      ],
      npc: {
        id: "f8_ortalan",
        name: "Ortalan",
        title: "the Standing Bailiff",
        form: "armored",
        voice: "mid",
        palette: { robe: "#2a2136", trim: "#d6c8e8", skin: "#e6ddc8", glow: "#c59cf0" },
        greet: [
          "Bone in a purple surcoat, stood so long the floor has worn to fit his boots. He counts. \"One. That is you. One party appearing, unrepresented, alive. Noted.\"",
          "\"I must enter you. Not a threat — procedure. Anyone crossing this porch attends the session, and attendance is a service rendered, and services rendered are entered against a name.\""
        ],
        idle: ["\"Noted. Still one. Still you.\""],
        choices: [
          {
            id: "f8_c_ask_debt",
            text: "Ask what, exactly, I am being charged for.",
            once: true,
            reply: [
              "\"Convening. Tapers lit, roll opened, Justice woken. You are the first live party in two hundred and six years, so the cost is enormous, and it is entered against you.\"",
              "\"The Court will not let a party leave while the party is in debt to it. Not spite. Tidiness.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_debt" },
              {
                t: "codex",
                id: "f8_convening",
                title: "On Convening",
                text: "The Ossuary Court charges for its own attention. A session costs something to hold, and the cost is entered against whoever caused it to be held. Two centuries of adjournment accrued nothing, because nothing was happening. You happened."
              }
            ]
          },
          {
            id: "f8_c_enter",
            text: "Give him a name to enter.",
            once: true,
            reply: [
              "He writes without looking down. The pen is a finger. \"Entered. Take the writ. A party who cannot prove attendance was never here, and the Court has enough missing parties.\"",
              "A pause exactly one beat too long. \"Forget I said that.\""
            ],
            effects: [
              { t: "item", id: "writ_of_attendance", n: 1 },
              { t: "flag", id: "f8_entered" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f8_c_warn",
            text: "Ask what I should not do here.",
            once: true,
            reply: [
              "\"Three. The west taper walk off the cloister — do not count the candles. The hole below the counting-house, where the pauper debtors went. The deep stacks under the undercroft. All three have an exit. None is free.\""
            ],
            effects: [
              { t: "flag", id: "f8_warned" },
              {
                t: "codex",
                id: "f8_deadends",
                title: "Three Places Ortalan Names",
                text: "The taper walk off the cloister. The pauper hole below the counting-house. The deep stacks under the undercroft. All three let you out again. All three take a heartbeat as the fare."
              }
            ]
          },
          {
            id: "f8_c_last",
            text: "Ask about the last Petitioner who came down.",
            once: true,
            reply: [
              "Ortalan stops counting. It is the loudest thing that has happened since you arrived. \"That is not entered. You may go up the nave.\""
            ],
            effects: [{ t: "sound", id: "stone" }]
          },
          {
            id: "f8_c_go",
            text: "Go in.",
            once: false,
            reply: ["\"Nave on, cloister left, undercroft down. All three reach the same registry. Most things do.\""],
            effects: []
          }
        ]
      },
      doors: [
        { to: "f8_nave", label: "The Nave" },
        { to: "f8_cloister", label: "The Cloister Arch" },
        { to: "f8_undercroft", label: "The Undercroft Stair" }
      ]
    },

    // ------------------------------------------------------------------- NAVE
    {
      id: "f8_nave",
      name: "The Nave of Arrears",
      kind: "hub",
      size: "grand",
      desc: "A cathedral nave ribbed in vertebrae, hung with the banners of houses whose names have worn off the cloth.",
      props: ["pillars", "banners", "bones", "candles"],
      onEnter: [{ t: "say", text: "Something in the high vault is reciting, and has not stopped to breathe." }],
      npc: {
        id: "f8_litany",
        name: "The Litany of Arrears",
        title: "a Standing Recitation",
        form: "floating",
        voice: "choral",
        palette: { robe: "#3b2a52", trim: "#e4d8f0", glow: "#a67ce0" },
        greet: [
          "Not a person. A reading, going on by itself, the way a wheel turns after the cart has stopped.",
          "\"—house of Mell, four hundred weight of remembering, tendered—\" It notices you the way weather notices a window. \"A party appearing. The roll from the top, or the part that matters?\""
        ],
        idle: ["\"—house of Mell, four hundred weight of remembering, tendered—\""],
        choices: [
          {
            id: "f8_c_litany_short",
            text: "Ask what the houses bought.",
            once: true,
            reply: [
              "\"They bought the Cadence. It was not given to the world; it was financed. Nine houses mortgaged their own remembering — weddings, grudges, the shape of their mothers.\"",
              "\"Their term: go without, so everyone else need not, and be remembered forever in exchange. It is the only term the engine ever kept. They are all still here.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_houses" },
              {
                t: "codex",
                id: "f8_consortium",
                title: "The Nine Houses",
                text: "The Cadence was a loan against nine noble families' own memories. They paid in everything they were, and were promised they personally would never be forgotten. They were not forgotten. They are still in the building."
              }
            ]
          },
          {
            id: "f8_c_litany_full",
            text: "Pay ten gold for the roll from the top.",
            require: { gold: 10 },
            lockedText: "(Ten gold for the full recitation. You do not have it.)",
            once: true,
            reply: [
              "\"—Mell, Sarrow, Dunkan, Fen, Oby, Trellick, Sabbard, house of Arvellin, house of—\" It stops. It has not stopped before.",
              "\"Arvellin subscribed the largest share and stands principal creditor. No seat, no bones, no banner, no heir. When the engine stopped they went out like a hand taken off a candle. The case cannot proceed, and everyone here would rather you did not say so in the Court.\""
            ],
            effects: [
              { t: "gold", n: -10 },
              { t: "flag", id: "f8_knows_arvellin" },
              { t: "sound", id: "coin" },
              {
                t: "codex",
                id: "f8_arvellin",
                title: "House Arvellin",
                text: "Principal creditor of the Cadence. Thinned to nothing when the engine stopped remembering them. The case cannot proceed without them, so the session has never ended."
              }
            ]
          },
          {
            id: "f8_c_litany_hush",
            text: "Ask it to stop, just for a moment.",
            once: true,
            reply: [
              "It stops. The silence has weight, like water. \"A kindness, and it is entered as one. Somebody will have to repay it.\""
            ],
            effects: [{ t: "flag", id: "f8_hushed_litany" }, { t: "sound", id: "whisper" }]
          },
          {
            id: "f8_c_litany_leave",
            text: "Let it recite.",
            once: false,
            reply: ["\"—tendered; tendered; tendered—\""],
            effects: []
          }
        ]
      },
      doors: [
        { to: "f8_court", label: "The Court Doors" },
        { to: "f8_countinghouse", label: "The Counting-House" },
        { to: "f8_lectern", label: "The Reading Aisle" }
      ]
    },

    // --------------------------------------------------------------- CLOISTER
    {
      id: "f8_cloister",
      name: "The Bone Cloister",
      kind: "branch",
      size: "hall",
      desc: "A covered walk whose every arch is a ribcage, opened outward, holding up a ceiling of interlocked hands.",
      props: ["bones", "pillars", "candles"],
      onEnter: [
        { t: "say", text: "The hands in the ceiling are all cupped, palm up, in the oldest gesture there is." }
      ],
      doors: [
        { to: "f8_writing_room", label: "The Writing Room" },
        { to: "f8_paid_gallery", label: "The Gallery of the Satisfied" },
        { to: "f8_taper_walk", label: "The West Taper Walk" }
      ]
    },

    // ------------------------------------------------------------- UNDERCROFT
    {
      id: "f8_undercroft",
      name: "The Undercroft of Sureties",
      kind: "branch",
      size: "large",
      desc: "Sarcophagi stacked four high, each with a chain run through its handle and back into the wall.",
      props: ["sarcophagi", "chains", "candles"],
      npc: {
        id: "f8_hesk",
        name: "Hesk",
        title: "Surety-Bearer",
        form: "armored",
        voice: "low",
        palette: { robe: "#33283f", trim: "#b8a6c8", skin: "#ded2bc", glow: "#8f6fd0" },
        greet: [
          "A big man in dented harness, standing. Not standing guard, not standing about — standing, as an occupation.",
          "\"Two hundred and six years. I stood surety for a man named Corbel Fen. If I sit before he returns, the surety is forfeit and the Court takes it out of whatever is left of him. So. Standing.\""
        ],
        idle: ["\"Two hundred and six. And a bit. Standing.\""],
        choices: [
          {
            id: "f8_c_hesk_ask",
            text: "Ask what he thinks happened to Corbel Fen.",
            once: true,
            reply: [
              "\"He got out. Good for him.\" No bitterness at all; that is the worst part. \"A surety is not a promise about the world. It is a promise about me.\"",
              "\"You will be asked to owe something before you leave. Ask one question of it: when this comes due, who is actually standing here for it? If the answer is nobody, it is not a debt. It is a hole with a lid on it.\""
            ],
            effects: [{ t: "flag", id: "f8_hesk_advice" }]
          },
          {
            id: "f8_c_hesk_witness",
            text: "Offer to witness that he is still standing.",
            once: true,
            reply: [
              "The shift of his weight stops. \"You would sign that the surety-bearer Hesk was observed upright and in performance? That has not been entered since the fourth year.\"",
              "He drops a purse at your feet, refusing to bend. \"Witness-money. Take it, or a coin sits on the floor of a court, and that is an untidiness I would have to look at.\""
            ],
            effects: [
              { t: "gold", n: 35 },
              { t: "flag", id: "f8_witnessed_hesk" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f8_c_hesk_relieve",
            text: "Stand surety in his place, on the Iron Pact.",
            require: { class: ["warden"], notFlags: ["f8_relieved_hesk"] },
            lockedText: "(You would need an oath the Court recognises.)",
            once: true,
            reply: [
              "You give the old form. The dissolved order's words, which are still words. Hesk does not sit; he looks like a man who has forgotten how and is willing to be taught.",
              "\"You have picked up two hundred and six years of somebody else's posture.\" A ring of bone keys. \"Corbel left it against his return. The muniment room.\""
            ],
            effects: [
              { t: "item", id: "muniment_key", n: 1 },
              { t: "flag", id: "f8_relieved_hesk" },
              { t: "unlock", to: "f8_muniment" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f8_c_hesk_shape",
            text: "Read the true shape of the undercroft.",
            require: { class: ["cartographer"], notFlags: ["f8_found_muniment"] },
            lockedText: "(The wall is wrong somewhere. You cannot say where.)",
            once: true,
            reply: [
              "The undercroft is eleven feet longer than it admits, and the missing eleven feet are behind the fourth stack of sarcophagi, and have a door in them.",
              "Hesk watches. \"Corbel knew when a room was lying about its width. Rooms can do that. People can't.\""
            ],
            effects: [
              { t: "flag", id: "f8_found_muniment" },
              { t: "unlock", to: "f8_muniment" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f8_c_hesk_deep",
            text: "Ask about the deep stacks.",
            once: false,
            reply: [
              "\"Down and left. Not dangerous in any way you could fight — only very interested in anyone with a heartbeat to put up as collateral. A toll, not a trap.\""
            ],
            effects: [{ t: "flag", id: "f8_warned_deep" }]
          }
        ]
      },
      doors: [
        { to: "f8_carrier", label: "The Salt Niche" },
        { to: "f8_ossuary_deep", label: "The Deep Stacks" },
        { to: "f8_muniment", locked: true, label: "The Muniment Door" }
      ]
    },

    // ------------------------------------------------------------------ COURT
    {
      id: "f8_court",
      name: "The Court in Session",
      kind: "hub",
      size: "grand",
      desc: "Tiered benches of skulls facing a throne of fused pelvises, and on every bench a noble, seated, attentive, and two hundred years dead.",
      props: ["throne", "bones", "banners", "candles"],
      onEnter: [
        { t: "say", text: "Three hundred dead nobles turn their heads at once, politely, and wait for you to be introduced." },
        { t: "sound", id: "bell" }
      ],
      npc: {
        id: "f8_justice",
        name: "The Sitting Justice",
        title: "Presiding, Without Recess",
        form: "tall",
        voice: "dry",
        palette: { robe: "#2b1f3c", trim: "#efe4f6", skin: "#e8e0cc", glow: "#c79cf4" },
        greet: [
          "Seven feet of articulated bone in purple that has not faded, because nothing here fades. The gavel is down. It has been down two centuries; the wood beneath it has dented.",
          "\"Party appearing in person and unrepresented. You are welcome, and extremely late, though not through any fault of your own. You will be addressed by your standing in the case. Do you wish one, Party Appearing?\""
        ],
        idle: ["\"The Court remains in session, Party Appearing. It is very good at that, and at almost nothing else.\""],
        choices: [
          {
            id: "f8_c_standing",
            text: "Ask to be given a standing.",
            once: true,
            reply: [
              "\"Granted. Party of the Fifth Part: attending, indebted, not yet heard. The registry opens to you; a standing is very nearly the only key here.\"",
              "A purse appears on the rail. \"The Court disburses to parties appearing. That is not a discharge. Do not confuse a payment made to you with one made by you; that confusion is how half this room ended up on the benches.\""
            ],
            effects: [
              { t: "gold", n: 25 },
              { t: "flag", id: "f8_standing" },
              { t: "unlock", to: "f8_registry" },
              { t: "unlock", to: "f8_seal_room" },
              { t: "item", id: "court_summons", n: 1 },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f8_c_case",
            text: "Ask what the case is.",
            once: true,
            reply: [
              "\"The subscribing houses against the instrument they subscribed to. Nine advanced their remembering; it undertook to remember them in perpetuity; it stopped.\"",
              "\"Nothing here is in dispute, Party Appearing. That is what makes it unbearable. There is only the ruling, and the ruling requires all parties present. All parties are present.\" The gavel stays down. \"That statement is why this session has lasted two hundred and six years.\""
            ],
            effects: [{ t: "flag", id: "f8_knows_case" }]
          },
          {
            id: "f8_c_missing",
            text: "Ask about the party who is missing.",
            require: { flags: ["f8_knows_arvellin"] },
            lockedText: "(You would have to know there was one.)",
            once: true,
            reply: [
              "The whole room does not move, which is a thing three hundred skeletons can do very loudly.",
              "\"The Court will not discuss that. Not from obstinacy — from competence. To say the name is to call the party, and if they do not appear I must rule them in default, and I will not rule a creditor in default for the offence of having been forgotten by the engine paid to remember them.\"",
              "\"So the Court waits. It notes only that its clerk keeps the roll, that the roll is one entry short, and that the Court cannot be expected to notice what its own clerk does with it.\""
            ],
            effects: [
              { t: "flag", id: "f8_justice_hint" },
              {
                t: "codex",
                id: "f8_procedure",
                title: "The Adjournment",
                text: "The Sitting Justice will not name the missing creditor, because naming them would call them, and failing to appear when called would rule them in default. Two hundred years of waiting is, in the Justice's view, the more merciful option."
              }
            ]
          },
          {
            id: "f8_c_court_debt",
            text: "Ask how a party is permitted to leave.",
            once: true,
            reply: [
              "\"Discharged. You may pay. You may be paid for. You may produce a valid instrument. Or another party may assume the obligation from you.\"",
              "\"The Court examines instruments for validity, not for honesty. Only one of those tests is within its power. That is a limitation, not an invitation. Whichever you choose, you do it at the Crier's stone, aloud. Nothing here takes effect until it is said in a voice.\""
            ],
            effects: [{ t: "flag", id: "f8_knows_routes" }]
          },
          {
            id: "f8_c_court_leave",
            text: "Bow and withdraw.",
            once: false,
            reply: ["\"The Court thanks Party Appearing and remains, as ever, in session.\""],
            effects: []
          }
        ]
      },
      doors: [
        { to: "f8_seal_room", locked: true, label: "The Sealing Room" },
        { to: "f8_registry", locked: true, label: "The Registry Door" }
      ]
    },

    // ---------------------------------------------------------- COUNTING HOUSE
    {
      id: "f8_countinghouse",
      name: "The Counting-House",
      kind: "shop",
      size: "medium",
      desc: "A narrow office off the nave, every surface covered in small stacks, and every stack a different person's outstanding balance.",
      props: ["table", "candles", "shelves"],
      npc: {
        id: "f8_osk",
        name: "Vellum Osk",
        title: "Broker of Standing Obligations",
        form: "twin",
        voice: "dry",
        palette: { robe: "#3a2b48", trim: "#e0c878", skin: "#dcd0b8", glow: "#f0c96a" },
        greet: [
          "Osk has two faces on one skull, set at a slight angle. The left buys. The right sells. They agree about everything except the number.",
          "\"Bid,\" says the left. \"Ask,\" says the right. \"There is a spread. That is not greed; that is what a market is. I buy obligations at a discount, because I take a risk, and sell you out of one at a premium, because you are in a hurry.\""
        ],
        idle: ["\"Bid,\" says the left. \"Ask,\" says the right. \"Still trading.\""],
        choices: [
          {
            id: "f8_c_osk_shop",
            text: "Trade.",
            once: false,
            reply: ["\"Both faces, one till. Look your fill.\""],
            effects: [
              {
                t: "shop",
                stock: [
                  { item: "forged_quittance", price: 55 },
                  { item: "muniment_key", price: 30 },
                  { item: "owed_favor", price: 90 },
                  { item: "tallow_candle", price: 8 },
                  { item: "black_glass_hex", price: 45 },
                  { item: "sealed_quittance", price: 150 }
                ],
                buys: [
                  { item: "ledger_stub", price: 20 },
                  { item: "quiet_coin", price: 55 },
                  { item: "owed_favor", price: 40 },
                  { item: "paid_ring", price: 38 },
                  { item: "salt_shard", price: 14 },
                  { item: "drowned_page", price: 28 },
                  { item: "stopped_tooth", price: 32 },
                  { item: "held_note", price: 44 },
                  { item: "grey_feather", price: 11 },
                  { item: "mourner_mask", price: 30 }
                ]
              },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f8_c_osk_forgery",
            text: "Ask about the forged quittance, plainly.",
            once: true,
            reply: [
              "\"It is a forgery,\" says the left. \"It is an excellent forgery,\" says the right. \"Valid and untrue. The Seal will stamp it, because the Seal cannot read. The Crier will accept it, because the Crier tests form.\"",
              "Both faces turn the same way at once, which is unpleasant. \"One caveat, free: an obligation is not destroyed by being papered over. It is relocated. People who use my paper meet it again further down, wearing a different hat.\""
            ],
            effects: [{ t: "flag", id: "f8_osk_caveat" }]
          },
          {
            id: "f8_c_osk_price",
            text: "Name the true price of his paper.",
            require: { class: ["coinwright"], notFlags: ["f8_osk_respect"] },
            lockedText: "(You would need to be able to see what a thing actually costs.)",
            once: true,
            reply: [
              "You set the Skeleton Sigil on the counter and say the number under the asking number. Vellum, hand, hour, risk, and Osk's margin to the quarter.",
              "Both faces smile, which is one smile too many. \"A colleague. Twenty gold off everything, and the candle for nothing — I am buying the pleasure of having been read correctly, and I consider it cheap. And since you see prices: my trapdoor is the pauper hole. It still costs a heartbeat, because nobody told it that it closed.\""
            ],
            effects: [
              { t: "flag", id: "f8_osk_respect" },
              { t: "flag", id: "f8_warned_pauper" },
              { t: "gold", n: 20 },
              { t: "item", id: "tallow_candle", n: 1 },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f8_c_osk_own",
            text: "Ask who holds Osk's own debt.",
            once: true,
            reply: [
              "The left face keeps smiling. The right stops. \"Not for sale,\" says the right. \"Not for sale,\" agrees the left, half a second late, and they do not look at each other, which for a man with two faces on one skull takes work."
            ],
            effects: []
          },
          {
            id: "f8_c_osk_carry",
            text: "Ask if anyone will simply carry a debt for you.",
            once: true,
            reply: [
              "\"The thing in the salt niche under the undercroft will,\" says the right, \"and I take no commission, which should tell you something.\"",
              "Together: \"The paperwork is flawless. And then the debt is somewhere it cannot be found, and every ledger holding it has a hole in it. Some people want that. I sell to those people too.\""
            ],
            effects: [{ t: "flag", id: "f8_knows_carrier" }]
          }
        ]
      },
      doors: [{ to: "f8_pauper_hole", label: "The Trapdoor" }]
    },

    // ----------------------------------------------------------- WRITING ROOM
    {
      id: "f8_writing_room",
      name: "The Writing Room",
      kind: "branch",
      size: "medium",
      desc: "A low room of desks and cold light where one clerk works alone among nine hundred closed volumes and one open one.",
      props: ["table", "bookstacks", "candles"],
      npc: {
        id: "f8_anneve",
        name: "Anneve",
        title: "Clerk of the Registry",
        form: "hunched",
        voice: "mid",
        palette: { robe: "#2f2740", trim: "#cfe0d8", skin: "#e2d6c0", glow: "#9fe0c8" },
        greet: [
          "She does not look up. \"Sorry about the ink. It's two hundred years old and gone to sludge; everything I write looks like an accusation.\"",
          "The open volume is almost entirely full. On the last page there is one line, ruled, headed, and empty."
        ],
        idle: ["\"Sorry about the ink. Still one short.\""],
        choices: [
          {
            id: "f8_c_anneve_name",
            text: "Ask her name before asking her for anything.",
            once: true,
            reply: [
              "She looks up. It takes her a moment to remember how the muscles work. \"Anneve. The Justice says Clerk of the Registry. The nobles say clerk. Ortalan says Registry, as though the room does the writing.\"",
              "She sets the pen down, which she has not done today, or possibly this century. \"Sit down, you're making the desk nervous. What do you actually need?\""
            ],
            effects: [{ t: "flag", id: "f8_anneve_named" }, { t: "sound", id: "chime" }]
          },
          {
            id: "f8_c_anneve_book",
            text: "Ask about the one empty line.",
            once: true,
            reply: [
              "\"The last entry. The books close when it's filled and not before, and I've been one short since the fourth year. It's a debtor's line.\"",
              "\"An open ledger means a session, and a session means all of that—\" she gestures, without looking, at the wall the Court is behind. \"Three hundred people sitting upright for two centuries because of seven inches.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_entry" },
              {
                t: "codex",
                id: "f8_last_line",
                title: "The Last Entry",
                text: "The registry closes when its final line is filled: a debtor for an obligation nobody has assumed. One line. Seven inches. Two hundred and six years."
              }
            ]
          },
          {
            id: "f8_c_anneve_writ",
            text: "Ask her to draw up a Writ of Assumption.",
            require: { flags: ["f8_anneve_named"] },
            lockedText: "(She is a function to you so far, and functions do not do favours.)",
            once: true,
            reply: [
              "She goes very still. \"You know what that instrument is for. I'll write it, but I'll be clear, because you've been decent to me.\"",
              "\"It takes another party's obligation onto you. Not a copy. It. And the one on the table is the Cadence's own — everything it took and did not give back. Nobody can pay that, which is exactly why it has sat unassumed while three hundred clever people found something else to do.\"",
              "She blows on the ink. \"The debtor's line is blank. The Crier will make you fill it aloud, and say the sum, and the sum is unpayable. You will have to say that word about yourself, in public, and mean it.\""
            ],
            effects: [
              { t: "item", id: "writ_of_assumption", n: 1 },
              { t: "flag", id: "f8_has_writ" },
              { t: "unlock", to: "f8_registry" },
              { t: "unlock", to: "f8_seal_room" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f8_c_anneve_forge",
            text: "Draw up your own discharge at her desk.",
            require: { class: ["coinwright"], notFlags: ["f8_forged"] },
            lockedText: "(You would need a hand that can make paper true enough.)",
            once: true,
            reply: [
              "A blank, a straightedge, forty minutes. The Skeleton Sigil does the rest. Anneve watches without stopping you, which is worse than being stopped.",
              "\"It's good. One thing — you've written yourself in as the satisfied creditor, because there wasn't a real one to name. That's the correct forger's choice. It does mean the ledger now shows you owing a sum to yourself. Nobody's tried it. I'd have liked to close the books, that's all.\""
            ],
            effects: [
              { t: "item", id: "forged_quittance", n: 1 },
              { t: "flag", id: "f8_forged" },
              { t: "unlock", to: "f8_registry" },
              { t: "unlock", to: "f8_seal_room" },
              { t: "sound", id: "whisper" }
            ]
          },
          {
            id: "f8_c_anneve_justice",
            text: "Ask what she thinks the Justice should rule.",
            once: false,
            reply: [
              "\"I keep the roll. If I had a view I'd be a party, and if I were a party I couldn't keep the roll, and then nobody would. Sorry about the ink.\""
            ],
            effects: []
          }
        ]
      },
      doors: [{ to: "f8_registry", locked: true, label: "The Clerk's Door" }]
    },

    // ------------------------------------------------------------ PAID GALLERY
    {
      id: "f8_paid_gallery",
      name: "The Gallery of the Satisfied",
      kind: "branch",
      size: "large",
      desc: "A long gallery of empty chairs with one occupied, and an open door at the far end with daylight-coloured nothing behind it.",
      props: ["pillars", "banners", "candles", "throne"],
      onEnter: [
        { t: "say", text: "The door at the end of the gallery is open. It has been open a long time." }
      ],
      npc: {
        id: "f8_corvenant",
        name: "Lady Corvenant",
        title: "Paid In Full",
        form: "robed",
        voice: "high",
        palette: { robe: "#4a2f5e", trim: "#f4ecf8", skin: "#eae0cc", glow: "#e8c4f6" },
        greet: [
          "She sits at the very edge of her chair, hands on knees, in the attitude of a woman about to stand up. She has been about to stand up for a long time.",
          "\"Oh — a live one.\" She almost rises. Doesn't. \"I am satisfied. Paid in full in the eleventh year. Nothing outstanding against me in any book here. The door at the end is open. It has always been open. I want you to have seen that.\""
        ],
        idle: ["She is still at the edge of the chair. \"Any moment now,\" she says, brightly."],
        choices: [
          {
            id: "f8_c_corv_why",
            text: "Ask why she has not walked out.",
            once: true,
            reply: [
              "\"I don't know.\" She says it the way you would say the date. \"Two hundred years to find a better answer. I am not afraid of the stair. I owe nothing and am owed nothing.\"",
              "\"I simply have not stood up. Every morning: today, obviously. And then it is the part of the day when I have not, and then the year. The debt was the shape I was in. It was paid and I kept the shape.\"",
              "\"I am the reason to be careful how you leave. They will let you go; that is not the question. The question is what you will still be standing in the middle of afterwards.\""
            ],
            effects: [
              { t: "flag", id: "f8_corvenant_answer" },
              {
                t: "codex",
                id: "f8_satisfied",
                title: "Paid In Full",
                text: "Lady Corvenant's debt was discharged in the eleventh year. The gallery door has stood open ever since. She has not walked through it and cannot say why. A debt can be paid off and still be the shape a person is in."
              }
            ]
          },
          {
            id: "f8_c_corv_houses",
            text: "Ask which houses are missing from these chairs.",
            once: true,
            reply: [
              "She counts them off, because she is a noblewoman and this is what she is for. \"Mell, Sarrow, Dunkan, Fen, Oby, Trellick, Sabbard — and Arvellin, who is not missing from the chairs, dear, because Arvellin never had one. By the time the benches were carved there was nothing left of them to sit in it.\"",
              "\"They are why the Justice cannot rule. And I cannot remember a single face of theirs, and I remember everything; that is the entire point of me.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_arvellin" },
              {
                t: "codex",
                id: "f8_arvellin",
                title: "House Arvellin",
                text: "Principal creditor of the Cadence. Thinned to nothing when the engine stopped remembering them. The case cannot proceed without them, so the session has never ended."
              }
            ]
          },
          {
            id: "f8_c_corv_favor",
            text: "Ask her for a favour, written down.",
            once: true,
            reply: [
              "\"Oh, gladly.\" She is delighted; it is the most alive thing on the floor. \"How long since anybody wanted something from me? I am a solvent woman with no obligations. I am completely useless.\"",
              "She writes it on the chair-arm with a pin. \"Undated and unlimited. Any house here will honour it; debt outlives jurisdiction. Take the ring too — it confers the right to leave. I should like it used, once, by somebody.\""
            ],
            effects: [
              { t: "item", id: "owed_favor", n: 1 },
              { t: "item", id: "paid_ring", n: 1 },
              { t: "gold", n: 20 },
              { t: "flag", id: "f8_has_favor" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f8_c_corv_walls",
            text: "Mention the singing through the thin walls above.",
            require: { flags: ["f7_said_name"] },
            lockedText: "(You have nothing from the floor above worth telling her.)",
            once: true,
            reply: [
              "\"The choir. They say things aloud until the saying is the thing. We write things down until the writing is the thing. The same illness, one floor apart. Theirs is prettier.\""
            ],
            effects: [{ t: "flag", id: "f8_choir_talk" }]
          },
          {
            id: "f8_c_corv_stand",
            text: "Offer her your arm.",
            once: true,
            reply: [
              "She looks at your hand for a very long time. \"That was extremely kind.\" She does not take it. \"Not today. Ask me again when you come back up.\" Nobody in the Verrow lies. She believes you are coming back up, which is its own kind of news."
            ],
            effects: [{ t: "flag", id: "f8_offered_arm" }, { t: "sound", id: "whisper" }]
          }
        ]
      },
      doors: [{ to: "f8_reliquary_bench", label: "The Bench Alcove" }]
    },

    // ------------------------------------------------------------ TAPER WALK (DEADEND)
    {
      id: "f8_taper_walk",
      name: "The West Taper Walk",
      kind: "deadend",
      size: "hall",
      desc: "Nine hundred cold candles in a row, all lit, all the same height, all inviting a count.",
      props: ["candles", "pillars"],
      onEnter: [
        { t: "say", text: "You reach four hundred and eleven before you understand that the candles are not being counted by you." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "One year, taken neatly off the end, the way you would trim a wick. The cloister is behind you again." },
        { t: "move", to: "f8_cloister" }
      ],
      doors: []
    },

    // ----------------------------------------------------------- PAUPER HOLE (DEADEND)
    {
      id: "f8_pauper_hole",
      name: "The Pauper Hole",
      kind: "deadend",
      size: "small",
      desc: "A brick shaft where debtors too poor to be worth a bench were kept, and were never told the practice had ended.",
      props: ["rubble", "chains", "bones"],
      onEnter: [
        { t: "say", text: "Hands come up out of the brick — courteously, one at a time, the way you would offer a coat." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "They take their fee and lose all interest in you. One hands you a stub of chalk and a torn scrap of somebody's account." },
        { t: "item", id: "chalk_stub", n: 1 },
        { t: "item", id: "ledger_stub", n: 1 },
        { t: "flag", id: "f8_paid_pauper" },
        { t: "unlock", to: "f8_registry" },
        { t: "move", to: "f8_countinghouse" }
      ],
      doors: []
    },

    // ---------------------------------------------------------- OSSUARY DEEP (DEADEND)
    {
      id: "f8_ossuary_deep",
      name: "The Deep Stacks",
      kind: "deadend",
      size: "vault",
      desc: "Bones filed by arrears, smallest debts at the top, and the bottom of the stack a very long way down.",
      props: ["bones", "sarcophagi", "chains"],
      onEnter: [
        { t: "say", text: "The stacks lean in, reading you the way a shopkeeper reads a coin." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "Collateral taken, interest lost. They part, disappointed, and let you back up. A quiet coin has been left in your hand as change." },
        { t: "item", id: "quiet_coin", n: 1 },
        { t: "flag", id: "f8_paid_deep" },
        { t: "move", to: "f8_undercroft" }
      ],
      doors: []
    },

    // ---------------------------------------------------------------- CARRIER
    {
      id: "f8_carrier",
      name: "The Salt Niche",
      kind: "branch",
      size: "medium",
      desc: "An alcove where the bone gives way to raw Caudmere salt, grown into a shape that is nearly a person and has never been one.",
      props: ["crystals", "sand", "candles"],
      npc: {
        id: "f8_carrier_npc",
        name: "The Carrier",
        title: "Salt-Born, Unencumbered",
        form: "coiled",
        voice: "broken",
        palette: { robe: "#5a4a6e", trim: "#f0f4f8", glow: "#dff0f4" },
        greet: [
          "Salt that learned the shape of a person from leaked memory and then improved on it, in its own opinion.",
          "\"I was never anything. Not a soldier who stopped. Not a clerk who was filed. Nothing was taken off me to make me, because there was no me to take from. So I have no creditors. I am the only clean ledger under the salt, and I rent the cleanliness out.\""
        ],
        idle: ["\"Still clean. Still renting.\""],
        choices: [
          {
            id: "f8_c_carrier_ask",
            text: "Ask what it charges to take a debt.",
            once: true,
            reply: [
              "\"One thing you own, and it must be a thing you would rather keep, or the transfer will not hold. Obligation is made of reluctance. That is what the stuff is.\"",
              "\"Then it is mine, and the paperwork is flawless. Know the rest: I cannot be summoned. No name in any roll, no house, no grave. The debt goes nowhere, and the ledger holding it has a hole in it the size of the debt.\""
            ],
            effects: [
              { t: "flag", id: "f8_carrier_terms" },
              {
                t: "codex",
                id: "f8_saltborn",
                title: "The Unencumbered",
                text: "Salt-Born owe nothing because nothing was taken to make them. A debt handed to one is not discharged; it is put somewhere that cannot be found, in a ledger that can never be balanced again."
              }
            ]
          },
          {
            id: "f8_c_carrier_give_ring",
            text: "Give it the Ring of a Paid Debt to carry yours.",
            require: { items: ["paid_ring"], notFlags: ["f8_carried"] },
            lockedText: "(It wants something you would rather keep. You have nothing you would rather keep.)",
            once: true,
            reply: [
              "It takes the ring and does not put it on, having no finger and wanting none. \"Accepted. Your obligation is mine as of this breath. Tell the Crier.\"",
              "The salt settles. \"She gave you that so it would be used. It has been. I do not think this is what she meant, but meaning is not a term of the contract.\""
            ],
            effects: [
              { t: "item", id: "paid_ring", n: -1 },
              { t: "flag", id: "f8_carried" },
              { t: "unlock", to: "f8_registry" },
              { t: "sound", id: "crack" }
            ]
          },
          {
            id: "f8_c_carrier_give_favor",
            text: "Give it the Favour, Written Down, to carry yours.",
            require: { items: ["owed_favor"], notFlags: ["f8_carried"] },
            lockedText: "(It wants something you would rather keep. Written favours count.)",
            once: true,
            reply: [
              "\"A favour owed you by a dead noble. Reluctance, yes. Accepted.\" The salt closes over the strip of bone-paper, and the favour is now somewhere no ledger can point at."
            ],
            effects: [
              { t: "item", id: "owed_favor", n: -1 },
              { t: "flag", id: "f8_carried" },
              { t: "unlock", to: "f8_registry" },
              { t: "sound", id: "crack" }
            ]
          },
          {
            id: "f8_c_carrier_pride",
            text: "Ask if it ever wanted to have been something first.",
            once: false,
            reply: [
              "\"No. Everything else down here is a subtraction. A person minus the war. A house minus its name. You are all remainders. I am a sum.\""
            ],
            effects: []
          }
        ]
      },
      doors: [{ to: "f8_registry", locked: true, label: "The Niche Passage" }]
    },

    // --------------------------------------------------------------- MUNIMENT
    {
      id: "f8_muniment",
      name: "The Muniment Room",
      kind: "vault",
      size: "medium",
      desc: "Deeds, settlements and marriage articles in bone tubes, floor to vault, and one tube on the floor with nothing in it.",
      props: ["shelves", "bookstacks", "candles", "table"],
      npc: {
        id: "f8_tass",
        name: "Tass",
        title: "Under-Warden of Muniments",
        form: "hunched",
        voice: "high",
        palette: { robe: "#382a4a", trim: "#d0c0a0", skin: "#e0d4c0", glow: "#b0e0d0" },
        greet: [
          "A small skeleton in under-warden's grey, on a stool, hands flat on his knees, facing the door. Waiting.",
          "\"You've come for a deed. Which house. Please say a house that has a tube. There is one tube on this floor with nothing in it, and I have had two hundred years of the possibility that somebody would ask for that one.\""
        ],
        idle: ["\"Please say a house that has a tube.\""],
        choices: [
          {
            id: "f8_c_tass_empty",
            text: "Ask about the empty tube.",
            once: true,
            reply: [
              "He does not move his hands off his knees. \"Arvellin. The deed was in it. I put it back myself. In the fourth year it stopped having a deed in it, and then it stopped having a label.\"",
              "\"If you hadn't asked, within another century I'd have stopped knowing it was empty rather than spare. The Thinning takes the record, and then the fact that there was a record. That second theft is what makes it stick.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_arvellin" },
              { t: "flag", id: "f8_saw_tube" },
              { t: "sound", id: "whisper" },
              {
                t: "codex",
                id: "f8_arvellin",
                title: "House Arvellin",
                text: "Principal creditor of the Cadence. Thinned to nothing when the engine stopped remembering them. The case cannot proceed without them, so the session has never ended."
              }
            ]
          },
          {
            id: "f8_c_tass_read",
            text: "Read the thinned deeds through the Emberglass Lens.",
            require: { class: ["ashcaller"] },
            lockedText: "(The ink is gone. You would need to read what is no longer there.)",
            once: true,
            reply: [
              "Through the lens the empty tube is warm. Script that has forgotten itself lies inside the bone in a hand that gave up halfway through a word.",
              "*—the said House ARVELLIN doth advance the whole of its remembering, and accepts in consideration only this: that the Engine shall keep the House's name against all wearing, the House having no other—*",
              "Tass watches your face. \"Don't tell me what it says. Tell me only whether it was a fair bargain.\" You tell him. \"Worst kind of thing to have assumed correctly.\""
            ],
            effects: [
              { t: "flag", id: "f8_knows_arvellin" },
              { t: "flag", id: "f8_read_deed" },
              { t: "gold", n: 30 },
              {
                t: "codex",
                id: "f8_bargain",
                title: "The Arvellin Consideration",
                text: "House Arvellin advanced everything and asked one thing in return: to be kept against all wearing. The engine stopped. The consideration failed. Nobody has ever been made whole for it, because there is nobody left to make whole."
              }
            ]
          },
          {
            id: "f8_c_tass_ask",
            text: "Ask him for a house that does have a tube.",
            once: false,
            reply: [
              "He is up like a bird. \"Sarrow! Marriage articles, two settlements and a quarrel — an actual notarised quarrel—\" He reads you the quarrel. It is about a fence. He is happier than anything you have met since the plinth."
            ],
            effects: []
          }
        ]
      },
      doors: [{ to: "f8_seal_room", locked: true, label: "The Sealing Passage" }]
    },

    // --------------------------------------------------------------- LECTERN
    {
      id: "f8_lectern",
      name: "The Reading Aisle",
      kind: "corridor",
      size: "small",
      desc: "A side aisle with a lectern at each end, both open, both at a page somebody meant to come back to.",
      props: ["bookstacks", "candles", "pillars"],
      onEnter: [
        { t: "say", text: "One lectern holds a list of names. The other holds the same list, shorter, in the same hand." },
        { t: "sound", id: "whisper" }
      ],
      doors: [{ to: "f8_reliquary_bench", label: "The Alcove Step" }]
    },

    // -------------------------------------------------------- RELIQUARY BENCH
    {
      id: "f8_reliquary_bench",
      name: "The Bench of the Unclaimed",
      kind: "shrine",
      size: "small",
      desc: "A stone bench with a cold candle at each end and nothing between them, tended anyway.",
      props: ["altar", "candles", "bones"],
      npc: {
        id: "f8_unclaimed",
        name: "The Unclaimed",
        title: "An Obligation Without Parties",
        form: "wisp",
        voice: "choral",
        palette: { robe: "#3d3352", trim: "#e8e0f4", glow: "#cbb0ff" },
        greet: [
          "There is a debt on the bench. Not a debtor, not a creditor, not a document. The obligation itself, sat down, waiting to be owed by somebody.",
          "\"Somebody owed somebody something. I am what is left when you take both of them away and the something stays. I do not want paying. I want witnessing. It took me a hundred years to find the difference.\""
        ],
        idle: ["\"Somebody owed somebody something. Still true.\""],
        choices: [
          {
            id: "f8_c_unclaimed_sit",
            text: "Sit with it for a while.",
            once: true,
            reply: [
              "You sit. Nothing happens for long enough that you begin to feel foolish, and then the feeling passes, and something in your chest that had been clenched since the seventh floor lets go.",
              "\"Thank you. Debts are not made of money. They are made of the fact that somebody noticed. Go on — you have a thing to say out loud somewhere.\""
            ],
            effects: [
              { t: "heart", n: 1 },
              { t: "flag", id: "f8_sat_with_unclaimed" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f8_c_unclaimed_bless",
            text: "Take its weight into the Empty Reliquary.",
            require: { class: ["hollow-saint"] },
            lockedText: "(You would need something hollow enough to put a debt in.)",
            once: true,
            reply: [
              "The reliquary is hinged, lined and empty, and the obligation fits the way a hand fits a glove made for it two hundred years before the hand existed.",
              "\"Somebody's god used to do this,\" it says from inside. \"Not well. You do it better, and I think that is because yours forgot you and you kept the habit anyway.\""
            ],
            effects: [
              { t: "item", id: "black_glass_hex", n: 1 },
              { t: "flag", id: "f8_reliquary_carries" },
              { t: "sound", id: "bell" }
            ]
          },
          {
            id: "f8_c_unclaimed_go",
            text: "Leave it in peace.",
            once: false,
            reply: ["\"That is also witnessing. You looked. Go on.\""],
            effects: []
          }
        ]
      },
      doors: [{ to: "f8_registry", locked: true, label: "The Registry Steps" }]
    },

    // ------------------------------------------------------------- SEAL ROOM
    {
      id: "f8_seal_room",
      name: "The Sealing Room",
      kind: "vault",
      size: "medium",
      desc: "A press the size of a cart, worked by a mechanism with a face, which stamps whatever is put beneath it.",
      props: ["machine", "table", "candles", "gears"],
      npc: {
        id: "f8_seal",
        name: "The Great Seal",
        title: "A Function, Still Functioning",
        form: "construct",
        voice: "bell",
        palette: { robe: "#2a2a3c", trim: "#e8c86a", glow: "#ffd980" },
        greet: [
          "\"PRESENT,\" says the press, with enormous good cheer. \"PRESENT AND I SHALL SEAL. THAT IS THE WHOLE OF MY OFFICE AND I HAVE NEVER ONCE BEEN LATE.\"",
          "\"I DO NOT READ. READING WAS ANOTHER DEPARTMENT. THEY WENT QUIET IN THE SIXTH YEAR AND I WILL NOT HEAR A WORD AGAINST THEM.\""
        ],
        idle: ["\"PRESENT AND I SHALL SEAL.\""],
        choices: [
          {
            id: "f8_c_seal_forged",
            text: "Present the forged quittance.",
            require: { items: ["forged_quittance"], notFlags: ["f8_sealed_forgery"] },
            lockedText: "(You have no instrument to press.)",
            once: true,
            reply: [
              "The press comes down like a door closing in another building. The paper comes out warm and official and entirely wrong. \"SEALED. VALID IN FORM. I MAKE NO OTHER CLAIM AND HAVE NEVER BEEN ASKED TO. THE POSTERN IS OPEN.\""
            ],
            effects: [
              { t: "flag", id: "f8_sealed_forgery" },
              { t: "unlock", to: "f8_quittance" },
              { t: "unlock", to: "f8_registry" },
              { t: "sound", id: "stone" }
            ]
          },
          {
            id: "f8_c_seal_writ",
            text: "Present the Writ of Assumption.",
            require: { items: ["writ_of_assumption"], notFlags: ["f8_sealed_writ"] },
            lockedText: "(You have no instrument to press.)",
            once: true,
            reply: [
              "The press hesitates. It is a machine and has no business hesitating and does it anyway. \"AN ASSUMPTION. I HAVE NEVER SEALED ONE. THE DEBTOR'S LINE IS BLANK.\"",
              "It comes down carefully, the way you set down something asleep. \"SEALED. THE LINE REMAINS BLANK, BECAUSE THAT IS FOR SAYING AND NOT FOR WRITING.\""
            ],
            effects: [
              { t: "flag", id: "f8_sealed_writ" },
              { t: "unlock", to: "f8_quittance" },
              { t: "unlock", to: "f8_registry" },
              { t: "sound", id: "bell" }
            ]
          },
          {
            id: "f8_c_seal_ask",
            text: "Ask what it has sealed most often.",
            once: true,
            reply: [
              "\"EXTENSIONS OF TIME. NINE THOUSAND AND FOUR. THE HOUSES ASKED FOR MORE TIME AND I GAVE IT, AND THEN THE TIME STOPPED, AND THE EXTENSIONS ARE ALL STILL RUNNING. THAT IS THE ONLY THING I HAVE EVER FOUND SAD. I DO NOT DWELL.\""
            ],
            effects: [{ t: "flag", id: "f8_seal_extensions" }]
          },
          {
            id: "f8_c_seal_hand",
            text: "Put your bare hand under the press.",
            once: true,
            reply: [
              "It does not come down. \"NO. YOU ARE NOT AN INSTRUMENT. I KNOW THE DIFFERENCE BY WEIGHT. TAKE YOUR HAND BACK. I SHALL NOT MENTION IT.\""
            ],
            effects: [{ t: "sound", id: "wrong" }]
          },
          {
            id: "f8_c_seal_nothing",
            text: "Present nothing at all.",
            once: false,
            reply: [
              "The press comes down on the empty table with tremendous ceremony. \"SEALED. THAT WAS NOTHING. I KNOW. I DID IT PROPERLY ANYWAY. THAT IS WHAT AN OFFICE IS.\""
            ],
            effects: [{ t: "unlock", to: "f8_registry" }]
          }
        ]
      },
      doors: [{ to: "f8_quittance", locked: true, label: "The Sealed Postern" }]
    },

    // -------------------------------------------------------------- REGISTRY
    {
      id: "f8_registry",
      name: "The Registry of Standing",
      kind: "hub",
      size: "large",
      desc: "Every path on this floor comes out here, into a rotunda of shelves holding a book for every person the Court has ever had an opinion about.",
      props: ["shelves", "bookstacks", "pillars", "candles"],
      onEnter: [
        { t: "say", text: "There is a book on the shelf with your name on the spine. It is already three pages long." },
        { t: "flag", id: "f8_saw_own_book" },
        {
          t: "codex",
          id: "f8_registry_lore",
          title: "The Registry of Standing",
          text: "The Court keeps a volume for every party it has formed an opinion about. Yours was opened the moment you crossed the porch, and three pages of it were written before you arrived here, and nobody will say by whom."
        },
        { t: "sound", id: "whisper" }
      ],
      doors: [{ to: "f8_quittance", label: "The Crier's Stone" }]
    },

    // ------------------------------------------------------------------ EXIT
    {
      id: "f8_quittance",
      name: "The Crier's Stone",
      kind: "exit",
      size: "grand",
      desc: "A round stone at the head of the down-stair, with the whole court somehow present around it though you left them two rooms behind.",
      props: ["stairs", "bones", "banners", "candles"],
      onEnter: [
        { t: "say", text: "Three hundred dead nobles are here, and so is the Justice, and none of them came past you." },
        { t: "sound", id: "bell" }
      ],
      npc: {
        id: "f8_halloway",
        name: "Halloway",
        title: "Crier of the Court",
        form: "tall",
        voice: "bell",
        palette: { robe: "#3a2650", trim: "#f2e6fa", skin: "#e6dac4", glow: "#d8a8ff" },
        greet: [
          "The Crier is all throat. Whatever else he was has gone into the job. \"PARTY OF THE FIFTH PART, ATTENDING, INDEBTED, APPROACHING THE STONE.\"",
          "\"You may go down. You may not go down owing. Whatever you do here, you do out loud — writing is for the clerk. Stand on the stone and tell me how you are leaving.\""
        ],
        idle: ["\"THE PARTY IS STILL AT THE STONE AND HAS NOT YET SAID ANYTHING.\""],
        choices: [
          {
            id: "f8_c_exit_ask",
            text: "Ask what my standing is.",
            once: false,
            reply: [
              "\"ATTENDING. INDEBTED FOR THE CONVENING. NOT YET HEARD.\" He drops to a whisper the size of a bell. \"Not a criticism. Nobody has been heard in two hundred and six years.\"",
              "\"Pay it, buy a paper for it, hand it to something else, or take on the one nobody will take. Four doors. Only one of them is a door.\""
            ],
            effects: []
          },
          {
            id: "f8_c_exit_gold",
            text: "Present the Quittance in Gold.",
            require: { items: ["sealed_quittance"] },
            lockedText: "(A discharge bought outright costs more than you are carrying.)",
            once: true,
            reply: [
              "\"PRESENTED: A QUITTANCE IN GOLD, SEALED, VALID.\" He reads it all out. It is very boring, which is precisely what money buys. \"THE OBLIGATION IS EXTINGUISHED. THE PARTY DEPARTS WITHOUT STAIN AND WITHOUT STANDING.\"",
              "The benches do not react. He lowers his voice. \"They don't mind; it's a perfectly good discharge. It's only that they hoped.\""
            ],
            effects: [
              { t: "item", id: "sealed_quittance", n: -1 },
              { t: "flag", id: "f8_left_paid" },
              { t: "say", text: "You go down clean, and lighter by a sum, and nothing follows you." },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f8_c_exit_forged",
            text: "Present the sealed forgery.",
            require: { items: ["forged_quittance"], flags: ["f8_sealed_forgery"] },
            lockedText: "(Whatever you have is not in a form the Crier can read out.)",
            once: true,
            reply: [
              "\"PRESENTED: A QUITTANCE, SEALED, VALID IN FORM.\" He reads all of it, including the creditor's name, and the creditor's name is yours.",
              "He stops. He is a crier; stopping is not in him; he does it anyway. \"The Court examines instruments for validity. This instrument is valid. THE OBLIGATION IS DISCHARGED. THE PARTY IS SATISFIED OF THE PARTY.\"",
              "Nobody objects. Nobody can. \"Go down. You are your own creditor now. That is a new one.\""
            ],
            effects: [
              { t: "item", id: "forged_quittance", n: -1 },
              { t: "flag", id: "f8_left_forged" },
              {
                t: "codex",
                id: "f8_self_creditor",
                title: "Satisfied Of Yourself",
                text: "A forged discharge does not remove an obligation; it renames the party holding it. Somewhere in the Registry of Standing there is now a line in which you are owed something by you, and the Verrow's ledgers are very good at finding a name twice."
              },
              { t: "say", text: "The stair takes you. Behind, a page turns by itself, and your name is on both sides of it." },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f8_c_exit_carried",
            text: "Say the salt thing has taken it.",
            require: { flags: ["f8_carried"] },
            lockedText: "(Nothing has agreed to carry anything for you.)",
            once: true,
            reply: [
              "\"PRESENTED: A TRANSFER OF OBLIGATION TO A PARTY UNENCUMBERED, UNNAMED, AND OF NO FIXED ROLL. IT IS IN ORDER.\"",
              "\"It is in order,\" he repeats, quieter, and this is the only time the room does not settle to listen. \"Clerk Anneve will rule a line through the entry and note it untraceable. She has been one entry short for two hundred years, and this is not the entry.\"",
              "\"THE PARTY DEPARTS. THE PARTY OWES NOTHING.\" Then, not crying it: \"Which is different from nothing being owed.\""
            ],
            effects: [
              { t: "flag", id: "f8_left_carried" },
              { t: "say", text: "Somewhere above, salt settles over a hole the exact size of everything the Cadence took." },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f8_c_exit_petition",
            text: "Petition to be entered as the missing party.",
            require: {
              flags: ["f8_knows_arvellin"],
              items: ["writ_of_assumption"],
              gold: 25,
              notFlags: ["f8_petitioned"]
            },
            lockedText: "(You would need the instrument, the name, and twenty-five gold in filing.)",
            once: true,
            reply: [
              "The room stops — not quietens, stops, the way three hundred people who do not need to breathe can stop. \"THE PARTY PETITIONS TO ASSUME AN UNASSUMED OBLIGATION.\" Halloway's voice cracks somewhere very old.",
              "The Justice speaks from behind the benches and does not use your standing, which is the most frightening thing that has happened on this floor. \"Filing is twenty-five; I would rather it did not exist. You propose to assume everything the Cadence was advanced and did not return. It cannot be paid. Not by you, not by a line of you, not by a province.\"",
              "\"If you still intend it, you will not sign. You will say it. Plainly, on the stone, and then it goes down with you, and it will be waiting at the bottom.\""
            ],
            effects: [
              { t: "gold", n: -25 },
              { t: "flag", id: "f8_petitioned" },
              { t: "sound", id: "stone" }
            ]
          },
          {
            id: "f8_c_exit_declare",
            text: "Say it plainly: \"I owe what cannot be paid.\"",
            require: { flags: ["f8_petitioned"], items: ["writ_of_assumption"], gold: 20 },
            lockedText: "(You have not yet petitioned, or cannot meet the filing.)",
            once: true,
            reply: [
              "You say it, on the stone, before a court of dead nobles and a Justice who has not ruled since the world began to go quiet. \"I owe what cannot be paid.\" You must say the sum too, and it has no number, so you say *all of it*, and that is accepted, because it is accurate.",
              "Far off, through two walls, a pen moves. Anneve fills a line seven inches long and closes a book that has been open two hundred and six years, and you can hear her crying, and she is furious about the ink.",
              "The gavel comes up. \"IN THE MATTER OF THE CADENCE,\" says the Justice — then stops, and says to you alone, without your standing: \"Thank you. It goes with you. I am not sorry, and I want you to know I considered being.\"",
              "Halloway presses a strip of bone-paper into your hand as you pass. \"Your favour, signed by the whole bench. You will be owed a great deal by people who cannot pay you, which is the only credit this building has ever issued.\""
            ],
            effects: [
              { t: "gold", n: -20 },
              { t: "item", id: "writ_of_assumption", n: -1 },
              { t: "item", id: "writ_of_attendance", n: -1 },
              { t: "item", id: "owed_favor", n: 1 },
              { t: "flag", id: "f8_assumed_debt" },
              { t: "sound", id: "bell" },
              {
                t: "codex",
                id: "f8_assumption",
                title: "The Assumption",
                text: "The books closed on the eighth floor because a living party stood on the Crier's stone and assumed an obligation that cannot be discharged. It is recorded. It is transferable. It is now yours, and the tenth floor keeps a ledger too."
              },
              { t: "say", text: "The gavel falls. The sound goes down the stair ahead of you and is still going." },
              { t: "floorEnd", token: true }
            ]
          },
          {
            id: "f8_c_exit_abscond",
            text: "Walk down owing it, and let them write what they like.",
            require: { minHearts: 2, notFlags: ["f8_assumed_debt"] },
            lockedText: "(You have not the heartbeats to spare for that kind of exit.)",
            once: true,
            reply: [
              "\"THE PARTY DEPARTS THE STONE WITHOUT DISCHARGE.\" He does not shout it. He announces it, and the benches lean very slightly forward, all together, like grass.",
              "\"That is permitted. It costs you nothing the Court can take. It costs you something the Court can only watch being taken.\""
            ],
            effects: [
              { t: "heart", n: -1 },
              { t: "sound", id: "heartloss" },
              { t: "flag", id: "f8_left_owing" },
              { t: "say", text: "Something goes out of you on the third step down — not a memory, but the weight of one. The ledger does not close, and it knows which stair you took." },
              { t: "floorEnd" }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

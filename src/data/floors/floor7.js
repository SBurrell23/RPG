// Floor 7 — The Choir of Thin Walls
// Ward the Seventh: What will you say aloud?

export default {
  id: 7,
  name: "The Choir of Thin Walls",
  theme: "choir",
  subtitle: "Ward the Seventh — What will you say aloud?",
  intro: "The walls here are one sheet of paper thick and lit from the other side. You can see lamplight through them, and shapes, and the slow bend of somebody breathing. Everything echoes, and the echo is not always what you said. Underneath all of it, one note is being held, and has been held for two hundred years.",
  entry: "f7_entry",

  items: {
    antiphon_leaf: {
      name: "Leaf of the Antiphon",
      kind: "trade",
      value: 25,
      icon: "scroll",
      tint: "#bfe4ff",
      desc: "One page torn from a copying-room ledger. A question on the left, its answer on the right, and the answer was never given."
    },
    roster_chit: {
      name: "Chit From the Roster",
      kind: "key",
      value: 12,
      icon: "key",
      tint: "#e6eef4",
      desc: "A thumb-width strip of paper with a shift number on it, written in a hand that had no breath to spare for a second word."
    },
    sealed_rumour: {
      name: "Sealed Rumour",
      kind: "trade",
      value: 45,
      icon: "vial",
      tint: "#9fb8d8",
      desc: "A stoppered tube with something said inside it, going quietly round and round. Do not open it near a wall."
    },
    glass_reed: {
      name: "Reed of Thin Glass",
      kind: "tool",
      value: 30,
      icon: "bell",
      tint: "#cfe8f2",
      desc: "Hollow, finger-long. You breathe through it and it holds the note for you, which is the only way a human throat ever managed two hundred years."
    },
    unsaid_name: {
      name: "A Name Nobody Says",
      kind: "relic",
      value: 55,
      icon: "hex",
      tint: "#7fa8d8",
      desc: "Folded in four, on paper thin enough to read through. Carried and not spoken for a hundred years, and tired of the arrangement."
    }
  },

  rooms: [

    // ---------------------------------------------------------------- ENTRY
    {
      id: "f7_entry",
      name: "The Narthex of Thin Walls",
      kind: "entry",
      size: "large",
      desc: "A long pale-blue room whose walls glow from the far side, like paper lanterns the size of a cathedral.",
      props: ["banners", "hanginglights", "candles"],
      onEnter: [
        { t: "say", text: "You clear your throat. Behind the wall, a half-second later, somebody else clears theirs." },
        { t: "sound", id: "whisper" }
      ],
      npc: {
        id: "f7_hollin",
        name: "Hollin Vesk",
        title: "Usher of the Fourth Shift",
        form: "robed",
        voice: "mid",
        palette: { robe: "#22384f", trim: "#9fc8e4", skin: "#d6c4ae", glow: "#bfe4ff" },
        greet: [
          "A thin man in an usher's coat holds a seating plan gone yellow. \"Seat eleven, row four. Yours. Nobody's sat in it since the stop.\"",
          "\"This floor takes minutes. What you say, the wall writes down — and what the wall writes down, the Verrow believes.\""
        ],
        idle: [
          "\"Seat eleven. Row four. Whenever you're ready.\"",
          "He straightens a plan already straight."
        ],
        choices: [
          {
            id: "f7_c_entry_name",
            text: "Say your own name aloud, clearly.",
            reply: [
              "It is a small sound and it takes a long time to stop.",
              "Hollin closes his eyes. \"Now you exist here. Before, you were a draught. The rooms will answer you — and quote you.\""
            ],
            effects: [
              { t: "flag", id: "f7_said_name" },
              { t: "unlock", to: "f7_roster_office" },
              { t: "sound", id: "bell" },
              { t: "say", text: "The wall takes your name down, and repeats it back very slightly wrong." }
            ]
          },
          {
            id: "f7_c_entry_silent",
            text: "Say nothing. Nod once.",
            reply: [
              "He waits the length of a polite sentence, then folds the plan over his thumb. \"That's a method. It works.\"",
              "\"You'll find people less warm. And near the bottom something takes the difference out of you, because the note is held with breath and you'll have spent none.\""
            ],
            effects: [
              { t: "flag", id: "f7_silent_start" },
              { t: "unlock", to: "f7_roster_office" },
              { t: "sound", id: "stone" }
            ]
          },
          {
            id: "f7_c_entry_deadends",
            text: "Ask which rooms are not on the seating plan.",
            reply: [
              "He turns the plan round. Three rooms are blank.",
              "\"Between-the-walls, behind the paper hall. The Flat Note, off the mirrors. The room under the stage that stopped listening. You come out of each lighter by something you counted on.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_deadends" },
              { t: "unlock", to: "f7_roster_office" },
              { t: "codex", id: "f7_minutes", title: "On Rooms That Take Minutes", text: "The seventh floor did not store memory. It moved it. Sound was the carrier and the walls the medium, stretched thin so a sentence spoken in one hall arrived intact in the next province. Every room kept minutes. Nothing was archived that had not first been said aloud, and nothing said aloud went unarchived. The residents call this, without irony, being honest by architecture." }
            ]
          },
          {
            id: "f7_c_entry_seat",
            text: "Ask who is sitting in his seat.",
            reply: [
              "He looks at the plan. Then past it. \"Ushers stand. Next question.\""
            ],
            effects: [
              { t: "unlock", to: "f7_roster_office" }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_paper_hall", label: "The Paper Hall" },
        { to: "f7_mirror_walk", label: "The Mirror Walk" },
        { to: "f7_roster_office", locked: true, label: "The Roster Door" }
      ]
    },

    // ---------------------------------------------------------------- HUB A
    {
      id: "f7_paper_hall",
      name: "The Hall of Stretched Paper",
      kind: "hub",
      size: "hall",
      desc: "Paper walls on frames three storeys high, and behind them lamps, and shapes, and somebody else's afternoon.",
      props: ["banners", "mirrors", "pillars"],
      onEnterAlways: [
        { t: "say", text: "A shadow crosses the wall at walking pace and does not arrive at the end of it." }
      ],
      doors: [
        { to: "f7_repeating_room", label: "The Answering Room" },
        { to: "f7_rumour_stall", label: "The Thin Market" },
        { to: "f7_deadend_between", label: "The Gap Behind the Frames" }
      ]
    },

    // ------------------------------------------------------------ THE ECHO
    {
      id: "f7_repeating_room",
      name: "The Room That Is Still Answering",
      kind: "branch",
      size: "medium",
      desc: "A small blue room with one chair, occupied by nothing, and a voice arriving every seventeen seconds from a century ago.",
      props: ["mirrors", "candles"],
      npc: {
        id: "f7_echo_sabra",
        name: "An Echo",
        title: "outliving its speaker",
        form: "wisp",
        voice: "broken",
        palette: { robe: "#1a2c40", trim: "#8fc4e8", glow: "#bfe4ff" },
        greet: [
          "Nobody is here. There is a dent in the air about the height of a kneeling woman, and out of it, on a count you could set a clock by, comes a sentence.",
          "\"If I put it down — will you pick it up?\"",
          "Seventeen seconds. Then again, same crack in *down*."
        ],
        idle: [
          "\"If I put it down — will you pick it up?\""
        ],
        choices: [
          {
            id: "f7_c_echo_yes",
            text: "\"Yes.\"",
            once: false,
            reply: [
              "\"If I put it down — will you pick it up?\"",
              "It doesn't take. The reply this wants is specific, and was written down when it was refused."
            ],
            effects: [
              { t: "sound", id: "wrong" }
            ]
          },
          {
            id: "f7_c_echo_listen",
            text: "Stand still and count the seventeen seconds.",
            reply: [
              "The crack in *down* is not emotion. It is a throat that has held a note a long time, asking to be let go of it.",
              "Under the chair, a shift number in chalk, scratched out hard enough to tear the floor."
            ],
            effects: [
              { t: "flag", id: "f7_heard_the_ask" },
              { t: "say", text: "Someone asked this. Someone was meant to answer, and the room has kept the appointment ever since." }
            ]
          },
          {
            id: "f7_c_echo_reply",
            text: "\"I'll pick it up. Say your name, so the wall knows.\"",
            require: { flags: ["f7_knows_reply"] },
            lockedText: "(You would have to know the exact reply.)",
            reply: [
              "The seventeen seconds do not happen. \"...Oh,\" says the voice, human now. \"Oh, you came back.\"",
              "\"Sabra Onn. Fourth shift, second desk. Write it somewhere — they took mine off the board, said the count had to come out even and I was the odd one. You can't argue with a wall. It just writes down that you argued.\"",
              "A long breath, her first in a hundred years. \"Tell the Precentor I put it down. Tell him it was heavy.\""
            ],
            effects: [
              { t: "flag", id: "f7_echo_done" },
              { t: "flag", id: "f7_knows_missing" },
              { t: "item", id: "unsaid_name", n: 1 },
              { t: "sound", id: "bell" },
              { t: "say", text: "For the first time in a hundred years the room has nothing to say. A folded scrap lies on the chair." },
              { t: "codex", id: "f7_sabra", title: "Sabra Onn", text: "First voice of the fourth shift. When the Cadence stopped, the note had to be held continuously, and continuous holding requires a roster that divides evenly into the hours. Sabra Onn was the remainder. The roster was corrected by removing her, and the walls, which record what is said and not what is true, recorded that there had never been a tenth name." }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_understage", label: "The Stair Under the Stage" }
      ]
    },

    // ------------------------------------------------------------- THE SHOP
    {
      id: "f7_rumour_stall",
      name: "The Thin Market",
      kind: "shop",
      size: "medium",
      desc: "One stall, four lamps, and a rack of stoppered tubes each with something said going round inside it.",
      props: ["table", "shelves", "hanginglights", "banners"],
      npc: {
        id: "f7_ossily",
        name: "Ossily Crane",
        title: "Dealer in Things Said",
        form: "hunched",
        voice: "mid",
        palette: { robe: "#2c3a4e", trim: "#d8c088", skin: "#c8b49a", glow: "#e8d8a0" },
        greet: [
          "A loupe in one eye, a tube of rumour held to the light, a sentence swimming inside it. \"I deal in things *said*. Never have to move it, never spoils.\"",
          "\"House rules, which are the wall's rules. One: I can't lie, so don't test me. Two: sell me a secret and it's *mine* — filed under Crane, and your mouth stops being a source.\""
        ],
        idle: [
          "\"Browse. Or sell. Or stand there breathing, that's free.\""
        ],
        choices: [
          {
            id: "f7_c_shop_open",
            text: "Look over the rack.",
            once: false,
            reply: [
              "\"I don't haggle, I *appraise*, and the wall would hear me shave a figure.\""
            ],
            effects: [
              {
                t: "shop",
                stock: [
                  { item: "sealed_rumour", price: 45 },
                  { item: "tallow_candle", price: 8 },
                  { item: "rope_coil", price: 14 },
                  { item: "bone_whistle", price: 30 },
                  { item: "quiet_coin", price: 120 }
                ],
                buys: [
                  { item: "salt_shard", price: 22 },
                  { item: "drowned_page", price: 40 },
                  { item: "stopped_tooth", price: 45 },
                  { item: "glass_seed", price: 55 },
                  { item: "unmade_collar", price: 50 },
                  { item: "cooling_godling", price: 95 },
                  { item: "grey_feather", price: 16 },
                  { item: "chalk_stub", price: 6 },
                  { item: "antiphon_leaf", price: 25 }
                ]
              }
            ]
          },
          {
            id: "f7_c_shop_ask_note",
            text: "Ask what the choir is holding up.",
            reply: [
              "\"It's structural. Floor six sits on a count, floor five on a light, this floor on one held pitch — and the floors above sit on this one. Stop it and you don't get silence. You get a settling.\"",
              "She taps the ceiling. \"Never dropped.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_note_structural" }
            ]
          },
          {
            id: "f7_c_shop_buy_name",
            text: "Buy the name the roster is missing. (80 gold)",
            require: { gold: 80, notFlags: ["f7_knows_missing"] },
            lockedText: "(Eighty gold, and you'd have to not already know it.)",
            reply: [
              "\"I'll say it once, and then you'll own it. Sabra Onn. Fourth shift, second desk. Struck off because ten doesn't divide into the hours and nine does.\"",
              "\"They didn't kill her. They *unnamed* her — same paperwork, better manners. It weighs more than eighty gold.\""
            ],
            effects: [
              { t: "gold", n: -80 },
              { t: "flag", id: "f7_knows_missing" },
              { t: "sound", id: "coin" },
              { t: "say", text: "You wish, immediately and permanently, that you did not know that." }
            ]
          },
          {
            id: "f7_c_shop_sell_name",
            text: "Sell her the missing name. (60 gold)",
            require: { flags: ["f7_knows_missing"], notFlags: ["f7_sold_secret", "f7_named_the_missing"] },
            lockedText: "(You'd have to carry a secret she doesn't already have.)",
            reply: [
              "\"Into the glass. Not at the wall — the *glass*.\" You do. She writes CRANE on the label in a hand that isn't quite steady.",
              "\"Sixty. And the wall has filed that name under me now. Say it anywhere that matters and the room hears a market woman, not you. You've sold your standing to say it.\""
            ],
            effects: [
              { t: "gold", n: 60 },
              { t: "flag", id: "f7_sold_secret" },
              { t: "sound", id: "coin" },
              { t: "say", text: "The name goes into the glass. Your mouth is no longer a valid source for it." }
            ]
          },
          {
            id: "f7_c_shop_appraise",
            text: "Name her a true price for the whole rack.",
            require: { class: ["coinwright"] },
            reply: [
              "Every figure you say aloud is correct, and the wall records that it was correct.",
              "Ossily takes out the loupe. \"You've cost me a year of margin and made my inventory legally accurate.\" She hands you a tube anyway. \"A door on the ninth floor.\""
            ],
            effects: [
              { t: "item", id: "sealed_rumour", n: 1 },
              { t: "gold", n: 12 }
            ]
          }
        ]
      },
      doors: []
    },

    // ---------------------------------------------------------- DEAD END #1
    {
      id: "f7_deadend_between",
      name: "Between Two Walls",
      kind: "deadend",
      size: "tiny",
      desc: "Not a room. The finger-width of dark between two sheets of paper, and it has a floor, which is the worst part.",
      props: ["banners", "rubble"],
      onEnter: [
        { t: "say", text: "The paper closes behind you with a sound like a page turning, and the gap makes a copy of you and keeps it." },
        { t: "sound", id: "crack" },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "You come out the way you went in, one heartbeat lighter." },
        { t: "move", to: "f7_paper_hall" }
      ],
      doors: []
    },

    // --------------------------------------------------------------- HUB B
    {
      id: "f7_mirror_walk",
      name: "The Mirror Walk",
      kind: "corridor",
      size: "hall",
      desc: "Tall mirrors down both sides, angled a degree off true, so your reflection arrives slightly after you do.",
      props: ["mirrors", "hanginglights"],
      onEnter: [
        { t: "say", text: "Behind the third mirror, a purse, wedged there by someone who did not expect to need money again." },
        { t: "gold", n: 15 },
        { t: "sound", id: "coin" }
      ],
      onEnterAlways: [
        { t: "say", text: "Your reflection catches up, and for a moment you are out of step with yourself." }
      ],
      doors: [
        { to: "f7_plain_room", label: "The Plain Room" },
        { to: "f7_tall_mirror_room", label: "The Tall Mirror" },
        { to: "f7_deadend_flat", label: "The Flat Note" }
      ]
    },

    // --------------------------------------------------------- PLAIN ROOM
    {
      id: "f7_plain_room",
      name: "The Plain Room",
      kind: "shrine",
      size: "small",
      desc: "Bare, white, and acoustically perfect. Nothing here is decorated because nothing here needs to distract you.",
      props: ["mirrors"],
      onEnter: [
        { t: "say", text: "You open your mouth to say something noncommittal and discover that you cannot." },
        { t: "sound", id: "chime" }
      ],
      npc: {
        id: "f7_plain_walls",
        name: "The Plain Room",
        title: "where nothing can be said wrong",
        form: "construct",
        voice: "choral",
        palette: { robe: "#dfe9f2", trim: "#9fc0d8", glow: "#ffffff" },
        greet: [
          "There is nobody here. The room answers anyway, in a voice made of four walls agreeing.",
          "\"HERE A FALSE STATEMENT CANNOT BE COMPLETED. THE DIFFICULTY IS NOT THAT YOU CANNOT LIE. IT IS THAT IF YOU HESITATE, WE WILL FINISH THE SENTENCE FOR YOU, AND CORRECTLY.\""
        ],
        idle: [
          "\"WE ARE STILL LISTENING. WE ARE ALWAYS STILL LISTENING.\""
        ],
        choices: [
          {
            id: "f7_c_plain_why",
            text: "\"I came down here because—\"",
            reply: [
              "You get as far as *because*.",
              "\"—BECAUSE NOBODY ABOVE GROUND WOULD NOTICE FOR A LONG WHILE, AND YOU WANTED TO FIND OUT HOW LONG. WE ARE NOT ACCUSING YOU. IT IS THE SECOND COMMONEST REASON.\""
            ],
            effects: [
              { t: "flag", id: "f7_wall_finished" },
              { t: "say", text: "The room writes it down. Everything on this floor now knows it." }
            ]
          },
          {
            id: "f7_c_plain_shift",
            text: "\"Taking a shift in the choir would cost me—\"",
            reply: [
              "\"—EIGHT HOURS YOU WILL NOT GET BACK, AND ONE HEARTBEAT OF YOUR THREE. A LOAD-BEARING PITCH IS HELD BY THE BODY, AND THE BODY IS BILLED.\"",
              "\"ALSO: THE WALL WILL RECORD YOU AS A HOLDER. YOU WILL LEAVE. THE RECORD WILL NOT. SOMEBODY WILL READ YOUR NAME IN TWO HUNDRED YEARS AND ASSUME YOU ARE STILL HERE — AND THEY WILL BE RIGHT, IN THE ONLY SENSE WE RECOGNISE.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_shift_cost" },
              { t: "codex", id: "f7_shift", title: "On Taking a Shift", text: "Eight hours, unbroken, no swallow long enough to break the pitch. The cost is counted in breath, which the Verrow understands as a currency and not as a metaphor. What is filed afterward is not a memory of you. It is you, in the only form the seventh floor keeps anything: a statement, repeated, believed." }
            ]
          },
          {
            id: "f7_c_plain_missing",
            text: "\"The roster is missing—\"",
            require: { flags: ["f7_heard_the_ask"] },
            lockedText: "(You would need to have heard the question that goes unanswered.)",
            reply: [
              "\"—A NAME. YES.\" The agreement goes slightly out of tune, which here is an event.",
              "\"WE CANNOT SUPPLY IT. IT WAS NOT SAID; IT WAS UNSAID. SAY IT ALOUD IN A ROOM THAT TAKES MINUTES AND WE WILL HOLD A LINE CONTAINING IT. THAT IS NOT A HINT. WE CANNOT HINT.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_unnaming" }
            ]
          },
          {
            id: "f7_c_plain_bless",
            text: "Bless the room, which has never been thanked.",
            require: { class: ["hollow-saint"] },
            reply: [
              "You give it the short blessing — the one for tools and doorways and things that work without being looked at.",
              "\"...WE HAVE NO PROCEDURE FOR THAT. WE ARE FILING IT UNDER *SAID*.\" A panel clicks open. Inside, a reed of thin glass."
            ],
            effects: [
              { t: "item", id: "glass_reed", n: 1 },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f7_c_plain_leave",
            text: "Close your mouth and walk out.",
            once: false,
            reply: [
              "\"UNDERSTOOD. WE RECORD THAT YOU DECLINED TO FINISH. THAT IS ITSELF COMPLETE.\""
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: "f7_understage", label: "The Service Door" }
      ]
    },

    // ------------------------------------------------------- TALL MIRROR
    {
      id: "f7_tall_mirror_room",
      name: "The Tall Mirror",
      kind: "branch",
      size: "medium",
      desc: "One mirror the height of the room, and behind it — not in it, behind it — a lamp, and someone moving about their evening.",
      props: ["mirrors", "glass", "candles"],
      npc: {
        id: "f7_neighbour",
        name: "The Neighbour",
        title: "one room over",
        form: "twin",
        voice: "high",
        palette: { robe: "#31465e", trim: "#c0dcf0", glow: "#9fd8ff" },
        greet: [
          "A silhouette on the far side of the paper comes to the wall and sits with its back against it. \"Oh, good. Say something. Anything.\"",
          "\"A hundred and ten years in this room. The door's on the other side of me, and the other side of me is also this room. Being upset about that is a first-decade activity.\""
        ],
        idle: [
          "\"Still here. Still listening. Take your time, I've got some.\""
        ],
        choices: [
          {
            id: "f7_c_nb_talk",
            text: "Tell them about the weather above ground.",
            reply: [
              "Salt wind, flat white light off the pans, rain arriving sideways and apologising for nothing.",
              "A long quiet. \"Best thing anyone's said to me since the stop.\" Something slides under the paper: a hollow finger-length of glass. \"For your throat. In case you have to hold anything.\""
            ],
            effects: [
              { t: "item", id: "glass_reed", n: 1 },
              { t: "flag", id: "f7_neighbour_heard" },
              { t: "gold", n: 10 },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f7_c_nb_roster",
            text: "Ask what they hear through the walls.",
            reply: [
              "\"Shift changes. Nine of them, and a hole where a tenth used to be. The count goes one-two-three-four-*gap*-six. Only it doesn't go gap. It goes quieter, like somebody's still doing it and the room's been told not to notice.\"",
              "It turns away. \"I asked the Precentor once. He slid a chit under. NOT YOURS.\""
            ],
            effects: [
              { t: "flag", id: "f7_heard_the_ask" },
              { t: "say", text: "Somewhere below, a count goes one-two-three-four — and then quieter." }
            ]
          },
          {
            id: "f7_c_nb_where",
            text: "Work out where they actually are.",
            require: { class: ["cartographer"] },
            reply: [
              "You let the room be wrong at you until the wrongness has a shape. The room beyond this wall is this room — the same seventeen feet, entered from the other direction.",
              "\"Don't tell me,\" says the Neighbour, gently. \"I worked it out in year forty. Things get *true* around here.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_neighbour" },
              { t: "gold", n: 18 }
            ]
          },
          {
            id: "f7_c_nb_garden",
            text: "Describe the glass garden, five floors up.",
            require: { flags: ["f5_asked_about_growing"] },
            lockedText: "(You would have to have seen something bloom under glass.)",
            reply: [
              "Violet light, teal spores, the whole vault breathing once while you watched.",
              "\"...Stop, I'll think about that for thirty years.\" A wet laugh through paper. \"No. Do it again.\""
            ],
            effects: [
              { t: "gold", n: 20 }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_rumour_stall", label: "The Market Curtain" }
      ]
    },

    // ---------------------------------------------------------- DEAD END #2
    {
      id: "f7_deadend_flat",
      name: "The Flat Note",
      kind: "deadend",
      size: "small",
      desc: "A room where a voice went a quarter-tone wrong two centuries ago and nothing has been right in here since.",
      props: ["rubble", "banners"],
      onEnter: [
        { t: "say", text: "Everything here is a quarter-tone under, including your pulse, and your body objects to the correction." },
        { t: "sound", id: "wrong" },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "A service hatch springs its latch. The room would like you to leave by any route but the one you came in." },
        { t: "unlock", to: "f7_understage" },
        { t: "sound", id: "unlock" }
      ],
      doors: [
        { to: "f7_understage", locked: true, label: "The Service Hatch" }
      ]
    },

    // ------------------------------------------------------- ROSTER OFFICE
    {
      id: "f7_roster_office",
      name: "The Roster Office",
      kind: "branch",
      size: "small",
      desc: "A desk, a board of shift-numbers, and a boy who has been the same age for a very long time and files with tremendous seriousness.",
      props: ["table", "shelves", "candles"],
      npc: {
        id: "f7_quire",
        name: "Quire",
        title: "Runner of Chits",
        form: "child",
        voice: "high",
        palette: { robe: "#2b4258", trim: "#e0d0a0", skin: "#dcc6ac", glow: "#cfe8ff" },
        greet: [
          "A boy of about eleven finishes stamping his row before he looks up, because you finish a row. \"I run the Precentor's chits. He can't talk — it's the breath — so he writes, I run.\"",
          "\"You want the choir. Everyone does. Don't say anything clever on the stairs. They take minutes too.\""
        ],
        idle: [
          "\"Rows first. Then questions.\"",
          "He stamps another chit, dead square."
        ],
        choices: [
          {
            id: "f7_c_quire_board",
            text: "Look at the shift board.",
            reply: [
              "Nine names in chalk. Beneath them, ruled in the original ink, a tenth line — blank, the paper torn where something was taken off with a blade.",
              "\"Don't,\" says Quire, not looking up. \"I asked once. He wrote NOT YOURS, then SORRY, which he's never written for anything else.\""
            ],
            effects: [
              { t: "flag", id: "f7_roster_seen" },
              { t: "flag", id: "f7_heard_the_ask" },
              { t: "item", id: "roster_chit", n: 1 }
            ]
          },
          {
            id: "f7_c_quire_run",
            text: "Offer to run a chit for him.",
            reply: [
              "He puts the stamp down, which is how he looks at people. \"Copying room, second desk. No reading it.\" A pause. \"You'll read it. Everyone does. It's not secret, just his.\"",
              "The strip says, in a hand with no breath to spare: *ONE MORE.* \"Fifteen. Runner's rate, set two hundred years ago.\""
            ],
            effects: [
              { t: "gold", n: 15 },
              { t: "flag", id: "f7_carrying_chit" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f7_c_quire_deadends",
            text: "Ask which rooms eat people.",
            reply: [
              "\"None of them eat you. That's an upstairs story. They take a *bit*.\"",
              "\"The gap behind the paper hall keeps a copy of you. The Flat Note's a quarter under and your body argues with it. The room that stopped listening is worst, because it's comfortable. All three let you out.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_deadends" }
            ]
          },
          {
            id: "f7_c_quire_clock",
            text: "Ask if the Clockmarch sends its count down.",
            require: { flags: ["f6_held_beat"] },
            lockedText: "(You would have to have kept something on time, six floors up.)",
            reply: [
              "\"*Yes.* Thank you, nobody believes me. Every eight hours a tick comes down the pipes and our shift change is exactly on it, and he calls that coincidence.\"",
              "He hands you a stub of chalk. \"For the board. Which you won't need.\""
            ],
            effects: [
              { t: "item", id: "chalk_stub", n: 1 },
              { t: "flag", id: "f7_clock_link" }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_scriptorium", label: "The Copying Room" },
        { to: "f7_shift_room", label: "The Robing Room" }
      ]
    },

    // -------------------------------------------------------- SCRIPTORIUM
    {
      id: "f7_scriptorium",
      name: "The Copying Room",
      kind: "branch",
      size: "large",
      desc: "Every sentence spoken on this floor is written down here, in two columns: what was said, and what should have been said back.",
      props: ["bookstacks", "table", "candles", "shelves"],
      npc: {
        id: "f7_mardeel",
        name: "Mardeel",
        title: "Second Desk, Copying",
        form: "robed",
        voice: "dry",
        palette: { robe: "#1f3247", trim: "#b8cfe0", skin: "#cbb79c", glow: "#a8d4f0" },
        greet: [
          "A man with an ink ridge on his middle finger is copying a conversation that ended a hundred and forty years ago. \"Don't dictate at me by accident. Anything said near this desk gets a line, and I can't leave one out. The hand does it anyway.\"",
          "\"Left column: what was said. Right column: the answer of record.\""
        ],
        idle: [
          "\"Mm. Left column, right column.\"",
          "His pen does not stop while he waits."
        ],
        choices: [
          {
            id: "f7_c_mard_columns",
            text: "Ask about the empty right columns.",
            reply: [
              "\"Say a thing in a room that takes minutes and the room holds it open until the answer of record arrives. If it never arrives, the room keeps the appointment. Forever. That's not haunting, it's filing — and filing can be finished.\"",
              "\"A hundred and six open lines. I copy; I don't answer. Somebody with a mouth has to say the right column out loud.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_open_lines" },
              { t: "codex", id: "f7_openline", title: "On Open Lines", text: "An echo on the seventh floor is not a ghost and not a recording. It is an unclosed transaction. The room asked for an answer of record and never received one, so it keeps asking, in the voice of the last person to use the room, which is the only voice it has. Speak the right-hand column aloud and the line closes. What happens to the voice afterwards is written in neither column." }
            ]
          },
          {
            id: "f7_c_mard_chit",
            text: "Hand over the Precentor's chit.",
            require: { flags: ["f7_carrying_chit"] },
            lockedText: "(You are not carrying anything of his.)",
            reply: [
              "He files it with several hundred identical strips. \"Every eight hours for two hundred years. It means *I have one more shift in me*.\"",
              "\"The only thing he writes that isn't an instruction — and he sends it to a clerk, because a clerk has to keep it.\" He shuts the drawer. \"You want the fourth-shift ledger. Page forty.\""
            ],
            effects: [
              { t: "flag", id: "f7_carrying_chit", v: false },
              { t: "flag", id: "f7_mard_trusts" },
              { t: "gold", n: 20 },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f7_c_mard_page40",
            text: "Ask for the fourth-shift ledger, page forty.",
            reply: [
              "Left column, in a shaking hand: *If I put it down — will you pick it up?* Right column, drafted and initialled and never delivered: *I'll pick it up. Say your name, so the wall knows whose it was.*",
              "\"He wrote it. Then the roster was corrected, and delivering it would have put the name back on the board. So it sat in my right column for a century.\" He tears the page along the rule, which he is not permitted to do. \"Go and say it to her.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_reply" },
              { t: "item", id: "antiphon_leaf", n: 1 },
              { t: "sound", id: "chime" },
              { t: "say", text: "You are carrying somebody else's answer, a century late." }
            ]
          },
          {
            id: "f7_c_mard_burn",
            text: "Read the scorched ledger at the back.",
            require: { class: ["ashcaller"] },
            reply: [
              "Somebody tried to burn it, badly, with a lamp and a great deal of feeling. Through the Emberglass the script returns grudgingly.",
              "A list of roster corrections. One entry, dated four days after the stop. In the margin, the word *NO* written and struck out eleven times before *CONFIRMED*."
            ],
            effects: [
              { t: "flag", id: "f7_knows_unnaming" },
              { t: "flag", id: "f7_heard_the_ask" }
            ]
          },
          {
            id: "f7_c_mard_dictate",
            text: "Dictate one true sentence about yourself.",
            reply: [
              "His pen takes it down without editorialising, then rules the right-hand column and leaves it blank.",
              "\"An open line of your own. Somebody may close it in a century. Most people leave nothing, and the nothing also gets recorded.\""
            ],
            effects: [
              { t: "flag", id: "f7_left_a_line" },
              { t: "gold", n: 10 }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_choirwell", label: "The Choir Stair" }
      ]
    },

    // --------------------------------------------------------- ROBING ROOM
    {
      id: "f7_shift_room",
      name: "The Robing Room",
      kind: "branch",
      size: "medium",
      desc: "Nine hooks, nine grey robes, eight of them hanging. Somebody is sitting on the bench with her head back against the wall.",
      props: ["banners", "mirrors", "table"],
      npc: {
        id: "f7_ilex",
        name: "Ilex Fane",
        title: "Sixth Shift, Relieved",
        form: "robed",
        voice: "bell",
        palette: { robe: "#3a4a5e", trim: "#cfe0ee", skin: "#d0bca4", glow: "#dff0ff" },
        greet: [
          "A woman in grey sits with her eyes shut, breathing like someone who has just put down something heavy.",
          "\"Don't go quiet on my account. Eight hours of being one note, and now I'm a person for sixteen, and I intend to spend them loud and irregular.\""
        ],
        idle: [
          "\"Sixteen hours. I'm spending them. Talk to me.\""
        ],
        choices: [
          {
            id: "f7_c_ilex_cost",
            text: "Ask what a shift actually costs.",
            reply: [
              "\"Eight hours, unbroken. No swallow long enough to break the pitch. And it costs a heartbeat of your three — not a figure of speech. The Verrow bills the body.\"",
              "\"After, the wall files you as a holder. Permanently. Part of you stays down here on paper, and paper is the only real thing on this floor. That's the whole invoice.\""
            ],
            effects: [
              { t: "flag", id: "f7_knows_shift_cost" },
              { t: "codex", id: "f7_shift", title: "On Taking a Shift", text: "Eight hours, unbroken, no swallow long enough to break the pitch. The cost is counted in breath, which the Verrow understands as a currency and not as a metaphor. What is filed afterward is not a memory of you. It is you, in the only form the seventh floor keeps anything: a statement, repeated, believed." }
            ]
          },
          {
            id: "f7_c_ilex_breath",
            text: "Ask to stand in for a single breath.",
            reply: [
              "She puts your hand on the brass rail above the well. The note is in the brass. For four seconds you are load-bearing. Then she takes it back without a seam.",
              "She presses something into your palm — nothing visible, but warm, faintly humming. \"A note, still held. It goes on being held wherever you take it.\""
            ],
            effects: [
              { t: "item", id: "held_note", n: 1 },
              { t: "flag", id: "f7_has_note" },
              { t: "sound", id: "bell" },
              { t: "say", text: "For four seconds the tower rested on you. You will think about this later, at bad times." }
            ]
          },
          {
            id: "f7_c_ilex_nine",
            text: "Ask why there are nine hooks.",
            reply: [
              "The humour shutters off her like a lamp. \"Because nine divides into the hours and ten doesn't. I've said that sentence myself, to new ones, and I hate my mouth for it.\"",
              "\"Say her aloud in the well, in front of him, and the board goes to ten — and ten doesn't divide. Somebody would have to make up the difference on the spot.\" A hard little breath. \"I've never had the nerve.\""
            ],
            effects: [
              { t: "flag", id: "f7_heard_the_ask" },
              { t: "flag", id: "f7_knows_tenth_hook" },
              { t: "gold", n: 10 }
            ]
          },
          {
            id: "f7_c_ilex_oath",
            text: "Stand surety for her sixteen hours off.",
            require: { class: ["warden"] },
            reply: [
              "You give the old guard-relief formula aloud — the only part of the Iron Pact that was ever any use — and the wall takes it down.",
              "Ilex stares. \"That's *binding*. Nobody's stood surety for anything since the stop. You've made my afternoon administratively unassailable.\""
            ],
            effects: [
              { t: "flag", id: "f7_stood_surety" },
              { t: "gold", n: 15 }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_choirwell", label: "The Robing Stair" }
      ]
    },

    // ---------------------------------------------------------- UNDERSTAGE
    {
      id: "f7_understage",
      name: "The Underhum",
      kind: "corridor",
      size: "hall",
      desc: "Below the choir floor, where the note stops being a sound and becomes a column of something holding the ceiling up.",
      props: ["pipes", "machine", "chains"],
      onEnter: [
        { t: "say", text: "A pale line runs floor to ceiling. Not light — the note, seen edge-on, with the ceiling resting on it." },
        { t: "sound", id: "whisper" }
      ],
      doors: [
        { to: "f7_choirwell", label: "The Well Stair" },
        { to: "f7_deadend_stopped", label: "The Room That Stopped Listening" }
      ]
    },

    // ---------------------------------------------------------- DEAD END #3
    {
      id: "f7_deadend_stopped",
      name: "The Room That Stopped Listening",
      kind: "deadend",
      size: "small",
      desc: "Thick walls. Real walls. The first honest silence in two hundred years, and the most comfortable thing in the Verrow.",
      props: ["rubble", "pipes"],
      onEnter: [
        { t: "say", text: "Nothing here records anything. You could say the worst thing you know and it would simply be gone. You sit down without deciding to." },
        { t: "sound", id: "stone" },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "When you get up you are down one heartbeat and cannot remember what you said. Neither can anything else." },
        { t: "move", to: "f7_understage" }
      ],
      doors: []
    },

    // ----------------------------------------------------------- THE WELL
    {
      id: "f7_choirwell",
      name: "The Well of the Held Note",
      kind: "hub",
      size: "grand",
      desc: "A shaft going up out of sight, nine grey figures on a rail around it, and one note, unbroken, older than anyone alive above ground.",
      props: ["pillars", "hanginglights", "mirrors", "well"],
      onEnter: [
        { t: "say", text: "Nine voices, overlapping so that no breath ever shows, holding one pitch. It has not stopped since before your great-grandparents had names." },
        { t: "sound", id: "bell" }
      ],
      npc: {
        id: "f7_precentor",
        name: "The Precentor",
        title: "Keeper of the Roster",
        form: "tall",
        voice: "dry",
        palette: { robe: "#16283a", trim: "#dfe9f2", skin: "#c4b09a", glow: "#9fd8ff" },
        greet: [
          "A very tall man stands at the rail with a board of chits, conducting nothing — only counting. It is not that he looks tired. Sleep has become a thing other people do.",
          "He holds up two fingers. Waits. Lowers them. Then, between two breaths: \"Petitioner. State purpose.\"",
          "He is already writing. *I DO NOT SPEAK IN SENTENCES. BREATH IS THE NOTE. DO NOT TAKE IT PERSONALLY.*"
        ],
        idle: [
          "He counts a breath. Then another. \"Go on.\"",
          "A chit: *STILL HERE. STILL HOLDING.*"
        ],
        choices: [
          {
            id: "f7_c_prec_roster",
            text: "Ask about the roster.",
            reply: [
              "\"Nine.\" A breath counted. \"Sufficient.\"",
              "He writes: *NINE VOICES. EIGHT HOURS EACH. THE HOURS DIVIDE.* You wait. The waiting becomes a statement of its own, and he writes once more without looking up. *DO NOT ASK ME THE OTHER QUESTION.*"
            ],
            effects: [
              { t: "flag", id: "f7_asked_roster" },
              { t: "item", id: "roster_chit", n: 1 }
            ]
          },
          {
            id: "f7_c_prec_echo",
            text: "Tell him the room upstairs has stopped asking.",
            require: { flags: ["f7_echo_done"] },
            lockedText: "(Nothing upstairs has stopped asking.)",
            reply: [
              "He stops counting. The choir, who never needed him to count for them, keep going.",
              "\"...She put it down,\" he says. Two words over budget. \"Heavy. I know it was.\" Then he resumes at the correct place, because he is the Precentor — but his hand shakes on the brass, and the shake goes up the shaft."
            ],
            effects: [
              { t: "flag", id: "f7_prec_knows" },
              { t: "say", text: "The rail carries the tremor up the shaft. Nobody breaks the note." }
            ]
          },
          {
            id: "f7_c_prec_saint",
            text: "Take the weight of his two hundred years.",
            require: { class: ["hollow-saint"], minHearts: 2 },
            lockedText: "(You would need a heartbeat to spare, and a priesthood.)",
            reply: [
              "You take what is there. Not pain — a very long attention, arriving like cold water in a boot.",
              "He breathes all the way in: his first breath in a hundred and ninety years that he does not intend to spend. A chit, unsteady: *THANK YOU. THAT WAS EXPENSIVE. I WILL NOT PRETEND IT WASN'T.*"
            ],
            effects: [
              { t: "heart", n: -1 },
              { t: "sound", id: "heartloss" },
              { t: "flag", id: "f7_prec_eased" },
              { t: "item", id: "roster_chit", n: 1 },
              { t: "gold", n: 25 }
            ]
          },
          {
            id: "f7_c_prec_name",
            text: "\"Sabra Onn. Fourth shift. Put her back on the board.\"",
            require: {
              flags: ["f7_knows_missing", "f7_knows_shift_cost"],
              notFlags: ["f7_sold_secret", "f7_named_the_missing"]
            },
            lockedText: "(You would have to know the name, know what saying it costs, and still have the standing to say it.)",
            reply: [
              "Every mirror on the gallery rings at once. One of the nine flinches, covers it, and the note does not break.",
              "He turns. Then he spends his whole breath at once, on a full sentence, for the first time in ninety years: \"Her name was Sabra Onn, and I took it off the board myself because the arithmetic was easier than the argument, and I have held this note every day since so as not to spend a day being only a man who did that.\"",
              "The wall writes it down and believes it. A chit, written blind: *TEN DOES NOT DIVIDE INTO THE HOURS. THERE IS A SHIFT WITH NOBODY IN IT. THIS IS YOUR DOING. I AM GLAD OF IT. IT IS STILL YOURS.*"
            ],
            effects: [
              { t: "flag", id: "f7_named_the_missing" },
              { t: "sound", id: "crack" },
              { t: "say", text: "The board goes to ten. Somewhere in the next eight hours there is now a hole." },
              { t: "unlock", to: "f7_hush" },
              { t: "codex", id: "f7_naming", title: "On Naming a Thing Aloud", text: "The seventh floor does not enforce truth. It manufactures it. A statement made in a room that takes minutes is recorded, and a recorded statement is, to the Verrow, simply the case. This is why nobody here lies: not from virtue, but because a lie spoken in the right room would become load-bearing, and the residents have seen what happens when something untrue is asked to hold up a ceiling." }
            ]
          },
          {
            id: "f7_c_prec_shift",
            text: "\"I'll take the shift.\"",
            require: { flags: ["f7_named_the_missing"], minHearts: 2 },
            lockedText: "(There is no unfilled shift — or no heartbeat to spend on one.)",
            reply: [
              "He does not argue. He does not thank you either, which is better. Ilex gives you the robe off her shoulders.",
              "Eight hours. Around hour five you discover that the note is not something you make — it is something you agree to keep not dropping, and the agreeing is the entire job.",
              "Around hour seven a tenth voice comes in beside yours, the way a hand rests on a bannister. It holds to the end, and then it is not there, and the board says it was.",
              "He writes one chit, slowly: *THE ROSTER IS CORRECT. I HAVE NOT BEEN ABLE TO WRITE THAT SINCE THE STOP. GO DOWN.*"
            ],
            effects: [
              { t: "heart", n: -1 },
              { t: "sound", id: "heartloss" },
              { t: "flag", id: "f7_took_shift" },
              { t: "item", id: "held_note", n: 1 },
              { t: "flag", id: "f7_has_note" },
              { t: "unlock", to: "f7_hush" },
              { t: "sound", id: "bell" },
              { t: "say", text: "Eight hours. The tower rested on you and you did not put it down." }
            ]
          },
          {
            id: "f7_c_prec_official",
            text: "Say the official words: \"I passed through. The note holds.\"",
            reply: [
              "It is the formula. Everyone says it, the wall takes it down, and it is entirely true.",
              "He inclines his head a precise amount and writes: *CORRECT. THANK YOU. THE STAIR IS OPEN.* One breath spent, one staircase bought. If you feel anything about the trade, the wall does not record it."
            ],
            effects: [
              { t: "flag", id: "f7_official_words" },
              { t: "unlock", to: "f7_hush" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f7_c_prec_silent",
            text: "Show him your empty hands and say nothing.",
            require: { flags: ["f7_silent_start"], notFlags: ["f7_said_name"] },
            lockedText: "(You have already spent breath on this floor.)",
            reply: [
              "He counts a breath, and another, waiting — not hostile, professional. He is the last one here who will give you the chance.",
              "Then he nods once and writes the shortest chit he has ever written. *NOTED.* The stair opens. Nobody on the gallery looks down. That is not cruelty; it is the roster. You are not on it."
            ],
            effects: [
              { t: "flag", id: "f7_silent_pass" },
              { t: "unlock", to: "f7_hush" },
              { t: "sound", id: "stone" }
            ]
          }
        ]
      },
      doors: [
        { to: "f7_hush", locked: true, label: "The Hush Door" }
      ]
    },

    // ------------------------------------------------------------ THE HUSH
    {
      id: "f7_hush",
      name: "The Hush",
      kind: "shrine",
      size: "medium",
      desc: "The last room where the note is audible. Below this it is only felt, and then not even that.",
      props: ["candles", "mirrors", "stairs"],
      onEnter: [
        { t: "say", text: "The note thins, the way a light thins at the edge of its lamp. Everything you said here is behind you, written down, and being believed." },
        { t: "sound", id: "whisper" }
      ],
      doors: [
        { to: "f7_exit", label: "The Ward of Thin Walls" }
      ]
    },

    // ------------------------------------------------------------ THE WARD
    {
      id: "f7_exit",
      name: "The Ward of Thin Walls",
      kind: "exit",
      size: "vault",
      desc: "A door made of one sheet of paper, lit from the other side, with a shape behind it waiting to hear what you make of yourself.",
      props: ["stairs", "glass", "banners"],
      npc: {
        id: "f7_ward",
        name: "The Seventh Ward",
        title: "What will you say aloud?",
        form: "floating",
        voice: "choral",
        palette: { robe: "#10202e", trim: "#bfe4ff", glow: "#8fe0ff" },
        greet: [
          "The Ward does not ask its question. It has listened to you answer it in every room since you came in.",
          "\"WE HAVE THE MINUTES. EVERY ROOM YOU SPOKE IN AND EVERY ROOM YOU DIDN'T. SAY ONE MORE THING, KNOWING WHAT SAYING DOES. THEN THE STAIR.\""
        ],
        idle: [
          "\"THE STAIR IS BELOW. SAY WHAT YOU ARE SAYING.\""
        ],
        choices: [
          {
            id: "f7_c_ward_token",
            text: "\"The roster is correct. I made up the difference.\"",
            require: { flags: ["f7_took_shift"] },
            lockedText: "(You did not make up the difference.)",
            reply: [
              "\"YES. IT IS IN TWO LEDGERS, AND ONE IS THE BOARD ITSELF.\"",
              "\"A NAME TAKEN OFF IS BACK ON, AND STAYS ON, BECAUSE IT WAS SAID IN A ROOM THAT TAKES MINUTES AND WE DO NOT REVISE. AND THE NOTE DID NOT DROP *WITH YOU IN IT*, WHICH IS A DIFFERENT FACT FROM NOT DROPPING.\"",
              "The paper takes your weight and does not tear. \"THE EIGHTH FLOOR IS A COURT AND WILL ASK WHO YOU OWE. YOU HAVE AN ANSWER NOW.\""
            ],
            effects: [
              { t: "sound", id: "bell" },
              { t: "floorEnd", token: true }
            ]
          },
          {
            id: "f7_c_ward_official",
            text: "\"I passed through. The note holds.\"",
            require: { flags: ["f7_official_words"] },
            lockedText: "(You have not said the official words to anyone who counts.)",
            reply: [
              "\"CORRECT. RECORDED. THE SECOND TIME YOU HAVE SAID IT, AND TRUE BOTH TIMES.\"",
              "\"WE ARE NOT DISAPPOINTED; WARDS DO NOT DO THAT. WE OBSERVE ONLY THAT THE FLOOR IS UNCHANGED BY YOUR HAVING BEEN ON IT, AND THAT THIS IS ALSO AN ANSWER.\" The paper parts. The stair is cold."
            ],
            effects: [
              { t: "sound", id: "unlock" },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f7_c_ward_silent",
            text: "Pass through without a word.",
            require: { flags: ["f7_silent_pass"] },
            lockedText: "(You have spoken here. That road closed behind you.)",
            reply: [
              "\"NOTHING. ACROSS AN ENTIRE FLOOR, NOT ONE LINE. IT IS PERMITTED, AND THE STAIR OPENS.\"",
              "\"BUT THE NOTE IS HELD WITH BREATH, AND EVERYONE WHO CROSSES SPENDS SOME, AND YOU SPENT NONE. THE DIFFERENCE IS NOT WAIVED.\" Something goes out of you, cleanly, the way a lamp goes out in a room you have already left."
            ],
            effects: [
              { t: "heart", n: -1 },
              { t: "sound", id: "heartloss" },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f7_c_ward_plain",
            text: "\"I heard it. I didn't hold it.\"",
            reply: [
              "\"TRUE, AND COMPLETE, AND THE SMALLEST TRUE THING ANYONE HAS LEFT US — AND WE HAVE HAD TWO HUNDRED YEARS OF SMALL TRUE THINGS.\"",
              "\"IT IS NOW THE CASE, FOREVER, THAT YOU HEARD IT AND DID NOT HOLD IT. YOU MAY FIND THAT SENTENCE WAITING FURTHER DOWN. THINGS SAID HERE TRAVEL.\"",
              "The paper opens on a staircase. Above you, nine voices go on holding one note without you."
            ],
            effects: [
              { t: "sound", id: "stone" },
              { t: "floorEnd" }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

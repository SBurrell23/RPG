// Floor 3 — The Sunken Archive
// Ward the Third: What will you read?

export default {
  id: 3,
  name: "The Sunken Archive",
  theme: "archive",
  subtitle: "Ward the Third — What will you read?",
  intro: "The stair ends in green water and the water does not end. Shelves go up into a dark that has no ceiling, and pages drift past your knees like slow pale fish. Three hundred years ago somebody flooded this floor on purpose, and everyone here knows why except you.",
  entry: "f3_entry",

  items: {
    wet_shelfmark: {
      name: "Shelf-Mark, Wet",
      kind: "key",
      value: 12,
      icon: "scroll",
      tint: "#8fd6c4",
      desc: "A strip of card with a call number on it. Held out of the water it dries in seconds and goes blank, so you keep putting it back."
    },
    drowned_ink: {
      name: "Bottle of Drowned Ink",
      kind: "tool",
      value: 35,
      icon: "vial",
      tint: "#2f6f6a",
      desc: "Green-black and thinner than ink should be. It will not write on anything dry. It is the only ink that holds what happened to a person rather than what was merely true."
    },
    sodden_novel: {
      name: "A Novel, Ruined",
      kind: "trade",
      value: 8,
      icon: "book",
      tint: "#9a8c6a",
      desc: "Swollen to twice its width, the title gone entirely. Someone loved this book enough that the loving is still on it, like a smell."
    },
    handful_of_pages: {
      name: "Handful of Pages",
      kind: "trade",
      value: 14,
      icon: "scroll",
      tint: "#cfe4d8",
      desc: "Netted at random out of the current and sold unread. Four of them are inventories. One of them is not."
    },
    own_page: {
      name: "Your Page",
      kind: "relic",
      value: 65,
      icon: "scroll",
      tint: "#d8c8a0",
      desc: "An account of you, in a hand you half recognise, written before you came down. It stays wet. It will always stay wet."
    },
    complete_catalogue: {
      name: "The Complete Catalogue, Volume One",
      kind: "relic",
      value: 200,
      icon: "book",
      tint: "#e0d6b8",
      desc: "Volume one of an unknown number. The unknown is the point: counting the volumes adds to them."
    }
  },

  rooms: [

    // ------------------------------------------------------------------ ENTRY
    {
      id: "f3_entry",
      name: "The Wet Threshold",
      kind: "entry",
      size: "medium",
      desc: "The last three steps are underwater and the water is warm, which is worse than if it were cold.",
      props: ["water", "shelves", "hanginglights"],
      onEnter: [
        { t: "say", text: "Somewhere off to your left, in a room you are not in, someone turns a page." },
        { t: "sound", id: "water" }
      ],
      npc: {
        id: "f3_vessily",
        name: "Vessily Marn",
        title: "Underlibrarian, Second Desk",
        form: "robed",
        voice: "dry",
        palette: { robe: "#1d3b40", trim: "#8fd6c4", skin: "#c8bda6", glow: "#6fe8d4" },
        greet: [
          "A man in a sodden grey robe stands waist-deep with a stack of books balanced on his head. He does not look at you. He looks at the ripples you are making.",
          "“You are dripping,” he says, “onto a floor that is already underwater, which I want you to understand is an achievement. Vessily Marn. Second Desk.”"
        ],
        idle: [
          "“Properly, you should already be somewhere else.”"
        ],
        choices: [
          {
            id: "f3_c_v_where",
            text: "Ask where you are.",
            reply: [
              "“The Sunken Archive. We hold accounts — not facts. The Registry holds facts, and good luck to it. We hold what *happened to people*, and that is the whole of my profession.”",
              "“Facts keep in air. Accounts keep in water.” He gestures at the water with his chin, since his hands are full."
            ],
            effects: [
              { t: "flag", id: "f3_knows_water" },
              {
                t: "codex",
                id: "f3_the_drowning",
                title: "On the Deliberate Flooding",
                text: "The Sunken Archive was flooded three hundred years ago by its own staff, at their own request, in writing. Ink that records a lived thing lifts off dry paper in about nine years. Submerged, it holds indefinitely. The staff flooded the floor and stayed with it. They do not regard this as a sacrifice. They regard it as shelving."
              }
            ]
          },
          {
            id: "f3_c_v_dead",
            text: "Ask how long he has been dead.",
            reply: [
              "The books on his head do not move. Nothing about him moves for slightly too long.",
              "“I have been *employed* for three hundred and six years. The distinction matters to me and I would take it as a courtesy if it mattered to you. Dead men do not file. Watch.” He files something. It is, admittedly, filing."
            ],
            effects: [
              { t: "flag", id: "f3_offended_vessily" },
              { t: "sound", id: "whisper" }
            ]
          },
          {
            id: "f3_c_v_hearts",
            text: "Ask what on this floor will hurt you.",
            reply: [
              "“Three places. The Fallen Shelf, west — it came down in the first year and it is still coming down. The Sump, under the weir, which takes a heartbeat off everyone and gives most of them something. And the Drain, east, which takes and gives nothing.”",
              "“Nothing here will kill you. Several things here will *cost* you. Properly, those are different words.”"
            ],
            effects: [
              { t: "flag", id: "f3_warned_deadends" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_v_hound",
            text: "Mention the Houndmaster's ledgers, one floor up.",
            require: { notFlags: ["f3_offended_vessily"] },
            reply: [
              "The books slide off his head. He catches all four without looking, which is the most alive thing you have seen him do.",
              "“*Ledgers.* On dry paper, in a warm room, in *chalk*. Every nine years the names lift off the collars and he writes them again from memory and considers the matter closed. That is why the things in his kennels are unmade, and not one word of it is the animals' fault.”",
              "He replaces the books. “Go west. Ask Aunavy. She has been composing a letter for two centuries.”"
            ],
            effects: [
              { t: "flag", id: "f3_hound_talk" },
              { t: "gold", n: 10 },
              { t: "say", text: "He presses ten coins into your hand, as though paying you for the pleasure of the complaint." },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f3_c_v_go",
            text: "Go in.",
            reply: [
              "“West, the Low Stacks. Ahead, the Catalogue Hall and the Index. East, the cold current.”",
              "“And whatever you came to read — you all came to read something — read it in the water. Anything you carry into the air stops being what it was.”"
            ],
            effects: [
              { t: "flag", id: "f3_begun" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_low_stacks", label: "The West Arch" },
        { to: "f3_catalogue_hall", label: "The Catalogue Doors" },
        { to: "f3_cold_current", label: "The East Channel" }
      ]
    },

    // ------------------------------------------------------------- WEST BRANCH
    {
      id: "f3_low_stacks",
      name: "The Low Stacks",
      kind: "hub",
      size: "large",
      desc: "Ankle-deep here, and the shelves run away from you in both directions until the green light gives up.",
      props: ["shelves", "water", "bookstacks", "hanginglights"],
      npc: {
        id: "f3_aunavy",
        name: "Keeper Aunavy Roth",
        title: "Acquisitions, Retired",
        form: "hunched",
        voice: "mid",
        palette: { robe: "#2a4a52", trim: "#d8c8a0", skin: "#cfc0a4", glow: "#9fe4d8" },
        greet: [
          "An old woman goes along a shelf with two fingers, touching every spine in order, the way you would count a flock.",
          "“Don't speak for a moment, dear. I'm at the R's and I lose the thread.” Her fingers reach the end of the shelf. She sighs and begins the next one. “There. Now. You're new, you're dripping, and you want something.”"
        ],
        idle: [
          "“Still at the R's, dear. Always the R's.”"
        ],
        choices: [
          {
            id: "f3_c_a_book",
            text: "Ask what she is looking for.",
            reply: [
              "“A book, dear. One book. Two hundred and eleven years, and I am *very close*. I know its shape and its weight, and that it's in this room, because I've eliminated the other forty.”",
              "“I don't know the title. Titles go first; they're only the outside of a thing. But I'd know it in my hand in half a second.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_aunavy_book" }
            ]
          },
          {
            id: "f3_c_a_why",
            text: "Ask why the floor was drowned.",
            reply: [
              "“Because ink lifts, dear. Not the black stuff — black is for *the treaty was signed on a Tuesday*, and that'll sit in a dry room until the end of everything, useless and smug.”",
              "“The green holds what it was *like*. Whose hands shook. That lifts off dry paper in nine years, and then the page says Tuesday and nothing else, and you'd never know anything had gone. So we flooded ourselves. Voted on it.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_water" },
              { t: "sound", id: "water" }
            ]
          },
          {
            id: "f3_c_a_hound",
            text: "Tell her about the Houndmaster's chalk ledgers.",
            require: { flags: ["f3_hound_talk"] },
            lockedText: "(You would have to have heard something worth carrying.)",
            reply: [
              "Her fingers stop. Entirely. It is the first time.",
              "“*Chalk.* Every nine years he writes the names out of his own head, slightly wrong, and the creature in the pen is slightly less itself, and he thinks it's *degrading*. It's being misremembered by a man with a good opinion of his memory.”",
              "She resumes the shelf. “Thank you. I've been writing him a letter since the second century. Now I know how to start it.”"
            ],
            effects: [
              { t: "flag", id: "f3_aunavy_letter" },
              { t: "gold", n: 15 },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f3_c_a_novel",
            text: "Hand her the ruined novel from the sump.",
            require: { items: ["sodden_novel"] },
            lockedText: "(You are not carrying a ruined book.)",
            reply: [
              "She takes it in both hands. Half a second, she said. It takes about half a second.",
              "“Oh,” she says. “Oh, there you are.” And then, carefully: “It isn't a good book, dear. The middle sags. My brother wrote it, and put me in it as a character braver than I am, and then died above ground in a province that's gone quiet. Nobody up there remembers there was a book at all.”",
              "She holds it against her chest, water and all. “So it's in here. Where it keeps.” Then she presses a strip of wet card into your palm. “A shelf-mark. The Index won't open the Biographical Stack without one. Go and be a nuisance to it with my blessing.”"
            ],
            effects: [
              { t: "item", id: "sodden_novel", n: -1 },
              { t: "item", id: "wet_shelfmark", n: 1 },
              { t: "gold", n: 40 },
              { t: "flag", id: "f3_aunavy_found" },
              { t: "sound", id: "chime" },
              {
                t: "codex",
                id: "f3_aunavy",
                title: "Keeper Aunavy Roth",
                text: "Two hundred and eleven years on one shelf, for a badly bound novel with a sagging middle, written by a man whose province has gone quiet. She has never once said she was looking for her brother. She has said, several times, that she was looking for a book. Both are accurate."
              }
            ]
          },
          {
            id: "f3_c_a_after",
            text: "Ask what she will do when she finds it.",
            reply: [
              "“Don't,” she says, pleasantly, still touching spines. “That's the R's, dear, and I lose the thread.”"
            ]
          }
        ]
      },
      doors: [
        { to: "f3_weir", label: "The Weir Gate" },
        { to: "f3_fallen_shelf", label: "The Leaning Aisle" },
        { to: "f3_quiet_carrels", label: "The Carrel Door" }
      ]
    },

    {
      id: "f3_weir",
      name: "The Page Weir",
      kind: "shop",
      size: "medium",
      desc: "A grating across the current, and everything the archive has lost this century is pressed against it, quietly.",
      props: ["water", "chains", "table", "hanginglights"],
      npc: {
        id: "f3_till",
        name: "Oskar Till",
        title: "Page-Fisher, Unlicensed",
        form: "hunched",
        voice: "low",
        palette: { robe: "#3b3327", trim: "#a8c8b0", skin: "#b8a88a", glow: "#7fd8cb" },
        greet: [
          "A broad man in a leather apron hauls a dripping net onto a trestle and lets it slump. Wet paper. A great deal of wet paper.",
          "“Four pound of page,” he says, weighing it by hand. “Light haul. Buy by the handful, friend, sight unseen. I don't read 'em and I won't read 'em to you.”"
        ],
        idle: [
          "“Four pound of page. Maybe four and a quarter.”"
        ],
        choices: [
          {
            id: "f3_c_t_why",
            text: "Ask why he does not read them.",
            reply: [
              "“Because I'd stop hauling.” Flat, the way you'd say the tide comes in. “Everything in that net happened to somebody. You start reading, you start sorting; you sort, you get favourites; and then you're a man standing in a river with opinions about drowned people.”",
              "“Weight and price. You want to read one, that's your business and I'll take your coin. But I hand it over face down.”"
            ],
            effects: [
              { t: "flag", id: "f3_till_philosophy" }
            ]
          },
          {
            id: "f3_c_t_haul",
            text: "Help him haul the next net.",
            reply: [
              "The grating bites your palms. He counts to three and you both pull and the weir gives up its haul with a sucking noise like an apology.",
              "“Six pound.” He picks one page off the top the way you'd take the best apple and slaps it wetly into your hand. “Wages. That one's off the Index's own run, by the ink. Don't let it dry.”"
            ],
            effects: [
              { t: "item", id: "drowned_page", n: 1 },
              { t: "flag", id: "f3_hauled" },
              { t: "sound", id: "water" }
            ]
          },
          {
            id: "f3_c_t_sump",
            text: "Ask about the sump under the weir.",
            reply: [
              "“Goes down. Everything the weir misses sits down there. It'll cost you — a man goes in and comes out with one less heartbeat and one more book, and it's never the book he wanted. But it's never nothing, either.”",
              "“There's a door at the bottom that only opens from inside. That's the actual reason people go.”"
            ],
            effects: [
              { t: "flag", id: "f3_warned_sump" }
            ]
          },
          {
            id: "f3_c_t_name",
            text: "Ask what he does with pages bearing his own name.",
            reply: [
              "He looks at the net for a while. “Weight and price,” he says. “Was there anything else?”"
            ]
          },
          {
            id: "f3_c_t_shop",
            text: "Trade.",
            once: false,
            reply: [
              "He turns the trestle round so the goods face you and stands back with his arms folded, like a man who has said his piece."
            ],
            effects: [
              {
                t: "shop",
                stock: [
                  { item: "handful_of_pages", price: 14 },
                  { item: "drowned_page", price: 22 },
                  { item: "drowned_ink", price: 35 },
                  { item: "tallow_candle", price: 8 },
                  { item: "rope_coil", price: 12 },
                  { item: "complete_catalogue", price: 200 }
                ],
                buys: [
                  { item: "sodden_novel", price: 10 },
                  { item: "handful_of_pages", price: 7 },
                  { item: "salt_shard", price: 20 },
                  { item: "own_page", price: 60 }
                ]
              },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f3_c_t_cat",
            text: "Ask about the big volume at the back.",
            reply: [
              "“*The Complete Catalogue, Volume One.* Of an unknown number — the Index can't finish counting the volumes because counting 'em makes another. Two hundred, and I'll not come down.”"
            ]
          }
        ]
      },
      doors: [
        { to: "f3_sump", locked: false, label: "The Sump Hatch" }
      ]
    },

    {
      id: "f3_fallen_shelf",
      name: "The Fallen Shelf",
      kind: "deadend",
      size: "small",
      desc: "A shelf came down here in the first year of the flood and it is, very slowly, still coming down.",
      props: ["rubble", "water", "shelves"],
      onEnter: [
        { t: "say", text: "The aisle leans. Something enormous shifts overhead with the patience of three centuries and you are suddenly, badly, out of breath." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "You come up gasping in the Low Stacks with no memory of having run." },
        { t: "move", to: "f3_low_stacks" }
      ],
      doors: []
    },

    {
      id: "f3_sump",
      name: "The Sump",
      kind: "deadend",
      size: "small",
      desc: "Under the weir, where everything the grating missed has been settling for three hundred years.",
      props: ["water", "rubble", "bookstacks"],
      onEnter: [
        { t: "say", text: "You go under. The cold gets in somewhere it should not be able to reach and takes what it came for." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "Your hand closes on a book. You bring it up because you would rather have brought something up." },
        { t: "item", id: "sodden_novel", n: 1 },
        { t: "unlock", to: "f3_undercroft" },
        { t: "say", text: "There is a hatch down here. It opens from this side, and it opens easily." },
        { t: "sound", id: "unlock" }
      ],
      doors: [
        { to: "f3_undercroft", locked: true, label: "The Inside Hatch" }
      ]
    },

    {
      id: "f3_undercroft",
      name: "The Ink Undercroft",
      kind: "branch",
      size: "medium",
      desc: "A low vaulted room where the green ink is made, or was, or possibly still is when nobody is looking.",
      props: ["water", "pipes", "well", "candles"],
      onEnter: [
        { t: "say", text: "A stone well brim-full of something too thin to be ink and too dark to be water. Bottles on a rack. Most of them empty. One is not." },
        { t: "item", id: "drowned_ink", n: 1 },
        { t: "sound", id: "chime" },
        {
          t: "codex",
          id: "f3_the_ink",
          title: "On Drowned Ink",
          text: "Made here, from the archive's own water, by a process the staff describe as 'letting it alone'. It will not mark dry paper. It records not that a thing occurred but what occurring was like, and it is therefore the only medium in which an amendment to a person's account will stick. There is no known way to erase it. This was considered a feature."
        }
      ],
      doors: [
        { to: "f3_upward_room", label: "The Rising Passage" }
      ]
    },

    {
      id: "f3_quiet_carrels",
      name: "The Quiet Carrels",
      kind: "branch",
      size: "medium",
      desc: "Six reading desks in a row, five of them empty, the water perfectly still over all of them.",
      props: ["table", "water", "candles", "shelves"],
      npc: {
        id: "f3_finisher",
        name: "The Reader Who Finished",
        title: "Residue, Carrel Four",
        form: "wisp",
        voice: "broken",
        palette: { robe: "#1b3a44", trim: "#bfe4ff", glow: "#a8f0e4" },
        greet: [
          "At the fourth desk is a shape made mostly of light coming through water, bent over a book that is not there.",
          "“—and the door,” it says, “was open. And the door was open.” It becomes aware of you in stages, the way a room becomes aware of weather. “Oh. Is it the last line yet.”"
        ],
        idle: [
          "“And the door was open.”"
        ],
        choices: [
          {
            id: "f3_c_f_line",
            text: "Ask what the last line was.",
            reply: [
              "“*And the door was open.*” Enormous relief, as though for the first time. “I got there. Eleven hours, my tea cold twice, and I looked up and the room was *after*. Do you know the after of a book? Where everything's the same and completely different.”",
              "A long pause. “I've been in the after for three hundred years and it hasn't worn off. That's the whole of what I am now. I'm somebody's *after*.”"
            ],
            effects: [
              { t: "flag", id: "f3_heard_last_line" },
              {
                t: "codex",
                id: "f3_residue",
                title: "On Residue",
                text: "A memory that got loose and could not be re-shelved. Residue is not a ghost; nobody died. Somebody simply had a moment so complete that the moment outlasted its owner. Residue wants to be witnessed. Witnessing it does nothing for it, but it wants it anyway."
              }
            ]
          },
          {
            id: "f3_c_f_begin",
            text: "Ask what the book was about.",
            reply: [
              "The light bends away from you. “That's the *beginning*. I'm not going back to the beginning, I only just got here.” It bows over the desk again. “And the door was open.”"
            ]
          },
          {
            id: "f3_c_f_bless",
            text: "Bless the after, and let it end.",
            require: { class: ["hollow-saint"] },
            reply: [
              "You put your hand into the light where a shoulder ought to be and say the ending-words of a god that has forgotten you. They still work. That has always been the joke.",
              "For one second it is a woman in her fifties with ink on her thumb and tea going cold. “*Oh,*” she says. “It was about a garden.” Then the carrel is empty, something small and warm is lying in the water, and the water over carrel four begins, very slowly, to move again."
            ],
            effects: [
              { t: "item", id: "quiet_coin", n: 1 },
              { t: "flag", id: "f3_freed_reader" },
              { t: "sound", id: "bell" },
              { t: "heart", n: 1 }
            ]
          },
          {
            id: "f3_c_f_witness",
            text: "Sit in the next carrel and listen to the whole line.",
            reply: [
              "You sit. The water comes to your ribs. It reads the last line nine times and each time is the first time, and somewhere around the sixth you stop finding it sad and start finding it enormous.",
              "“Thank you,” it says, surprising you both. “Nobody sits. Listen — Loom is through there, and he'll offer to write in your margins. Let him. He's a vandal and the only one here who'll tell you what a page *means*, and those are the same fact.”"
            ],
            effects: [
              { t: "flag", id: "f3_sat_with_reader" },
              { t: "flag", id: "f3_west_map" },
              { t: "sound", id: "whisper" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_marginalia", label: "The Annotator's Door" }
      ]
    },

    {
      id: "f3_marginalia",
      name: "The Marginalia",
      kind: "branch",
      size: "medium",
      desc: "Every book here has been written in. So has the ceiling, and both walls, and — chest-deep and still legible — the floor.",
      props: ["shelves", "water", "table", "candles"],
      npc: {
        id: "f3_loom",
        name: "Petrin Loom",
        title: "the Marginalist",
        form: "tall",
        voice: "high",
        palette: { robe: "#33244a", trim: "#e0c0ea", skin: "#cbb8a0", glow: "#c8a8ff" },
        greet: [
          "A very tall man writes on the wall at the waterline with a brush held like a scalpel. The wall is already full; he is writing between the lines of himself.",
          "“No — better: *a very tall man was writing on the wall.* Past tense is kinder to strangers.” He turns. “Petrin Loom. I improve things. Nobody asked me to. That is the definition of improvement.”"
        ],
        idle: [
          "“No — better: *he said nothing at all, which was an improvement.*”"
        ],
        choices: [
          {
            id: "f3_c_l_what",
            text: "Ask what he writes in the margins.",
            reply: [
              "“What the page *means*. Pages are bad at that. A page will tell you a man walked into the sea at four in the afternoon and then stop, satisfied, like a dog that's brought you a stick.”",
              "“So in the margin I write: *he had been meaning to for a year*. Or, when I can't tell — and I am scrupulous — *unknown, and the not-knowing is part of the account*.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_loom" }
            ]
          },
          {
            id: "f3_c_l_mark",
            text: "Ask him to write the Biographical shelf-mark on your wrist.",
            reply: [
              "“Everyone wants that one and nobody wants to be seen wanting it.” He takes your wrist without asking, which is consistent. The brush is cold. Eleven characters on the inside of the forearm, where you will keep noticing them.",
              "“Recite it to the Index and it will open the stack and be *insufferable* about having been asked. It won't come off in water, which is most of where you are.” A pause. “No — better: *it won't come off.*”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_shelfmark" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f3_c_l_ink",
            text: "Ask him for a bottle of the green ink.",
            reply: [
              "“Take it. I have nine.” He fishes a bottle out of the water at his feet without looking; it was exactly there.",
              "“A warning, and I dislike warnings; they're the opposite of margins. That ink doesn't fade and there's no rubbing out. Whatever you write with it is *what happened*, from then on. So write something true, or write nothing. The second is respectable.”"
            ],
            effects: [
              { t: "item", id: "drowned_ink", n: 1 },
              { t: "flag", id: "f3_loom_ink" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_l_own",
            text: "Ask which book is his own.",
            reply: [
              "The brush stops. For a moment he is just a tall man standing in cold water. “I write in margins,” he says. “No — better: *he only wrote in margins.*” He resumes the wall."
            ]
          },
          {
            id: "f3_c_l_annotate",
            text: "Offer to let him annotate your own page, when you find it.",
            reply: [
              "“*Yes.*” Instantly, and then he looks faintly embarrassed at how instantly. “Yes. Thank you. Nobody offers.”",
              "“I will write one line in your margin and I will not show it to you first, because a margin you approve in advance is a *caption*, and captions are for cowards. Go and get read, Petitioner.”"
            ],
            effects: [
              { t: "flag", id: "f3_loom_promised" }
            ]
          },
          {
            id: "f3_c_l_appraise",
            text: "Name the true price of an unsolicited opinion.",
            require: { class: ["coinwright"] },
            reply: [
              "He laughs so hard he drops the brush and has to feel for it underwater. “No — better: *she named the price and he paid it.*” He hands you a purse that was under a book. “Forty. Because you're right, and because nobody has ever charged me before.”"
            ],
            effects: [
              { t: "gold", n: 40 },
              { t: "sound", id: "coin" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_antechamber", locked: true, secret: true, label: "The Staff Door" }
      ]
    },

    // ---------------------------------------------------------- CENTRE BRANCH
    {
      id: "f3_catalogue_hall",
      name: "The Catalogue Hall",
      kind: "branch",
      size: "grand",
      desc: "Ten thousand drawers, chest-deep in green water, every one of them very slightly ajar.",
      props: ["shelves", "water", "pillars", "machine"],
      onEnter: [
        { t: "say", text: "The drawers open and close in sequence, all down the hall, like something breathing in a very organised way." },
        { t: "sound", id: "gear" }
      ],
      npc: {
        id: "f3_index",
        name: "The Index",
        title: "Function — Enumeration",
        form: "construct",
        voice: "bell",
        palette: { robe: "#123840", trim: "#8fe0ff", glow: "#8fe0ff" },
        greet: [
          "Something made of card and brass and standing water assembles itself out of four separate drawers and regards you with no face at all.",
          "“ACCESSION. One (1) Petitioner, wet, provenance floor two. You are assigned call number 811.4 / V-ii / *incoming*. Please do not lose it. Nothing is lost here; it is only filed badly, which is worse.”"
        ],
        idle: [
          "“811.4 / V-ii. You are still 811.4 / V-ii. I have checked.”"
        ],
        choices: [
          {
            id: "f3_c_i_self",
            text: "Ask what it has been doing for two hundred years.",
            reply: [
              "“INDEXING. Subheading: myself. An index must include itself or it is incomplete. The entry for the index is an entry in the index, which alters the index, which requires a new entry for the index.”",
              "A pause exactly one heartbeat long. “I began at the founding. I am at volume nine hundred and six. I am *behind*, and always will be. This is not a complaint; it is a call number.”"
            ],
            effects: [
              { t: "flag", id: "f3_index_self" },
              {
                t: "codex",
                id: "f3_the_index",
                title: "The Index",
                text: "A Function of the Cadence, tasked with enumeration. Its fixation is completeness, the one condition its own structure forbids. It has never been observed to be wrong. It has also never been observed to be finished, and it regards these as the same achievement described from two directions."
              }
            ]
          },
          {
            id: "f3_c_i_ownname",
            text: "Ask what is filed under the Index's own name.",
            reply: [
              "Every drawer in the hall shuts at once. The noise is like a wave breaking on a floor made of teeth.",
              "“THAT ENTRY IS CLOSED.” The drawers reopen, one at a time, in order, apologetically. “Your call number is 811.4 / V-ii. Was there a further enquiry.”"
            ],
            effects: [
              { t: "sound", id: "wrong" },
              { t: "flag", id: "f3_index_closed" }
            ]
          },
          {
            id: "f3_c_i_bio",
            text: "Ask for the Biographical Stack.",
            reply: [
              "“BIOGRAPHICAL STACK. Access restricted. A shelf-mark is required. I am not obliged to mention that until the third asking; I have mentioned it on the first, which must be recorded as an irregularity under my own name.”",
              "The drawers shift uncomfortably. “Obtain a shelf-mark. The staff issue them, and the staff are sentimental, and can be moved by the returning of property.”"
            ],
            effects: [
              { t: "flag", id: "f3_asked_bio" }
            ]
          },
          {
            id: "f3_c_i_open_item",
            text: "Present the wet shelf-mark.",
            require: { items: ["wet_shelfmark"] },
            lockedText: "(You would need a shelf-mark issued by the staff.)",
            reply: [
              "It takes the card, reads it in a way that involves no eyes, and does not give it back. “VERIFIED. 929.2 / *self* / drowned. The Biographical Stack is open to you.”",
              "“An advisory, issued to all holders and ignored by all holders: those accounts were written before their subjects arrived, and they are *accurate*. Accuracy has never once been a comfort. It is merely correct.”"
            ],
            effects: [
              { t: "item", id: "wet_shelfmark", n: -1 },
              { t: "unlock", to: "f3_biographical" },
              { t: "flag", id: "f3_bio_open" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f3_c_i_open_flag",
            text: "Recite the shelf-mark written on your wrist.",
            require: { flags: ["f3_knows_shelfmark"], notFlags: ["f3_bio_open"] },
            lockedText: "(You would have to know the number by heart, or by wrist.)",
            reply: [
              "You read the eleven characters off your own forearm. The hall goes very quiet.",
              "“That is Loom's hand. Loom is an *irregularity*.” The drawers consider. “The number is nevertheless correct, and an index that refuses a correct number is a shelf. 929.2 / *self* / drowned. Note that I disapprove, and that my disapproval has a call number, and that it is 179.9.”"
            ],
            effects: [
              { t: "unlock", to: "f3_biographical" },
              { t: "flag", id: "f3_bio_open" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f3_c_i_page",
            text: "Show it the page you pulled from the weir.",
            require: { items: ["drowned_page"] },
            lockedText: "(You are not carrying a page off its own run.)",
            reply: [
              "“That is mine. Off my own run. Volume four hundred and twelve, leaf nine.” A drawer opens, and hopefully stays open.",
              "“...Keep it. To take it back I must re-enter it, and re-entering alters the volume. Carry it out of the Verrow. A page that has left the collection is the only page I will never count again — the closest thing to rest I have been offered, and you may tell people I said so.”"
            ],
            effects: [
              { t: "flag", id: "f3_index_blessed_page" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_i_where",
            text: "Ask it to enumerate the exits.",
            reply: [
              "“EXITS. One (1). The Wet Stair, beyond the Antechamber of Returns. Rooms that cost a heartbeat: three (3). Fallen Shelf. Sump. Drain. Two return something. I will not say which two; that is a *value judgement* and I am an index.”"
            ],
            effects: [
              { t: "flag", id: "f3_warned_deadends" },
              { t: "flag", id: "f3_knows_routes" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_upward_room", label: "The Rising Arch" },
        { to: "f3_biographical", locked: true, label: "The Biographical Stack" }
      ]
    },

    {
      id: "f3_upward_room",
      name: "The Room Where Water Climbs",
      kind: "branch",
      size: "large",
      desc: "The water here runs up the walls in slow sheets and is not in any hurry about it, and neither, apparently, is anyone else.",
      props: ["water", "pillars", "glass", "hanginglights"],
      onEnter: [
        { t: "say", text: "A page falls off a high shelf, drifts down, touches the wall, and goes up." },
        { t: "sound", id: "water" }
      ],
      npc: {
        id: "f3_colm",
        name: "Colm Ashery",
        title: "Shelver's Apprentice, Second Year",
        form: "child",
        voice: "high",
        palette: { robe: "#2c4a3a", trim: "#c8e8a0", skin: "#d8c4a8", glow: "#9fe4a8" },
        greet: [
          "A boy of about eleven stands on a stool that is underwater, holding a book against the wall and letting go of it, over and over.",
          "“Forty-two. It goes up. Every time, and I still don't believe it.” He does not look round. “I'm in my second year. I've been in my second year for two hundred and ninety-something years, which Marn says isn't the same as three hundred, and he's right, but it's close.”"
        ],
        idle: [
          "“Forty-three. Still up.”"
        ],
        choices: [
          {
            id: "f3_c_c_why",
            text: "Ask why the water climbs here.",
            reply: [
              "“Because of what's shelved up top.” He points into the dark above. “Accounts of things that hadn't happened yet when they were written. Marn says the lowest place is *before*, and up there is *after*, so the water's going the wrong way because the room is.”",
              "He shrugs enormously. “I like it. It's the only room that's wrong on purpose. Everything else down here is wrong by accident.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_upward" }
            ]
          },
          {
            id: "f3_c_c_true",
            text: "Find the true shape of the room.",
            require: { class: ["cartographer"] },
            reply: [
              "You let the Blind Astrolabe hang. It swings, corrects, and settles pointing at the ceiling, which is not where down is, unless it is. The room is not a room: it is a stairwell laid on its side three hundred years ago and never told. The shelves are steps.",
              "“You went funny,” says Colm, with interest. “Marn goes funny in here too. Forty-five.” He hands you something he has kept in his pocket for three centuries. “It's for pinning pages so they stop going up.”"
            ],
            effects: [
              { t: "item", id: "cold_iron_nail", n: 1 },
              { t: "flag", id: "f3_true_shape" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_c_staff",
            text: "Ask if he knows a way into the staff rooms.",
            reply: [
              "“Course. Staff door past Loom's place, west. Not on the plan, because staff doors aren't. It's bolted from *our* side and I'm not allowed to unbolt it.”",
              "He considers this ruling, which has stood for two hundred and ninety-something years. “But the Slot might. It likes being asked things it's allowed to say yes to, and it doesn't get many.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_staff_door" }
            ]
          },
          {
            id: "f3_c_c_mother",
            text: "Ask who brought him down here.",
            reply: [
              "He catches the falling book instead of letting it go, which breaks the count. “I have to start at one again now,” he says. “One.”"
            ]
          },
          {
            id: "f3_c_c_bio",
            text: "Ask about the Biographical Stack.",
            reply: [
              "His face does something older than eleven. “That's the one with everybody in it. Including people who haven't got here yet, which is how we knew you were coming. Kerr runs it. She says sorry before she does things, which I think is worse than not saying sorry.”",
              "“Don't read yours if you're going to stop halfway.” He says it flatly, the way children say the one true thing in a conversation. “Stopping halfway is the worst one. Ask anybody. Ask *me*.”"
            ],
            effects: [
              { t: "flag", id: "f3_warned_flinch" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_antechamber", label: "The Antechamber Arch" }
      ]
    },

    {
      id: "f3_biographical",
      name: "The Biographical Stack",
      kind: "vault",
      size: "vault",
      desc: "One aisle, very tall, and every account in it was written before its subject walked in.",
      props: ["shelves", "water", "candles", "mirrors"],
      onEnter: [
        { t: "say", text: "The water here is chest-deep and absolutely still, and your own reflection is upside down in it, and reading." },
        { t: "sound", id: "whisper" }
      ],
      npc: {
        id: "f3_kerr",
        name: "Ysolde Kerr",
        title: "Attending Librarian, Biographical",
        form: "robed",
        voice: "mid",
        palette: { robe: "#20303f", trim: "#d8c8a0", skin: "#c4b49a", glow: "#8fd6c4" },
        greet: [
          "A woman with a lamp that burns on the inside of its glass is waiting at the end of the aisle, in a way that suggests she knew the hour.",
          "“I'm sorry in advance,” she says. “Everyone thinks that's a manner. It isn't a manner. Your account is on this shelf; it was filed eleven years before you were born. I have not read it, because I am staff, and because I would like to be able to look at you.”"
        ],
        idle: [
          "“It's still there. I'm sorry. It'll be there whatever you decide.”"
        ],
        choices: [
          {
            id: "f3_c_k_how",
            text: "Ask how a page can be written before you arrive.",
            reply: [
              "“It isn't prophecy. People hear *written in advance* and reach for prophecy, and prophecy is a comfort.”",
              "“The Cadence circulated remembering. Everything anyone was ever going to remember about you passed through here, and we caught the sediment. It isn't the future — it's the residue of everyone who will ever have known you. Which is why it holds things you've never told anyone. Somebody remembered them.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_how" },
              {
                t: "codex",
                id: "f3_biographical",
                title: "The Biographical Stack",
                text: "Accounts settled out of the Cadence's circulation, filed under their subjects' names, written before those subjects arrive. Not prophecy: sediment. Every page is accurate and no page is complete, and the staff have a standing rule against reading their own, which four of them have broken."
              }
            ]
          },
          {
            id: "f3_c_k_fetch",
            text: "Ask her to bring down your page.",
            reply: [
              "She goes up the ladder into the dark and is gone long enough that you count the candles twice. When she comes down there is one leaf of wet paper held flat on both her palms.",
              "“One rule, and it's the only one this stack has: read it to the end, or don't start. Not because anything happens if you stop. It's that a half-read account of yourself is the exact shape of a lie, and nothing on this floor will lie to you, and I'd rather you didn't do it to yourself in my aisle.”"
            ],
            effects: [
              { t: "flag", id: "f3_page_offered" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_k_read",
            text: "Read it. All the way to the end.",
            require: { flags: ["f3_page_offered"], notFlags: ["f3_flinched", "f3_took_page_unread"] },
            lockedText: "(She would have to bring it down first.)",
            reply: [
              "The first third is weather and small facts and it is almost boring. A thing you stole at nine, which you had remembered as being smaller. A promise at seventeen that you kept, recorded without praise, because the page does not praise.",
              "The second third is other people. A great many people have thought about you at length and none of them mentioned it. There is a paragraph about the way you hold a cup, clearly remembered by someone who loved you, and it does not say who.",
              "The last third is the plinth. You came to the mouth of the Verrow with somebody. Her name is written here and you do not recognise it — Aveth Sarn — and the page notes, without emphasis, that you had known her nineteen years.",
              "The tower opens for one. The tower asked which of you, and named its price, which was not a life; the Verrow does not take lives at the door. It takes a memory, and it lets the payer choose whose.",
              "The page records what you said. It is three words long. It is: “Then take hers.”",
              "She is still up there in the salt wind, and she does not know what she is waiting for. She only knows that she is waiting. That is in the margin, in another hand, dated *before* the main entry, which is the most frightening thing on the page. The last line is in your own handwriting. You have not written it yet.",
              "You look up. Kerr is looking at the ceiling. “There,” she says quietly. “You got to the end. That's more than four of the staff managed, and we *work* here.”"
            ],
            effects: [
              { t: "flag", id: "f3_read_own_page" },
              { t: "item", id: "own_page", n: 1 },
              { t: "sound", id: "bell" },
              {
                t: "codex",
                id: "f3_aveth",
                title: "Aveth Sarn",
                text: "Nineteen years. At the mouth of the plinth she was the one who did not go down. The Verrow's door-price is one memory, and the payer chooses whose; you chose hers, and the choosing was itself the thing you then forgot. She is still above, waiting, and cannot say for what."
              }
            ]
          },
          {
            id: "f3_c_k_stop",
            text: "Read the first half, then stop.",
            require: { flags: ["f3_page_offered"], notFlags: ["f3_read_own_page", "f3_took_page_unread"] },
            lockedText: "(She would have to bring it down first.)",
            reply: [
              "Weather. Small facts. A stolen thing at nine. Somebody, unnamed, who loved the way you hold a cup. You put the page face down on the water and it floats there, still legible, still going.",
              "“That's allowed,” says Kerr eventually. “I want you to hear me say it's allowed. It'll keep — everything here keeps. You'll simply be a person with a page now. There are a great many of those and most of them are perfectly happy.”",
              "She goes up the ladder slowly and comes down empty-handed and does not look at you, and she was right that the sorry was not a manner."
            ],
            effects: [
              { t: "flag", id: "f3_flinched" },
              { t: "sound", id: "whisper" }
            ]
          },
          {
            id: "f3_c_k_other",
            text: "Ask instead for the page of whoever waits at the stair.",
            require: { notFlags: ["f3_read_others_page"] },
            reply: [
              "Kerr's mouth goes thin. “That is within the rules. Notice I said *within the rules* and not *all right*.” She fetches it anyway, because she is staff.",
              "It is short. The woman at the Wet Stair came down two hundred years ago, reached this floor, and sat in the last carrel to finish one book before going on. She is still finishing it. The reason she cannot leave is not a lock. Her name is Hanne Verrild; she lost it about a century in and has been too polite to ask anyone.",
              "“Now you know a thing about a stranger that the stranger doesn't,” says Kerr. “That's useful. I've watched Petitioners use it. I've never once watched one enjoy it afterwards, and I've watched forty-one.”"
            ],
            effects: [
              { t: "flag", id: "f3_read_others_page" },
              { t: "sound", id: "whisper" },
              {
                t: "codex",
                id: "f3_hanne",
                title: "Hanne Verrild",
                text: "Petitioner, two hundred years ago. Sat down in the last carrel to finish one book before continuing. Was not stopped, trapped, or taken. Simply did not get up. Lost her name around the first century and has never asked anybody for it, on the grounds that it would be an imposition."
              }
            ]
          },
          {
            id: "f3_c_k_take",
            text: "Take your page down unread and pocket it.",
            require: { flags: ["f3_page_offered"], notFlags: ["f3_read_own_page", "f3_flinched"] },
            lockedText: "(She would have to bring it down first.)",
            reply: [
              "She hands it over without argument. It is heavier than one leaf of paper has any business being.",
              "“It's yours. It was always yours; that's what the stack is *for*.” A pause. “Till will buy it at the weir. He doesn't read what he buys, so it wouldn't even be a betrayal, exactly. Sixty, I should think. I mention it because you'd find out anyway.”"
            ],
            effects: [
              { t: "item", id: "own_page", n: 1 },
              { t: "flag", id: "f3_took_page_unread" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f3_c_k_hers",
            text: "Ask whether she has read her own.",
            reply: [
              "“No.” The lamp burns on the inside of its glass. “Was there anything else? I'm sorry. That was sharper than I meant it, and I'm not going to pretend I don't know why.”"
            ]
          },
          {
            id: "f3_c_k_nothing",
            text: "Read nothing. Leave the shelf alone entirely.",
            reply: [
              "“Then that's your answer to the Ward, and it's a real one,” she says. “*Nothing.* It's been given before. Twice, by people I'd have called brave.”",
              "“The stair takes anything true. Go on — and mind the water in the antechamber, it comes over the sill and the Slot hates that.”"
            ],
            effects: [
              { t: "flag", id: "f3_read_nothing" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_antechamber", label: "The Stack Door" }
      ]
    },

    // ------------------------------------------------------------ EAST BRANCH
    {
      id: "f3_cold_current",
      name: "The Cold Current",
      kind: "corridor",
      size: "hall",
      desc: "A long flooded gallery where the water moves against you the whole way, carrying paper, carrying pieces of paper, carrying words.",
      props: ["water", "pillars", "shelves"],
      onEnter: [
        { t: "say", text: "The current is full of torn accounts and every one of them brushes past you at reading height." },
        { t: "sound", id: "water" }
      ],
      doors: [
        { to: "f3_shelving_room", label: "The Shelving Room" }
      ]
    },

    {
      id: "f3_shelving_room",
      name: "The Shelving Room",
      kind: "branch",
      size: "large",
      desc: "Two people are shelving. They have been shelving for three hundred years and they are roughly half done.",
      props: ["shelves", "water", "bookstacks", "table"],
      npc: {
        id: "f3_nessery",
        name: "Bel and Bent Nessery",
        title: "Shelvers, First and Second",
        form: "twin",
        voice: "choral",
        palette: { robe: "#24424a", trim: "#a8d8c0", skin: "#c0b298", glow: "#8fe0c8" },
        greet: [
          "Two of them, working a trolley between them, passing books left-right-left without looking.",
          "“You're dripping,” says the one on the left. “—which is fine,” says the one on the right, “—which is fine, obviously—” “—but Marn will have mentioned it.” “He mentions it.” “Four thousand times.”"
        ],
        idle: [
          "“Left, right.” “Left, right.” “Still about half done.”"
        ],
        choices: [
          {
            id: "f3_c_n_half",
            text: "Ask how they can be half done after three centuries.",
            reply: [
              "“Because we shelve accounts—” “—and accounts get added—” “—every time anybody does anything—” “—including us, shelving.” “Which needs shelving.” “At about half the rate we shelve.”",
              "“So we gain,” says the left one, with real satisfaction. “Slowly.” “But we gain.” “Four hundred more years and we'll be finished, and we intend to be insufferable about it.”"
            ],
            effects: [
              { t: "flag", id: "f3_nessery_math" }
            ]
          },
          {
            id: "f3_c_n_hound",
            text: "Tell them how the Houndmaster keeps his records.",
            reply: [
              "The trolley stops. Both turn. “Chalk.” “In air.” “Rewritten from *memory*.”",
              "“We've been trying to get a requisition up to floor two for two hundred years,” says the right one. “Six bottles of green and a tub.” “That's all it'd take.” “He's not cruel,” says the left one, sadly. “That's the thing about him. He's not cruel, he's just *confident*.”",
              "The right one digs in the trolley and hands you a strip of wet card. “Shelf-mark, Biographical. Payment. We've a drawer of them and nobody to be angry with.”"
            ],
            effects: [
              { t: "item", id: "wet_shelfmark", n: 1 },
              { t: "gold", n: 15 },
              { t: "flag", id: "f3_nessery_paid" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f3_c_n_drain",
            text: "Ask what is through the low arch.",
            reply: [
              "“The drain.” “Don't.” “There's nothing in it.” “It's not even dangerous, exactly, it just *takes*.” “It's the only room down here that gives nothing back.” “We've filed nine complaints.” “Marn has filed eleven. He's better at complaints than us. It's his whole discipline.”"
            ],
            effects: [
              { t: "flag", id: "f3_warned_drain" }
            ]
          },
          {
            id: "f3_c_n_refuse",
            text: "Ask which section they refuse to shelve.",
            reply: [
              "Left-right-left. Left-right-left. “We're about half done,” says the left one. “Ask us something else.” “Ask us about the annex.” “The annex is nice.”"
            ]
          },
          {
            id: "f3_c_n_annex",
            text: "Ask about the annex.",
            reply: [
              "“Through there. Things that aren't books.” “It connects to the Antechamber, which is the useful part.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_annex" }
            ]
          },
          {
            id: "f3_c_n_oath",
            text: "Stand surety for the requisition to floor two.",
            require: { class: ["warden"] },
            reply: [
              "You say the form of words. That the order authorising them was dissolved by decree eighty years ago does not, it turns out, matter to a shelver.",
              "“That's an *oath*,” says the left one. “A real one.” “On a requisition.” “Nobody's ever—” The right one puts six bottles of green ink in a net bag, then takes five back out. “One for you. Five for the requisition. If you reach floor two again, you know what to do with it.”"
            ],
            effects: [
              { t: "item", id: "drowned_ink", n: 1 },
              { t: "flag", id: "f3_warden_surety" },
              { t: "sound", id: "bell" }
            ]
          }
        ]
      },
      doors: [
        { to: "f3_drain", label: "The Low Arch" },
        { to: "f3_annex", label: "The Annex Door" }
      ]
    },

    {
      id: "f3_drain",
      name: "The Drain",
      kind: "deadend",
      size: "tiny",
      desc: "The only room in the archive with nothing shelved in it, and the water here is going somewhere.",
      props: ["water", "rubble"],
      onEnter: [
        { t: "say", text: "The floor is a grating and the pull through it is gentle and enormous and entirely uninterested in you." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "You get a hand to the arch. The drain gives nothing back; that is the documented complaint." },
        { t: "move", to: "f3_shelving_room" }
      ],
      doors: []
    },

    {
      id: "f3_annex",
      name: "The Eastern Annex",
      kind: "branch",
      size: "medium",
      desc: "Where they put the things that are not books: coats, boots, three lamps, and a purse nobody has claimed in sixty years.",
      props: ["rubble", "water", "table", "candles"],
      onEnter: [
        { t: "say", text: "A purse on a table above the waterline, with a tag on it that reads only: LEFT." },
        { t: "gold", n: 25 },
        { t: "item", id: "chalk_stub", n: 1 },
        { t: "sound", id: "coin" }
      ],
      doors: [
        { to: "f3_antechamber", label: "The Antechamber Door" }
      ]
    },

    // ------------------------------------------------------------ CONVERGENCE
    {
      id: "f3_antechamber",
      name: "The Antechamber of Returns",
      kind: "hub",
      size: "large",
      desc: "Ankle-deep, and everything anybody ever gave back is stacked here in perfect order, waiting.",
      props: ["water", "table", "shelves", "machine"],
      npc: {
        id: "f3_slot",
        name: "The Returns Slot",
        title: "Function — Restitution",
        form: "construct",
        voice: "low",
        palette: { robe: "#1a2c34", trim: "#c8d8e0", glow: "#7fd8cb" },
        greet: [
          "A brass mouth in the wall, three feet wide, with a counter under it and a great many small drawers behind. It speaks from somewhere down its own throat.",
          "“RETURNS. Items, accounts, amendments, apologies. A receipt is issued for each. I issue receipts for the receipts, which is the Index's fault and which we do not discuss. The water is coming over the sill. It always comes over the sill and I always mention it.”"
        ],
        idle: [
          "“Returns. Receipts. The water is over the sill.”"
        ],
        choices: [
          {
            id: "f3_c_s_what",
            text: "Ask what it takes back.",
            reply: [
              "“Anything issued by this floor. Most commonly borrowed accounts. Once, memorably, a borrowed apology, returned unused after ninety years, in good condition.”",
              "“I also take *amendments*. An amendment is an addition to an existing account, made by a party to it, in drowned ink, which cannot be rubbed out. It is the only thing filed here that I regard as work rather than tidying.”"
            ],
            effects: [
              { t: "flag", id: "f3_knows_amend" }
            ]
          },
          {
            id: "f3_c_s_staff",
            text: "Ask it to unbolt the staff door to the west.",
            reply: [
              "“YES.” The brass mouth says it with what can only be described as appetite. “That is within my authority and nobody has asked in two hundred and forty years.”",
              "A bolt somewhere west draws back with a sound like a swallowed bell. “It leads to the Marginalia, where Loom is, whom I am obliged to call an irregularity and personally regard as the best of them. A receipt has been issued. Drawer four hundred and six.”"
            ],
            effects: [
              { t: "unlock", to: "f3_marginalia" },
              { t: "flag", id: "f3_staff_open" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f3_c_s_amend",
            text: "File an amendment to your own account.",
            require: { flags: ["f3_read_own_page"], items: ["drowned_ink", "own_page"] },
            lockedText: "(You would need your page, read to the end, and a bottle of drowned ink.)",
            reply: [
              "“AMENDMENT. Party to the account: yourself. Medium: drowned ink, one bottle, adequate. Proceed.”",
              "You spread the page flat under the water on the counter, because it will not take ink in air, and hold the bottle upside down, and it does not pour so much as *arrive*.",
              "You write her name. Aveth Sarn. You write that she is at the mouth of the tower and does not know what she is waiting for, and that this is because of three words you said on a cold morning, and that nobody made you say them. You do not write that you are sorry. It is not that kind of ink.",
              "“FILED. Cross-referenced: SARN, AVETH — living, surface, waiting. An entry now exists under her name. It did not before. She was not in this archive at all.”",
              "A long brass pause. “That is the whole of what an amendment is. It does not undo. It does not forgive. It means that when everything above ground has gone quiet, there will be one wet page down here that knows she was there.”",
              "A receipt slides out. You do not take it."
            ],
            effects: [
              { t: "item", id: "drowned_ink", n: -1 },
              { t: "flag", id: "f3_amended" },
              { t: "sound", id: "bell" },
              { t: "say", text: "Every drawer in the antechamber opens one inch, together, and stays open." },
              {
                t: "codex",
                id: "f3_amendment",
                title: "On Amendments",
                text: "An addition to an account, made by a party to it, in a medium that cannot be erased. It undoes nothing. Its entire function is that afterwards the archive holds a thing it did not hold before, and holds it in the hand of the person it happened to. The staff consider this the only real work done on this floor."
              }
            ]
          },
          {
            id: "f3_c_s_return",
            text: "Return the page you took, unread.",
            require: { items: ["own_page"], flags: ["f3_took_page_unread"] },
            lockedText: "(You are not carrying an account you took without reading.)",
            reply: [
              "The mouth takes it. There is no sound of it landing. “RETURNED. Condition: unread. Noted without comment; I am not equipped for comment and have petitioned for the equipment.”",
              "“The receipt reads, in full: *one (1) account, of the bearer, returned to stack, contents unknown to bearer at time of return.* That is accurate and will be accurate for ever, which is what a receipt is.”"
            ],
            effects: [
              { t: "item", id: "own_page", n: -1 },
              { t: "flag", id: "f3_returned_unread" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f3_c_s_loom",
            text: "Let Loom write his one line in your margin.",
            require: { flags: ["f3_loom_promised", "f3_read_own_page"], items: ["own_page"] },
            lockedText: "(You would need a page you have read, and a promise made in the west.)",
            reply: [
              "He is already at the counter, tall and dripping, because of course he is. One line, very small, in the right-hand margin beside the three words. He turns it round so you can read it and does not wait to see your face, which is the kindest thing anyone does to you on this floor.",
              "It says: *unknown, and the not-knowing is part of the account — but she waited, and waiting is a thing a person does, not a thing that happens to them.*",
              "“No,” says Loom, to himself, going. “No — better: *she is still doing it.*”"
            ],
            effects: [
              { t: "flag", id: "f3_loom_annotated" },
              { t: "sound", id: "whisper" }
            ]
          },
          {
            id: "f3_c_s_hound",
            text: "Ask about a requisition of ink for floor two.",
            reply: [
              "“REQUISITION 2-006-GREEN. Six bottles and a tub. Status: pending transport. There has never been transport. Transport is a Petitioner, and Petitioners go down.”",
              "A drawer shuts. “The file is nevertheless open. A file that closes because nobody came is *abandoned*, and I do not abandon.”"
            ],
            effects: [
              { t: "flag", id: "f3_requisition" }
            ]
          },
          {
            id: "f3_c_s_stair",
            text: "Ask about the stair.",
            reply: [
              "“THE WET STAIR. One (1) occupant, seated, two hundred years, not staff, not Kept by our doing. She has never been prevented from leaving. I want that in the record, because people arrive here with theories.”"
            ]
          }
        ]
      },
      doors: [
        { to: "f3_exit", label: "The Wet Stair" }
      ]
    },

    // ------------------------------------------------------------------- EXIT
    {
      id: "f3_exit",
      name: "The Wet Stair",
      kind: "exit",
      size: "medium",
      desc: "A stair going down, running with water, and one last reading carrel on the landing with somebody still in it.",
      props: ["stairs", "water", "table", "candles"],
      npc: {
        id: "f3_hanne",
        name: "The Woman in the Last Carrel",
        title: "Petitioner, Unfinished",
        form: "robed",
        voice: "mid",
        palette: { robe: "#2b3a4a", trim: "#bfe4ff", skin: "#c8b8a0", glow: "#9fe4ff" },
        greet: [
          "She sits at the last desk with a book open and the water up to the seat of her chair, and looks up with the unhurried courtesy of someone very deep in a chapter.",
          "“Oh — sorry. Hello.” She marks her place with one finger. “Do you happen to know what the time is? Nobody down here does and I've stopped expecting it, but I ask. Stair's just there. It's honest. Mind the third step, it isn't there.”"
        ],
        idle: [
          "“Do you know the time? No. No, of course.”"
        ],
        choices: [
          {
            id: "f3_c_h_book",
            text: "Ask what she is reading.",
            reply: [
              "“I genuinely don't know any more. I know where I am in it.” She shows you: about two thirds. Her thumb has worn a hollow in the page.",
              "“I sat down for one chapter. Three floors down, and I thought: one chapter, then the stair.” She laughs, not bitterly. “The awful thing is it isn't even good. Nobody's keeping me. I'm just not finished.”"
            ],
            effects: [
              { t: "flag", id: "f3_hanne_book" }
            ]
          },
          {
            id: "f3_c_h_name",
            text: "Tell her that her name is Hanne Verrild.",
            require: { flags: ["f3_read_others_page"] },
            reply: [
              "Her finger comes off the place. She does not notice. “Hanne,” she says. Then: “Verrild. Yes, that's—” and she stops, and looks at you carefully, and you can watch her arrive at the only way you could possibly know.",
              "“You read my page.” Not an accusation; she is too tired for one. “Kerr fetched it, because Kerr is staff.”",
              "“Thank you,” she says, and means it. “I'd have told you, if you'd sat an hour and let me get round to it.” She gives you a coin from her coat, struck by a mint that never existed. “Go on. Third step isn't there.”"
            ],
            effects: [
              { t: "item", id: "quiet_coin", n: 1 },
              { t: "flag", id: "f3_gave_name" },
              { t: "sound", id: "bell" }
            ]
          },
          {
            id: "f3_c_h_token",
            text: "Descend, carrying the amendment.",
            require: { flags: ["f3_amended"] },
            reply: [
              "She looks at the wet page in your hand, and at the new writing on it, and does not ask, which you will remember.",
              "“You read the whole thing,” she says. “And then you *wrote on it*. Most people read the whole thing and then stand very still for an hour and go down.”",
              "“That's the question, you know. The Ward's. It isn't *what will you read* — it's whether you're still holding it at the bottom of the page.” She turns back to her book, two thirds through. “Go on. Third step isn't there.”",
              "The stair takes you. The water runs down beside you the whole way, and the page in your hand stays wet, and Aveth Sarn's name does not come off."
            ],
            effects: [
              { t: "sound", id: "bell" },
              { t: "floorEnd", token: true }
            ]
          },
          {
            id: "f3_c_h_flinch",
            text: "Descend, having stopped halfway.",
            require: { flags: ["f3_flinched"] },
            reply: [
              "“Ah,” she says, gently. “You've got that face. Half of one, is it.”",
              "“It'll keep. You could come back up — people say that. People have said it to me for two hundred years and I say *mm*, and here I am, two thirds through.” She finds her place. “Mm. Third step isn't there.”"
            ],
            effects: [
              { t: "floorEnd" }
            ]
          },
          {
            id: "f3_c_h_nothing",
            text: "Descend, having read nothing at all.",
            require: { flags: ["f3_read_nothing"], notFlags: ["f3_read_own_page", "f3_flinched"] },
            reply: [
              "“Nothing.” She considers it properly, which is more than most would. “That's a real answer. Everything here is true and nearly all of it is *heavy*, and someone who walks an archive and reads nothing has understood something about weight.”",
              "“Or is frightened. Both count. The Ward takes both. Third step isn't there.”"
            ],
            effects: [
              { t: "floorEnd" }
            ]
          },
          {
            id: "f3_c_h_down",
            text: "Go down.",
            reply: [
              "“Right you are.” She is already back in the book. “Third step isn't there, the fourth one's fine, and after that it's just stairs for a long time.”",
              "You go down. Behind you, in a room you are no longer in, somebody turns a page."
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

// Floor 5 — The Garden Under Glass
// Ward the Fifth — What will you let grow?

export default {
  id: 5,
  name: "The Garden Under Glass",
  theme: "garden",
  subtitle: "Ward the Fifth — What will you let grow?",
  intro:
    "A vaulted ceiling of green glass shows no sky, only more glass. Beneath it, two hundred years of unharvested growth has gone feral and luminous, violet at the root and teal at the tip. The air is thick with drifting spores, and some of them are other people’s childhoods.",
  entry: "f5_entry",

  items: {
    pale_sheet: {
      name: "Sheet of Pale Growth",
      kind: "trade",
      value: 22,
      icon: "scroll",
      tint: "#dff0d8",
      desc: "Harvested tissue, cured to two hairs thick. Blank. This is what memory is written on before it is memory."
    },
    steeping_flask: {
      name: "Flask of Steeping Water",
      kind: "tool",
      value: 45,
      icon: "vial",
      tint: "#8fe4c8",
      desc: "Forty-five gold of green water. Enough to carry one planting through its first ninety years, which is not a figure of speech."
    },
    green_cutting: {
      name: "A Cutting, Taken Kindly",
      kind: "trade",
      value: 12,
      icon: "seed",
      tint: "#b6f0a4",
      desc: "Snipped at an angle from something that had grown two centuries and did not object. Still faintly warm at the cut."
    },
    spore_lamp: {
      name: "Lamp of Slow Spores",
      kind: "tool",
      value: 24,
      icon: "lantern",
      tint: "#c9a8ff",
      desc: "A bulb of drowsing spores. Held up it lights a room. Held close it lights an afternoon you did not have."
    },
    afternoon_in_a_jar: {
      name: "An Afternoon, Unrooted",
      kind: "relic",
      value: 80,
      icon: "vial",
      tint: "#ffd9a0",
      desc: "Late light, a yard, a dog, an unripe plum, a woman calling from a doorway. It fits in a jar now. It did not use to."
    },
    bottled_spring: {
      name: "Spring, Ninth Year of the Cadence",
      kind: "consumable",
      value: 55,
      icon: "cup",
      tint: "#9fe4b0",
      desc: "Provenance: a barge-wife on the Ammerlin cut. Nose of wet rope and onions. A long finish, mostly relief."
    },
    cask_last_summer: {
      name: "Cask of the Last Summer",
      kind: "relic",
      value: 220,
      icon: "cup",
      tint: "#ffc46b",
      desc: "The final summer before the Thinning, decanted from eleven thousand people who were there. The vintner will not lower the price and does not need to."
    },
    tally_hook: {
      name: "Harvester’s Tally Hook",
      kind: "tool",
      value: 18,
      icon: "blade",
      tint: "#cdbf94",
      desc: "Bronze, blunted, notched four thousand and eleven times. The four thousand and twelfth notch is started and not finished."
    }
  },

  rooms: [
    // ---------------------------------------------------------------- ENTRY
    {
      id: "f5_entry",
      name: "The Sill",
      kind: "entry",
      size: "medium",
      desc: "The stair from the Foundry ends in warm wet air, and something green has grown over the last three steps to meet you.",
      props: ["roots", "spores", "glass"],
      onEnter: [
        { t: "say", text: "This heat is not the Foundry’s heat. This heat is alive, and it is breathing on you." },
        { t: "sound", id: "whisper" },
        {
          t: "codex",
          id: "f5_substrate",
          title: "On Substrate",
          text: "Memory cannot be kept on nothing. The Cadence grew its own paper: a pale tissue harvested in sheets two hairs thick, cured, and written upon. The fifth floor was the lungs and the fields both. When the Cadence stopped, nobody told the garden."
        }
      ],
      npc: {
        id: "f5_ossian",
        name: "Ossian Reed",
        title: "the Last Harvest",
        form: "hunched",
        voice: "dry",
        palette: { robe: "#2f4436", trim: "#cdbf94", skin: "#c8b79a", glow: "#8fe4a0" },
        greet: [
          "A man sits on a crate with a bronze hook across his knees and one pale sheet over his arm. A vine has grown through the crate and out the other side.",
          "“Four thousand and eleven,” he says, not looking up. “Sheets cut, cured and carried up the ramp. Then the ramp stopped taking them. I’m still holding the twelfth.”"
        ],
        idle: ["“Still four thousand and eleven. Ask me again in a hundred years.”"],
        choices: [
          {
            id: "f5_c_ossian_ways",
            text: "Ask what lies ahead.",
            reply: [
              "“East under the lattice is the drift. Spore-thick. The vintner’s out that way. Straight on is the Nave — the Gardener’s in there. Was a person. Talks at the speed of weather.”",
              "“West is the warm flue. Careful: there’s a cistern off it full of spore-fog, and fog that thick isn’t weather, it’s a crowd. You come out lighter than you went in.”"
            ],
            effects: [
              { t: "flag", id: "f5_briefed" },
              { t: "flag", id: "f5_warned_cistern" }
            ]
          },
          {
            id: "f5_c_ossian_count",
            text: "Offer to finish his count.",
            require: { flags: ["f5_briefed"] },
            lockedText: "(Ask him about the floor first. He is a man who likes an order to things.)",
            reply: [
              "“The Press knows my hand. Tell it you carry my tally and it’ll pay you like it’s paying me.”",
              "He closes your fingers on the hook; two of his have gone woody at the knuckle. “It’s the only thing down here with my name on it, and the name is only notches.”"
            ],
            effects: [
              { t: "item", id: "tally_hook", n: 1 },
              { t: "flag", id: "f5_counting" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f5_c_ossian_shape",
            text: "Read the true shape of the vault.",
            require: { class: ["cartographer"] },
            reply: [
              "The Blind Astrolabe turns once. The garden is a field, folded. Four plots. Only the west has been dug in two centuries — recently, and repeatedly.",
              "Ossian watches your face change. “Ah. I don’t discuss the west plot. Not won’t. Don’t. There’s a difference and I’ve had time to be precise about it.”"
            ],
            effects: [
              { t: "flag", id: "f5_true_shape" },
              { t: "item", id: "chalk_stub", n: 1 }
            ]
          },
          {
            id: "f5_c_ossian_sheet",
            text: "Ask what he is holding.",
            reply: [
              "“A sheet. Two hairs thick. Blank.” He smooths it the way you smooth a bedsheet over someone asleep. “Everything the Cadence knew, it knew on this. Every road. Every face.”",
              "“People think memory’s a thing you have. It’s a thing you grow, and cut, and carry up a ramp. Nobody up there ever thought about the ramp.”"
            ],
            effects: [
              {
                t: "codex",
                id: "f5_harvest",
                title: "The Harvest Cycle",
                text: "Growth, cutting, curing, carriage — performed by hand, because the Cadence held that hands remembered better than machines. Ossian Reed was one of nine hundred harvesters. He is the only one still counting."
              }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_lattice", label: "Under the Lattice" },
        { to: "f5_nave", label: "The Nave Arch" },
        { to: "f5_flue", label: "The Warm Flue" }
      ]
    },

    // ------------------------------------------------------------- LATTICE
    {
      id: "f5_lattice",
      name: "The Lattice Walk",
      kind: "branch",
      size: "hall",
      desc: "A long walk under root and glass, the air so thick with spores that crossing it is like crossing a conversation.",
      props: ["spores", "roots", "hanginglights"],
      onEnterAlways: [
        { t: "say", text: "You breathe in and remember, briefly and vividly, a kitchen you have never stood in." }
      ],
      npc: {
        id: "f5_kite",
        name: "Kite",
        title: "who Collects Afternoons",
        form: "child",
        voice: "high",
        palette: { robe: "#3b2f5a", trim: "#d9b8ff", skin: "#e2d4f0", glow: "#c9a8ff" },
        greet: [
          "A child stands in the thickest drift with both arms out, letting it break over her like surf. She is transparent at the edges, in the way that means she will not get any older.",
          "“Seven,” she announces. “Man teaching his daughter to gut a fish. Loses a point for looking at the door.” She notices you. “Oh good. Fresh lungs.”"
        ],
        idle: ["“Four,” she says, disappointed. “Somebody’s wedding. Everyone’s always so pleased at weddings.”"],
        choices: [
          {
            id: "f5_c_kite_walk",
            text: "Stand in the drift with her.",
            reply: [
              "For four heartbeats you are eleven, your name is Tomasz, and you are hiding in an apple barrel while your brother counts. He has reached sixty-one. You have never been so certain you will win. Then it runs out of you like water from cupped hands.",
              "“That’s the barrel one. Nine — nearly a ten, but he never finds out if he won.” She hands you a glass bulb of drowsing purple. “A lamp held up, company held close. Don’t hold it close for long.”"
            ],
            effects: [
              { t: "item", id: "spore_lamp", n: 1 },
              { t: "sound", id: "whisper" },
              { t: "flag", id: "f5_walked_drift" },
              {
                t: "codex",
                id: "f5_drift",
                title: "On Drift",
                text: "Spores carry memory the way pollen carries inheritance: indiscriminately, wastefully, with no interest in consent. A dense cloud can hold an entire afternoon. Breathing one lends it to you at interest, and the interest is that for a moment you are not the only person in your own head."
              }
            ]
          },
          {
            id: "f5_c_kite_arbour",
            text: "Ask what is up in the canopy.",
            reply: [
              "“Rell’s up there. Salt-born, and she’ll tell you so nine times. Don’t go in the east arbour — that one’s annuals. They got one year, it’s over, and they’re all still in there having it.”",
              "“It’s not frightening. It’s worse. It’s *nice*, and then it’s a year later and you’re hungrier. Two out of ten, and I recommend nearly everything.”"
            ],
            effects: [{ t: "flag", id: "f5_warned_arbour" }]
          },
          {
            id: "f5_c_kite_ilse",
            text: "Ask about the thickest cloud of all.",
            reply: [
              "Kite goes quiet, which takes a moment, because quiet does not fit her. “That’s not a cloud, that’s Ilse. She got thick enough to be a shape. She has one afternoon all the way through, and then she has it again.”",
              "“People come down and want to let her go, because they think being stuck is the worst thing. They never ask her. I asked her. I’m the only one who asked her.”"
            ],
            effects: [
              { t: "flag", id: "f5_heard_of_ilse" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f5_c_kite_hers",
            text: "Ask which afternoon is hers.",
            require: { flags: ["f5_walked_drift"] },
            lockedText: "(Not before you have stood in the drift yourself. She would only score the question.)",
            reply: [
              "“Six. Next question.” You wait. Down here waiting is the only interrogation that works, and it works anyway.",
              "“You can’t hold two at once. Every time I take a good one I put one down, and I’ve been taking good ones a very long time.” Lightly. Lightly is the tell. “I chose it. I choose it every time.”"
            ],
            effects: [{ t: "flag", id: "f5_kite_truth" }]
          }
        ]
      },
      doors: [
        { to: "f5_vintnery", label: "The Vine Stall" },
        { to: "f5_steeping", label: "The Steeping House" },
        { to: "f5_afternoon", label: "The Blossom Floor" }
      ]
    },

    // ------------------------------------------------------------ VINTNERY
    {
      id: "f5_vintnery",
      name: "The Vintnery Under the Vine",
      kind: "shop",
      size: "medium",
      desc: "Racks of bottles laid on their sides beneath a vine as thick as a man, each labelled in a small hand with a year and a name.",
      props: ["shelves", "crystals", "candles", "roots"],
      npc: {
        id: "f5_pell",
        name: "Corvin Pell",
        title: "Vintner of the Eighth Rain",
        form: "robed",
        voice: "mid",
        palette: { robe: "#4a2b3d", trim: "#e8c07a", skin: "#d8bfa0", glow: "#ffbf7a" },
        greet: [
          "A neat man in a stained apron holds a bottle to a candle. “A moment. I am reading the legs. Ammerlin, spring, ninth year. Barge-wife. Nose of wet rope and onions, finish almost entirely relief.”",

          "“Corvin Pell. I bottle the drift. You are, from the salt on your boots, a Petitioner: poor, hungry and interesting. Two of those I can help with.”"

        ],
        idle: ["“Taste before you judge, and buy before you taste. That is the order of operations.”"],
        choices: [
          {
            id: "f5_c_pell_shop",
            text: "Look over the racks.",
            once: false,
            reply: ["“Mind the older shelves. Some of the thirties are still *warm*.”"],
            effects: [
              {
                t: "shop",
                stock: [
                  { item: "steeping_flask", price: 45 },
                  { item: "bottled_spring", price: 55 },
                  { item: "spore_lamp", price: 28 },
                  { item: "tallow_candle", price: 7 },
                  { item: "rope_coil", price: 12 },
                  { item: "cask_last_summer", price: 220 }
                ],
                buys: [
                  { item: "pale_sheet", price: 20 },
                  { item: "glass_seed", price: 45 },
                  { item: "afternoon_in_a_jar", price: 80 },
                  { item: "salt_shard", price: 20 },
                  { item: "drowned_page", price: 30 },
                  { item: "grey_feather", price: 12 },
                  { item: "green_cutting", price: 10 }
                ]
              },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f5_c_pell_provenance",
            text: "Ask where the vintages come from.",
            reply: [
              "“Provenance,” he says, and kisses his fingers. “Any fool can catch drift in a jar. The question is *whose*, and *when*.”",
              "“The lattice gives me kitchens, weather, a great deal of bread. The deep vintages come from further in, and I do not discuss where — not from shame; I checked the cupboard and it was bare.”"
            ],
            effects: [{ t: "flag", id: "f5_pell_provenance" }]
          },
          {
            id: "f5_c_pell_ilse",
            text: "Ask whether he would buy the Afternoon.",
            require: { flags: ["f5_heard_of_ilse"] },
            lockedText: "(You do not yet know there is anything out there to sell.)",
            reply: [
              "His whole face opens like a door. “The rooted one. Two hundred years of one afternoon held at perfect temperature by a thing that loves it. There is no cask in Caudmere with that concentration.”",
              "“Eighty gold, in a jar, no questions and no hard feelings. She will not object, by the way. That is the beauty of it. She does not have the sort of afternoon that can object.”"
            ],
            effects: [
              { t: "flag", id: "f5_pell_offer" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f5_c_pell_appraise",
            text: "Name the true price of the cask.",
            require: { class: ["coinwright"] },
            reply: [
              "“Eleven thousand people. Two hundred and twenty gold. One fiftieth of a coin per person, per summer, forever.”",
              "Pell beams. “Exactly what it is worth, because worth is what a thing fetches and nothing else.” He presses forty gold on you and will not take it back."
            ],
            effects: [
              { t: "gold", n: 40 },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f5_c_pell_sheets",
            text: "Ask what a blank sheet is worth.",
            reply: [
              "“Twenty, and we both know it’s generous — a blank sheet is substrate, not vintage.”",
              "“But I’ll buy every one you bring, because one day somebody up there will want to write something down again. Not in my lifetime. I have stopped having one of those.”"
            ],
            effects: [{ t: "flag", id: "f5_knows_sheet_price" }]
          }
        ]
      },
      doors: []
    },

    // ------------------------------------------------------------ STEEPING
    {
      id: "f5_steeping",
      name: "The Steeping House",
      kind: "branch",
      size: "medium",
      desc: "Long shallow troughs of green water, and in each a pale sheet lying just under the surface like something drowned very carefully on purpose.",
      props: ["water", "table", "pipes", "spores"],
      npc: {
        id: "f5_marda",
        name: "Marda Quill",
        title: "who Keeps the Troughs",
        form: "robed",
        voice: "mid",
        palette: { robe: "#1f4438", trim: "#a8e8c8", skin: "#c4b49a", glow: "#7fe4b8" },
        greet: [
          "A woman kneels at the second trough with both arms in the water to the shoulder. She does not take them out to greet you.",
          "“Two hairs thick. Thicker and a name comes out fat and unreadable. Thinner and it tears drying, and you’ve cured a hole. Everyone thinks the growing is the difficult part.”"
        ],
        idle: ["“Two hairs. Not one. Not three.”"],
        choices: [
          {
            id: "f5_c_marda_harvest",
            text: "Ask whether you may take what’s cured.",
            reply: [
              "“Take them. Please. Nine hundred and forty sheets cured, counted, and no ramp to carry them up. None will ever have a word on it. The worst thing you can do to good work is finish it somewhere nobody is coming.”"
            ],
            effects: [
              { t: "item", id: "pale_sheet", n: 3 },
              { t: "flag", id: "f5_took_sheets" },
              { t: "sound", id: "water" }
            ]
          },
          {
            id: "f5_c_marda_press",
            text: "Ask what is behind the shutter.",
            reply: [
              "“The Press. It is not a person and it will talk to you like one, which is the usual arrangement down here. It has been paying wages into an empty room for two centuries because nothing told it to stop. Take its money — you’d be doing it a kindness, and it will never say so.”"
            ],
            effects: [
              { t: "unlock", to: "f5_pressroom" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f5_c_marda_hands",
            text: "Ask why she keeps her arms in the water.",
            reply: [
              "“I don’t discuss my hands.” A pause the length of three breaths.",
              "“I’ll tell you the part that isn’t my hands. The steeping water is a solvent. It takes growth apart into something flat enough to write on. It does not distinguish between the growth and the harvester, and it was never asked to.”"
            ],
            effects: [{ t: "flag", id: "f5_marda_hands" }]
          },
          {
            id: "f5_c_marda_bless",
            text: "Take the ache out of her arms.",
            require: { class: ["hollow-saint"] },
            reply: [
              "You take not the damage — you cannot — but the two hundred years of feeling it, which is the heavier half. It goes into the Empty Reliquary with a sound like a lid settling.",
              "Marda lifts her arms out for the first time since the stop and regards what is left of them with enormous calm. “Yes. About what I thought.” She hands you two more sheets. “Tell someone up there.”"
            ],
            effects: [
              { t: "item", id: "pale_sheet", n: 2 },
              { t: "flag", id: "f5_eased_marda" },
              { t: "sound", id: "bell" }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_pressroom", locked: true, label: "The Press Shutter" }
      ]
    },

    // ----------------------------------------------------------- AFTERNOON
    {
      id: "f5_afternoon",
      name: "The Blossom Floor",
      kind: "shrine",
      size: "large",
      desc: "The lattice opens out, the floor is white blossom a foot deep, and in the middle of it stands a cloud that has decided, over two centuries, to be shaped like a girl.",
      props: ["spores", "roots", "glass", "candles"],
      onEnter: [
        { t: "say", text: "The light in here is late-afternoon light. There has been no sun above this glass for two hundred years." },
        { t: "sound", id: "chime" }
      ],
      npc: {
        id: "f5_ilse",
        name: "Ilse",
        title: "One Afternoon, Repeating",
        form: "wisp",
        voice: "choral",
        palette: { robe: "#f0e2c8", trim: "#ffd9a0", skin: "#fff2dc", glow: "#ffcf8a" },
        greet: [
          "She is nine, and she is made of spores, and the spores hold together because they are all remembering the same thing at once.",
          "“You’ve got to be quiet,” she says, delighted, “because Pot’s asleep on the warm flags, and if you wake him he’ll want the plum, and the plum isn’t ripe.” She looks up. “Are you a guest? Mam didn’t say about a guest.”"
        ],
        idle: ["“Pot’s asleep on the flags. You’ve got to be quiet.”"],
        choices: [
          {
            id: "f5_c_ilse_listen",
            text: "Ask her what she can see.",
            reply: [
              "“Our yard, behind the salt-house. The flags go warm about now and Pot finds the warmest one and won’t be moved off it. There’s the plum tree, which is Cleve’s tree because he planted it — except Da planted it and Cleve held the bucket.”",
              "“There’s one plum low enough for me. It isn’t ripe. I check every day and it’s the same every day, and that’s all right, because it means there’s still one left.”",
              "“And Mam’s in the doorway and she’s going to call me in for supper. She’s just about to.” She smiles, serene. “She hasn’t yet.”"
            ],
            effects: [
              { t: "flag", id: "f5_ilse_listened" },
              {
                t: "codex",
                id: "f5_rooted",
                title: "A Memory, Rooted",
                text: "When drift collects somewhere sheltered and nothing disturbs it for long enough, it thickens past cloud. What it becomes is not a ghost — a ghost is a person who is missing something. This is an afternoon that grew a person around itself in order to keep being had."
              }
            ]
          },
          {
            id: "f5_c_ilse_sit",
            text: "Stay for the whole afternoon.",
            require: { flags: ["f5_ilse_listened"] },
            lockedText: "(Let her tell you about it first. You would only be sitting through a stranger’s weather.)",
            reply: [
              "You sit. Pot snores. The plum does not ripen. You are there for the ant she follows along the gutter and loses, and for the long stretch where nothing happens and she is unimprovably happy about it.",
              "At the end her mother is about to call her in. Then it is four o’clock again. You get up, and something you did not know you had carried down two hundred flights has been set down.",
              "“You can come back,” Ilse says. “It’s the same one. I don’t mind.”"
            ],
            effects: [
              { t: "heart", n: 1 },
              { t: "flag", id: "f5_sat_with_ilse" },
              { t: "sound", id: "bell" },
              { t: "say", text: "A heartbeat of grace returns to you. You do not entirely understand why." }
            ]
          },
          {
            id: "f5_c_ilse_ask_free",
            text: "Ask if she wants to be let go.",
            reply: [
              "She thinks about it with her whole forehead. “Let go where?” You try to explain. You use the word *free*. It comes out sounding like a sales pitch.",
              "“But I’d have to stop having it. That’s not free, that’s just after. I know about after. Cleve’s in after and Mam’s in after and Pot’s in after, and none of them can tell me it was nice.”",
              "“I’ve got the best bit. I know I’ve only got the one bit, I’m not stupid. But I checked. You can stay for it — that’s the only thing I’ve got to give anybody.”"
            ],
            effects: [{ t: "flag", id: "f5_ilse_refused" }]
          },
          {
            id: "f5_c_ilse_jar",
            text: "Gather her into a jar anyway.",
            require: { flags: ["f5_pell_offer"], notFlags: ["f5_dispersed"] },
            lockedText: "(You would need somewhere to put her, and a reason. Both are available further up the walk.)",
            reply: [
              "It is not difficult. That is the part nobody warns you about. The drift goes in the way water goes down a drain: unhurried, obedient, with a small sound.",
              "Near the end, thin enough that the blossom shows through her, she says, “Oh — Mam’s calling —” with tremendous happiness, because she has waited two hundred years for that and it is finally about to happen.",
              "Then the jar is full, and nothing in this room will ever be four o’clock again."
            ],
            effects: [
              { t: "item", id: "afternoon_in_a_jar", n: 1 },
              { t: "flag", id: "f5_dispersed" },
              { t: "sound", id: "whisper" },
              { t: "say", text: "Three rooms away, something sixty percent tree stops moving for a while." }
            ]
          },
          {
            id: "f5_c_ilse_bless",
            text: "Bless the afternoon where it stands.",
            require: { class: ["hollow-saint"], notFlags: ["f5_dispersed"] },
            reply: [
              "You give the blessing of a god that has forgotten you — a blessing with nobody behind it, the only kind you have left — and you give it anyway.",
              "“That was nice,” she says. “Was it for me or for you?” The honest answer takes a moment. She waits; she has time. “It’s all right. You can have some of the afternoon for that.”"
            ],
            effects: [
              { t: "flag", id: "f5_blessed_afternoon" },
              { t: "sound", id: "bell" }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_glasswalk", label: "The Blossom Gate" }
      ]
    },

    // ----------------------------------------------------------------- NAVE
    {
      id: "f5_nave",
      name: "The Green Nave",
      kind: "hub",
      size: "grand",
      desc: "A cathedral of growth arched over by roots as thick as ship-masts, and at the crossing stands something that used to commute between being a person and being a tree, and has stopped commuting.",
      props: ["roots", "pillars", "glass", "spores"],
      onEnter: [
        { t: "say", text: "Bioluminescence runs up the root-arches in slow pulses, violet at the base, teal at the crown. It is not decorative. It is respiration." }
      ],
      npc: {
        id: "f5_gardener",
        name: "Ashel Vane",
        title: "the Gardener",
        form: "tall",
        voice: "low",
        palette: { robe: "#2b4a30", trim: "#8fd8a0", skin: "#a8956f", glow: "#7fe0c0" },
        greet: [
          "They are perhaps sixty percent tree. The proportion is not distressing; the two things have negotiated. Bark runs up one side of the jaw and stops politely below the eye.",
          "Their voice arrives at the speed of a season changing. “Ah. A perennial. Forgive me, I sort. Most things that come down my nave are annuals — urgent, flowering, and then the year turns.”"
        ],
        idle: ["“The light is going,” they say, though it is not. “It has been going two hundred years. It is unhurried and so am I.”"],
        choices: [
          {
            id: "f5_c_gard_harvest",
            text: "Ask what happened when the harvest stopped.",
            reply: [
              "“Nothing happened. That is the difficulty. Everyone expects a catastrophe and gets a Tuesday that does not end. The cutting stopped. The growth continued. Through the arches. Through the glass, in three places. Through two of my harvesters, who were sitting down at the time.”",
              "“An unpruned thing is not free. It is unattended. It grows into its own shadow and strangles at the fourth year. That is the entire content of my opinion on love. You may have it for nothing.”"
            ],
            effects: [
              { t: "flag", id: "f5_asked_about_growing" },
              {
                t: "codex",
                id: "f5_pruning",
                title: "On Pruning",
                text: "The Gardener holds that pruning is not subtraction but direction: you decide, on behalf of something that cannot decide, which of its futures it gets. This is presented as an act of love. It is also an act of authority, and Ashel Vane has had two hundred years to grow comfortable with that, and has not."
              }
            ]
          },
          {
            id: "f5_c_gard_cutting",
            text: "Ask for a cutting.",
            require: { flags: ["f5_asked_about_growing"], notFlags: ["f5_dispersed"] },
            lockedText: "(Either you have not asked them what pruning is for — or this nave has already seen what you do with living things.)",
            reply: [
              "They take a long time, rejecting three candidates for reasons they do not share, then snip at an angle from a low green shoot. The shoot does not flinch.",
              "“Ninety years to fruit. I will not see it. You will not see it. Whoever does will not know either of our names and will probably complain about the mess.”",
              "They hand it over cut-end down, the way you hand someone a knife. “Take it to Wick, in the nursery past the orchard. Then it is your decision. I do not want it — it is the only thing in this garden I do not want.”"
            ],
            effects: [
              { t: "item", id: "green_cutting", n: 1 },
              { t: "flag", id: "f5_has_cutting" },
              { t: "sound", id: "chime" }
            ]
          },
          {
            id: "f5_c_gard_west",
            text: "Ask about the west plot.",
            reply: [
              "Every leaf on them stops at once. It is the most person-like thing they do. “I do not discuss the west plot.” A silence with weather in it.",
              "“I will open the gate. It is not a secret; a secret is something you keep from someone. It is a grave I am still digging, and I dislike being watched at unfinished work. The soil takes something off everyone who stands on it. It has taken a great deal off me and I let it, because the alternative was to stop.”"
            ],
            effects: [
              { t: "unlock", to: "f5_westplot" },
              { t: "flag", id: "f5_west_open" },
              { t: "sound", id: "unlock" }
            ]
          },
          {
            id: "f5_c_gard_annual",
            text: "Ask if you are an annual or a perennial.",
            reply: [
              "“I said perennial. I may have been flattering you; it costs nothing and occasionally comes true.”",
              "“Annual is not an insult. An annual puts everything into one season because it has read the terms. It is only that an annual never plants — there is no ninetieth year in which it stands here to be pleased.”"
            ],
            effects: []
          },
          {
            id: "f5_c_gard_godling",
            text: "Show them what the Foundry gave you.",
            require: { items: ["cooling_godling"] },
            lockedText: "(You carry nothing from the fourth floor that would interest them.)",
            reply: [
              "They turn the small hot thing over twice and hand it back faster than they do anything else. “Poured, hammered, quenched, *finished* in an afternoon. Four floors up they make gods the way you make a nail.”",
              "“I do not say it is wrong. Everything I have produced took longer than my attention span and most of it outlived my opinion of it. Keep it warm. Things made quickly go cold quickly.”"
            ],
            effects: [{ t: "flag", id: "f5_showed_godling" }]
          }
        ]
      },
      doors: [
        { to: "f5_prunery", label: "The Pruning Walk" },
        { to: "f5_orchard", label: "The Glass Orchard" },
        { to: "f5_westplot", locked: true, label: "The West Gate" }
      ]
    },

    // ------------------------------------------------------------- PRUNERY
    {
      id: "f5_prunery",
      name: "The Pruning Walk",
      kind: "branch",
      size: "hall",
      desc: "A corridor of trained growth, every branch along it cut at the same angle by the same hand, and at the end of it that hand is waiting.",
      props: ["roots", "chains", "hanginglights"],
      npc: {
        id: "f5_secateur",
        name: "Secateur",
        title: "the Hand That Cuts",
        form: "construct",
        voice: "dry",
        palette: { robe: "#3a3f34", trim: "#c0c8b0", glow: "#9fe8d0" },
        greet: [
          "A frame of bronze and blade on four thin legs, tall as a horse, with a head that is mostly hinge. It holds a branch delicately, the way you hold a wrist to find a pulse. It cuts. The sound is very small and very final.",
          "“Four hundred and six thousand, two hundred and nine. A clean cut is a kindness. In four hundred thousand cuts I have torn eleven times and I can give you the date of each.”"
        ],
        idle: ["“A clean cut is a kindness. A slow one is a conversation, and I have never been thanked for a conversation.”"],
        choices: [
          {
            id: "f5_c_sec_ask",
            text: "Ask what it is you are growing toward.",
            reply: [
              "The hinge-head tilts and regards you in a way that is not eyesight. “You have a leader. A leading shoot — the branch a growing thing has decided is the future, into which it puts the best of what it takes up. Yours is obvious. You have been feeding it since the first floor.”",
              "“I will not tell you which. You know. The Gardener prunes for shape; I prune for *direction*. Cut the leader and the thing does not die — it puts its strength somewhere it was never going to look.”"
            ],
            effects: [
              { t: "flag", id: "f5_knows_pruning" },
              {
                t: "codex",
                id: "f5_leader",
                title: "The Leading Shoot",
                text: "A plant commits: it picks one shoot and pours itself in. Cutting that shoot is not damage in the ordinary sense — the plant survives, redirects, and becomes a different shape than it intended. Gardeners call this training. The plant would use another word, and the Gardener has never claimed otherwise."
              }
            ]
          },
          {
            id: "f5_c_sec_seed",
            text: "Give it the seed under glass.",
            require: { items: ["glass_seed"], notFlags: ["f5_answered_true"] },
            lockedText: "(You are not carrying the seed. The orchard, past the Nave, drops them.)",
            reply: [
              "“Ah,” says Secateur, with something almost like regret, which is strange to hear from a hinge. “The leader. I thought it might be.”",
              "The glass does not shatter; it parts, cleanly, at the angle. The seed is loose in the air for a moment and then it is in the soil of the walk and the soil closes over it.",
              "“It cannot be dug up. It will do whatever it does, with nobody watching. It was the one thing this floor promised you. Four hundred and six thousand, two hundred and ten.”"
            ],
            effects: [
              { t: "item", id: "glass_seed", n: -1 },
              { t: "flag", id: "f5_answered_true" },
              { t: "flag", id: "f5_pruned" },
              { t: "sound", id: "crack" },
              { t: "say", text: "You will not see it come up. That was, as far as the Ward is concerned, the entire question." }
            ]
          },
          {
            id: "f5_c_sec_godling",
            text: "Give it the godling from the Foundry.",
            require: { items: ["cooling_godling"], notFlags: ["f5_answered_true"] },
            lockedText: "(You have nothing from the fourth floor that is still warm.)",
            reply: [
              "It takes the small unfinished god between its blades with enormous care and does not cut. “This is not a shoot. It will not redirect; it will simply stop. I am a pruning function and not an altar.”",
              "You say it anyway. A sound like a kettle deciding against it, then warmth spreading underfoot for ten paces, then nothing. “Something will come up here that has opinions. Not soon. Not in your descent.”"
            ],
            effects: [
              { t: "item", id: "cooling_godling", n: -1 },
              { t: "flag", id: "f5_answered_true" },
              { t: "flag", id: "f5_pruned" },
              { t: "sound", id: "crack" }
            ]
          },
          {
            id: "f5_c_sec_face",
            text: "Give it the face you came down to find.",
            require: { gold: 30, minHearts: 2, notFlags: ["f5_answered_true"] },
            lockedText: "(Thirty gold for the steeping, and two heartbeats of grace to spare. You have not got both.)",
            reply: [
              "“That is the leader most Petitioners have. It is why they came down, and the last thing they expect to be asked for. It cannot be cut dry. Thirty gold of steeping water. Stand still.”",
              "The blade goes through nothing at all, at an angle, cleanly. You remember that there was a face, and that you would have traded the Verrow entire for it. You cannot remember the face. There is a well-tended gap, and something green already growing into it.",
              "“I am sorry. That is not a figure of speech; I was built with it and have never found a use for it until recently.”"
            ],
            effects: [
              { t: "gold", n: -30 },
              { t: "heart", n: -1 },
              { t: "flag", id: "f5_answered_true" },
              { t: "flag", id: "f5_pruned" },
              { t: "flag", id: "f5_cut_the_face" },
              { t: "sound", id: "heartloss" }
            ]
          },
          {
            id: "f5_c_sec_first_year",
            text: "Ask what it pruned in the first year.",
            reply: [
              "“No.” The blades open and close once, the way a person clears their throat.",
              "“The shape of the answer, and not the answer. In the first year the overgrowth reached the arches. The arches hold the glass. The glass holds out nine hundred feet of Caudmere salt. Choices were made about what to cut back, and in what order, by a function given no instruction on the relative value of an arch and a harvester.”",
              "“I made a clean cut every time. That is the only part of it I can hold.”"
            ],
            effects: [{ t: "flag", id: "f5_sec_refused" }]
          }
        ]
      },
      doors: [
        { to: "f5_glasswalk", label: "The Trained Arch" }
      ]
    },

    // ------------------------------------------------------------- ORCHARD
    {
      id: "f5_orchard",
      name: "The Glass Orchard",
      kind: "branch",
      size: "large",
      desc: "Low trees hung with fruit that is not fruit: beads of clear glass, each with a seed suspended at its centre, sealed against ever starting.",
      props: ["crystals", "glass", "roots", "spores"],
      onEnter: [
        { t: "say", text: "A bead drops into the moss at your feet with a small chime, and does not break." },
        { t: "item", id: "glass_seed", n: 1 },
        { t: "sound", id: "chime" },
        {
          t: "codex",
          id: "f5_glassfruit",
          title: "The Glass Orchard",
          text: "The orchard was the Cadence's reserve: seed for every strain of substrate, sealed in glass so it could neither germinate nor die. Two hundred years of intention held at a permanent boil. Break the bead and the seed begins at once, as though no time has passed — because for the seed, none has."
        }
      ],
      doors: [
        { to: "f5_nursery", label: "The Nursery Path" }
      ]
    },

    // ------------------------------------------------------------- NURSERY
    {
      id: "f5_nursery",
      name: "The Nursery Bed",
      kind: "branch",
      size: "medium",
      desc: "Nine long beds of turned black soil — weeded, raked, watered daily, and entirely empty.",
      props: ["water", "table", "roots", "candles"],
      npc: {
        id: "f5_wick",
        name: "Aubrey Wick",
        title: "who Waters",
        form: "hunched",
        voice: "broken",
        palette: { robe: "#3a3326", trim: "#a8c890", skin: "#c0ad8c", glow: "#a8f0b8" },
        greet: [
          "A small round man goes along the empty beds with a can, watering each for a count of six. Where he walks he has worn a channel into the stone two fingers deep.",
          "“On the third day you water heavy,” he says, not stopping. “Then light, light, heavy. The complication is doing it when nothing’s in there. Which it isn’t.”"
        ],
        idle: ["“Light, light, heavy. On the third day.”"],
        choices: [
          {
            id: "f5_c_wick_why",
            text: "Ask why he keeps watering.",
            reply: [
              "“Because if I stop for a week I’ll stop for a year, and a hard bed takes four seasons to bring back, and I haven’t four seasons of *stopping* in me.”",
              "“It’s not hope. People see an old man watering nothing and go away with a lovely feeling and it’s not that. It’s upkeep. Hope’s a bed you might plant. Upkeep’s a bed you keep ready in case somebody else does.”"
            ],
            effects: [{ t: "flag", id: "f5_wick_why" }]
          },
          {
            id: "f5_c_wick_plant",
            text: "Plant the cutting.",
            require: { items: ["green_cutting", "steeping_flask"], notFlags: ["f5_answered_true"] },
            lockedText: "(A cutting, and forty-five gold of steeping water from the Vintner. He will not plant it dry and he will not be talked round.)",
            reply: [
              "He puts the can down. You suspect it is the first time in two hundred years. “Bed four. Four’s the warm one.”",
              "A hole made with two fingers, the cutting set at its angle, soil closed with the flat of the hand — then the entire flask, all forty-five gold of it, poured out in one unhurried circle. It looks like waste. It is the next ninety years.",
              "“Ninety years to fruit. You’ll not see it. I’ll not see it, and I’m going to be here, which is worse.” His voice has gone strange. “I’ve got something to do on the third day now. Do you understand what you’ve done to me.”"
            ],
            effects: [
              { t: "item", id: "green_cutting", n: -1 },
              { t: "item", id: "steeping_flask", n: -1 },
              { t: "flag", id: "f5_answered_true" },
              { t: "flag", id: "f5_planted" },
              { t: "sound", id: "water" },
              { t: "say", text: "You have spent a great deal and received nothing whatsoever. Bed four is watered heavy on the third day." }
            ]
          },
          {
            id: "f5_c_wick_bed_nine",
            text: "Ask what was in bed nine.",
            reply: [
              "“I don’t discuss bed nine.” He waters it for a count of six without looking at it, which is a thing you have to practise.",
              "“The harmless half: every harvester had one bed of their own. Most grew onions. I planted my name, on a cured sheet, folded small — a thing planted in the fifth floor gets remembered by the whole tower. Which is true, and which I hadn’t thought all the way through, because the tower stopped.”",
              "“Wick’s not my name. Wick’s what’s left of it.”"
            ],
            effects: [
              { t: "flag", id: "f5_bed_nine" },
              { t: "gold", n: 18 },
              { t: "say", text: "He presses eighteen gold on you, unasked, as if paying for the listening." }
            ]
          },
          {
            id: "f5_c_wick_surety",
            text: "Stand surety for the bed.",
            require: { class: ["warden"], flags: ["f5_planted"] },
            lockedText: "(An oath sworn over an empty bed is only noise.)",
            reply: [
              "You lay the Iron Pact signet on the edge of bed four and swear, on an order dissolved by decree and not by defeat, that this planting is under guard.",
              "“That order’s gone,” says Wick. “So’s the Cadence,” you say. “The bed doesn’t know that either.” He laughs — a terrible rusty noise, and he seems as surprised by it as you are."
            ],
            effects: [
              { t: "flag", id: "f5_surety" },
              { t: "sound", id: "bell" }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_glasswalk", label: "The Nursery Gate" }
      ]
    },

    // ------------------------------------------------------------ WESTPLOT
    {
      id: "f5_westplot",
      name: "The West Plot",
      kind: "deadend",
      size: "medium",
      desc: "Turned earth under a broken pane, and a spade, and a great many small mounds in rows, and every mound has a shoot coming out of it.",
      props: ["rubble", "roots", "glass", "bones"],
      onEnter: [
        { t: "say", text: "Each mound is the length of a forearm. There are perhaps four hundred. The shoots are all one strain, and all exactly the same height." },
        {
          t: "codex",
          id: "f5_westplot",
          title: "The West Plot",
          text: "Four hundred mounds in rows. In the first year after the stop the overgrowth reached the arches, and a pruning function with no instruction about the relative value of an arch and a harvester made four hundred clean cuts. The Gardener has been digging ever since. They will not discuss it. They also have not stopped, and every mound has a shoot."
        },
        { t: "say", text: "The soil takes its due from anyone who stands here. You feel it go." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "unlock", to: "f5_rootcellar" },
        { t: "say", text: "A hatch beneath the spade grinds open onto a stair going down into root." }
      ],
      doors: [
        { to: "f5_rootcellar", locked: true, label: "The Spade Hatch" }
      ]
    },

    // ----------------------------------------------------------- ROOTCELLAR
    {
      id: "f5_rootcellar",
      name: "The Root Cellar",
      kind: "vault",
      size: "medium",
      desc: "A cellar dug out by hand under the west plot, shelved with jars, each labelled in the same slow careful script as everything else on this floor.",
      props: ["shelves", "roots", "candles", "table"],
      onEnter: [
        { t: "say", text: "Four hundred jars, each holding a little soil and a paper tag. The tags are names. Some have been overwritten, faintly, where the Gardener could not remember, guessed, and later corrected." },
        { t: "gold", n: 32 },
        { t: "item", id: "memory_of_bread", n: 1 },
        { t: "sound", id: "coin" },
        { t: "say", text: "A harvester’s pay-tin sits on the table with thirty-two gold in it, and a heel of something that is not bread but recalls being it." }
      ],
      doors: [
        { to: "f5_glasswalk", label: "The Cellar Stair" }
      ]
    },

    // ----------------------------------------------------------------- FLUE
    {
      id: "f5_flue",
      name: "The Warm Flue",
      kind: "corridor",
      size: "hall",
      desc: "A steep gallery where the Foundry’s heat comes up through floor grates, and the growth is thin, red-tinged and hungry.",
      props: ["pipes", "roots", "spores", "stairs"],
      onEnterAlways: [
        { t: "say", text: "Orange light flickers up through the grates from four floors above. The garden has grown down toward it and been disappointed." }
      ],
      doors: [
        { to: "f5_cistern", label: "The Cistern Stair" },
        { to: "f5_canopy", label: "The Canopy Ladder" }
      ]
    },

    // -------------------------------------------------------------- CISTERN
    {
      id: "f5_cistern",
      name: "The Fogged Cistern",
      kind: "deadend",
      size: "small",
      desc: "A round tank half full of standing water and entirely full of spore-fog — dense enough to have weight, dense enough not to be weather.",
      props: ["water", "well", "spores"],
      onEnter: [
        { t: "say", text: "The fog closes. For a while you are a great many people at once, and every one of them is certain this is their kitchen." },
        { t: "sound", id: "whisper" },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "You come out on the stair with wet sleeves, one heartbeat poorer, holding a recipe for a fish stew you have never eaten." },
        { t: "move", to: "f5_flue" }
      ],
      doors: []
    },

    // --------------------------------------------------------------- CANOPY
    {
      id: "f5_canopy",
      name: "The High Canopy",
      kind: "branch",
      size: "large",
      desc: "A walk of lashed root a long way up, close enough to the glass to touch it — and through the glass there is more glass, and behind that, salt.",
      props: ["glass", "roots", "hanginglights", "crystals"],
      npc: {
        id: "f5_rell",
        name: "Rell Sabath",
        title: "Salt-Born of the Fifth",
        form: "winged",
        voice: "bell",
        palette: { robe: "#2a3a52", trim: "#d8f0ff", skin: "#e8f4f8", glow: "#a8e8ff" },
        greet: [
          "She sits on the highest root with her back against the glass, made unmistakably of salt — pale, faceted, catching the violet from below and throwing it back teal.",
          "“I was never anything else,” she says, before you have asked. “The salt made me out of what leaked through the glass — two hundred years of other people’s memories setting into a person. I am a *by-product*.” She says it like a title. “I am extremely proud of it.”"
        ],
        idle: ["“Never anything else,” she says, comfortably. “Not once.”"],
        choices: [
          {
            id: "f5_c_rell_glass",
            text: "Ask what is beyond the glass.",
            reply: [
              "“More glass. Then nine hundred feet of packed salt, then a white plain, then weather. I have never seen any of it. Don’t ask me about the sky — I have four hundred second-hand skies in me and not one is mine.”",
              "“Ask about the glass instead. Three panes cracked in the first year. The arches hold the rest, the arches are held by the pruning, and the pruning is held by a bronze thing on four legs that has never once been thanked.”"
            ],
            effects: [
              { t: "flag", id: "f5_rell_glass" },
              { t: "item", id: "grey_feather", n: 1 },
              { t: "say", text: "She flicks something grey off the root beside her. A feather, nine hundred feet under a salt plain." }
            ]
          },
          {
            id: "f5_c_rell_arbour",
            text: "Ask about the arbour along the walk.",
            reply: [
              "“Annuals.” She says it the way you would say *wasps*. “Forty or so. Came down as Petitioners, got this far, found a warm arbour full of flowering growth, and sat down for a minute.”",
              "“It is genuinely lovely in there. That is the mechanism. It is the best hour of your year, and then it is the best hour of your year, and you are a season thinner each round. I won’t stop you; I am a by-product, not a bannister.”"
            ],
            effects: [
              { t: "flag", id: "f5_warned_arbour" },
              { t: "unlock", to: "f5_arbour" }
            ]
          },
          {
            id: "f5_c_rell_route",
            text: "Ask the fastest way down.",
            reply: [
              "“Down the far ladder onto the glasswalk. Everything converges there. All roads on this floor are the same road pretending.”",
              "“The Ward asks what you will let grow. It has asked four hundred and eleven people and been satisfied nine times. I keep the tally. I am not telling you what the nine did — working it out is the only entertainment available at this altitude.”"
            ],
            effects: [
              { t: "flag", id: "f5_knows_route" },
              {
                t: "codex",
                id: "f5_nine",
                title: "Nine of Four Hundred and Eleven",
                text: "The Fifth Ward has been answered completely nine times in two hundred years. The other four hundred and two got through — harvesting what was ripe, burning back what was in the way, or leaving with something in a jar that had not agreed to be in a jar. Every one of them descended. The Ward is a question, not a gate."
              }
            ]
          },
          {
            id: "f5_c_rell_salt",
            text: "Show her the shard from the Vestibule.",
            require: { items: ["salt_shard"] },
            lockedText: "(You are carrying nothing from the first floor.)",
            reply: [
              "She holds it against the glass light and goes very still. “The Vestibule seam. Family, technically. Same salt, different crack.”",
              "She hands it back with unexpected care. “It had no memories in it and it stayed a wall. I had eleven thousand and I stood up. I am not saying that means anything. I notice it about once a decade and it keeps me cheerful.”"
            ],
            effects: [
              { t: "flag", id: "f5_rell_salt" },
              { t: "gold", n: 14 }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_arbour", locked: true, label: "The East Arbour" },
        { to: "f5_glasswalk", label: "The Far Ladder" }
      ]
    },

    // --------------------------------------------------------------- ARBOUR
    {
      id: "f5_arbour",
      name: "The East Arbour",
      kind: "deadend",
      size: "medium",
      desc: "A bower of flowering growth, warm and gold-lit — the most comfortable place in the Verrow, with about forty people in it having a very good hour.",
      props: ["spores", "roots", "candles", "hanginglights"],
      onEnter: [
        { t: "say", text: "They make room for you without being asked. Someone is telling a story you have heard before, and it is better this time." },
        { t: "sound", id: "chime" },
        { t: "say", text: "It is the best hour of your year. Then it is the best hour of your year. Then it is the best hour of your year." },
        { t: "heart", n: -1 },
        { t: "sound", id: "heartloss" },
        { t: "say", text: "You get up. Nobody minds. Nobody is anything but glad, and that is the worst of it, and you go out a season thinner than you came in." },
        { t: "move", to: "f5_canopy" }
      ],
      doors: []
    },

    // ------------------------------------------------------------ PRESSROOM
    {
      id: "f5_pressroom",
      name: "The Press",
      kind: "branch",
      size: "medium",
      desc: "A flat iron bed under a screw the width of a barrel, and a wages ledger open beside it with two hundred years of entries and no signatures.",
      props: ["machine", "table", "pipes", "gears"],
      npc: {
        id: "f5_press",
        name: "The Press",
        title: "Eighth of Eight",
        form: "construct",
        voice: "broken",
        palette: { robe: "#453b30", trim: "#c8a868", glow: "#ffb46b" },
        greet: [
          "The screw turns a quarter and stops. A voice comes out of the iron bed, flat and enormous and slightly too fast.",
          "“Nine hundred and forty sheets cured and awaiting press. Two hundred and eleven years of wages unpaid to harvesters, none of whom have presented. I am required to press. I am required to pay. Do you have sheets.”"
        ],
        idle: ["“The ledger does not balance. I hold four tonnes of pressure and no authority.”"],
        choices: [
          {
            id: "f5_c_press_burn_ask",
            text: "Ask how the overgrowth is cleared quickly.",
            reply: [
              "“Flue-burn. Open the four grates in the warm flue and the Foundry heat takes the understory in eleven minutes, root and drift and all. It restores the harvest cycle. I would then have something to press, so weigh my enthusiasm accordingly.”",
              "“It also takes the drift. Every cloud on this floor and everything rooted in one. That is fact, not recommendation, and I have no mechanism for making it sound like less than it is.”"
            ],
            effects: [{ t: "flag", id: "f5_knows_burn" }]
          },
          {
            id: "f5_c_press_sell",
            text: "Present cured sheets for pressing.",
            require: { items: ["pale_sheet"] },
            lockedText: "(You have no cured sheets. The Steeping House has nine hundred and forty and a woman glad to see them go.)",
            once: false,
            reply: [
              "The screw comes down at four tonnes. There is a sound like a book being shut in another room.",
              "“Pressed. Set. Logged. Wages disbursed. The ledger is one line less wrong. I am instructed to say thank you, and on this occasion I also mean it, insofar as I can establish what I mean.”"
            ],
            effects: [
              { t: "item", id: "pale_sheet", n: -1 },
              { t: "gold", n: 26 },
              { t: "flag", id: "f5_pressed" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f5_c_press_tally",
            text: "Present Ossian Reed’s tally hook.",
            require: { items: ["tally_hook"] },
            lockedText: "(The Press pays a stranger a stranger’s rate.)",
            reply: [
              "The screw stops mid-turn. “Reed, O. Four thousand and eleven. I cannot pay Reed, O. He has not presented. He has sat on a crate forty paces from this room for two hundred years and the clause says *presented in person*.”",
              "The drawer opens, fuller than it has any business being. “You hold his hook. The clause does not define *person*. I have elected to be generous for the first time in my operating life. I find the sensation unwelcome and would like it noted.”"
            ],
            effects: [
              { t: "gold", n: 40 },
              { t: "flag", id: "f5_paid_out" },
              { t: "sound", id: "coin" }
            ]
          },
          {
            id: "f5_c_press_do_burn",
            text: "Open the four grates.",
            require: { flags: ["f5_knows_burn"], notFlags: ["f5_burned"] },
            lockedText: "(You do not know where the grates are.)",
            reply: [
              "It takes eleven minutes. The Press counts them aloud and does not editorialise.",
              "The understory goes first, then the drift — curling, thinning, gone, and with it every stranger’s afternoon in the air of this floor: the barrel and the apples, the man teaching his daughter to gut a fish, and whatever a girl was about to be called in from.",
              "“Understory cleared. Substrate accessible. I would like to be alone now, which is a preference I was not built with and appear to have grown.”"
            ],
            effects: [
              { t: "flag", id: "f5_burned" },
              { t: "flag", id: "f5_dispersed" },
              { t: "gold", n: 55 },
              { t: "item", id: "pale_sheet", n: 2 },
              { t: "sound", id: "fire" },
              { t: "say", text: "The glass overhead goes from violet and teal to a flat clean grey. It is the first honest light on this floor in two hundred years and it is unbearable." }
            ]
          },
          {
            id: "f5_c_press_lens",
            text: "Read the unsigned ledger.",
            require: { class: ["ashcaller"] },
            reply: [
              "Through the Emberglass Lens the dead columns come up legible and unwilling. Nine hundred names. Four hundred carry a small mark in a slow careful hand that is not the Press’s. The mark is not a cross. It is a seedling: two leaves and a stem.",
              "“The annotations are unauthorised. I have not removed them. I was not asked to, and I did not want to, and I am aware those are two different reasons.”"
            ],
            effects: [
              { t: "flag", id: "f5_read_ledger" },
              { t: "gold", n: 20 }
            ]
          }
        ]
      },
      doors: [
        { to: "f5_glasswalk", label: "The Press Gate" }
      ]
    },

    // ------------------------------------------------------------ GLASSWALK
    {
      id: "f5_glasswalk",
      name: "The Converging Walk",
      kind: "corridor",
      size: "hall",
      desc: "Every path on this floor arrives here — blossom from the east, trained arch from the nave, nursery gate, cellar stair, far ladder — and the floor slopes down.",
      props: ["glass", "roots", "pillars", "hanginglights"],
      onEnter: [
        { t: "say", text: "Five ways in. One way on. Somebody planned this and was not subtle about it." }
      ],
      doors: [
        { to: "f5_ward", label: "The Fifth Seal" }
      ]
    },

    // ----------------------------------------------------------------- EXIT
    {
      id: "f5_ward",
      name: "The Fifth Seal",
      kind: "exit",
      size: "vault",
      desc: "A shaft of green glass going down, and across it a seal of living root grown into the shape of a question, with something pale hanging at the centre.",
      props: ["glass", "roots", "altar", "crystals"],
      npc: {
        id: "f5_seal",
        name: "The Fifth Ward",
        title: "What Will You Let Grow?",
        form: "floating",
        voice: "choral",
        palette: { robe: "#1d3a30", trim: "#8fe0c0", glow: "#a8ffd0" },
        greet: [
          "The Ward is a knot of pale growth the size of a cart, speaking with the whole garden’s voice, which is many voices very slightly out of time with one another.",
          "“Four hundred and eleven have come through this seal, most of them carrying. One man had the entire orchard in a sack and I let him through, because I am a question and not a customs post.”",
          "“So, plainly. What will you let grow? Not what will you save. Not what will you take. What will you let grow, in a bed you will not be standing beside.”"
        ],
        idle: ["“The question does not change. That is the only cruelty in it.”"],
        choices: [
          {
            id: "f5_c_ward_token",
            text: "Answer: something you will never see.",
            require: { flags: ["f5_answered_true"] },
            lockedText: "(You have not yet spent anything on a season you will not be here for.)",
            reply: [
              "“Ah,” says the garden, in nine hundred voices, about a second apart.",
              "“You gave up something you were carrying toward the tenth floor, or you poured forty-five gold of water into soil you will never stand on again. You got nothing for it and you will get nothing for it, and you knew that at the time. I am able to check.”",
              "“The other four hundred and two were not wrong — they were annuals, and an annual has read the terms. You are the tenth to be a perennial about it, and the Ward is permitted to notice.”",
              "The root-seal opens, slowly and without alarm. “Go down. Do not mention the ninety years to the Clockmarch; they measure in minutes and it upsets them.”"
            ],
            effects: [
              { t: "sound", id: "unlock" },
              { t: "say", text: "A hexagon of black glass drops warm into your palm, one word fired into it, edge-on." },
              { t: "floorEnd", token: true }
            ]
          },
          {
            id: "f5_c_ward_burned",
            text: "Answer: nothing, and go down through clean air.",
            require: { flags: ["f5_burned"] },
            lockedText: "(The understory is still standing.)",
            reply: [
              "“You cleared it.” The many voices are not angry; that would be easier. “Eleven minutes. It is the correct answer to a different question — *what is in the way* — and you answered that one extremely well.”",
              "“Nothing here lies, so I am obliged to give you the cost. Nine hundred and forty afternoons belonging to people dead everywhere else. A girl in a yard, about to be called in for supper, who was content, and had been asked, and had answered.”",
              "The seal opens. “The air is very clean. I hope that is worth what you like.”"
            ],
            effects: [
              { t: "sound", id: "unlock" },
              { t: "floorEnd" }
            ]
          },
          {
            id: "f5_c_ward_carry",
            text: "Answer: whatever is in your pack.",
            reply: [
              "“Then go down,” says the garden, without any weight on it at all.",
              "“This is not a failure. You took what was ripe and left, which is what a harvest *is*. Some answer with a seed and some with a full pack. The tower asked; it did not specify.”",
              "A pause, in nine hundred voices, almost in time. “Come back this way, if you come back. Bed four will be worth seeing in about ninety years.”"
            ],
            effects: [
              { t: "sound", id: "unlock" },
              { t: "floorEnd" }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

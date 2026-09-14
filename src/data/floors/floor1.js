export default {
  id: 1,
  name: 'The Salt Vestibule',
  theme: 'salt',
  subtitle: 'Ward the First — What did you bring?',
  intro: 'The plinth closes over your head with a sound like a held breath. Salt has grown across everything here the way frost grows on a window that nobody opens — patiently, and with the whole night to work in.',
  entry: 'f1_entry',

  items: {
    declared_list: {
      name: 'Your Declaration', kind: 'key', value: 0, icon: 'scroll', tint: '#cfe8f0', bound: true,
      desc: 'A list, in your own hand, of everything you brought down. Hask read it back to you and said "Noted." It did not feel like agreement.'
    },
    forged_manifest: {
      name: 'Forged Manifest', kind: 'key', value: 30, icon: 'scroll', tint: '#b9a882',
      desc: 'Brack made it out of salt and spite. It declares you carrying three barrels of nothing, and the Vestibule finds this plausible.'
    }
  },

  rooms: [
    // ------------------------------------------------------------ entry
    {
      id: 'f1_entry',
      name: 'The Mouth',
      kind: 'entry',
      size: 'large',
      desc: 'Salt has grown over the doorframe behind you like frost that decided to stay. There is no draught, and yet something is moving the air.',
      props: ['brazier', 'sand', 'pillars'],
      npc: {
        id: 'f1_hask',
        name: 'Hask',
        title: 'the Tallyman',
        form: 'hunched',
        voice: 'dry',
        palette: { robe: '#38414a', trim: '#9fb4c0', skin: '#c8bca6', glow: '#9fe4ff' },
        greet: [
          'A small bent shape at a small bent desk, in a room built for something enormous. He does not look up. He is turning a smooth grey stone over and over in one hand.',
          '"Declaration," he says. "You came down with things. I write down what. That’s the whole job and it has never once been done wrong, which is a sentence I have had two hundred years to get comfortable saying."',
          '"Ward the First asks what you brought. I am not the Ward. I am the paperwork. Don’t confuse us; the Ward is the one with opinions."'
        ],
        idle: [
          '"Still here." He turns the stone over. "Still counting."'
        ],
        choices: [
          {
            id: 'f1_c_declare',
            text: 'Declare everything you are carrying.',
            reply: [
              'He writes without looking at you, which is somehow more thorough than looking at you would have been. He reads the list back. It is correct. It is *painfully* correct — he has itemised things you had forgotten were in your pockets.',
              '"Noted." He hands you the copy. "The Walk and the Alcove will both open for a declared Petitioner. Undeclared ones use the Walk anyway and I write that down too."'
            ],
            effects: [
              { t: 'item', id: 'declared_list', n: 1 },
              { t: 'flag', id: 'f1_declared' },
              { t: 'unlock', to: 'f1_brine_walk' },
              { t: 'unlock', to: 'f1_alcove' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f1_c_ask_ward',
            text: 'Ask what the Ward actually wants.',
            reply: [
              '"Wants." He says it the way you’d say a word in a language you disapprove of. "It asks what you brought. People hear *show me your bags*. Two hundred years of people hearing *show me your bags*."',
              '"Gennet’s down the Tally Hall. She declared her bags beautifully. She’s still here."'
            ],
            effects: [
              { t: 'flag', id: 'f1_asked_ward' },
              { t: 'say', text: 'He goes back to his stone. The conversation is not over; it has simply been set down.' }
            ]
          },
          {
            id: 'f1_c_ask_floor',
            text: 'Ask what this place was.',
            reply: [
              '"A porch." He shrugs with one shoulder, the way you do when only one shoulder still works properly. "Every cathedral has one. You wipe your feet, you put down what you’re carrying, you go in."',
              '"The Cadence put the counting first because the counting is the courtesy. It stopped. Nobody told the porch."'
            ],
            effects: [
              { t: 'codex', id: 'f1_codex_porch', title: 'The Porch',
                text: 'The Salt Vestibule is not a defence. It is a cloakroom. Every floor of the Verrow had a function and this floor’s function was hospitality — to note what a visitor arrived with, so that it could be given back. When the Cadence stopped, the giving-back stopped with it. The noting did not.' }
            ]
          },
          {
            id: 'f1_c_take_stone',
            text: 'Ask for the counting stone.',
            require: { flags: ['f1_declared'] },
            lockedText: '(He will not put the stone down for someone he has not written down.)',
            reply: [
              'The turning stops. For the first time, he looks at you — grey eyes in a face made mostly of patience.',
              '"You’re the first to ask instead of taking." He sets it in your palm. It is warm. "Bring it back or don’t. I’ve counted it either way."'
            ],
            effects: [
              { t: 'item', id: 'tally_stone', n: 1 },
              { t: 'flag', id: 'f1_has_stone' }
            ]
          },
          {
            id: 'f1_c_walk_past',
            text: 'Say nothing. Walk toward the Tally Hall.',
            reply: [
              '"Undeclared," he says to the desk. "Noted."'
            ],
            effects: [{ t: 'flag', id: 'f1_undeclared' }]
          }
        ]
      },
      doors: [
        { to: 'f1_tally_hall', label: 'The Long Arch' },
        { to: 'f1_brine_walk', locked: true, label: 'The Brine Walk' },
        { to: 'f1_alcove', locked: true, label: 'The Alcove Door' }
      ]
    },

    // ------------------------------------------------------------ hub west
    {
      id: 'f1_tally_hall',
      name: 'The Tally Hall',
      kind: 'hub',
      size: 'hall',
      desc: 'Every surface is scratched with tally marks, five and five and five, going up the walls further than a person could reach.',
      props: ['pillars', 'candles', 'rubble'],
      npc: {
        id: 'f1_gennet',
        name: 'Gennet Wry',
        title: 'who declared everything',
        form: 'robed',
        voice: 'mid',
        palette: { robe: '#4a4438', trim: '#c2b48c', skin: '#d4c2a8', glow: '#ffd9a0' },
        greet: [
          'She is sitting on a fallen column with the unhurried posture of someone who arrived a long time ago and has stopped expecting to leave. She has been drawing a tally mark on the stone with her thumbnail. It has not made a mark.',
          '"Eighty-one years," she says, pleasantly. "You’ll want to know how long, so: eighty-one. I declared perfectly. Every object, every coin, the knife in my boot, the second knife in my other boot. Hask wrote it all down and said Noted."',
          '"The Ward did not open. I have had eighty-one years to work out why, and I did, and I’ll tell you for free, because the alternative is that I worked it out for nothing."'
        ],
        idle: [
          '"Go on, then," she says. "Go and be brought."'
        ],
        choices: [
          {
            id: 'f1_c_gennet_why',
            text: 'Ask why it refused her.',
            reply: [
              '"Because a thing you *carry* isn’t a thing you *brought*." She says it slowly, the way you say a sentence you have polished. "I brought a knife and a purse and a good coat. That’s what I listed. That is not what I brought down here."',
              '"I brought a debt I couldn’t pay and a brother I couldn’t look at and a fairly enormous amount of wanting to be somebody. None of that was in my boots. All of it came down the stair."',
              '"The First Ward asks what you brought. It means *all* of it. It is not being clever. It is being literal, and we are the ones being clever, and that is why we are all still here."'
            ],
            effects: [
              { t: 'flag', id: 'f1_knows_intent' },
              { t: 'codex', id: 'f1_codex_ward', title: 'Ward the First',
                text: 'Gennet Wry, eighty-one years below: "A thing you carry is not a thing you brought. The Ward asks the second question and everyone answers the first, and then blames the Ward."' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f1_c_gennet_danger',
            text: 'Ask what to avoid down here.',
            reply: [
              '"The Sump, off the west end of this hall. It looks like a room. It is a mouth with a room’s manners." She points with her chin. "You go in, the salt comes down, and it takes a beat of you as rent and puts you back where you started. Not fatal. Not free."',
              '"And don’t trust the floor in the Brine Walk when the water’s low. Ivo’s down by the pools — the small one — he’ll tell you where to put your feet. He likes being asked."'
            ],
            effects: [
              { t: 'flag', id: 'f1_warned_sump' },
              { t: 'say', text: 'You file this away. In the Verrow, being told a thing once is generally the whole of the warning you get.' }
            ]
          },
          {
            id: 'f1_c_gennet_open',
            text: 'Ask her to open the way on.',
            reply: [
              '"I can do the Nook and the Dry Room. Brack keeps the Nook — mind yourself, he’s honest in a way that costs money." She stands, and something in the hall unlatches without being touched.',
              '"The Dry Room I’ll open and then I’ll tell you not to go in it. Both of those are real things I am doing."'
            ],
            effects: [
              { t: 'unlock', to: 'f1_shop_nook' },
              { t: 'unlock', to: 'f1_dry_room' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f1_c_gennet_saint',
            text: 'Offer her the rite for the dead.',
            require: { class: ['hollow-saint'] },
            reply: [
              'She goes very still. "I’m not dead."',
              '"...Do it anyway," she says. "Nobody’s said anything over me in eighty-one years and I find I mind."',
              'You say the words into a room that has no god in it. The hall does not change. She does — fractionally, around the eyes. "Right," she says. "Right. Take the lamp. It’s no use to me and it will be to you."'
            ],
            effects: [
              { t: 'item', id: 'brine_lamp', n: 1 },
              { t: 'flag', id: 'f1_blessed_gennet' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f1_c_gennet_leave',
            text: 'Thank her and move on.',
            reply: ['"Mm," she says. "Mind the west end."'],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f1_shop_nook', locked: true, label: 'The Nook' },
        { to: 'f1_sump', label: 'The West End' },
        { to: 'f1_dry_room', locked: true, label: 'The Dry Room' },
        { to: 'f1_vestry', label: 'The Vestry Stair' }
      ]
    },

    // ------------------------------------------------------------ vestry
    {
      id: 'f1_vestry',
      name: 'The Vestry',
      kind: 'branch',
      size: 'small',
      desc: 'A narrow room lined with hooks. Two hundred coats’ worth of hooks, and one coat.',
      props: ['banners', 'candles'],
      npc: {
        id: 'f1_inventory',
        name: 'The Inventory',
        title: '',
        form: 'wisp',
        voice: 'bell',
        palette: { robe: '#2e3a44', glow: '#bfe4ff' },
        greet: [
          'A drift of pale light hanging at head height, in a room that smells faintly of wet wool.',
          '"— one coat, grey, wool, three buttons of four," it says, in the middle of a sentence it has clearly been in for some time. "One coat, grey, wool, three buttons of four. One coat —"',
          'It notices you. The recitation stops with the small politeness of someone taking their feet off a chair.'
        ],
        idle: ['"— one coat, grey, wool, three buttons of four —"'],
        choices: [
          {
            id: 'f1_c_inv_ask',
            text: 'Ask whose coat it is.',
            reply: [
              '"Unclaimed. Item the four-hundred-and-sixth. Deposited by a Petitioner who did not come back for it, which is all of them, which is why I only have the one."',
              'A pause, exactly as long as a breath would be, if it had one. "The others were reclaimed by the salt. The salt does not fill in the form."'
            ],
            effects: [
              { t: 'codex', id: 'f1_codex_coat', title: 'Item the Four-Hundred-and-Sixth',
                text: 'One coat, grey, wool, three buttons of four. Four hundred and five other things have been deposited in the Vestry of the Verrow and taken back by the salt without paperwork. The Inventory considers this the single worst thing that has ever happened.' }
            ]
          },
          {
            id: 'f1_c_inv_read',
            text: 'Read the hook-labels in the dead script.',
            require: { class: ['ashcaller'] },
            reply: [
              'The lens goes warm against your eye and the labels give up their names, reluctantly, one at a time. Most are ordinary. One is not: it reads *HASK — EFFECTS OF*, and the hook beneath it is bare.',
              '"He hung himself up," the Inventory says, with enormous approval. "Properly. Filed and everything. Nobody has ever done it since."'
            ],
            effects: [
              { t: 'flag', id: 'f1_hask_filed' },
              { t: 'codex', id: 'f1_codex_hask', title: 'Hask, Effects Of',
                text: 'The Tallyman was a Petitioner once. When the Cadence stopped and he understood that nobody was coming to take the count, he hung up everything he had brought, on a hook, with a label, and sat down at the desk. He has not stood up since. He counts because the counting is the courtesy.' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f1_c_inv_take',
            text: 'Take the coat.',
            reply: [
              '"— one coat, grey, wool, three buttons of four, *claimed*," it says, and the relief in it is so total that the light brightens.',
              'The coat is heavier than it looks. There is a glove in the pocket. Only the left one.'
            ],
            effects: [
              { t: 'item', id: 'left_glove', n: 1 },
              { t: 'gold', n: 12 },
              { t: 'say', text: 'Twelve coins in the lining, of a denomination that has not been minted in ninety years, and which every merchant in this tower will accept without comment.' }
            ]
          },
          {
            id: 'f1_c_inv_go',
            text: 'Leave it to its list.',
            reply: ['"— one coat, grey, wool —" it says, already gone.'],
            effects: []
          }
        ]
      },
      doors: []
    },

    // ------------------------------------------------------------ shop
    {
      id: 'f1_shop_nook',
      name: 'Brack’s Nook',
      kind: 'shop',
      size: 'small',
      desc: 'The walls here have grown inward into shelves. Nothing on them was made; all of it was encouraged.',
      props: ['crystals', 'table', 'candles'],
      npc: {
        id: 'f1_brack',
        name: 'Brack',
        title: 'Salt-Born',
        form: 'coiled',
        voice: 'broken',
        palette: { robe: '#b9c8cc', trim: '#e4f2f6', glow: '#dff0f4' },
        greet: [
          'It is a stack of translucent coils in a shape that is *almost* a person, the way a word in a foreign language is almost a word you know.',
          '"I was never anything else," it says, before you have asked. "Everyone asks. Everyone assumes I *was*. The Kept were people. The Residue were memories. I am salt that started paying attention. There is no tragedy in me at all and I find people take it personally."',
          '"Now. You want something and I want something and mine is easier to say. Coin."'
        ],
        idle: ['"Shelves are where they were."'],
        choices: [
          {
            id: 'f1_c_brack_trade',
            text: 'Look at the shelves.',
            once: false,
            reply: ['"Take your time. Time is the one thing down here that isn’t priced."'],
            effects: [{
              t: 'shop',
              stock: [
                { item: 'salt_shard', price: 14, note: 'A flake of this floor. Cold long after your hand should have warmed it.' },
                { item: 'salt_lily', price: 20, note: 'Grown. Not carved. Do not say carved.' },
                { item: 'tallow_candle', price: 7, infinite: true, note: 'Honest light. Burns about an hour.' },
                { item: 'rope_coil', price: 12, note: 'Always exactly long enough.' },
                { item: 'forged_manifest', price: 35, note: 'Declares you carrying three barrels of nothing. The Vestibule finds this plausible.' },
                { item: 'brine_lamp', price: 40, note: 'Makes a room admit things.' }
              ],
              buys: [
                { item: 'left_glove', price: 11 },
                { item: 'chalk_stub', price: 6 },
                { item: 'cold_iron_nail', price: 14 },
                { item: 'grey_feather', price: 18 },
                { item: 'tally_stone', price: 60 }
              ]
            }]
          },
          {
            id: 'f1_c_brack_manifest',
            text: 'Ask what the forged manifest is for.',
            reply: [
              '"The Long Gallery door reads your declaration and decides whether you are a person who declares. It does not read *well*. It reads the way a lock reads a key."',
              '"Buy the forgery and the Gallery opens for you and you will have got past the First Ward without answering it. People do. I sell it because they want it, and I tell you what it is because lying is not a thing I can do. Those are separate sentences and both are true."'
            ],
            effects: [{ t: 'flag', id: 'f1_knows_forgery' }]
          },
          {
            id: 'f1_c_brack_use_manifest',
            text: 'Present the forged manifest at the Gallery door.',
            require: { items: ['forged_manifest'] },
            lockedText: '(You would need the manifest in your hand.)',
            reply: [
              'Somewhere along the hall a heavy salt-crusted door decides you are the sort of person who declares things, and opens.',
              '"There," says Brack, without satisfaction. "You have been believed."'
            ],
            effects: [
              { t: 'item', id: 'forged_manifest', n: -1 },
              { t: 'unlock', to: 'f1_long_gallery' },
              { t: 'flag', id: 'f1_used_forgery' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f1_c_brack_price',
            text: 'Name the true price of the forgery.',
            require: { class: ['coinwright'] },
            reply: [
              'You say the number out loud — the real one, the cost of the salt and the hour and the nerve. Brack’s coils go still.',
              '"Eleven," it agrees, wonderingly. "It is eleven. Nobody has ever — take it at eleven. Take it at eleven and tell no one, I have a *reputation*."'
            ],
            effects: [
              { t: 'flag', id: 'f1_coinwright_price' },
              { t: 'say', text: 'The manifest is now eleven gold, should you want it. Brack will not meet your eye, which is difficult, as it has none.' },
              { t: 'shop',
                stock: [{ item: 'forged_manifest', price: 11, note: 'At the true price, and under protest.' }],
                buys: [{ item: 'salt_shard', price: 16 }] }
            ]
          },
          {
            id: 'f1_c_brack_born',
            text: 'Ask what it is like, having never been anything else.',
            reply: [
              'A long pause. The coils shift like a held breath being reconsidered.',
              '"Restful," it says. "You are all of you carrying a person you used to be. I have only ever had to carry salt. When the Thinning gets down this far — and it will, it is patient, it is more patient than I am — it will take your names and your faces and it will get to me and find nothing to take."',
              '"I will still be here. Counting shelves. That is either the best thing anyone in this tower has got, or it is the worst, and I have decided not to work out which."'
            ],
            effects: [
              { t: 'item', id: 'salt_lily', n: 1 },
              { t: 'codex', id: 'f1_codex_saltborn', title: 'The Salt-Born',
                text: 'Things the Caudmere salt grew on its own, in the dark, using the tower’s leaked memory as a pattern. They were never people. They are the only residents of the Verrow with nothing to lose to the Thinning, and they are quietly, enormously proud of it.' },
              { t: 'say', text: 'It presses a salt lily into your hand and refuses, elaborately, to discuss why.' }
            ]
          }
        ]
      },
      doors: [{ to: 'f1_long_gallery', locked: true, label: 'The Gallery Door' }]
    },

    // ------------------------------------------------------------ dead end 1
    {
      id: 'f1_sump',
      name: 'The Sump',
      kind: 'deadend',
      size: 'small',
      desc: 'The room ends. It has the decency to end quickly.',
      props: ['rubble', 'water'],
      onEnter: [
        { t: 'say', text: 'The salt comes down behind you all at once, without malice, the way a ledger closes.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'It takes its beat and sets you back on your feet at the arch, which is either mercy or bookkeeping.' },
        { t: 'move', to: 'f1_tally_hall' }
      ],
      doors: []
    },

    // ------------------------------------------------------------ dead end 2
    {
      id: 'f1_dry_room',
      name: 'The Dry Room',
      kind: 'deadend',
      size: 'small',
      desc: 'No salt here. No damp. The air has been wrung out and something is still wringing.',
      props: ['rubble', 'sand'],
      npc: {
        id: 'f1_thirst',
        name: 'The Thirst',
        title: '',
        form: 'wisp',
        voice: 'broken',
        palette: { robe: '#5a4a38', glow: '#e0a860' },
        greet: [
          'There is a shape in here made of the idea of being thirsty. It has been alone with that idea for two centuries.',
          'It takes something from you before you can decide whether to let it. Not much. A beat.'
        ],
        idle: ['It is already forgetting that you were here.'],
        choices: [
          {
            id: 'f1_c_thirst_go',
            text: 'Get out.',
            reply: ['Behind it, a seam in the wall has cracked open from the sheer dryness. It goes somewhere.'],
            effects: [{ t: 'unlock', to: 'f1_long_gallery' }]
          }
        ]
      },
      onEnter: [
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'Gennet told you not to come in here. She also opened the door. Both of those were real things she was doing.' },
        { t: 'unlock', to: 'f1_long_gallery' }
      ],
      doors: [{ to: 'f1_long_gallery', locked: true, label: 'The Dry Seam', secret: true }]
    },

    // ------------------------------------------------------------ east branch
    {
      id: 'f1_brine_walk',
      name: 'The Brine Walk',
      kind: 'branch',
      size: 'hall',
      desc: 'A causeway over standing water, ankle-deep and perfectly level, reflecting a ceiling that is not there.',
      props: ['water', 'pillars', 'hanginglights'],
      npc: {
        id: 'f1_moll',
        name: 'Thin Moll',
        title: 'a Residue',
        form: 'tall',
        voice: 'high',
        palette: { robe: '#4a5a66', trim: '#bfe4ff', skin: '#c0cdd4', glow: '#9fe4ff' },
        greet: [
          'She is too tall and slightly too thin and standing in the water without disturbing it at all.',
          '"There was a wind," she says. "Off the flats. It came from the north and it smelled of nothing whatsoever and it went on for four days and on the fourth day my mother said *well*, and we went inside."',
          'She looks at you with great warmth. "There was a wind," she says.'
        ],
        idle: ['"There was a wind. Off the flats."'],
        choices: [
          {
            id: 'f1_c_moll_listen',
            text: 'Let her finish the memory.',
            reply: [
              '"— and on the fourth day my mother said *well*, and we went inside, and that is all of it. That is the entire thing I am."',
              'She says it without self-pity, the way you’d read out a measurement.',
              '"Somebody remembered a wind so hard that the memory got loose and came down here and kept going. I don’t know who. I would like to have met them. I am *fond* of them."'
            ],
            effects: [
              { t: 'flag', id: 'f1_heard_moll' },
              { t: 'codex', id: 'f1_codex_residue', title: 'Residue',
                text: 'Memories that got loose. They drift, they repeat, and they want to be witnessed. A Residue is not the person who had the memory; it is the memory, wearing a shape, entirely aware of what it is and generally at peace about it.' }
            ]
          },
          {
            id: 'f1_c_moll_feet',
            text: 'Ask where it is safe to walk.',
            reply: [
              '"The causeway is honest all the way to the pools. The side path is not. The side path counts your steps and gets one of them wrong on purpose."',
              '"Ivo is at the pools. Ivo *likes* being asked things, which down here is an unusual appetite."'
            ],
            effects: [
              { t: 'flag', id: 'f1_warned_miscount' },
              { t: 'unlock', to: 'f1_pools' }
            ]
          },
          {
            id: 'f1_c_moll_map',
            text: 'Read the true shape of the causeway.',
            require: { class: ['cartographer'] },
            reply: [
              'The astrolabe goes cold, which is how it disagrees with a room. The causeway is not one path; it is two, laid exactly on top of each other, and only one of them arrives.',
              'You step onto the one that arrives. Moll watches you do it with open delight. "Oh, *that’s* how."'
            ],
            effects: [
              { t: 'flag', id: 'f1_warned_miscount' },
              { t: 'unlock', to: 'f1_pools' },
              { t: 'unlock', to: 'f1_saltfall' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f1_c_moll_walk',
            text: 'Walk on.',
            reply: ['"There was a wind," she says, happily, to the space where you were.'],
            effects: [{ t: 'unlock', to: 'f1_pools' }]
          }
        ]
      },
      doors: [
        { to: 'f1_pools', locked: true, label: 'The Causeway' },
        { to: 'f1_counting_error', label: 'The Side Path' },
        { to: 'f1_saltfall', locked: true, label: 'The Low Arch' }
      ]
    },

    // ------------------------------------------------------------ dead end 3
    {
      id: 'f1_counting_error',
      name: 'The Side Path',
      kind: 'deadend',
      size: 'tiny',
      desc: 'Seventeen steps. You take seventeen steps. There were sixteen.',
      props: ['water', 'rubble'],
      onEnter: [
        { t: 'say', text: 'One of your steps is counted twice and you are charged for both.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'wrong' },
        { t: 'move', to: 'f1_brine_walk' }
      ],
      doors: []
    },

    // ------------------------------------------------------------ saltfall
    {
      id: 'f1_saltfall',
      name: 'The Saltfall',
      kind: 'vault',
      size: 'small',
      desc: 'Salt pours out of a crack in the ceiling in a slow white rope and has been doing so long enough to build its own floor.',
      props: ['sand', 'crystals', 'glass'],
      onEnter: [
        { t: 'say', text: 'Something is half-buried at the base of the fall, and has been for a while.' },
        { t: 'item', id: 'salt_shard', n: 1 },
        { t: 'gold', n: 26 }
      ],
      doors: []
    },

    // ------------------------------------------------------------ pools
    {
      id: 'f1_pools',
      name: 'The Brine Pools',
      kind: 'branch',
      size: 'large',
      desc: 'Nine shallow pools, each perfectly circular, each reflecting a slightly different version of the ceiling.',
      props: ['water', 'crystals', 'pillars', 'candles'],
      npc: {
        id: 'f1_ivo',
        name: 'Ivo Small',
        title: 'who has been eleven for a long time',
        form: 'child',
        voice: 'high',
        palette: { robe: '#5a6a74', trim: '#ffd9a0', skin: '#d8c6ac', glow: '#ffd9a0' },
        greet: [
          'A boy of about eleven, sitting on the rim of the fourth pool with his boots off, kicking water that does not ripple.',
          '"You’re new," he says, with the frank pleasure of someone whose week has just improved. "Ask me things. I know where everything is and nobody ever asks, they just go and then they’re *filed* and then they’re boring."'
        ],
        idle: ['"Ask me another one. Go on."'],
        choices: [
          {
            id: 'f1_c_ivo_where',
            text: 'Ask where the stair down is.',
            reply: [
              '"Past the Long Gallery, through the Antechamber, and then there’s the Mouth again — the *second* one, the one that asks. Everyone gets to the second Mouth. Almost nobody gets *through* it."',
              '"It asks what you brought and then it just *waits*. Some of them stood there for days. One of them is still standing there but she doesn’t count any more, she’s scenery."'
            ],
            effects: [
              { t: 'unlock', to: 'f1_long_gallery' },
              { t: 'flag', id: 'f1_ivo_route' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f1_c_ivo_traps',
            text: 'Ask what has hurt people here.',
            reply: [
              '"The Sump eats a beat and spits you back. The Side Path miscounts on purpose. The Dry Room takes one and gives you a door, which everyone says is a fair trade until it happens to them."',
              'He counts them off on his fingers with tremendous relish. "Three. There’s only three. It’s the *first floor*, they go easy on you. Floor six will take your hand off and apologise for the delay."'
            ],
            effects: [
              { t: 'flag', id: 'f1_warned_sump' },
              { t: 'flag', id: 'f1_warned_miscount' },
              { t: 'flag', id: 'f1_warned_dry' }
            ]
          },
          {
            id: 'f1_c_ivo_pools',
            text: 'Ask about the nine pools.',
            reply: [
              '"They’re for washing. Not you — *things*. You put a thing in and the salt takes the part of it that was about somebody, and what’s left is just the thing."',
              'He goes briefly, entirely serious, which on a face like that is startling. "Don’t put anything in that you want to keep meaning something. I did. It was a button."'
            ],
            effects: [
              { t: 'codex', id: 'f1_codex_pools', title: 'The Nine Pools',
                text: 'The Vestibule’s washing pools. Immersion strips the associative memory off an object and leaves the object. The Cadence used them to clean incoming material. Ivo Small used one on a button and has not forgiven himself, which is impressive, as he can no longer remember whose button it was.' }
            ]
          },
          {
            id: 'f1_c_ivo_stuck',
            text: 'Ask why he is still here.',
            reply: [
              'He kicks the water. It still doesn’t ripple.',
              '"I came down with my sister. She got through the second Mouth and I didn’t." A shrug, entirely without drama. "She’d have brought better things than me. She was always the one who brought things."',
              '"Anyway. She’s somewhere below and she’s fine, probably, and I’ve got nine pools and a lot of time. Don’t look like that. You’ll do it too, the looking, and then you’ll go."'
            ],
            effects: [
              { t: 'flag', id: 'f1_ivo_sister' },
              { t: 'item', id: 'salt_shard', n: 1 },
              { t: 'say', text: 'He hands you a shard of the pool rim without being asked, and does not explain, and does not need to.' }
            ]
          },
          {
            id: 'f1_c_ivo_oath',
            text: 'Swear the Iron Pact to come back for him.',
            require: { class: ['warden'] },
            reply: [
              'The signet is very cold. You say the words. They are old words from an order that was dissolved by decree and they still, infuriatingly, work.',
              'Ivo looks at the ring, then at you, then away. "That’s a *real* one," he says, not quite steadily. "You shouldn’t spend a real one on me."',
              '"Take the lamp. It was hers. If you get down far enough to need it you’ll have got further than I did, and I’d rather it went."'
            ],
            effects: [
              { t: 'item', id: 'brine_lamp', n: 1 },
              { t: 'flag', id: 'f1_swore_to_ivo' },
              { t: 'sound', id: 'bell' }
            ]
          }
        ]
      },
      doors: [{ to: 'f1_long_gallery', locked: true, label: 'The Pool Arch' }]
    },

    // ------------------------------------------------------------ alcove
    {
      id: 'f1_alcove',
      name: 'The Alcove of Left Things',
      kind: 'shrine',
      size: 'medium',
      desc: 'A niche in the wall, and in front of it a drift of objects a foot deep: buttons, knives, rings, a child’s shoe, a great deal of rope.',
      props: ['altar', 'rubble', 'candles'],
      npc: {
        id: 'f1_left',
        name: 'The Left Things',
        title: '',
        form: 'floating',
        voice: 'choral',
        palette: { robe: '#3e4650', trim: '#c2ccd4', glow: '#e0e8f0' },
        greet: [
          'It is person-shaped the way a coat on a hook is person-shaped. It is made of what people put down here on their way past.',
          '"Everyone stops," it says, in a voice with too many people in it. "Nobody means to. They come in to look and they find they are holding something out."',
          '"I do not take. That is important and I would like it noted. I *receive*."'
        ],
        idle: ['It waits, with the patience of a hook.'],
        choices: [
          {
            id: 'f1_c_alcove_give_item',
            text: 'Set down something you were carrying.',
            require: { items: ['salt_shard'] },
            lockedText: '(You would need something you actually mind losing.)',
            reply: [
              'You put the shard into the drift. It does not look like much, there. It does not look like anything.',
              '"Received," says the Alcove, and the word lands with a weight that the act did not have. "You will want to understand what you just did. You gave a thing away to a place that cannot use it, for no return, in front of a witness who cannot lie about it."',
              '"That is the whole of the lesson and I am not permitted to say why it matters. The Ward gets to say. The Ward has so little else."'
            ],
            effects: [
              { t: 'item', id: 'salt_shard', n: -1 },
              { t: 'flag', id: 'f1_gave_freely' },
              { t: 'unlock', to: 'f1_shrine' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f1_c_alcove_give_gold',
            text: 'Set down twenty gold.',
            require: { gold: 20 },
            lockedText: '(Twenty gold. You do not have twenty gold.)',
            reply: [
              'The coins go into the drift and are immediately indistinguishable from everything else in it.',
              '"Received." A pause with something almost like regret in it. "Coin is a poor gift here, because coin is *for* giving away. But it was yours and now it is not, and the Ward is literal, and literal is the best any of us can do."'
            ],
            effects: [
              { t: 'gold', n: -20 },
              { t: 'flag', id: 'f1_gave_freely' },
              { t: 'unlock', to: 'f1_shrine' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f1_c_alcove_take',
            text: 'Take something from the drift instead.',
            reply: [
              '"Of course." It does not move. "It was left. Leaving is what it is for."',
              'You come away with a glove. Only the left one. The Alcove says nothing at all, which is worse than most things it could have said.'
            ],
            effects: [
              { t: 'item', id: 'left_glove', n: 1 },
              { t: 'flag', id: 'f1_took_from_alcove' },
              { t: 'gold', n: 15 }
            ]
          },
          {
            id: 'f1_c_alcove_ask',
            text: 'Ask what people usually leave.',
            reply: [
              '"Weight. Always weight. They come to the First Ward and they think *I am going to be asked what I brought* and they panic and they start putting things down, as though the answer could be made smaller."',
              '"It cannot be made smaller. It can only be made honest. But by the time anyone works that out they are eighty-one years into the Tally Hall and very good company."'
            ],
            effects: [{ t: 'flag', id: 'f1_alcove_hint' }]
          },
          {
            id: 'f1_c_alcove_leave',
            text: 'Keep your hands at your sides and go.',
            reply: ['"Noted," it says, which is not its word, and it is careful to let you hear that it knows it.'],
            effects: []
          }
        ]
      },
      doors: [{ to: 'f1_shrine', locked: true, label: 'The Shrine Door' }]
    },

    // ------------------------------------------------------------ shrine
    {
      id: 'f1_shrine',
      name: 'The Shrine of the Second Order',
      kind: 'shrine',
      size: 'medium',
      desc: 'A chapel for a god that has not been named aloud in this room for a very long time, kept immaculately clean.',
      props: ['altar', 'banners', 'candles', 'statue'],
      npc: {
        id: 'f1_ordell',
        name: 'Ordell Fenn',
        title: 'of an order that was dissolved',
        form: 'armored',
        voice: 'low',
        palette: { robe: '#4a4e56', trim: '#a8b0ba', glow: '#ffd9a0' },
        greet: [
          'A figure in the plate of an order you half-recognise, on one knee, cleaning a floor that is already clean.',
          '"You’ll want the stair," he says, without getting up. "Everyone wants the stair. I’ll open it in a moment; I’m not being difficult, I’m finishing."',
          'He finishes. He stands. The plate is two hundred years out of fashion and in better condition than anything else on this floor.'
        ],
        idle: ['"The floor doesn’t need doing. I do."'],
        choices: [
          {
            id: 'f1_c_ordell_open',
            text: 'Ask him to open the way to the Gallery.',
            reply: [
              '"Done." Something heavy moves, somewhere, without hurry. "It was never locked against *you*. It was locked against people arriving in a state. You are not in a state. You are merely new."'
            ],
            effects: [
              { t: 'unlock', to: 'f1_long_gallery' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f1_c_ordell_order',
            text: 'Ask which order.',
            reply: [
              '"The Second. Dissolved by decree in the eleventh year of the Thinning, along with the First, the Fourth and most of the Seventh, on the grounds that an order that guards a thing nobody can remember the value of is an expense."',
              '"They were right. It was an expense." He looks at the altar. "It went on being an expense after they dissolved us, and somebody had to keep paying it, and here I am, and the floor is clean."'
            ],
            effects: [
              { t: 'codex', id: 'f1_codex_orders', title: 'The Dissolved Orders',
                text: 'In the eleventh year of the Thinning the standing orders were dissolved by decree, not by defeat, on the reasoning that guarding something nobody can remember the value of is a line item. Several of their members declined to notice the decree. The Iron Pact was one of these.' }
            ]
          },
          {
            id: 'f1_c_ordell_pact',
            text: 'Show him the signet of the Iron Pact.',
            require: { class: ['warden'] },
            reply: [
              'He looks at the ring for a long moment. Then he does something with his right hand that you have only ever seen in an old book, and which you find, to your considerable surprise, that your own hand knows how to answer.',
              '"The Fourth," he says. "They told us you’d all stood down."',
              '"No," you say.',
              '"No," he agrees. He is not a man who smiles. Something in the plate relaxes anyway. "Take the lamp off the altar. It is not consecrated to anything and it never was; we only ever said it was so people would stop stealing it."'
            ],
            effects: [
              { t: 'item', id: 'brine_lamp', n: 1 },
              { t: 'flag', id: 'f1_met_ordell_warden' },
              { t: 'unlock', to: 'f1_long_gallery' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f1_c_ordell_rest',
            text: 'Kneel at the altar a while.',
            require: { class: ['hollow-saint'], minHearts: 1 },
            reply: [
              'The reliquary is empty and the altar is empty and the two emptinesses fit together with a click you feel in your teeth.',
              'Ordell Fenn does not comment. When you stand, something that was spent is not spent any more.'
            ],
            effects: [
              { t: 'heal', n: 1 },
              { t: 'flag', id: 'f1_used_shrine' }
            ]
          },
          {
            id: 'f1_c_ordell_ward',
            text: 'Ask what he told the Ward, when he came down.',
            reply: [
              'A very long pause. He looks at the clean floor.',
              '"I told it I had brought nothing, because I had been dissolved, and a dissolved man carries nothing." He shifts his weight. "It let me in. It should not have. I have had two centuries to understand that it let me in because it was *true*, and that being true is not the same as being right, and that I would give a great deal now to have been carrying something."',
              '"Bring something. That is not advice, it is a request. I would like one of you to bring something."'
            ],
            effects: [
              { t: 'flag', id: 'f1_knows_intent' },
              { t: 'sound', id: 'whisper' }
            ]
          }
        ]
      },
      doors: [{ to: 'f1_long_gallery', locked: true, label: 'The Shrine Arch' }]
    },

    // ------------------------------------------------------------ reconverge
    {
      id: 'f1_long_gallery',
      name: 'The Long Gallery',
      kind: 'hub',
      size: 'grand',
      desc: 'Everything on this floor arrives here eventually. The salt has grown up the walls in vertical ribs, like the inside of something that once breathed.',
      props: ['pillars', 'hanginglights', 'statue'],
      npc: null,
      onEnter: [
        { t: 'say', text: 'Whatever route you took, the Gallery was always going to be at the end of it. That is what a vestibule is for.' },
        { t: 'unlock', to: 'f1_antechamber' }
      ],
      doors: [
        { to: 'f1_antechamber', locked: true, label: 'The Gallery End' },
        { to: 'f1_niche', label: 'A Gap in the Ribbing' }
      ]
    },

    {
      id: 'f1_niche',
      name: 'The Gap in the Ribbing',
      kind: 'vault',
      size: 'tiny',
      desc: 'A space between two salt ribs, just wide enough, with something wedged at the back of it.',
      props: ['crystals', 'rubble'],
      onEnter: [
        { t: 'gold', n: 34 },
        { t: 'item', id: 'salt_shard', n: 1 },
        { t: 'say', text: 'Someone hid a purse here and did not come back for it. The Verrow has a great many of these.' }
      ],
      doors: []
    },

    // ------------------------------------------------------------ antechamber
    {
      id: 'f1_antechamber',
      name: 'The Weighing Room',
      kind: 'branch',
      size: 'medium',
      desc: 'A room with a set of scales in it the size of a cart, holding nothing in either pan, perfectly balanced.',
      props: ['machine', 'pillars', 'candles'],
      npc: {
        id: 'f1_weighing',
        name: 'The Weighing',
        title: '',
        form: 'construct',
        voice: 'bell',
        palette: { robe: '#3a4450', trim: '#c0c8d4', glow: '#9fe4ff' },
        greet: [
          'A ring-bound core of pale light turning slowly above the fulcrum of the scales.',
          '"You are carrying four hundred and ten grams of metal, six hundred of cloth, an unknown quantity of salt, and eleven kilograms of something I am not equipped to weigh," it says. "The last figure is an estimate. It is always an estimate. It is always about eleven."'
        ],
        idle: ['"Still about eleven."'],
        choices: [
          {
            id: 'f1_c_weigh_ask',
            text: 'Ask what the eleven kilograms are.',
            reply: [
              '"Reason." The rings turn. "Everyone who comes down this stair is carrying a reason and none of you declare it, because you do not think of it as luggage. It is the heaviest thing any of you has ever put down a hole."',
              '"I weigh it. I do not read it. I am a scale; reading is the Mouth’s job and it is very tiresome about the distinction."'
            ],
            effects: [
              { t: 'flag', id: 'f1_knows_intent' },
              { t: 'codex', id: 'f1_codex_weight', title: 'Eleven Kilograms',
                text: 'The Weighing Room measures every Petitioner at roughly eleven kilograms over their physical mass. The excess is their reason for descending. It does not vary meaningfully between people, which the Weighing finds the single most interesting fact in the tower and cannot get anyone to discuss.' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f1_c_weigh_stone',
            text: 'Weigh the Tallyman’s stone.',
            require: { items: ['tally_stone'] },
            lockedText: '(You would need Hask’s stone.)',
            reply: [
              'You set it in the left pan. The scales do not move.',
              '"It weighs nothing," says the Weighing, delighted. "He has been holding it for two hundred years and it weighs *nothing*. Do you know what that means?"',
              '"No," you say.',
              '"Neither do I! Isn’t it splendid. Take it back to him. Take it back to him and watch his face."'
            ],
            effects: [
              { t: 'flag', id: 'f1_weighed_stone' },
              { t: 'gold', n: 18 }
            ]
          },
          {
            id: 'f1_c_weigh_open',
            text: 'Ask it to open the Mouth.',
            reply: [
              '"It is not shut. It has never once been shut." The rings slow. "It is simply *waiting*, and people mistake a thing that waits for a thing that is closed. Go through whenever you like. The difficulty is not the going through."'
            ],
            effects: [
              { t: 'unlock', to: 'f1_exit' },
              { t: 'sound', id: 'unlock' }
            ]
          }
        ]
      },
      doors: [{ to: 'f1_exit', locked: true, label: 'The Second Mouth' }]
    },

    // ------------------------------------------------------------ exit
    {
      id: 'f1_exit',
      name: 'The Second Mouth',
      kind: 'exit',
      size: 'large',
      desc: 'The stair down begins here. Standing to one side of it, absolutely still, is a woman who stopped being a person and became scenery.',
      props: ['stairs', 'pillars', 'statue', 'candles'],
      npc: {
        id: 'f1_mouth',
        name: 'The Second Mouth',
        title: 'Ward the First',
        form: 'floating',
        voice: 'choral',
        palette: { robe: '#26313c', trim: '#9fe4ff', glow: '#cfe8f0' },
        greet: [
          'It does not have a shape so much as a direction. Everything in the room, including the air, is very slightly oriented toward it.',
          '"What did you bring?" it says.',
          'It is not a challenge and it is not a riddle. It is a question, asked plainly, by something that has been asking it for two hundred years and has not yet become bored, which is the most frightening thing about it.'
        ],
        idle: ['"What did you bring?" it says, with no impatience whatsoever.'],
        choices: [
          {
            id: 'f1_c_mouth_true',
            text: 'Declare why you came down.',
            require: { flags: ['f1_knows_intent', 'f1_gave_freely'] },
            lockedText: '(You could say it. But you do not yet know that it is what is being asked, or what it costs to mean it.)',
            reply: [
              'You say it. Not the objects. The other thing — the eleven kilograms — out loud, in a room with very good acoustics, to something that cannot lie and therefore cannot be lied to comfortably.',
              'It is not a noble reason. Most of them are not. You say it anyway, and the saying of it is the entire ordeal, and it takes about nine seconds.',
              '"Noted," says the Second Mouth, in Hask’s voice, because it has only ever had the one.',
              'Something small and hexagonal and black is in your hand. The stair was always open. It is simply, now, also *yours*.'
            ],
            effects: [
              { t: 'flag', id: 'f1_answered_ward' },
              { t: 'sound', id: 'token' },
              { t: 'floorEnd', token: true }
            ]
          },
          {
            id: 'f1_c_mouth_goods',
            text: 'Declare your goods, item by item.',
            require: { items: ['declared_list'] },
            lockedText: '(You would want the declaration Hask wrote for you.)',
            reply: [
              'You read the list. It is accurate and complete and it takes some time.',
              '"Noted," says the Mouth, and waits.',
              'You wait too. Nothing further happens. After a while it becomes clear that nothing further is going to, and that the stair is right there, and that you may simply walk down it, and that this has been true the entire time.',
              'By the scales, Gennet Wry does not look up.'
            ],
            effects: [
              { t: 'flag', id: 'f1_declared_goods_only' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f1_c_mouth_forged',
            text: 'Present the forged manifest.',
            require: { items: ['forged_manifest'] },
            lockedText: '(You would need Brack’s forgery.)',
            reply: [
              '"Three barrels of nothing," reads the Mouth. A pause of exactly the length a person would use to decide not to say something.',
              '"Noted."',
              'The forgery goes to salt in your hand. The stair is right there. It was always right there.'
            ],
            effects: [
              { t: 'item', id: 'forged_manifest', n: -1 },
              { t: 'flag', id: 'f1_forged_the_ward' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f1_c_mouth_nothing',
            text: 'Say nothing, and take the stair.',
            reply: [
              'You walk past it. It does not stop you. Nothing in the Verrow will stop you; that is not what any of this is for.',
              'Behind you, unhurried, it asks the empty room what you brought.'
            ],
            effects: [
              { t: 'flag', id: 'f1_said_nothing' },
              { t: 'floorEnd' }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

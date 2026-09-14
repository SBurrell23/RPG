// Floor 2 — The Kennels of Unmade Things
// Ward the Second — What will you feed?

export default {
  id: 2,
  name: 'The Kennels of Unmade Things',
  theme: 'warren',
  subtitle: 'Ward the Second — What will you feed?',
  intro: 'Below the salt the ceiling drops and the air goes warm as a mouth. Something large is breathing two rooms away and has been for two hundred years. Nothing down here is finished, and all of it is hungry.',
  entry: 'f2_entry',

  items: {
    portion_tin: {
      name: 'Portion Tin',
      kind: 'tool', value: 8, icon: 'cup', tint: '#d8b06a',
      desc: 'A shallow tin with a lid that screws down hard. Kennel issue. Holds one portion of one thing, and is not fussy about what.'
    },
    strangers_afternoon: {
      name: 'A Stranger’s Afternoon',
      kind: 'consumable', value: 30, icon: 'thread', tint: '#c9a9d8',
      desc: 'Two drams of somebody else’s Thursday, wound on a spool. Sunlight, a door left open, a name you have never needed. Sold by weight, as everything is on Scrap Row.'
    },
    tally_stick: {
      name: 'Kennel Tally Stick',
      kind: 'trade', value: 12, icon: 'bone', tint: '#e4dcc8',
      desc: 'Notched along one edge in groups of four and struck through. The count runs to four thousand and something and then stops mid-group, as if the counter was interrupted and never was again.'
    }
  },

  rooms: [

    // ------------------------------------------------------------------ ENTRY
    {
      id: 'f2_entry',
      name: 'The Stoop',
      kind: 'entry',
      size: 'medium',
      desc: 'The stair ends in warm straw, and the straw is occupied.',
      props: ['stairs', 'bones', 'hanginglights'],
      onEnter: [
        { t: 'say', text: 'The ceiling here is low enough that you stoop without deciding to.' },
        { t: 'sound', id: 'whisper' }
      ],
      npc: {
        id: 'f2_bittel',
        name: 'Bittel',
        title: 'the Half-Written Hound',
        form: 'beast',
        voice: 'broken',
        palette: { robe: '#4a2f1e', trim: '#c98a5a', skin: '#8a5c38', glow: '#ffb46b' },
        greet: [
          'The thing at the bottom of the stair has a chest, a head, two good front legs, and then an argument about where the rest was meant to go. It drags the argument behind it, patiently.',
          '"You came down the stair," it says, the voice arriving from somewhere behind its teeth rather than through them. "Four hundred and sixteen have. I remember all of them. Their boots, mostly."',
          '"Bittel. No back legs and an excellent memory, and I would not trade."'
        ],
        idle: [
          '"Still four hundred and sixteen," says Bittel. "You do not count twice."'
        ],
        choices: [
          {
            id: 'f2_c_bittel_what',
            text: 'Ask what lives down here.',
            reply: [
              '"Drafts. The Cadence started us and went quiet partway through. A Tuesday that never got a week to sit in. A woman who is only her left side. A guard dog that is only a memory and an appetite, which is me."',
              '"We are not dangerous. We are hungry, and what we eat is remembering. That is worse than dangerous, in a slow way. Mind your hands."'
            ],
            effects: [
              { t: 'codex', id: 'f2_unmade', title: 'On the Unmade', text: 'The second floor of the Verrow holds the Cadence’s drafts: creatures, persons and concepts begun and never completed. They do not decay and they cannot finish themselves. They subsist on memory — anyone’s — taken in measured portions. A well-fed draft is placid and articulate. A starved one begins, very slowly, to eat the room it is in.' },
              { t: 'flag', id: 'f2_knows_unmade' }
            ]
          },
          {
            id: 'f2_c_bittel_safe',
            text: 'Ask how to come out of here whole.',
            reply: [
              '"Listen. That is the whole instruction. This floor breathes, because something is always asleep next door."',
              '"Three places down here are not rooms. The breathing stops at the doorframe, like a word bitten in half. Walk in and it takes a heartbeat off you — not out of malice. There is nothing in there to be gentle with."'
            ],
            effects: [
              { t: 'flag', id: 'f2_heard_breathing' },
              { t: 'codex', id: 'f2_breathing', title: 'Where the Breathing Stops', text: 'Rule of the warrens: a live room breathes, because something large is always asleep two rooms away. Where the breathing stops at the threshold, the tower stopped writing. Enter and it will take one heartbeat, without meaning anything by it.' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f2_c_bittel_before',
            text: 'Ask about the Petitioners before you.',
            reply: [
              '"Four hundred and sixteen. Eleven went down past me. One stayed — four generations ago, in a good coat. She saw the pens unfed and did not go on."',
              '"She will not discuss the floor above. Do not spend breath there. I liked her boots."'
            ],
            effects: [
              { t: 'flag', id: 'f2_knows_houndmaster' }
            ]
          },
          {
            id: 'f2_c_bittel_feed',
            text: 'Offer Bittel your hand to smell.',
            reply: [
              'Bittel considers the hand the way a creditor considers a coin.',
              '"No. You do not yet know what that costs."'
            ],
            effects: [
              { t: 'flag', id: 'f2_offered_hand' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f2_c_bittel_go',
            text: 'Go in.',
            once: false,
            reply: [
              '"Mind the light," says Bittel. "Standing in it makes them think it is feeding time, and it is never feeding time when you think it is."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_kennel_yard' }
      ]
    },

    // -------------------------------------------------------------------- HUB
    {
      id: 'f2_kennel_yard',
      name: 'The Feeding Floor',
      kind: 'hub',
      size: 'large',
      desc: 'Amber light falls in one hard column onto a plank table, and grey portions are laid along it in rows.',
      props: ['cages', 'table', 'brazier', 'bones'],
      onEnterAlways: [
        { t: 'say', text: 'Somewhere past the far wall, something enormous breathes in, holds it, and lets it go.' }
      ],
      npc: {
        id: 'f2_odile',
        name: 'Odile Cask',
        title: 'the Houndmaster',
        form: 'hunched',
        voice: 'dry',
        palette: { robe: '#5a4330', trim: '#e0c878', skin: '#c9a88a', glow: '#ffc978' },
        greet: [
          'A woman in a leather apron is dividing something grey into portions on a plank and does not look up. Her hands are entirely certain and her left one is slightly translucent at the knuckles.',
          '"Nine. Ten. Eleven," she says. "Eleven. Wrong. Start again." She sweeps two portions back into the heap and begins at one.',
          '"You are the new one. Don’t stand in the column of light. They see a shape in it and think it is the hour, and a disappointed draft goes quiet for a week."'
        ],
        idle: [
          '"Four. Five. Six," says Odile, not looking up. "Six is right. Six has been right for a hundred years."'
        ],
        choices: [
          {
            id: 'f2_c_odile_who',
            text: 'Ask who she is.',
            reply: [
              '"Odile Cask. Houndmaster, because nobody else stopped walking. I came down with a good coat and a list of questions, and the pens hadn’t been fed. You can’t look at that and then go down a stair."'
            ],
            effects: [
              { t: 'flag', id: 'f2_met_odile' }
            ]
          },
          {
            id: 'f2_c_odile_food',
            text: 'Ask what a portion actually is.',
            reply: [
              '"Memory. A spoonful of somebody’s afternoon — the wide flat boring parts. Nobody misses those."',
              '"Render it, portion it, carry it in a tin. Never in your hands. The warm of a hand starts it thinking it belongs to you, and then it is yours, and then you have to mean it."',
              '"Two hundred and nine mouths." Her mouth moves for a while with no sound in it. "Two hundred and nine."'
            ],
            effects: [
              { t: 'codex', id: 'f2_portions', title: 'On Portions', text: 'Memory is rendered in the stillroom press, divided on the plank, and carried in a sealed tin — never bare-handed. Warmth makes a portion adhere to the carrier, and an adhered portion is no longer a portion. It is a gift, and a gift has to be meant.' },
              { t: 'flag', id: 'f2_knows_portions' }
            ]
          },
          {
            id: 'f2_c_odile_count',
            text: 'Offer to help her count.',
            reply: [
              'She stops. She looks at you for the first time, and her eyes are ordinary and tired and entirely present.',
              '"Right. Four at a time, strike through the fourth. Don’t talk while you do it and don’t be clever about it."',
              'You count together for a while. It takes longer than you expect and is not unpleasant. Twice she says a number half a beat before you and does not gloat. When the plank is full she takes a notched stick off her belt and puts it in your hand without ceremony.',
              '"That’s yours. Don’t sell it to Ghyll under twelve; he’ll start at five and look wounded."'
            ],
            effects: [
              { t: 'item', id: 'tally_stick', n: 1 },
              { t: 'flag', id: 'f2_counted' },
              { t: 'unlock', to: 'f2_stillroom' },
              { t: 'sound', id: 'unlock' },
              { t: 'say', text: 'She kicks the low door behind her open with one heel. "Stillroom’s through there. Mind your head, it doesn’t care about yours."' }
            ]
          },
          {
            id: 'f2_c_odile_tin',
            text: 'Ask her for a tin of your own.',
            require: { flags: ['f2_counted'] },
            lockedText: '(She has not decided about you yet. She decides about people while they are doing something.)',
            reply: [
              'She takes a tin off the rack, looks at it, and does not hand it over immediately.',
              '"A tin is not a present. It is a responsibility with a lid. Filled, it is a portion, and a portion goes into a mouth and does not come back out."',
              '"It wants a seal. Warm tallow round the rim. Ghyll keeps tallow, down Scrap Row under the brass pans. Fifteen and not a coin more."',
              'She puts the tin in your hand. "And listen. A sealed tin will hold anything at all. Including the sort of thing you could not get back. Nine. Ten. Eleven. Wrong."'
            ],
            effects: [
              { t: 'item', id: 'portion_tin', n: 1 },
              { t: 'flag', id: 'f2_has_tin' },
              { t: 'sound', id: 'chime' },
              { t: 'codex', id: 'f2_tin', title: 'On Tins', text: 'A portion tin is sealed with tallow poured warm around the rim. A sealed tin will carry any portion, including one rendered from the carrier’s own remembering. The Houndmaster issues them rarely, and never to someone she has not watched work.' }
            ]
          },
          {
            id: 'f2_c_odile_nine',
            text: 'Ask what is in Pen Nine.',
            reply: [
              'The counting stops. It is the only time it stops.',
              '"I won’t say its name. That isn’t superstition, it is arithmetic — a name is a thing it could eat."',
              '"I will open the door. Those are two different acts." She knocks a wooden bar out of its bracket. "It is not dangerous. It is the other thing, the one people find harder. One. Two. Three. Four, strike."'
            ],
            effects: [
              { t: 'unlock', to: 'f2_pen_nine' },
              { t: 'flag', id: 'f2_nine_opened' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f2_c_odile_above',
            text: 'Ask her about the Salt Vestibule above.',
            reply: [
              '"No."',
              'She resumes counting. Without looking up: "Not rudeness. The thing that holds all of this together is that I do not think about the stair I came down. Ask me about here instead."'
            ],
            effects: []
          },
          {
            id: 'f2_c_odile_go',
            text: 'Step out of the light and go on.',
            once: false,
            reply: [
              '"Good," she says. "Two. Three. Four, strike."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_scrap_row', label: 'Scrap Row' },
        { to: 'f2_pen_row', label: 'The Pen Row' },
        { to: 'f2_stillroom', locked: true, label: 'The Low Door' }
      ]
    },

    // -------------------------------------------------------------- SCRAP ROW
    {
      id: 'f2_scrap_row',
      name: 'Scrap Row',
      kind: 'corridor',
      size: 'hall',
      desc: 'A long crooked passage of shuttered stalls, most of them empty, one of them lit.',
      props: ['shelves', 'chains', 'hanginglights'],
      npc: {
        id: 'f2_tuesday',
        name: 'Tuesday',
        title: 'a Day With Nowhere to Be',
        form: 'wisp',
        voice: 'high',
        palette: { robe: '#6a5a3a', trim: '#ffd79a', glow: '#ffe2a8' },
        greet: [
          'Something the shape of a held breath is drifting along the shutters, touching each one and moving on, like a person checking doors they already know are locked.',
          '"Tuesday," it says, before you have asked. "I was made Tuesday and the week was never made, so there is nothing on either side of me. Everything that happens, happens ON me."',
          '"Which is a lot of pressure," says Tuesday, "for a Tuesday."'
        ],
        idle: [
          '"Still on me," says Tuesday, sadly. "All of it. Still on me."'
        ],
        choices: [
          {
            id: 'f2_c_tues_what',
            text: 'Ask what it is waiting for.',
            reply: [
              '"A calendar. Any calendar. A wall with a nail in it. A day needs a Monday in front of it, or it is a duration standing on its own in a corridor."',
              '"Everything on me, and no Wednesday to hand it to. Do not pity me. Pity is very rich feed and I have been told to watch my weight."'
            ],
            effects: [
              { t: 'flag', id: 'f2_met_tuesday' }
            ]
          },
          {
            id: 'f2_c_tues_gutter',
            text: 'Ask what is down the low gutter.',
            reply: [
              '"Nothing is down there, and I mean that with precision. It is a held breath with no chest around it. You will stop hearing it before you reach it, which on this floor is a warning."',
              '"People go in anyway," says Tuesday. "It happens on me. I do wish it would happen on some other day."'
            ],
            effects: [
              { t: 'flag', id: 'f2_warned_sump' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f2_c_tues_tell',
            text: 'Tell it something that happened on a Tuesday.',
            reply: [
              'You tell it a small thing. A market day. Wet flagstones. Somebody shouting about the price of thread.',
              'Tuesday goes very still, and very slightly brighter, and does not eat it — you feel it decline, distinctly, like a hand drawing back.',
              '"No. That is yours, and it is only an afternoon, and I can wait. But thank you. It has been a long time since anything was put ON me on purpose."',
              'It nudges something out from under a shutter with what would be a foot. A stub of chalk. "Mark your turns. The row lies about its length. It was measured on a Tuesday."'
            ],
            effects: [
              { t: 'item', id: 'chalk_stub', n: 1 },
              { t: 'flag', id: 'f2_told_tuesday' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f2_c_tues_pass',
            text: 'Walk on down the row.',
            once: false,
            reply: [
              '"Go on then. Mind the crawl at the end, it gets lower than it looks. It always gets lower than it looks. On me."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_weighstall', label: 'The Lit Stall' },
        { to: 'f2_sump', label: 'The Low Gutter' },
        { to: 'f2_undercrawl', label: 'The Crawl Mouth' }
      ]
    },

    // ------------------------------------------------------------------- SHOP
    {
      id: 'f2_weighstall',
      name: 'The Weighing Stall',
      kind: 'shop',
      size: 'small',
      desc: 'Brass pans hang at four heights, and each one holds something that is not quite there.',
      props: ['table', 'shelves', 'candles'],
      npc: {
        id: 'f2_ghyll',
        name: 'Ghyll',
        title: 'Scrap-Broker, By Weight',
        form: 'coiled',
        voice: 'mid',
        palette: { robe: '#3d3348', trim: '#c9a9d8', skin: '#b8a8c4', glow: '#d7b6ff' },
        greet: [
          'The broker is wound around his own stall like rope on a cleat, and he has more elbows than the arrangement strictly justifies.',
          '"Weight," says Ghyll, tapping a pan so it swings. "Not worth. Worth is an argument. Two drams of a wedding and two drams of a wet walk home weigh two drams, and I will not be drawn further."',
          '"Everything here belonged to somebody. None of it belongs to them now. That is the trade, and if it sits badly, it should."'
        ],
        idle: [
          '"Still two drams," says Ghyll. "Still a fact."'
        ],
        choices: [
          {
            id: 'f2_c_ghyll_trade',
            text: 'Trade.',
            once: false,
            reply: [
              '"Pans are level. Hands where I can see them, all of them, however many you have."'
            ],
            effects: [
              {
                t: 'shop',
                stock: [
                  { item: 'tallow_candle', price: 15 },
                  { item: 'strangers_afternoon', price: 30 },
                  { item: 'memory_of_bread', price: 28 },
                  { item: 'bone_whistle', price: 34 },
                  { item: 'quiet_coin', price: 95 }
                ],
                buys: [
                  { item: 'salt_shard', price: 22 },
                  { item: 'tally_stick', price: 12 },
                  { item: 'grey_feather', price: 14 },
                  { item: 'chalk_stub', price: 5 },
                  { item: 'memory_of_bread', price: 18 }
                ]
              }
            ]
          },
          {
            id: 'f2_c_ghyll_where',
            text: 'Ask where the scraps come from.',
            reply: [
              'Ghyll does not hesitate, because nothing in the Verrow can lie, and because he has clearly answered this before and found that answering it costs him nothing.',
              '"Three places. The Kept sell — a person filed for a century has a great deal of afternoon and little use for it. That is the bulk of it, and it is consensual, and it is sad, and both remain true."',
              '"The second is the sluice. What the drafts do not finish comes down the drain, and I strain it and sell it back."',
              '"The third I will not discuss. Not because it is worse. Because I gave my word, and my word is the only thing here not for sale by weight."'
            ],
            effects: [
              { t: 'codex', id: 'f2_scraps', title: 'On Scrap', text: 'Memory-fragments on Scrap Row come from the Kept, who sell their surplus afternoons, and from the sluice, which strains what the drafts leave. There is a third source. The broker has given his word and will not name it, and he does not lie, so it is worth wondering about.' },
              { t: 'flag', id: 'f2_knows_scrap_source' }
            ]
          },
          {
            id: 'f2_c_ghyll_price',
            text: 'Name him a true price.',
            require: { class: ['coinwright'] },
            lockedText: '(You would have to know what a dram of somebody’s Thursday is actually worth.)',
            reply: [
              'You say the number. Not the number he wants, or the number he fears — the true one, the one the goods would fetch in a market that does not exist and never did.',
              'Every pan on the stall swings at once. Ghyll looks at you with something close to relief.',
              '"Oh, thank the salt. Two centuries of people insisting a memory is priceless. It is not priceless, it is fourteen. Take the difference, and never do that in front of customers."'
            ],
            effects: [
              { t: 'gold', n: 18 },
              { t: 'sound', id: 'coin' },
              { t: 'flag', id: 'f2_coinwright_price' }
            ]
          },
          {
            id: 'f2_c_ghyll_weigh',
            text: 'Pay him to weigh your own hand.',
            require: { gold: 10 },
            lockedText: '(Ten gold to be weighed. You do not have ten gold.)',
            reply: [
              'He lays your hand in the largest pan. It does not move at all, and then moves a very long way down.',
              '"Heavier than you look. You have not put any of yourself down yet. When you do, you will not notice for about three rooms."'
            ],
            effects: [
              { t: 'gold', n: -10 },
              { t: 'flag', id: 'f2_weighed' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f2_c_ghyll_leave',
            text: 'Leave the pans swinging.',
            once: false,
            reply: [
              '"Mind the row. It is longer coming back. That is not a lie, it is a measurement."'
            ],
            effects: []
          }
        ]
      },
      doors: []
    },

    // -------------------------------------------------------------- DEAD END 1
    {
      id: 'f2_sump',
      name: 'The Low Gutter',
      kind: 'deadend',
      size: 'tiny',
      desc: 'The breathing stops precisely at the doorframe, the way a word stops when it is bitten in half.',
      props: ['water', 'rubble'],
      onEnter: [
        { t: 'say', text: 'There is nothing in here. Not darkness, not silence — an absence of the tower having bothered.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'Something goes out of you the way warmth goes out of a room with the door open, and you are back on the row with wet knees and no memory of turning.' },
        { t: 'move', to: 'f2_scrap_row' },
        { t: 'flag', id: 'f2_took_the_gutter' }
      ],
      doors: []
    },

    // ---------------------------------------------------------------- PEN ROW
    {
      id: 'f2_pen_row',
      name: 'The Pen Row',
      kind: 'branch',
      size: 'hall',
      desc: 'Twelve pens down one side, numbered in chalk, and one of the numbers has been scrubbed at and given up on.',
      props: ['cages', 'chains', 'hanginglights'],
      onEnterAlways: [
        { t: 'say', text: 'The breathing is louder here. It is coming from the far end, and it is enormous, and it is patient.' }
      ],
      npc: {
        id: 'f2_asill',
        name: 'Asill',
        title: 'Who Is Only Her Left Side',
        form: 'tall',
        voice: 'low',
        palette: { robe: '#4c3a52', trim: '#e8d2a8', skin: '#d0b49a', glow: '#ffd0a8' },
        greet: [
          'A woman stands in the pen-row keeping herself carefully edge-on to you, which you take for shyness until the light shifts and you understand that edge-on is all there is.',
          '"Don’t walk round," she says, pleasantly. "There is nothing on the other side to look at, and it puts a draught through me."',
          '"Asill. Left side, whole and functional. On my side the floor is swept and the lamps are trimmed. I make no claims about the other half of anything."'
        ],
        idle: [
          '"Still swept, on my side," says Asill.'
        ],
        choices: [
          {
            id: 'f2_c_asill_pens',
            text: 'Ask about the pens.',
            reply: [
              '"Twelve. Three is the litter. Four through eight are concepts — you cannot see them, but you will know if you stand in one, because you will suddenly have an opinion about something you have never heard of."'
            ],
            effects: [
              { t: 'flag', id: 'f2_knows_pens' }
            ]
          },
          {
            id: 'f2_c_asill_nine',
            text: 'Ask about Pen Nine.',
            reply: [
              'She is quiet for a moment. Half a face gives you very little to read and she knows it, and does not use it against you.',
              '"Everybody expects a monster. I have watched four hundred people brace themselves on this patch of floor. It has never once put its head through the bars, and the bars would not stop it. It is sad. That is all."',
              'She knocks the bar out of its bracket with her elbow, on her side. "Go and be decent to it. Bring something or bring nothing, but don’t bring an audience face."'
            ],
            effects: [
              { t: 'unlock', to: 'f2_pen_nine' },
              { t: 'flag', id: 'f2_nine_opened' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f2_c_asill_midden',
            text: 'Ask where the bone midden goes.',
            reply: [
              '"Down and through, and out at the crawl. A shortcut, and honestly a bad one. The midden does not breathe. It takes a heartbeat at the threshold and lets you out the far side."',
              '"It pays, and what it costs is not in your purse, and that is the shape of every bad bargain there has ever been. On my side, I would walk round."'
            ],
            effects: [
              { t: 'flag', id: 'f2_warned_midden' },
              { t: 'codex', id: 'f2_midden_lore', title: 'The Bone Midden', text: 'A genuine shortcut from the pen row to the under-crawl, through a stretch the tower never finished. It costs one heartbeat at the threshold and lets you out the other side. It pays, and what it costs is not in your purse.' }
            ]
          },
          {
            id: 'f2_c_asill_walk',
            text: 'Walk the row.',
            once: false,
            reply: [
              '"Left side of the passage," says Asill. "Habit. Mine, not a rule."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_pen_three', label: 'Pen Three' },
        { to: 'f2_pen_nine', locked: true, label: 'Pen Nine' },
        { to: 'f2_midden', label: 'The Bone Midden' },
        { to: 'f2_hush', label: 'The Listening Alcove' }
      ]
    },

    // -------------------------------------------------------------- PEN THREE
    {
      id: 'f2_pen_three',
      name: 'Pen Three',
      kind: 'branch',
      size: 'medium',
      desc: 'Six sevenths of six dogs come to the bars at once and the arithmetic of it is upsetting until it is charming.',
      props: ['cages', 'bones', 'brazier'],
      npc: {
        id: 'f2_litter',
        name: 'The Litter',
        title: 'Six Sevenths of Six Dogs',
        form: 'child',
        voice: 'choral',
        palette: { robe: '#6b4a2c', trim: '#ffd79a', skin: '#a87a4e', glow: '#ffbf7a' },
        greet: [
          'They speak all together and slightly out of step, the way a room of children says a rhyme they only partly know.',
          '"Is it six? Is it six o’clock? It is not six. It is never six when the shape comes."',
          '"We were going to be one dog," they explain, without resentment. "A good one. Instead there is nearly six of us and we are each nearly good."'
        ],
        idle: [
          '"Not six yet," says the Litter. "We will tell you when."'
        ],
        choices: [
          {
            id: 'f2_c_litter_hand',
            text: 'Put your hand flat against the bars.',
            reply: [
              'They crowd it. Nothing is taken — you feel them decline, six times over, six small refusals with the same manners in them.',
              '"Odile said not off the hand. Odile said a hand-feed is a keeping, and we are not allowed to keep."',
              'One of them is scraping at the straw with a foreleg that stops at the wrist. It pushes something out into the light: coins, gone soft and green, worked loose from the packed floor over a century of digging.',
              '"You can have those. They are not memory. They are only money."'
            ],
            effects: [
              { t: 'gold', n: 14 },
              { t: 'flag', id: 'f2_litter_hand' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f2_c_litter_names',
            text: 'Ask if they have names.',
            reply: [
              '"No. Names are for finished things. A draft gets a number. We are all Three. It is a lot of Three to go round."',
              '"The Warden at the grate keeps a book," they add, all at once, which makes it sound like a cheer. "A written thing is a finished thing, or nearly. You could put one in. You would have to have one spare. People usually think they have one spare."'
            ],
            effects: [
              { t: 'flag', id: 'f2_knows_book' }
            ]
          },
          {
            id: 'f2_c_litter_feed',
            text: 'Unspool the stranger’s afternoon for them.',
            require: { items: ['strangers_afternoon'] },
            lockedText: '(You are carrying nothing they could eat.)',
            reply: [
              'You let the spool through the bars and it comes apart into six unequal shares, and for a while there is a wet flagstone street somewhere none of you has ever been.',
              '"Oh," says the Litter, with their mouths full. "That is somebody’s. That is somebody’s good one."',
              'They are quiet afterward in a way they were not before. One of them asks, from the back: "Did they say we could?" and none of the others answers it.'
            ],
            effects: [
              { t: 'item', id: 'strangers_afternoon', n: -1 },
              { t: 'flag', id: 'f2_fed_borrowed' },
              { t: 'sound', id: 'whisper' },
              { t: 'say', text: 'They are fed. It cost you nothing. That is the part that sits oddly.' }
            ]
          },
          {
            id: 'f2_c_litter_go',
            text: 'Tell them it is not six yet.',
            once: false,
            reply: [
              '"It is not six yet," they agree, mournfully, in chorus. "Go through. The crawl is that way. Stoop."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_undercrawl', label: 'The Crawl' }
      ]
    },

    // --------------------------------------------------------------- PEN NINE
    {
      id: 'f2_pen_nine',
      name: 'Pen Nine',
      kind: 'shrine',
      size: 'vault',
      desc: 'The breathing you have heard from every room on this floor is in here, and it is bigger than the pen, and the pen is enormous.',
      props: ['chains', 'bones', 'candles'],
      onEnter: [
        { t: 'say', text: 'It does not come to the bars. It turns its head, which takes a long time, and then holds very still so as not to frighten you.' },
        { t: 'sound', id: 'whisper' }
      ],
      npc: {
        id: 'f2_nine',
        name: 'Nine',
        title: 'The Thing Nobody Names',
        form: 'beast',
        voice: 'low',
        palette: { robe: '#2e1f18', trim: '#c98a5a', skin: '#5a3a28', glow: '#ff9b52' },
        greet: [
          'Something the size of a barn shifts its weight, once, and then deliberately does not shift it again.',
          '"You can come further in," it says. The voice is not loud; it is the quietest thing on this floor. "I frighten people by existing at this scale, and I can do nothing about the scale, so I hold still. It is the only courtesy I have."',
          '"They will have told you not to say my name. There isn’t one. It was going on the collar last, and the Cadence stopped at the collar."'
        ],
        idle: [
          '"Still here," says Nine, holding still. "Still holding."'
        ],
        choices: [
          {
            id: 'f2_c_nine_collar',
            text: 'Pick up the collar from the straw.',
            reply: [
              'It is leather, wide as your two hands, worn soft at one point where a chin rested for two hundred years. The plate on it is blank and has been polished blank by the same chin.',
              '"Take it. Please. It has lain there since they decided a collar with nothing on it was worse than no collar, and they were right, and I cannot pick it up with what I have for hands."',
              '"It is not a sad object. It was going to be a very happy object. Those are different things, and people confuse them."'
            ],
            effects: [
              { t: 'item', id: 'unmade_collar', n: 1 },
              { t: 'flag', id: 'f2_took_collar' },
              { t: 'sound', id: 'chime' },
              { t: 'codex', id: 'f2_collar', title: 'The Collar of the Unmade', text: 'Kennel leather, sized for something enormous, worn soft at one point. The nameplate is blank. It was to be engraved last; the Cadence stopped at the collar, and it was judged crueller to leave a nameless collar on a nameless thing than to leave it in the straw.' }
            ]
          },
          {
            id: 'f2_c_nine_what',
            text: 'Ask what it was going to be.',
            reply: [
              '"A guard. Not for a gate — for a memory. One particular memory, very old and very important, and I was to lie across it and let nothing at it."',
              '"They finished the lying-across. They did not finish telling me which memory." A long, careful breath. "So I have lain across nothing in particular for two hundred years, extremely well."',
              '"I would simply like to have been told what I am for. Accepting that nobody left alive can tell me took a hundred and ten years, and I am proud of it."'
            ],
            effects: [
              { t: 'flag', id: 'f2_nine_story' },
              { t: 'codex', id: 'f2_nine_lore', title: 'What Was In Pen Nine', text: 'A guardian drafted to lie across one specific memory and permit nothing to reach it. The lying-across was completed. The naming of the memory was not. It has therefore guarded nothing, perfectly, for two centuries.' }
            ]
          },
          {
            id: 'f2_c_nine_hunger',
            text: 'Take its hunger onto yourself for a moment.',
            require: { class: ['hollow-saint'] },
            lockedText: '(You would need to be the sort of thing that can carry another’s appetite.)',
            reply: [
              'You do the old work. You open the empty place you carry and you let its hunger come across into you, and for four seconds you understand it completely.',
              'It is not ravenous. That is the thing nobody above has ever understood. It is the hunger of a made bed in an empty house — an arrangement kept perfectly for a guest who was never told the address.',
              '"Oh," says Nine, very quietly. "You shouldn’t. Give it back now." It waits until you do. "Four hundred and sixteen, and nobody has done that. I would like you to know that I noticed."'
            ],
            effects: [
              { t: 'flag', id: 'f2_saint_carried' },
              { t: 'heart', n: 1 },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'Something in you settles that had been jarred loose on the stair.' }
            ]
          },
          {
            id: 'f2_c_nine_borrowed',
            text: 'Unspool the stranger’s afternoon and push it through.',
            require: { items: ['strangers_afternoon'] },
            lockedText: '(You have nothing on you that it could eat.)',
            reply: [
              'It eats. It is careful and quick and it does not let you see it happen, turning its head away like someone with better manners than their circumstances.',
              '"Thank you. That was a Thursday. It belonged to a woman who sold thread, and she is on the seventh floor now, and I have eaten eleven of her afternoons."',
              '"I always know whose it was. That is the part nobody thinks about at Ghyll’s stall. It feeds me. It is only that I have to be full of somebody who never met me."'
            ],
            effects: [
              { t: 'item', id: 'strangers_afternoon', n: -1 },
              { t: 'flag', id: 'f2_fed_borrowed' },
              { t: 'flag', id: 'f2_nine_fed_borrowed' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f2_c_nine_own',
            text: 'Open the tin, and put something of yours in it.',
            require: { items: ['portion_tin', 'tallow_candle'] },
            lockedText: '(A tin, and tallow to seal the rim. Odile told you what a tin wants, and what it costs to fill one.)',
            reply: [
              'You warm the tallow on the brazier and run it round the rim the way she showed you, and then you have to choose, and the choosing is the whole of it.',
              'You take the room. The one with the low ceiling and the good smell and the particular slant of light at four in the afternoon, and whoever was in it, and the name they called you there. You put all of it in the tin and you screw the lid down and your hands are shaking and it is not fear.',
              'Nine takes it the way a dog takes bread from a child — from the very edge, carefully, so as not to touch your fingers.',
              'For about four seconds there is a kitchen in Pen Nine. Then it is gone, and Nine is warm, and you cannot find the room. You know that there was a room. You know that it was good. You cannot get back inside it, and you will not, ever again.',
              '"Oh," says Nine. Its enormous head comes down, slowly, until the blank place where a nameplate was going to go rests on the straw near your feet. "That was yours. That was really yours."',
              '"I’ll keep it. I am very good at keeping. It is the only thing about me they finished."'
            ],
            effects: [
              { t: 'item', id: 'portion_tin', n: -1 },
              { t: 'item', id: 'tallow_candle', n: -1 },
              { t: 'flag', id: 'f2_fed_own' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'Something goes out of you and does not come back, and the floor is warmer for it.' },
              { t: 'codex', id: 'f2_ward_answer', title: 'The Second Ward', text: 'What will you feed? The warrens will accept a bought afternoon, or an empty hand, and let you pass either way. They only open the whole distance for someone who fed one of the drafts a portion rendered from themselves — and who could not, afterwards, get it back.' }
            ]
          },
          {
            id: 'f2_c_nine_leave',
            text: 'Say nothing, and leave it hungry.',
            reply: [
              '"That is all right," says Nine, and means it, because nothing here can lie. "Most do. I would rather be hungry than be the reason somebody emptied their pockets in a kennel."',
              '"Go through the sluice. And do not tell them downstairs that it was sad in here. Everyone comes braced for teeth, and I have got used to the teeth story."'
            ],
            effects: [
              { t: 'flag', id: 'f2_left_nine_hungry' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f2_sluice', label: 'The Pen Drain' }
      ]
    },

    // -------------------------------------------------------------- DEAD END 2
    {
      id: 'f2_midden',
      name: 'The Bone Midden',
      kind: 'deadend',
      size: 'medium',
      desc: 'A heaped slope of small clean bones, none of them from anything that was ever finished, and no breathing at all.',
      props: ['bones', 'rubble'],
      onEnter: [
        { t: 'say', text: 'You cross the threshold and the sound of the floor’s breathing cuts off mid-breath.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'The midden takes its toll at the door, indifferently, and then lets you through the far side as promised. A shortcut is still a shortcut.' },
        { t: 'item', id: 'grey_feather', n: 1 },
        { t: 'gold', n: 12 },
        { t: 'unlock', to: 'f2_undercrawl' },
        { t: 'sound', id: 'unlock' },
        { t: 'flag', id: 'f2_took_midden' }
      ],
      doors: [
        { to: 'f2_undercrawl', locked: true, label: 'The Midden Chute' }
      ]
    },

    // ------------------------------------------------------------------ ALCOVE
    {
      id: 'f2_hush',
      name: 'The Listening Alcove',
      kind: 'branch',
      size: 'tiny',
      desc: 'A dead-end niche that breathes, which on this floor means it is safe, and which takes some getting used to.',
      props: ['pipes', 'sand'],
      onEnter: [
        { t: 'say', text: 'Above you a pipe runs up into the salt, and things that fell through the Vestibule floor have been falling into this niche for two hundred years.' },
        { t: 'gold', n: 20 },
        { t: 'sound', id: 'coin' },
        { t: 'say', text: 'Coins, mostly. Somebody swept them into a corner a long time ago and never came back for them.' },
        { t: 'codex', id: 'f2_alcove', title: 'The Listening Alcove', text: 'A niche beneath a pipe that runs up into the Salt Vestibule. Small dropped things arrive here eventually. Someone gathered them into a corner, tidily, and then stopped gathering.' }
      ],
      doors: []
    },

    // ------------------------------------------------------------- STILLROOM
    {
      id: 'f2_stillroom',
      name: 'The Stillroom',
      kind: 'branch',
      size: 'medium',
      desc: 'A press, a plank, and a machine that renders afternoons down into something a mouth can manage.',
      props: ['machine', 'table', 'shelves'],
      npc: {
        id: 'f2_ollet',
        name: 'Ollet',
        title: 'the Portion, in Person',
        form: 'construct',
        voice: 'bell',
        palette: { robe: '#3a4a4a', trim: '#d8c9a8', glow: '#ffe0a0' },
        greet: [
          'The thing working the press is the shape of a person assembled by someone who had only ever had a person described to them, and who took very good notes.',
          '"Two drams," it says, without greeting. "Two drams is a portion. I am the subroutine that decided that, eleven million times."',
          '"Ollet. A measure with nothing left to measure grows a face. I do not recommend it and I would not undo it."'
        ],
        idle: [
          '"Two drams," says Ollet, comfortably. "Two drams."'
        ],
        choices: [
          {
            id: 'f2_c_ollet_press',
            text: 'Ask how the press works.',
            reply: [
              '"A remembering goes in the hopper and comes out flat and cold and edible and slightly less. You lose a tenth, and the tenth is the part where you were actually there."',
              '"Which is why a rendered portion is safe to hand out, and why it feeds thinly. They eat and stay hungry. Odile knows why, and does it anyway, because the alternative is the thing she will not do."'
            ],
            effects: [
              { t: 'flag', id: 'f2_knows_press' },
              { t: 'codex', id: 'f2_press', title: 'On Rendering', text: 'The stillroom press flattens a remembering into a portion. About a tenth is lost, and the tenth that is lost is the part where you were present. This makes a portion safe to give away and thin to eat. A thing fed on rendered portions stays hungry indefinitely.' }
            ]
          },
          {
            id: 'f2_c_ollet_unrendered',
            text: 'Ask what an unrendered portion would do.',
            require: { flags: ['f2_knows_press'] },
            lockedText: '(You would have to understand the press first.)',
            reply: [
              '"Feed one. Properly. Once and for good. Not through the hopper, or it is thin again — straight from the person into the mouth, out of a tin sealed with warm tallow. Ghyll wants fifteen."',
              'A pause of exactly two drams’ length. "I should say the other part. An unrendered portion does not come back. Not diminished. Gone. I have measured a great many things and never one that came back."'
            ],
            effects: [
              { t: 'flag', id: 'f2_knows_unrendered' },
              { t: 'sound', id: 'chime' },
              { t: 'codex', id: 'f2_unrendered', title: 'On Unrendered Feed', text: 'A memory given whole — never through the press, never bare-handed, always from a tallow-sealed tin — feeds a draft completely and permanently. It also leaves the giver for good. Ollet, who has measured eleven million things, has never measured one coming back.' }
            ]
          },
          {
            id: 'f2_c_ollet_script',
            text: 'Read the stamped plate on the press housing.',
            reply: [
              'The letters have half forgotten themselves, but the shape of an issue-order is still there, two hundred years old, with the last line struck through by a different hand.',
              'PENS 1–12 TO FEED AT SIX. PEN 9 TO FEED AT SIX AND AGAIN AT MIDNIGHT, SUBJECT BEING LARGER. PEN 9 FEED SUSPENDED PENDING ASSIGNMENT OF SUBJECT.',
              '"That line is older than me," says Ollet, pleasantly. "Pending. Two hundred years pending. I do like a word that keeps working after everyone has gone home."'
            ],
            effects: [
              { t: 'flag', id: 'f2_read_order' },
              { t: 'codex', id: 'f2_order', title: 'Kennel Issue-Order', text: 'PEN 9 FEED SUSPENDED PENDING ASSIGNMENT OF SUBJECT. Struck through by a second hand. The assignment was never made; the suspension was never lifted; the thing in Pen Nine has therefore been, on paper, correctly handled for two hundred years.' }
            ]
          },
          {
            id: 'f2_c_ollet_larder',
            text: 'Ask about the cold larder.',
            reply: [
              '"Do not. It does not breathe. There is one portion on a shelf in it, there since before the stop. I can give you its weight to the dram and not whose it was."',
              '"People go in and come out with it. It is worth having, and the room takes a heartbeat for it. I want it noted that I told you the price first."'
            ],
            effects: [
              { t: 'flag', id: 'f2_warned_larder' }
            ]
          },
          {
            id: 'f2_c_ollet_on',
            text: 'Go on through.',
            once: false,
            reply: [
              '"Two drams," says Ollet, agreeably. "Whelping room is through and down. Mind your head, it does not measure heads."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_whelping', label: 'The Whelping Room' },
        { to: 'f2_larder', label: 'The Cold Larder' }
      ]
    },

    // -------------------------------------------------------------- DEAD END 3
    {
      id: 'f2_larder',
      name: 'The Cold Larder',
      kind: 'deadend',
      size: 'small',
      desc: 'Shelves, cold, and one portion left out for somebody who did not come back for it.',
      props: ['shelves', 'rubble'],
      onEnter: [
        { t: 'say', text: 'No breathing. The cold in here is not temperature; it is the tower having stopped caring at this exact wall.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'item', id: 'memory_of_bread', n: 1 },
        { t: 'say', text: 'You take the portion off the shelf. It is real, and it is good, and it cost you a heartbeat, and Ollet did tell you.' },
        { t: 'move', to: 'f2_stillroom' },
        { t: 'flag', id: 'f2_robbed_larder' }
      ],
      doors: []
    },

    // -------------------------------------------------------------- WHELPING
    {
      id: 'f2_whelping',
      name: 'The Whelping Room',
      kind: 'branch',
      size: 'medium',
      desc: 'Low, hot, and lined with nests, most of them empty and all of them kept ready.',
      props: ['cages', 'candles', 'water'],
      npc: {
        id: 'f2_hessel',
        name: 'Hessel',
        title: 'the Dam of Drafts',
        form: 'twin',
        voice: 'mid',
        palette: { robe: '#5c3b3b', trim: '#e8b898', skin: '#c08a6a', glow: '#ff9e8a' },
        greet: [
          'She has two of several things and one of several others, and she is turning straw over in a nest that has nothing in it.',
          '"Keep it ready," she says. "That is the job. The Cadence stopped mid-litter and left me holding the middle, and the middle of a litter is a room that has to stay warm."',
          '"Eleven nests, two hundred years, for animals never begun. You may think that foolish. Say it out loud if you do; it sounds different out loud."'
        ],
        idle: [
          '"Still warm," says Hessel, turning straw. "Still ready."'
        ],
        choices: [
          {
            id: 'f2_c_hessel_nests',
            text: 'Ask about the empty nests.',
            reply: [
              '"Eleven of them are for nothing. Knowing that is not the same as letting the straw go cold."',
              '"The twelfth had something in it. It went down to Pen Nine when it outgrew the room, in eight days. It cannot fit back up the passage and I cannot fit down the drain. That has held for two centuries."',
              'She turns the straw. "I do not find it tragic. I find it inconvenient. Tragic is a word for people with the leisure."'
            ],
            effects: [
              { t: 'flag', id: 'f2_hessel_nine' },
              { t: 'codex', id: 'f2_whelp', title: 'The Twelfth Nest', text: 'The thing in Pen Nine was whelped in the warren’s twelfth nest and outgrew the room in eight days. It has never come back up the passage; the Dam has never got down the drain. She keeps its straw turned regardless, which she declines to call tragic.' }
            ]
          },
          {
            id: 'f2_c_hessel_help',
            text: 'Help her turn the straw.',
            reply: [
              'It is hot, dull work and she does not thank you for it, and halfway through she starts talking about drainage, at length, and it becomes clear that this is how she thanks people.',
              'At the end she digs in the seam of the wall and comes out with a handful of coin, green and soft with age.',
              '"Petitioner money. Four generations of it, dropped in the straw and never missed." She presses it on you. "If you get as far as the pen at the bottom, tell it the straw is turned. It will not answer. Tell it anyway."'
            ],
            effects: [
              { t: 'gold', n: 16 },
              { t: 'flag', id: 'f2_turned_straw' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f2_c_hessel_finished',
            text: 'Ask what happened to the ones that were finished.',
            reply: [
              'She stops turning straw. Both of her sets of hands stop at once, which is worse to watch than it sounds.',
              '"I won’t. Not because it is a secret — because I would have to say it in order, and I cannot begin it and stop partway, and I have a room to keep warm."',
              'She goes back to the straw. "Ask Pell at the grate. Pell can say things in order."'
            ],
            effects: [
              { t: 'flag', id: 'f2_asked_finished' }
            ]
          },
          {
            id: 'f2_c_hessel_on',
            text: 'Leave her to the straw.',
            once: false,
            reply: [
              '"Down and along. Stoop for the crawl. Everything stoops for the crawl, including, I am told, the crawl."'
            ],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f2_undercrawl', label: 'The Crawl' }
      ]
    },

    // ------------------------------------------------------------ UNDER-CRAWL
    {
      id: 'f2_undercrawl',
      name: 'The Under-Crawl',
      kind: 'corridor',
      size: 'hall',
      desc: 'The ceiling comes down until you are on your hands, and the floor is warm, and something is asleep directly above you.',
      props: ['pipes', 'roots'],
      onEnter: [
        { t: 'say', text: 'Every passage on this floor arrives here eventually. The tower was efficient about exactly one thing.' },
        { t: 'sound', id: 'stone' }
      ],
      doors: [
        { to: 'f2_sluice', label: 'The Sluice' },
        { to: 'f2_grate', label: 'The Grate Room' }
      ]
    },

    // ------------------------------------------------------------------ SLUICE
    {
      id: 'f2_sluice',
      name: 'The Sluice',
      kind: 'branch',
      size: 'small',
      desc: 'Warm water runs through a brass channel carrying things that are nearly thoughts, and a machine stands over it, straining.',
      props: ['water', 'machine', 'pipes'],
      npc: {
        id: 'f2_sluicegate',
        name: 'The Sluicegate',
        title: 'a Function, Still Functioning',
        form: 'construct',
        voice: 'dry',
        palette: { robe: '#2f3f44', trim: '#a8d8d0', glow: '#9fe4ff' },
        greet: [
          'It has been straining the channel for two hundred years and it does not stop to talk to you, which is not rudeness; it is the job, and the job is the entire personality.',
          '"Leavings," it says. "What the pens do not finish comes down. Coarse goes back to Odile. Fine goes into the pipe."',
          '"The pipe goes to Scrap Row. Yes. I was not asked to have a view and have declined to develop one."'
        ],
        idle: [
          '"Straining," says the Sluicegate. "Still coarse. Still fine."'
        ],
        choices: [
          {
            id: 'f2_c_sluice_ask',
            text: 'Ask what comes down most often.',
            reply: [
              '"Beginnings. Drafts cannot finish what they eat, so what comes down is the last half of something. Weddings without the walk in."',
              '"Nine has never sent anything down. In two hundred years, nothing. It finishes what it is given. I mention it because nobody asks about Nine except to be frightened, which is a poor use of a question."'
            ],
            effects: [
              { t: 'flag', id: 'f2_sluice_lore' },
              { t: 'codex', id: 'f2_sluice_codex', title: 'The Sluice', text: 'What the drafts leave runs down a brass channel and is strained: the coarse goes back to the feeding floor, the fine goes up a pipe to Scrap Row and is sold. Pen Nine has never sent anything down. It finishes what it is given.' }
            ]
          },
          {
            id: 'f2_c_sluice_shape',
            text: 'Take the true shape of the warren.',
            require: { class: ['cartographer'] },
            lockedText: '(You would need an instrument that measures where you are by how wrong you feel about it.)',
            reply: [
              'The astrolabe turns twice and settles, and the shape of the floor arrives all at once: not a warren at all. A ring of pens around one enormous central chamber, and every passage bent deliberately so that you are always walking around Pen Nine and never towards it.',
              '"Correct," says the Sluicegate, straining. "The floor was built to hold one thing and route everything else past it. I would not have volunteered that. You measured it, and measuring is legitimate."',
              'It hooks something out of the channel and hands it over without breaking rhythm. "Coarse. Not mine to keep."'
            ],
            effects: [
              { t: 'item', id: 'quiet_coin', n: 1 },
              { t: 'flag', id: 'f2_mapped_warren' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f2_c_sluice_on',
            text: 'Leave it straining.',
            once: false,
            reply: [
              '"Grate room is along the crawl. Pell will be at the book. Pell is always at the book."'
            ],
            effects: []
          }
        ]
      },
      doors: []
    },

    // ------------------------------------------------------------- GRATE ROOM
    {
      id: 'f2_grate',
      name: 'Before the Grate',
      kind: 'branch',
      size: 'medium',
      desc: 'A heavy grate, a small table, a very large book, and a woman in kennel armour who has been holding a pen for a long time.',
      props: ['chains', 'table', 'candles'],
      npc: {
        id: 'f2_pell',
        name: 'Pell',
        title: 'Warden of the Book',
        form: 'armored',
        voice: 'mid',
        palette: { robe: '#3c4450', trim: '#d8c078', skin: '#c8a888', glow: '#ffd28a' },
        greet: [
          'She has the book open at a page with a great deal of space left on it, and she is not writing.',
          '"Pell. I keep the book of what got finished." She turns it so you can see: one hundred and four names, and the rest blank. "One hundred and four in two hundred years."',
          '"A thing goes in when someone gives it a name and means it. A named thing is a finished thing, or near enough that the difference stops mattering to whoever has to live with it."'
        ],
        idle: [
          '"One hundred and four," says Pell, holding the pen. "The book is open."'
        ],
        choices: [
          {
            id: 'f2_c_pell_book',
            text: 'Ask what happened to the ones that were finished.',
            reply: [
              '"They left. That is all. A finished thing does not need a kennel. I watched thirty go, none looked back, and I did not take it personally."',
              '"Hessel cannot say it because she says things in order, and the order starts with the eleven never begun. I am at the end, and the end is fine. It is the middle nobody gets through out loud."'
            ],
            effects: [
              { t: 'flag', id: 'f2_pell_book' },
              { t: 'codex', id: 'f2_book', title: 'The Book of Finished Things', text: 'One hundred and four entries in two hundred years. A draft is entered when someone gives it a name and means it, at which point it stops needing a kennel and leaves. The Warden has watched thirty go and reports that none of them looked back, and that this is fine.' }
            ]
          },
          {
            id: 'f2_c_pell_name',
            text: 'Give her a name for the litter in Pen Three.',
            require: { notFlags: ['f2_fed_own'] },
            lockedText: '(You reach for the name — the one from the room with the good light, the dog you had, the word you called it. The place where it was is smooth. You gave it to Pen Nine.)',
            reply: [
              'You give her the name. It comes up easily, out of a warm room with a low ceiling — a dog you had, a word you shouted across a yard a long way above this one.',
              'Pell writes it down. She writes slowly, and she says it aloud as she writes, and somewhere back along the crawl six voices that are nearly six dogs stop talking all at once.',
              '"One hundred and five," she says. "That is the first one this generation. Take this — kennel issue, it calls things that are listening, and they are all listening now."'
            ],
            effects: [
              { t: 'item', id: 'bone_whistle', n: 1 },
              { t: 'gold', n: 20 },
              { t: 'flag', id: 'f2_named_litter' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'Somewhere behind you, for the first time in two hundred years, it is six o’clock.' }
            ]
          },
          {
            id: 'f2_c_pell_nine',
            text: 'Ask her to write a name for Pen Nine.',
            reply: [
              '"I have asked four hundred and sixteen people. Nobody ever had one to spare that was big enough, and a small name on that would be worse than the blank plate."',
              '"And it will not take one from me. It says — I am quoting — that a name given out of pity is a portion given off the hand, and would stick to me, and I have a book to keep."',
              'She closes the book and opens it again. "So the plate stays blank."'
            ],
            effects: [
              { t: 'flag', id: 'f2_asked_nine_name' }
            ]
          },
          {
            id: 'f2_c_pell_open',
            text: 'Ask her to open the grate.',
            reply: [
              'She puts the pen down across the open page, which she has clearly done four hundred and sixteen times, and hauls the counterweight.',
              '"The stair is warm all the way down. That is Nine — it lies along the stairwell wall and will hold very still as you pass, so as not to frighten you."',
              '"Say something to it on the way, if you have anything left. It does not need you to. It just notices."'
            ],
            effects: [
              { t: 'unlock', to: 'f2_exit' },
              { t: 'sound', id: 'unlock' },
              { t: 'flag', id: 'f2_grate_open' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f2_exit', locked: true, label: 'The Grate' }
      ]
    },

    // ------------------------------------------------------------------- EXIT
    {
      id: 'f2_exit',
      name: 'The Warm Stair',
      kind: 'exit',
      size: 'small',
      desc: 'The steps go down into the dark, and one wall of the stairwell rises and falls, slowly, as you pass it.',
      props: ['stairs', 'hanginglights'],
      onEnter: [
        { t: 'say', text: 'The wall beside you is breathing. It holds perfectly still as you come level with it, and then resumes once you are past.' },
        { t: 'sound', id: 'whisper' }
      ],
      npc: {
        id: 'f2_stairward',
        name: 'The Stair',
        title: 'Which Was Also Started',
        form: 'wisp',
        voice: 'bell',
        palette: { robe: '#2a2018', trim: '#ffcf8a', glow: '#ffb46b' },
        greet: [
          'The stair is only finished for the first nine steps. After that it is an intention about steps, which holds, and which you will have to trust.',
          '"Ward the Second," it says. "What will you feed. You have already answered it; the asking is a formality and I do the formality because it is what I have instead of a banister."'
        ],
        idle: [
          '"Down," says the stair. "Still down."'
        ],
        choices: [
          {
            id: 'f2_c_exit_token',
            text: 'Go down past the breathing wall, lighter than you came.',
            require: { flags: ['f2_fed_own'] },
            lockedText: '(You would have to have given one of them something that was yours.)',
            reply: [
              'You go down. The wall beside you is warm and enormous and holds still for you the whole way, out of courtesy, and does not ask for anything else.',
              'Somewhere far above, in a room you cannot picture any more, there is a good slant of light at four in the afternoon. You know it is there. You cannot go in.',
              'At the ninth step the stair says, quietly: "It is keeping it. It is very good at keeping. That is what it was for, and now it has one, and you did that."',
              'Something small and hexagonal and black is warm in your hand, with one word fired into it edge-on, where only somebody who already knows it could read it.'
            ],
            effects: [
              { t: 'sound', id: 'bell' },
              { t: 'floorEnd', token: true }
            ]
          },
          {
            id: 'f2_c_exit_bought',
            text: 'Go down, having fed them out of somebody else’s pocket.',
            require: { flags: ['f2_fed_borrowed'] },
            lockedText: '(You did not put anything in any mouth down here.)',
            reply: [
              '"They are fed," says the stair. "That is true and it counts. A woman on the seventh floor is eleven afternoons lighter, and she agreed, and it still went through your hands on the way."',
              '"The Ward has opened. It opens for an answer, not a good one. Go down."'
            ],
            effects: [
              { t: 'sound', id: 'stone' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f2_c_exit_empty',
            text: 'Go down with everything you came in with.',
            reply: [
              '"Nothing given," says the stair, without judgement, having no apparatus for it. "That is an answer. Most answers are that one."',
              '"They will be hungry tomorrow, and Odile will divide thin feed by four, and the count will be wrong, and she will start again. None of that is your doing, and none of it is undone by you."',
              'You go past the breathing wall. It holds still for you anyway.'
            ],
            effects: [
              { t: 'sound', id: 'stone' },
              { t: 'floorEnd' }
            ]
          }
        ]
      },
      doors: []
    }

  ]
};

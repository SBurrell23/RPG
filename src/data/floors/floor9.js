// Floor 9 — The Storm Ledger
// Ward the Ninth — What will you pay?

export default {
  id: 9,
  name: 'The Storm Ledger',
  theme: 'storm',
  subtitle: 'Ward the Ninth — What will you pay?',
  intro: 'Nine floors down, the ceiling is gone. There is black cloud to every horizon and rain coming down hard on flagstones that have not been dry in two hundred years. Somewhere out in it, a book is being kept.',
  entry: 'f9_entry',

  items: {
    bottled_lightning: {
      name: 'Lightning in a Jar',
      kind: 'relic', value: 55, icon: 'vial', tint: '#cfe4ff',
      desc: 'A fork of white bent double to fit, held at the instant before it arrives. The glass is cold and the stopper is warm. It has not struck yet and it is extremely willing to.'
    },
    oilcloth_shroud: {
      name: 'Chandler’s Oilcloth',
      kind: 'tool', value: 30, icon: 'thread', tint: '#6f7a5e',
      desc: 'Waxed six times, stinks of it, keeps one person dry from the collar down. Does not keep anything else off you.'
    },
    one_dry_thing: {
      name: 'One Dry Thing',
      kind: 'consumable', value: 14, icon: 'cup', tint: '#f0e0b4',
      desc: 'A folded square of linen that has never been wet and refuses, on principle, to start. Holding it is disproportionately comforting.'
    },
    province_name: {
      name: 'The Name of a Quiet Province',
      kind: 'relic', value: 65, icon: 'bell', tint: '#b8c8ff',
      desc: 'Four syllables in a shape you can hold. Nobody who lives there can say it any more. It is warm, like something small that has been asleep.'
    },
    dry_year: {
      name: 'One Dry Year',
      kind: 'relic', value: 400, icon: 'star', tint: '#ffd79a',
      desc: 'Twelve months of no weather at all, sealed at both ends. The chandler will not come down on the price and has not, in two hundred years, needed to.'
    }
  },

  rooms: [

    // ---------------------------------------------------------------- ENTRY
    {
      id: 'f9_entry',
      name: 'The Weather Door',
      kind: 'entry',
      size: 'large',
      desc: 'The stair lets out under open sky, and the sky is wrong, and it is raining on you anyway.',
      props: ['rain', 'pillars', 'rubble'],
      onEnter: [
        { t: 'say', text: 'Nine floors of stone above you, and cloud above that.' },
        { t: 'sound', id: 'water' }
      ],
      npc: {
        id: 'f9_awning',
        name: 'The Awning',
        title: 'a Roof, Retired',
        form: 'construct',
        voice: 'dry',
        palette: { robe: '#2b3440', trim: '#8fa6bd', skin: '#9aa7b5', glow: '#a8c4ff' },
        greet: [
          'A frame of black iron ribs stands over the stairhead, holding up nothing. Rain falls through where its canvas used to be and lands on you.',
          '“I am aware you are getting wet. I want that acknowledged at the outset so we can move past it.”',
          '“I was a roof. I am now a shape that used to be a roof. There is a difference and I am living in it.”'
        ],
        idle: [
          '“Still raining. It does that.”',
          '“You may stand under me. It will not help.”'
        ],
        choices: [
          {
            id: 'f9_c_awn_sky',
            text: 'Ask why there is a sky down here.',
            reply: [
              '“There isn’t. What you are looking at is exhaust. Remembering is work, work makes waste, and the waste has to go somewhere. It comes up this shaft, it cools, it becomes weather.”',
              '“Every storm here is a quantity of forgetting being thrown away. Not a figure of speech — a measurement. Someone is out in it doing the measuring, and I have never once seen her sheltered.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_knows_exhaust' },
              {
                t: 'codex', id: 'f9_exhaust', title: 'On Weather, and Where It Comes From',
                text: 'The ninth floor has no roof because it has a chimney. The Cadence circulates the world’s memory; circulation generates waste; the waste vents upward through the Storm Ledger and becomes cloud, rain and strike. Each storm is a measured quantity of forgetting, disposed of. It is disposed of somewhere. It is never disposed of nowhere.'
              }
            ]
          },
          {
            id: 'f9_c_awn_where',
            text: 'Ask where the ways go.',
            reply: [
              '“Three. Left along the colonnade, where a person is sitting who is the only genuinely honest thing on this floor. Right under the lit awning, where there is a shop I will not praise. Straight on down the gauge walk to the open field, where the rain is itemised — that is the shortest way to the book.”',
              '“And a warning, because you will not get another. Past the broken arcade a stair goes up to nothing. It has been struck forty thousand times. It is still standing and you will not be. Everyone goes up it for the view.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_warned_stair' },
              { t: 'sound', id: 'stone' }
            ]
          },
          {
            id: 'f9_c_awn_shape',
            text: 'Take the true shape of the ledger floor.',
            require: { class: ['cartographer'] },
            lockedText: '(You would need to feel where the walls actually are.)',
            reply: [
              'The astrolabe turns in your hand and keeps turning, which it does not do.',
              '“Yes. A hexagon nine hundred feet across, and also a shaft eleven feet across, and both true. Take the stone — it knows where the yard is when the rain gets loud enough to lose it in.”'
            ],
            effects: [
              { t: 'item', id: 'lodestone', n: 1 },
              { t: 'flag', id: 'f9_true_shape' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f9_c_awn_stand',
            text: 'Stand under it a while anyway.',
            reply: [
              'You stand under the ribs. The rain comes through exactly as it would if they were not there.',
              '“Thank you,” it says at last. “That is what I am for now. You may go.”'
            ],
            effects: [
              { t: 'say', text: 'The iron creaks, pleased, uselessly.' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_colonnade', label: 'The Colonnade Walk' },
        { to: 'f9_chandlery', label: 'The Lit Awning' },
        { to: 'f9_gauge_walk', label: 'The Gauge Walk' }
      ]
    },

    // ------------------------------------------------------------ COLONNADE
    {
      id: 'f9_colonnade',
      name: 'The Long Colonnade',
      kind: 'branch',
      size: 'hall',
      desc: 'Two rows of pillars holding up weather. Between them, the only dry six feet on the floor, and someone sitting in it.',
      props: ['pillars', 'rain', 'rubble'],
      npc: {
        id: 'f9_hessel',
        name: 'Hessel Vane',
        title: 'the One Who Turned Around',
        form: 'robed',
        voice: 'mid',
        palette: { robe: '#4a3f34', trim: '#c9b27a', skin: '#d6bfa4', glow: '#ffcf8a' },
        greet: [
          'A woman in a Petitioner’s oilcloth sits against a pillar, boots off, feet up on a stone that is out of the rain by a handspan.',
          '“Before you work up to it: I got to the yard. I read the book. I understood what the rain was. Then I walked back here and sat down, and I have been sitting down eleven years, and I am not ashamed.”',
          '“You may find that annoying. Most do. Sit anyway, you are letting the dry out.”'
        ],
        idle: [
          '“Tea’s gone. Tea was always gone. Sit down.”',
          '“Still not ashamed. Check again tomorrow.”'
        ],
        choices: [
          {
            id: 'f9_c_hes_saw',
            text: 'Ask what she saw in the yard.',
            reply: [
              '“A book big as a door, open in the rain, the rain not touching the page. Every storm gets a line. Wind, so much. Water, so much. Light, so much. And a fourth line I did not understand until I read the bottom.”',
              '“At the bottom of every page there is a word and a place. CHARGE TO. And then a name.” She drinks nothing from an empty cup. “It is not the tower’s name.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_heard_the_bottom' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f9_c_hes_why',
            text: 'Ask why she stopped.',
            reply: [
              '“Because I did the arithmetic and I could afford it. That is the part nobody believes. I could have settled one storm and gone down with black glass in my pocket, feeling extremely good about myself.”',
              '“And I thought: the next storm gets charged where it always was, the province thins by exactly as much as it was going to, and the only thing changed is how I feel. I could not do a thing that was only about how I feel.”',
              '“It is an argument, it is a good one, and it is also why I am eleven years in a colonnade with no boots on. Take both.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_hessels_argument' },
              {
                t: 'codex', id: 'f9_hessel', title: 'Hessel Vane’s Objection',
                text: 'That paying for one storm changes nothing except the payer. Held by a woman who got further than almost anyone and stopped on purpose. The Verrow does not lie, and it also does not settle arguments.'
              }
            ]
          },
          {
            id: 'f9_c_hes_advice',
            text: 'Ask her advice, plainly.',
            reply: [
              '“Good. Nobody asks. One: the lee wall looks like shelter. It is a pressure trap, and it will take something off you that you will not be able to name. Two: under the counting house is an overflow drain, same mistake, wetter. If you must be an idiot, be an idiot in the drain — it leaves you something to sell.”',
              '“Three, the useful one. The gauge walk has a shuttered grate with no handle. There is a lip underneath, a foot in from the left post. Two fingers, lift with your legs. The chandler sells that sentence for twenty-five gold. I give it to you because I do not like her.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_warned_deadends' },
              { t: 'unlock', to: 'f9_counting_house' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f9_c_hes_bread',
            text: 'Ask if she wants anything.',
            reply: [
              '“No, and I know how that sounds. I want you to eat something. Nine floors — you will have been living on the idea of meals.”',
              'She hands you a fold of cloth with nothing in it and the undeniable recollection of bread.'
            ],
            effects: [
              { t: 'item', id: 'memory_of_bread', n: 1 },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f9_c_hes_choir',
            text: 'Tell her what you said in the Choir.',
            require: { flags: ['f7_said_name'] },
            reply: [
              'She listens to all of it without moving. The rain fills in around the words.',
              '“Thin walls. I said mine to a mirror on the seventh and the mirror agreed with me, which I have never forgiven it for.” She digs in her pack. “Carried eleven years for someone who said a true thing in front of me. It stays lit in the rain. Don’t ask.”'
            ],
            effects: [
              { t: 'item', id: 'tallow_candle', n: 1 },
              { t: 'item', id: 'one_dry_thing', n: 1 },
              { t: 'sound', id: 'fire' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_lee_wall', label: 'The Lee Wall' },
        { to: 'f9_windward', label: 'The Windward Stair' }
      ]
    },

    // ------------------------------------------------------------- CHANDLERY
    {
      id: 'f9_chandlery',
      name: 'The Storm-Chandlery',
      kind: 'shop',
      size: 'medium',
      desc: 'The only lamplight on the floor, hung under the only intact piece of roof, and it is for sale by the hour.',
      props: ['shelves', 'hanginglights', 'table'],
      npc: {
        id: 'f9_oake',
        name: 'Perrin Oake',
        title: 'Storm-Chandler',
        form: 'hunched',
        voice: 'high',
        palette: { robe: '#3e3a2c', trim: '#e0b455', skin: '#c9a986', glow: '#ffc76a' },
        greet: [
          'A small dry woman behind a counter of crates, under six lamps, in a downpour that stops one inch outside her eaves as though it has been billed for the privilege.',
          '“Wet,” she says. “Cold. Nine floors of it. I sell oilcloth, lightning, candle, rope, and dry.”',
          '“Terms, once: I do not haggle, I do not give credit, I am not moved. Tell me your story and the price will be the same at the end of it. That is the kindness. Everyone else down here takes your story as payment and gives you nothing.”'
        ],
        idle: [
          '“Still open. Still expensive.”',
          '“You are dripping on the rope.”'
        ],
        choices: [
          {
            id: 'f9_c_oake_shop',
            text: 'Trade.',
            once: false,
            reply: [
              '“Look all you like. Touching is buying.”'
            ],
            effects: [
              {
                t: 'shop',
                stock: [
                  { item: 'one_dry_thing', price: 16 },
                  { item: 'tallow_candle', price: 14 },
                  { item: 'rope_coil', price: 22 },
                  { item: 'vial_of_still_water', price: 30 },
                  { item: 'oilcloth_shroud', price: 34 },
                  { item: 'bottled_lightning', price: 55 },
                  { item: 'storm_receipt', price: 95 },
                  { item: 'dry_year', price: 400 }
                ],
                buys: [
                  { item: 'salt_shard', price: 16 },
                  { item: 'grey_feather', price: 14 },
                  { item: 'ledger_stub', price: 22 },
                  { item: 'chalk_stub', price: 4 },
                  { item: 'drowned_page', price: 28 },
                  { item: 'stopped_tooth', price: 32 },
                  { item: 'quiet_coin', price: 44 },
                  { item: 'province_name', price: 60 }
                ]
              },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f9_c_oake_year',
            text: 'Ask about the year in the case.',
            reply: [
              '“One dry year. Twelve months, sealed both ends, no weather in it at all. Four hundred, and I have had it in that case two hundred years and never needed to sell it.”',
              '“They all say nobody could afford that. Someone could. A thing nobody could afford is just a thing. A thing one person in a generation could afford is a question.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_saw_the_year' }
            ]
          },
          {
            id: 'f9_c_oake_lightning',
            text: 'Ask what a jar of lightning is for.',
            reply: [
              '“Paying with. The roofless chapel keeps the light line and will not take gold for it, because light isn’t a gold sort of thing. You want a strike stoppered before it lands.”',
              '“Fifty-five off me. There is a child on the windward terrace who does it for twenty, because she catches them with a kite. Go to the child. You would find out anyway and then be annoyed at me, and that slows the queue.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_knows_lightning' },
              { t: 'sound', id: 'crack' }
            ]
          },
          {
            id: 'f9_c_oake_shutter',
            text: 'Buy the trick of the shuttered grate.',
            require: { gold: 25, notFlags: ['f9_warned_deadends'] },
            lockedText: '(Twenty-five gold. She will not come down.)',
            reply: [
              '“Underside lip, one foot in from the left post, lift with the legs. Twenty-five gold for eleven words, and you will get your money’s worth, which is more than most things down here manage.”'
            ],
            effects: [
              { t: 'gold', n: -25 },
              { t: 'unlock', to: 'f9_counting_house' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f9_c_oake_pity',
            text: 'Tell her how far you have come.',
            reply: [
              '“Nine floors. Salt, the kennels, the flood, the forge, garden, clocks, the choir, all those dead nobles. I have heard it nine hundred times, it was true every time, and I am sorry for all nine hundred.”',
              'She does not move toward the shelves. “And the oilcloth is still thirty-four. Those two sit next to each other in me quite comfortably. Learn that trick before you talk to the woman with the book.”'
            ],
            effects: [
              { t: 'say', text: 'She is not being cruel. That is somehow worse.' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_broken_arcade', label: 'The Broken Arcade' }
      ]
    },

    // ------------------------------------------------------------ GAUGE WALK
    {
      id: 'f9_gauge_walk',
      name: 'The Gauge Walk',
      kind: 'corridor',
      size: 'hall',
      desc: 'A causeway lined with brass instruments, all of them still reading, none of them read.',
      props: ['machine', 'rain', 'pipes'],
      onEnter: [
        { t: 'say', text: 'Forty gauges. Forty needles, all high, all climbing.' },
        { t: 'sound', id: 'gear' },
        {
          t: 'codex', id: 'f9_gauges', title: 'The Gauge Walk',
          text: 'Instruments for measuring an outflow, installed to warn an operator. There has been no operator for two hundred years, so they have spent two centuries being extremely alarmed in an empty corridor, accurately.'
        }
      ],
      doors: [
        { to: 'f9_rain_field', label: 'The Open Field' },
        { to: 'f9_weathervane', label: 'The Vane Court' },
        { to: 'f9_counting_house', locked: true, label: 'The Shuttered Grate' }
      ]
    },

    // ------------------------------------------------------------- VANE COURT
    {
      id: 'f9_weathervane',
      name: 'The Vane Court',
      kind: 'branch',
      size: 'medium',
      desc: 'A ring of stone figures on poles, each one turned to face the same wind, which is not blowing.',
      props: ['statue', 'rain', 'banners'],
      onEnter: [
        { t: 'say', text: 'Twelve vanes. Eleven point outward. One points down.' },
        { t: 'item', id: 'grey_feather', n: 1 },
        { t: 'flag', id: 'f9_saw_the_vanes' },
        {
          t: 'codex', id: 'f9_vanes', title: 'The Twelve Vanes',
          text: 'One for each province the Cadence served. Eleven turn with the weather. The twelfth has pointed straight down, at the tower, for eleven years, and nobody on this floor will say what that means, though several of them plainly know.'
        }
      ],
      doors: [
        { to: 'f9_windward', label: 'The Terrace Steps' }
      ]
    },

    // ------------------------------------------------------------ RAIN FIELD
    {
      id: 'f9_rain_field',
      name: 'The Itemised Rain',
      kind: 'hub',
      size: 'grand',
      desc: 'Open ground, open sky, and rain falling in columns with gaps between them, like writing.',
      props: ['rain', 'water', 'rubble'],
      onEnter: [
        { t: 'say', text: 'The rain is not falling evenly. It is falling in columns, with margins.' },
        { t: 'sound', id: 'water' },
        {
          t: 'codex', id: 'f9_itemised', title: 'Itemised Rain',
          text: 'Stand in the open field and look up long enough and the downpour resolves into ruled columns with margins between them. Wind. Water. Light. And a fourth, narrower column that falls harder than the others and that nobody standing under it enjoys.'
        }
      ],
      doors: [
        { to: 'f9_shape_room', label: 'The Sheeting Dark' },
        { to: 'f9_cistern', label: 'The Sounding Cistern' },
        { to: 'f9_deluge_walk', label: 'The Deluge Walk' }
      ]
    },

    // --------------------------------------------------------- COUNTING HOUSE
    {
      id: 'f9_counting_house',
      name: 'The Counting House',
      kind: 'vault',
      size: 'medium',
      desc: 'Dry, at last, and stacked floor to ceiling with two hundred years of paper that has never been asked for.',
      props: ['shelves', 'table', 'candles'],
      npc: {
        id: 'f9_prill',
        name: 'Sub-Clerk Prill',
        title: 'Copies, Duplicates and Carbon',
        form: 'hunched',
        voice: 'broken',
        palette: { robe: '#3a3548', trim: '#b8a9d8', skin: '#cbbfae', glow: '#c9b6ff' },
        greet: [
          'A narrow man at a standing desk copies a line onto a second page, and then a third, with the care of someone who has never been told to stop.',
          '“Copy for the yard, duplicate for the file, carbon for the bearer. No bearer has called for a carbon in two hundred and six years. I make it anyway. Not stubbornness. Procedure.”',
          '“You are a bearer. Technically. Do not get excited, it is a very low grade of bearer.”'
        ],
        idle: [
          '“Copy. Duplicate. Carbon. Copy. Duplicate—”',
          '“The file is behind you. Do not lean on the file.”'
        ],
        choices: [
          {
            id: 'f9_c_prill_receipt',
            text: 'Ask for your carbon.',
            reply: [
              'His hand stops. It is the first time it has stopped. “You are calling for a carbon. Two hundred and six years.”',
              'He lifts a sheet from a stack of identical sheets and passes it across with both hands, which is not how you pass paper. “Receipt for one storm. Wind, water, light, and sundries. Do not fold it along the sundries.”',
              '“Read the bottom line before you decide anything on this floor. Everyone decides first and reads after, and that is why the colonnade has a woman living in it.”'
            ],
            effects: [
              { t: 'item', id: 'storm_receipt', n: 1 },
              { t: 'flag', id: 'f9_has_receipt' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f9_c_prill_charge',
            text: 'Ask what the bottom line says.',
            reply: [
              '“CHARGE TO. And then the standing instruction, which is not mine, which I did not write, and which I have copied one hundred and nine thousand times.”',
              '“It names the surface. Not the tower. The Cadence vents its waste up the shaft and bills the world above for disposal, and the world above pays in the only currency it has, which is remembering. A province goes quiet and that is a settled account. That is the Thinning. Not a plague. Invoicing.”',
              'He resumes copying. “She will not discuss the instruction. I will, because it is not addressed to me. There is great freedom in being unimportant. I recommend it and I cannot have it back.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_knows_instruction' },
              { t: 'sound', id: 'whisper' },
              {
                t: 'codex', id: 'f9_instruction', title: 'The Standing Instruction',
                text: 'At the foot of every page of the Storm Ledger: CHARGE TO — and a name that is not the tower’s. For two hundred years the cost of the Cadence’s remembering has been billed to the surface of Caudmere and settled in forgetting. The Thinning is not a disease. It is a debt being serviced, on time, every time.'
              }
            ]
          },
          {
            id: 'f9_c_prill_witness',
            text: 'File a witness statement for the Guest.',
            require: { flags: ['f9_witnessed_ferrow'] },
            lockedText: '(You would need to have witnessed something out in the weather.)',
            reply: [
              '“A witness statement. On a storm. By a bearer.” He sits down, on a stool he has evidently never used. “That is form nine. I have eleven thousand form nines and not one is filled in.”',
              'He writes fast, then counts coins from a drawer that has no business having coins in it. “Witness fee, standard rate, unadjusted for two centuries, so it is insulting. Take it — refusing voids the statement, and I will not have my first form nine voided.”'
            ],
            effects: [
              { t: 'gold', n: 30 },
              { t: 'flag', id: 'f9_filed_form_nine' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f9_c_prill_drain',
            text: 'Ask what is below the floorboards.',
            reply: [
              '“The overflow drain. When the yard runs over it runs through there, and what goes down is water plus whatever the water has taken a liking to.”',
              '“People go down because it is the only door in here. You will lose something, and I cannot say what, because the losing includes the knowing.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_warned_drain' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_drain', label: 'The Overflow Drain' }
      ]
    },

    // ------------------------------------------------------------- DEAD END 1
    {
      id: 'f9_drain',
      name: 'The Overflow Drain',
      kind: 'deadend',
      size: 'small',
      desc: 'A throat of wet brick, going down, and the water in it is going down faster than water should.',
      props: ['water', 'pipes', 'rubble'],
      onEnter: [
        { t: 'say', text: 'The water takes something on its way past. You feel the exact shape of not knowing what.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'item', id: 'ledger_stub', n: 1 },
        { t: 'say', text: 'You come back up holding a torn stub. The right-hand column only.' },
        { t: 'move', to: 'f9_counting_house' }
      ],
      doors: []
    },

    // ------------------------------------------------------------- DEAD END 2
    {
      id: 'f9_lee_wall',
      name: 'The Lee Wall',
      kind: 'deadend',
      size: 'small',
      desc: 'The wind stops here, completely, which is the first thing that should worry you.',
      props: ['rubble', 'rain'],
      onEnter: [
        { t: 'say', text: 'Dead calm. Your ears pop. The pressure finds something in you and takes it out through the quiet.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'item', id: 'one_dry_thing', n: 1 },
        { t: 'say', text: 'You are holding a square of dry linen and you cannot say when you picked it up.' },
        { t: 'move', to: 'f9_colonnade' }
      ],
      doors: []
    },

    // -------------------------------------------------------------- THE GUEST
    {
      id: 'f9_shape_room',
      name: 'The Sheeting Dark',
      kind: 'branch',
      size: 'large',
      desc: 'The rain here is so heavy it is opaque, and there is a shape standing in it that the rain goes around.',
      props: ['rain', 'water'],
      npc: {
        id: 'f9_guest',
        name: 'The Guest',
        title: 'Ferrow Province, 1082–1182',
        form: 'wisp',
        voice: 'choral',
        palette: { robe: '#1c2436', trim: '#7f96c8', glow: '#b8c8ff' },
        greet: [
          'It is only a shape. Roughly a person, if a person were a column of rain persuaded to stand up, and if the rain remembered a coat.',
          '“Good evening,” it says, in more voices than one and fewer than a crowd. “I am sorry about the wet. I am the wet. I apologise for myself, which I understand is unusual.”',
          '“I am one hundred years of the forgetting of a province called Ferrow, condensed. Eighty-one thousand people forgot things for a century, it came up the shaft and cooled, and here I am with excellent manners and no idea whose they were.”'
        ],
        idle: [
          '“Please do not stay in the rain on my account.”',
          '“I am quite all right. Extremely wet, but quite all right.”'
        ],
        choices: [
          {
            id: 'f9_c_guest_name',
            text: 'Ask what Ferrow was like.',
            reply: [
              '“Terraces. Something about terraces, and a fish, and a festival where the fish mattered. I have the shape of it the way you have the shape of a room in the dark.”',
              '“It is still there — that is what people get wrong. Ferrow has eighty-one thousand people in it this evening, cooking, and some are happy, and none can tell you what the fish was for. They do not miss it. That is the whole cruelty. Nobody down there is sad.”',
              '“I am the sad. All of it. It came up here where it inconveniences no one, and it stands in the rain, and it is polite to strangers.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_heard_ferrow' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f9_c_guest_witness',
            text: 'Stand still and witness it.',
            reply: [
              '“Oh,” it says. “Oh, you needn’t—”',
              'You stay. The rain comes down on both of you at the same rate. It takes about four minutes and the shape says nothing for any of them.',
              '“Thank you. That has not happened. Take this — it is the name. I cannot use it and nobody in Ferrow can pronounce it, and I would rather it were carried than kept.” Something small and warm settles into your hand, four syllables long.'
            ],
            effects: [
              { t: 'item', id: 'province_name', n: 1 },
              { t: 'flag', id: 'f9_witnessed_ferrow' },
              { t: 'sound', id: 'bell' },
              {
                t: 'codex', id: 'f9_ferrow', title: 'Ferrow, Quiet',
                text: 'A province of terraces, a fish, and a festival about the fish. Still populated. Still eating supper. One hundred years of its forgetting stands on the ninth floor of the Verrow in the rain, apologising for the weather. The people it came from are not unhappy. That is the design.'
              }
            ]
          },
          {
            id: 'f9_c_guest_take',
            text: 'Take some of the grief off it.',
            require: { class: ['hollow-saint'], minHearts: 2 },
            lockedText: '(You would need to carry another’s pain, and to have room left to carry it.)',
            reply: [
              'The reliquary opens by itself, which it has not done in nine floors.',
              '“Ah,” says the Guest, and for a moment it has a face, and the face is not grateful, only tired, which is worse. “That is a century. Hold a year. Hold 1141 — it was hard, the terraces flooded.”',
              'You hold 1141. It is heavier than a year should be, and you feel the cost of the room you put it in.'
            ],
            effects: [
              { t: 'heart', n: -1 },
              { t: 'sound', id: 'heartloss' },
              { t: 'item', id: 'mourner_mask', n: 1 },
              { t: 'flag', id: 'f9_carried_a_year' },
              { t: 'say', text: 'You are carrying 1141. Nobody else is.' }
            ]
          },
          {
            id: 'f9_c_guest_leave',
            text: 'Say you are sorry and walk on.',
            reply: [
              '“Please do. It is raining and you have a book to get to.”',
              '“And — if it is not an imposition — when she reads out the line that says FEAR, that is me. I would like someone to know which line I am. Good evening.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_knows_the_fear_line' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_roofless_chapel', label: 'The Chapel Path' }
      ]
    },

    // --------------------------------------------------------------- CISTERN
    {
      id: 'f9_cistern',
      name: 'The Sounding Cistern',
      kind: 'shrine',
      size: 'vault',
      desc: 'A stone well the width of a courtyard, brim-full, and the rain falling into it makes no sound at all.',
      props: ['well', 'water', 'pillars'],
      npc: {
        id: 'f9_waterline',
        name: 'The Water Line',
        title: 'the Second Column',
        form: 'floating',
        voice: 'bell',
        palette: { robe: '#16303c', trim: '#7fd8cb', glow: '#9fe4ff' },
        greet: [
          'Something hangs above the cistern at the exact height the water would reach if the water were a foot higher. It is a line. It is only a line, and it is level, and it is watching you.',
          '“Water,” it says, on a note that makes the cistern hum. “Second column. Largest by volume, cheapest by weight, and the only line on the page that cannot be settled in gold.”'
        ],
        idle: [
          '“Water,” it says again, patiently, on the same note.'
        ],
        choices: [
          {
            id: 'f9_c_water_ask',
            text: 'Ask what water costs.',
            reply: [
              '“Warmth. Gold is a promise about work, and water has never been interested in promises.”',
              '“Eleven million tons, charged at one measure of warmth from something living. The best bargain in this tower, billed to a province that does not know it is cold. I do not persuade. I state.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_knows_water_price' }
            ]
          },
          {
            id: 'f9_c_water_drink',
            text: 'Drink from the cistern.',
            reply: [
              '“It will not hurt you. It has been through a great many people already.”',
              'The water is level in your mouth no matter how you tilt your head. You fill a vial without deciding to.'
            ],
            effects: [
              { t: 'item', id: 'vial_of_still_water', n: 1 },
              { t: 'sound', id: 'water' }
            ]
          },
          {
            id: 'f9_c_water_pay',
            text: 'Pay the water line yourself.',
            require: { minHearts: 2, notFlags: ['f9_paid_water'] },
            lockedText: '(One measure of warmth, from something living. You have none to spare.)',
            reply: [
              'You put your hand flat on the surface. It does not move, and the cold comes up your arm like a column of figures.',
              '“Received. One measure. Water, settled, this storm, this bearer.” The note drops a full tone and the whole cistern goes down with it. “Take it to the yard. She will want the line number. It is always the second line.”'
            ],
            effects: [
              { t: 'heart', n: -1 },
              { t: 'sound', id: 'heartloss' },
              { t: 'flag', id: 'f9_paid_water' },
              { t: 'say', text: 'WATER — SETTLED. You are colder than the rain now.' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_broken_arcade', label: 'The Arcade Steps' }
      ]
    },

    // --------------------------------------------------------- BROKEN ARCADE
    {
      id: 'f9_broken_arcade',
      name: 'The Broken Arcade',
      kind: 'corridor',
      size: 'hall',
      desc: 'Half a colonnade. The other half is on the ground and has been for a long time, in order.',
      props: ['pillars', 'rubble', 'rain'],
      onEnter: [
        { t: 'say', text: 'The fallen pillars lie in a neat row, like a sum worked out and left on the table.' },
        { t: 'sound', id: 'stone' },
        { t: 'say', text: 'To the left, a stair goes up out of the arcade to nothing whatsoever. Its top step is glassed black.' }
      ],
      doors: [
        { to: 'f9_roofless_chapel', label: 'The Chapel Door' },
        { to: 'f9_strike_stair', label: 'The Strike Stair' }
      ]
    },

    // ------------------------------------------------------------- DEAD END 3
    {
      id: 'f9_strike_stair',
      name: 'The Strike Stair',
      kind: 'deadend',
      size: 'small',
      desc: 'Thirty steps up to a platform with no building on it, and the view is worth it, and that is the trap.',
      props: ['stairs', 'rubble'],
      onEnter: [
        { t: 'say', text: 'You can see the whole floor. The yard. The book. The cloud going down the shaft like water down a throat.' },
        { t: 'sound', id: 'crack' },
        { t: 'say', text: 'It takes the light about as long as you would expect.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'You come to at the bottom of the stair. The arch beside you has been scorched open, which is the only good news.' },
        { t: 'unlock', to: 'f9_ledger_yard' }
      ],
      doors: [
        { to: 'f9_ledger_yard', locked: true, label: 'The Scorched Arch' }
      ]
    },

    // -------------------------------------------------------- ROOFLESS CHAPEL
    {
      id: 'f9_roofless_chapel',
      name: 'The Roofless Chapel',
      kind: 'shrine',
      size: 'large',
      desc: 'Pews, an altar, a font brim-full of rainwater, and above it a rectangle of black cloud exactly the shape a roof would be.',
      props: ['altar', 'rain', 'candles'],
      npc: {
        id: 'f9_verger',
        name: 'The Verger of No Roof',
        title: 'Third Column, Light',
        form: 'tall',
        voice: 'low',
        palette: { robe: '#2a2436', trim: '#e0c878', skin: '#b8ac9a', glow: '#ffe6a0' },
        greet: [
          'A very tall figure moves along the pews with a cloth, drying them, in the rain, starting again at the front when it reaches the back.',
          '“Don’t sit in the third row. It’s wet. They’re all wet. The third row is wet in a way I take personally.”',
          '“I keep the light line. Wind is haulage and water is warmth, but light is the only genuinely expensive line, because light is the part of a storm that decides. Everything else falls. Lightning chooses.”'
        ],
        idle: [
          '“The third row. Still.”',
          '“Light is the third column. It is always the third column.”'
        ],
        choices: [
          {
            id: 'f9_c_verg_roof',
            text: 'Ask what happened to the roof.',
            reply: [
              '“Nothing happened to it. There was never one. Built roofless on purpose, by people who wanted to be rained on while they prayed.”',
              '“They got what they asked for, and then the asking stopped and the getting did not. Nobody is being punished. The instructions simply outlived the wanting.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_heard_the_roof' }
            ]
          },
          {
            id: 'f9_c_verg_bless',
            text: 'Ask for a blessing before the yard.',
            reply: [
              'It wrings the cloth out. The cloth does not get drier and neither does the pew.',
              '“I can bless you. It will do nothing, and I will mean every word, and those are two facts that do not cancel.” A wet hand on your head. “May you read the bottom of the page. May you know what you are signing. May nobody thank you for it.”',
              '“That is the honest form. The dishonest form is longer and has more about mercy in it.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_blessed' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f9_c_verg_court',
            text: 'Mention what the bone court made you owe.',
            require: { flags: ['f8_assumed_debt'] },
            lockedText: '(You would have to have taken on a debt in the Ossuary Court.)',
            reply: [
              '“A noble’s favour. Eighth floor. They do that — they have nothing else to spend and they hate it.” It reads the paper through the rain. “Signed. Witnessed. Enforceable in a jurisdiction with no coastline.”',
              '“It counts here. Debt is the one thing in this tower that crosses floors intact.” Something cold is pressed into your hand. “A jar for the light line, drawn against the dead. They will not notice and would not mind.”'
            ],
            effects: [
              { t: 'item', id: 'bottled_lightning', n: 1 },
              { t: 'sound', id: 'crack' }
            ]
          },
          {
            id: 'f9_c_verg_pay',
            text: 'Settle the light line.',
            require: { items: ['bottled_lightning'], notFlags: ['f9_paid_light'] },
            lockedText: '(You would need a strike in a jar, stoppered before it landed.)',
            reply: [
              'You set the jar on the altar. The Verger unstoppers it without ceremony, and the chapel goes white, and for one instant every drop of rain in the air is a separate, itemised object.',
              '“Received. One strike, returned to the column it was drawn from. Light, settled, this storm, this bearer.”',
              '“Go to the yard. And listen to her read it out — all of it, not just your lines. People pay and then look at their boots for the sundries. You paid for the whole page. Hear the whole page.”'
            ],
            effects: [
              { t: 'item', id: 'bottled_lightning', n: -1 },
              { t: 'flag', id: 'f9_paid_light' },
              { t: 'sound', id: 'crack' },
              { t: 'say', text: 'LIGHT — SETTLED. The afterimage takes a long time to go.' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_ledger_yard', label: 'The Yard Gate' }
      ]
    },

    // ------------------------------------------------------- WINDWARD TERRACE
    {
      id: 'f9_windward',
      name: 'The Windward Terrace',
      kind: 'branch',
      size: 'large',
      desc: 'The wind comes across this terrace hard enough to lean on, and there is a child leaning on it.',
      props: ['rain', 'banners', 'rubble'],
      npc: {
        id: 'f9_tibb',
        name: 'Tibb',
        title: 'Kept, and Busy',
        form: 'child',
        voice: 'high',
        palette: { robe: '#3c4a3a', trim: '#d8e0a0', skin: '#d6bfa4', glow: '#dfffa8' },
        greet: [
          'A child of about nine stands at the rail with a kite made of receipts, forty feet of wet string, and total professional concentration.',
          '“Don’t talk on the upstroke. Talk on the slack. There. Now. Go.”',
          '“I catch lightning. Twenty gold a jar, no bulk. Yes I am Kept, yes I have been nine for a hundred and forty years, no it is not sad. I have a kite and a business, and you have wet boots and a moral problem.”'
        ],
        idle: [
          '“Slack. Talk. Quick.”',
          '“Twenty. Still twenty. It was twenty last century.”'
        ],
        choices: [
          {
            id: 'f9_c_tibb_kite',
            text: 'Ask about the kite.',
            reply: [
              '“Receipts. Chandler throws out the spoiled ones, spoiled ones are waxed, waxed ones fly. Ledger-Keeper doesn’t mind — but you have to ask her in line-item form or she doesn’t hear the question.”',
              '“She’s not deaf, she’s committed. She taught me to count out here, saying the wind column loud so I could follow, and she never once stopped writing to do it. Everyone thinks she’s a machine. She taught a kid arithmetic in a hurricane for a hundred years. Machines don’t bother.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_heard_about_keeper' }
            ]
          },
          {
            id: 'f9_c_tibb_buy',
            text: 'Buy a jar of lightning. Twenty gold.',
            require: { gold: 20 },
            lockedText: '(Twenty gold, and you do not have twenty gold.)',
            reply: [
              'She reels in one-handed and unhooks a jar from her belt without looking at you, eyes on the cloud.',
              '“Stoppered before it landed. That’s the trick. After it lands it’s a burn mark and a smell. Before, it’s still deciding, and a thing that’s still deciding is worth something to everybody down here. Don’t open it indoors. There is no indoors. Don’t open it.”'
            ],
            effects: [
              { t: 'gold', n: -20 },
              { t: 'item', id: 'bottled_lightning', n: 1 },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f9_c_tibb_call',
            text: 'Call one down out of the cloud yourself.',
            require: { class: ['ashcaller'] },
            lockedText: '(You would need to be on speaking terms with fire.)',
            reply: [
              'You raise the lens and the cloud notices, the way a room notices a door.',
              '“Oh, that’s CHEATING,” says Tibb, delighted and furious at once. The strike comes down the lens and stops an inch short of arriving, and she has a jar under it before you finish flinching. “Fine. Free. Tell people you bought it, I have a reputation.”'
            ],
            effects: [
              { t: 'item', id: 'bottled_lightning', n: 1 },
              { t: 'flag', id: 'f9_called_the_light' },
              { t: 'sound', id: 'fire' }
            ]
          },
          {
            id: 'f9_c_tibb_garden',
            text: 'Tell her about the thing you let grow.',
            require: { flags: ['f5_planted'] },
            reply: [
              '“Under the glass? On five? With the violet stuff?” She hauls the kite all the way in, which she has not done once. “Is it big now. Tell me it’s big now.”',
              'You tell her. She listens completely, then puts a coin in your hand in a denomination nobody uses. “For the story. That’s the rate. Don’t argue, I set the rates.”'
            ],
            effects: [
              { t: 'item', id: 'quiet_coin', n: 1 },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f9_c_tibb_wind',
            text: 'Settle the wind line here, at the rail.',
            require: { gold: 45, notFlags: ['f9_paid_wind'] },
            lockedText: '(Forty-five gold. Wind is haulage, and haulage is billed in coin.)',
            reply: [
              '“You want to pay the wind.” She looks at you properly for the first time. “People don’t. People pay the light one because it’s exciting, and then they go down the stairs.”',
              '“Forty-five. Haulage on one storm, terrace rate. I log it, because she can’t hold the book and the tally-post at once.” She threads your coins onto a wire along the rail where nine thousand others are already threaded, going green.',
              '“WIND — SETTLED,” she shouts into the gale, in a voice that is clearly an imitation of somebody. “ONE STORM. BEARER PAYS.” The wire hums. Somewhere out in the dark, a book gets written in.'
            ],
            effects: [
              { t: 'gold', n: -45 },
              { t: 'flag', id: 'f9_paid_wind' },
              { t: 'sound', id: 'coin' },
              { t: 'say', text: 'WIND — SETTLED. Nine thousand coins on a wire, and now yours.' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f9_gallery', label: 'The Gallery of Provinces' }
      ]
    },

    // ---------------------------------------------------------------- GALLERY
    {
      id: 'f9_gallery',
      name: 'The Gallery of Quiet Provinces',
      kind: 'branch',
      size: 'hall',
      desc: 'Twelve statues in a flooded hall. Eleven have had their names washed off, and the rain is working on the twelfth.',
      props: ['statue', 'banners', 'water'],
      onEnter: [
        { t: 'say', text: 'Offerings lie in the water at the statues’ feet. Nobody has come for them in a very long time.' },
        { t: 'gold', n: 40 },
        { t: 'sound', id: 'coin' },
        { t: 'flag', id: 'f9_robbed_the_provinces' },
        {
          t: 'codex', id: 'f9_provinces', title: 'The Quiet Provinces',
          text: 'Twelve figures, one per province served by the Cadence. The names are cut into the plinths and the rain has been at them for two centuries. Eleven are illegible. Taking the coins from the water is not stealing; there is nobody left who could say whose they were, and that is precisely the accounting being described.'
        }
      ],
      doors: [
        { to: 'f9_ledger_yard', label: 'The Yard, Downwind' }
      ]
    },

    // ----------------------------------------------------------- DELUGE WALK
    {
      id: 'f9_deluge_walk',
      name: 'The Deluge Walk',
      kind: 'corridor',
      size: 'hall',
      desc: 'A causeway with water over it ankle-deep and running hard toward the yard, taking paper with it.',
      props: ['rain', 'water', 'pillars'],
      onEnter: [
        { t: 'say', text: 'Torn pages go past your boots, all of them the same page, all of them itemised.' },
        { t: 'sound', id: 'water' },
        { t: 'item', id: 'chalk_stub', n: 1 },
        { t: 'say', text: 'A chalk stub turns in the current. Somebody was counting here, and stopped mid-count.' }
      ],
      doors: [
        { to: 'f9_ledger_yard', label: 'The Yard Steps' }
      ]
    },

    // ------------------------------------------------------------------ EXIT
    {
      id: 'f9_ledger_yard',
      name: 'The Foot of the Ledger',
      kind: 'exit',
      size: 'grand',
      desc: 'A book the size of a door stands open on a stone lectern in the middle of the rain, and the page is dry, and the stair down is behind it.',
      props: ['rain', 'table', 'pillars', 'stairs'],
      onEnter: [
        { t: 'say', text: 'The rain does not touch the page. It parts a handspan above the paper and goes around.' },
        { t: 'sound', id: 'bell' }
      ],
      npc: {
        id: 'f9_keeper',
        name: 'The Ledger-Keeper',
        title: 'Accuracy, Unrelieved',
        form: 'tall',
        voice: 'dry',
        palette: { robe: '#232a3a', trim: '#cbd8f0', skin: '#b0a894', glow: '#a8c4ff' },
        greet: [
          'She is soaked to the bone and has been for two hundred years, writing without pause, left hand flat on the page against a wind that should take it.',
          '“One moment. Wind, eleven thousand four hundred and six — water, eleven million one hundred and ninety thousand — light, four — sundries, one. There. Storm ninety-one thousand two hundred and eight. Closed. Good evening.”',
          '“You will want to ask where it gets charged. Everyone does, and I do not discuss the standing instruction. Anything else on this page, in any detail, for as long as you can stand in the rain.”'
        ],
        idle: [
          '“Wind, eleven thousand four hundred and six. You have heard this. Ask me something else.”',
          '“The book does not close. It has no back cover. A design decision, and not mine.”'
        ],
        choices: [
          {
            id: 'f9_c_keep_book',
            text: 'Ask what the book is.',
            reply: [
              '“A ledger. Not a chronicle, not a prophecy — a ledger, which records what was taken and what was given in exchange, and which is right or wrong and nothing else.” She writes. “Wind, four hundred and two. Sorry. New one starting.”',
              '“The weather is measured, by me, and entered, by me, and charged, by instruction, and settled, by somebody. Four verbs. I am responsible for two. I mention it because people arrive wanting to shout at me, and I would rather they shouted accurately.”',
              '“I have never been asked to stop. In two hundred and six years. I want that in the record, and there is only one record, and I keep it, so it is in the record.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_heard_the_book' },
              {
                t: 'codex', id: 'f9_ledger', title: 'The Storm Ledger',
                text: 'Ninety-one thousand storms, each measured, itemised and charged. The Ledger-Keeper measures and enters. She does not charge and she does not settle. She has never been instructed to stop, and has therefore never stopped, and considers the distinction between those two sentences to be the most important thing about her.'
              }
            ]
          },
          {
            id: 'f9_c_keep_receipt',
            text: 'Ask for a receipt for this storm.',
            require: { notFlags: ['f9_has_receipt'] },
            reply: [
              '“Carbon to bearer.” She tears along a line you cannot see and hands you a sheet that is not wet. “Wind, water, light, and one line reading FEAR — SUNDRIES, which people find upsetting and which is simply the smallest and most expensive column.”',
              '“Do not lose it. Not for my sake. There is a floor below this one that reads everything you carry, and reads it more carefully than you did.”'
            ],
            effects: [
              { t: 'item', id: 'storm_receipt', n: 1 },
              { t: 'flag', id: 'f9_has_receipt' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f9_c_keep_price',
            text: 'Name the true price of the page.',
            require: { class: ['coinwright'] },
            lockedText: '(You would need to say what a thing actually costs, out loud, correctly.)',
            reply: [
              'You say the figure before she has finished the line, and she stops writing, which by every account she has never done.',
              '“That is precisely the price. Nobody has said it. They estimate, or they weep, or they offer me a speech.” She turns back six hundred pages without looking. “There is a compounding error in the haulage column dating to the fourth year, in the tower’s favour and against the bearer’s. I have flagged it four thousand times and nobody has come to correct it. You are a bearer. Correct it.”',
              'She counts a rebate into your hand from a box under the lectern that has waited two hundred years to be opened for a reason.'
            ],
            effects: [
              { t: 'gold', n: 40 },
              { t: 'flag', id: 'f9_found_the_error' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f9_c_keep_default',
            text: 'Say nothing, and go down.',
            reply: [
              '“Understood.” She writes one line, and reads it aloud as she writes it, because she reads every line aloud as she writes it, and she has no idea this is the cruelest thing about her.',
              '“Storm ninety-one thousand two hundred and nine. Wind, four hundred and two. Water, eleven million. Light, six. Fear — sundries, one. CHARGE TO: as standing.”',
              'Out past the pillars, something that has stood in the weather being polite for a hundred years gets a little heavier. She does not look up as you pass.'
            ],
            effects: [
              { t: 'say', text: 'CHARGE TO: as standing. Somewhere above, a province gets quieter by exactly one storm.' },
              { t: 'sound', id: 'whisper' },
              { t: 'flag', id: 'f9_charged_as_standing' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f9_c_keep_tower',
            text: 'Tell her to charge it to the tower.',
            require: { flags: ['f9_knows_instruction'] },
            lockedText: '(You would have to know there is another party the bill could name.)',
            reply: [
              '“The tower.” Her pen hesitates one full second, which on this floor is an earthquake. “The Verrow is a party to the instruction. It may be named. It has never been named.”',
              '“It will pay. It cannot pay this and keep everything it is keeping. Something downstairs will be sold to cover it, and I will not be told which.”',
              'She writes. Far below, through nine floors of stone, something very large goes quiet — not a crash; a subtraction. The rain thins for eleven seconds and resumes. “Entered. Go down. I would go quickly.”'
            ],
            effects: [
              { t: 'flag', id: 'f9_charged_the_tower' },
              { t: 'say', text: 'Something below you stops being kept. The rain thins for eleven seconds.' },
              { t: 'sound', id: 'crack' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f9_c_keep_split',
            text: 'Split the storm with the surface.',
            require: { gold: 60 },
            lockedText: '(Sixty gold to take half the page. You cannot cover half.)',
            reply: [
              '“Half.” She counts the coins and enters them, and her voice does not change, which you find you were hoping it would. “Half is a real answer. Not a coward’s answer. The answer of somebody who has looked at the whole number.”',
              '“Wind, halved. Water, halved. Light, halved. Fear — sundries: it does not halve. It is one. It goes where it went. CHARGE TO: bearer, one half; as standing, remainder.”',
              '“A genuine reduction, felt by nobody, because half of an amount nobody can feel is an amount nobody can feel. I am not saying it was wrong. I am reading you the line.”'
            ],
            effects: [
              { t: 'gold', n: -60 },
              { t: 'flag', id: 'f9_split_the_bill' },
              { t: 'say', text: 'Half the page is yours. The sundries do not halve.' },
              { t: 'sound', id: 'coin' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f9_c_keep_full',
            text: 'Settle the whole page. Charge it to you.',
            require: {
              flags: ['f9_paid_wind', 'f9_paid_water', 'f9_paid_light'],
              items: ['storm_receipt'],
              gold: 40
            },
            lockedText: '(Wind at the rail, water at the cistern, light at the chapel — and forty gold for the sundries, with the carbon in hand.)',
            reply: [
              'You put the carbon on the lectern beside the book, and the rain goes around that too.',
              '“Wind. Four hundred and two. Settled at the terrace rail, bearer, forty-five in coin, logged by the child, wire nine.” She writes. “Water. Eleven million one hundred and ninety thousand. Settled at the cistern, bearer, one measure of warmth, received and not returnable.” She writes. “Light. Six. Settled at the chapel, bearer, one strike given back to the column it came from.”',
              'The pen stops over the fourth line. It is the first time she has looked at you. Her eyes are the only dry things on this floor.',
              '“Fear. Sundries. One.” You put down forty gold and she does not pick it up. “There is no unit for this line. It is entered as one because it must be entered as something, and it has cost the surface the most, and I have written it ninety-one thousand times knowing the number was wrong and having no better number to write.”',
              'She writes it, and reads it out, because she reads everything out. “CHARGE TO: the bearer. In full. This storm. No remainder.”',
              'Out past the pillars, the shape in the sheeting dark stops apologising for the weather, because for the length of one storm the weather is not its fault.',
              '“Entered. In two hundred and six years, not one.” The pen goes back down. “I am required to be accurate, so: this changes almost nothing. Ninety-one thousand two hundred and eight pages stand as charged. Yours is one page. It is the page I would have wanted, if I were a province. Go down.”'
            ],
            effects: [
              { t: 'gold', n: -40 },
              { t: 'flag', id: 'f9_paid_in_full' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'CHARGE TO: the bearer. In full. No remainder.' },
              {
                t: 'codex', id: 'f9_settled', title: 'One Page, Settled',
                text: 'Storm ninety-one thousand two hundred and nine: wind paid in coin at the terrace, water paid in warmth at the cistern, light paid in a returned strike at the chapel, and the sundries — the fear, the unit-less line, the one the Ledger-Keeper has never had a number for — paid by the bearer, in full, standing in the rain while it was read out.'
              },
              { t: 'floorEnd', token: true }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

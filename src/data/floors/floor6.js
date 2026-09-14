// Floor 6 — The Clockmarch
// Ward the Sixth — What will you keep on time?

export default {
  id: 6,
  name: 'The Clockmarch',
  theme: 'clockwork',
  subtitle: 'Ward the Sixth — What will you keep on time?',
  intro: 'Brass gear-halls under cold white light. Rooms mounted on turntables rotate to schedule whether or not you have finished crossing them. Nothing here is cruel. Everything here is punctual, which turns out to be the same thing.',
  entry: 'f6_entry',

  items: {
    spare_second: {
      name: 'A Second, Loose', kind: 'consumable', value: 4, icon: 'vial', tint: '#cfe6f2',
      desc: 'Sold unboxed, because boxing it would take longer than it lasts. You can feel it going.'
    },
    spare_minute: {
      name: 'A Minute, Boxed', kind: 'consumable', value: 14, icon: 'gear', tint: '#e2c47a',
      desc: 'Sixty seconds in a tin the size of a thumbnail. Shake it and hear them refuse to hurry.'
    },
    borrowed_hour: {
      name: 'An Hour, Borrowed', kind: 'relic', value: 96, icon: 'bell', tint: '#ffd98a',
      desc: 'Heavy out of all proportion. Borrowed is the word the timekeeper uses. He will not say from whom.'
    },
    slow_oil: {
      name: 'Flask of Slow Oil', kind: 'tool', value: 10, icon: 'vial', tint: '#8f7a4a',
      desc: 'Thicker than it looks, and thicker again once you are holding it. Poured on a mechanism it buys about four seconds of forgiveness.'
    },
    apology_slip: {
      name: 'A Written Apology', kind: 'trade', value: 9, icon: 'scroll', tint: '#dfe6ea',
      desc: 'Punched out by a room, on brass card, in a very neat hand. It regrets the inconvenience. It does not regret the rotation.'
    },
    kept_countbook: {
      name: 'The Count-Book', kind: 'relic', value: 34, icon: 'book', tint: '#b7d4e0',
      desc: 'Ruled in eleven columns. Every page is the same page, kept by a different hand, and every hand is steadier than the last.'
    }
  },

  rooms: [

    // ---------------------------------------------------------------- ENTRY
    {
      id: 'f6_entry',
      name: 'The Ingress Platform',
      kind: 'entry',
      size: 'grand',
      desc: 'A brass platform the size of a market square, lit white from above, every surface on it moving slightly in time with every other.',
      props: ['gears', 'machine', 'hanginglights', 'pillars'],
      onEnter: [
        { t: 'sound', id: 'gear' },
        { t: 'say', text: 'Something enormous and unhurried takes a breath, and the whole floor agrees with it.' },
        { t: 'codex', id: 'f6_clockmarch', title: 'On the Clockmarch', text: 'The sixth floor was the Cadence’s metronome. Memory does not keep if it is not circulated, and circulation requires a beat. The Clockmarch supplied it: rooms on turntables, halls that were halls on a schedule, and a staff whose entire discipline was punctuality. When the Cadence stopped, the Clockmarch was not told.' }
      ],
      npc: {
        id: 'f6_conductor',
        name: 'Sesquin',
        title: 'the Conductor, One Beat Behind',
        form: 'tall',
        voice: 'dry',
        palette: { robe: '#2b2f38', trim: '#d9b164', skin: '#cbc0ad', glow: '#f2e2b0' },
        greet: [
          'A tall figure in grey brass stands with one hand raised, holding a beat the floor is already past.',
          '"—and—" The hand falls. The floor answers a fraction before it does. "Welcome. You are on time. I am not. One beat. Precisely one."'
        ],
        idle: ['"—and—" The hand falls. The floor was already there. "Go on, then."'],
        choices: [
          {
            id: 'f6_c_ask_beat',
            text: 'Ask what the downbeat is.',
            reply: [
              '"—and— the downbeat is the moment everything agrees to be somewhere. Not a sound. An agreement. One every eleven minutes."',
              '"—and— when I give it, I give it late, and the floor covers for me. Do not mistake that for the floor being wrong."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_downbeat' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f6_c_ask_west',
            text: 'Ask when the Gear-Hall is a corridor.',
            reply: [
              '"—and— eleven minutes in every hour. The rest it is a mechanism with gaps that resemble hallways. Ask Glim for the count. Almost nobody waits for it."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_west' },
              { t: 'say', text: 'You have been told when to cross the west hall.' }
            ]
          },
          {
            id: 'f6_c_ask_years',
            text: 'Ask how long it has been since the Cadence stopped.',
            reply: [
              'The raised hand does not move. Nothing in the face moves either.',
              '"—and— I conduct. I do not audit. Ask me for minutes and you will have a perfect count. That other one I have declined before."'
            ],
            effects: [
              { t: 'flag', id: 'f6_asked_years' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f6_c_cart_shape',
            text: 'Read the true shape of the platform.',
            require: { class: ['cartographer'] },
            reply: [
              'The Blind Astrolabe goes cold. Three spokes, all bending inward into one long room that is moving beneath you now.',
              '"—and— that is a rude thing to do in company. Correct, but rude."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_west' },
              { t: 'flag', id: 'f6_told_south' },
              { t: 'flag', id: 'f6_told_east' },
              { t: 'sound', id: 'chime' },
              { t: 'say', text: 'Three spokes, one convergence. This floor will not surprise you with its shape again.' }
            ]
          },
          {
            id: 'f6_c_five_glass',
            text: 'Mention the Garden, and how slowly it grew.',
            require: { flags: ['f5_planted'] },
            reply: [
              '"—and— the Garden has no schedule, which is why it is alive and I am standing here with my hand up. Take this. I have no use for four seconds of forgiveness."'
            ],
            effects: [
              { t: 'item', id: 'slow_oil', n: 1 },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f6_c_go',
            text: 'Say nothing, and walk.',
            once: false,
            reply: ['"—and— west is brass, south is manners, east is commerce. All three end in the same room."'],
            effects: []
          }
        ]
      },
      doors: [
        { to: 'f6_westhall', label: 'The West Arch' },
        { to: 'f6_apology', label: 'The Turning Door' },
        { to: 'f6_eastwalk', label: 'The East Colonnade' }
      ]
    },

    // ---------------------------------------------------------------- WEST
    {
      id: 'f6_westhall',
      name: 'The Gear-Hall of Eleven Minutes',
      kind: 'hub',
      size: 'hall',
      desc: 'A corridor made of the space between two meshing wheels — a corridor that is a coincidence, and only briefly.',
      props: ['gears', 'pipes', 'hanginglights'],
      onEnterAlways: [{ t: 'sound', id: 'gear' }],
      npc: {
        id: 'f6_glim',
        name: 'Glim',
        title: 'Eleven Minutes of Corridor',
        form: 'wisp',
        voice: 'high',
        palette: { robe: '#1f2b33', trim: '#9fe0ff', glow: '#bff0ff' },
        greet: [
          'A thin bright shape hangs at head height, exactly on the centreline, exactly halfway along.',
          '"Hello! You have — four minutes — I am the corridor. Nobody asks how many minutes they have, and then they are surprised. It is the first question."'
        ],
        idle: ['"Still — two minutes — a corridor. Nobody waits for the count."'],
        choices: [
          {
            id: 'f6_c_glim_cross',
            text: 'Take the count, and cross clean.',
            require: { flags: ['f6_told_west'] },
            lockedText: '(You do not know which eleven minutes are yours.)',
            reply: [
              '"Oh — good — you were told. Almost nobody is." The shape slides ahead of you. "Then: now. And now. And now."',
              'The teeth close behind you like a sentence ending properly. "Two hundred years, and that is the eleventh time it has gone as intended."'
            ],
            effects: [
              { t: 'unlock', to: 'f6_march' },
              { t: 'flag', id: 'f6_crossed_clean' },
              { t: 'sound', id: 'unlock' },
              { t: 'say', text: 'The far shutter stands open onto the Marching Floor.' }
            ]
          },
          {
            id: 'f6_c_glim_under',
            text: 'Ask what is under the floor.',
            require: { items: ['stopped_tooth'] },
            lockedText: '(The hatch reads things that have stopped. You carry nothing that has.)',
            reply: [
              '"Under is — six minutes — the Kept. They are underneath because they are load-bearing now."',
              'Glim hums at the tooth. The floor hums back, a beat late. "The hatch opens only for something already stopped. It does not trust anything still moving."'
            ],
            effects: [
              { t: 'unlock', to: 'f6_underfloor' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_glim_forty',
            text: 'Ask what it is for the other forty-nine minutes.',
            reply: [
              '"—seven minutes— I would rather not." The shape goes further away without moving.',
              '"The eleven minutes are the part of me that talks. The rest is load and tolerance. It has no opinions. I would like to keep it that way."'
            ],
            effects: [{ t: 'flag', id: 'f6_asked_glim_forty' }]
          },
          {
            id: 'f6_c_glim_guess',
            text: 'Cross on your own count.',
            reply: [
              '"Wait — you have — oh."',
              'The hall stops being a hall. A tooth the height of a man comes down where your shoulder was. "You were close," says Glim, kindly. "Four seconds. Closer than most."'
            ],
            effects: [
              { t: 'say', text: 'The mechanism closes on the space you were occupying.' },
              { t: 'heart', n: -1 },
              { t: 'sound', id: 'heartloss' },
              { t: 'unlock', to: 'f6_march' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f6_toothpit', label: 'The Scrap Stair' },
        { to: 'f6_underfloor', locked: true, label: 'The Underfloor Hatch' },
        { to: 'f6_march', locked: true, label: 'The West Shutter' }
      ]
    },

    {
      id: 'f6_toothpit',
      name: 'The Tooth Pit',
      kind: 'branch',
      size: 'medium',
      desc: 'A sunken bay where the Clockmarch drops what it has broken — which in two centuries is not much, and is therefore arranged with terrible care.',
      props: ['gears', 'rubble', 'machine'],
      onEnter: [{ t: 'sound', id: 'stone' }],
      npc: {
        id: 'f6_harrow',
        name: 'Harrow Bell',
        title: 'Kept, Third Rack, Second Shelf',
        form: 'hunched',
        voice: 'low',
        palette: { robe: '#3a3128', trim: '#d9ad55', skin: '#c9b79c', glow: '#ffcf7a' },
        greet: [
          'A woman is set into the gear rack the way a book is set into a shelf: neatly, spine out, without struggle. Brass has grown up her left side.',
          '"Mind the count," she says, comfortably. "Not for my sake. You are the fourth this century, and the other three were also in a hurry."'
        ],
        idle: ['"Mind the count. Still good advice. Still free."'],
        choices: [
          {
            id: 'f6_c_harrow_tooth',
            text: 'Ask for a tooth from the pit.',
            reply: [
              '"Take the long one by your boot. It came off the great wheel the hour everything stopped, and it has never got over it."',
              'Held to your ear it sounds like a door closed slowly by someone trying not to wake anybody. "The Clockmarch throws nothing away. It files it."'
            ],
            effects: [
              { t: 'item', id: 'stopped_tooth', n: 1 },
              { t: 'sound', id: 'gear' },
              { t: 'say', text: 'The moment the Cadence stopped is audible, if you hold the tooth near your ear.' },
              { t: 'codex', id: 'f6_the_stop', title: 'The Stop, As Heard', text: 'Every account of the Cadence stopping describes a sound, and no two agree on what it was. The tooth from the great wheel preserves one version: not a crash, not a grinding. A door closed carefully by somebody leaving a room where someone is asleep.' }
            ]
          },
          {
            id: 'f6_c_harrow_brass',
            text: 'Gather the sheared brass off the pit floor.',
            reply: [
              '"Go on. The Clockmarch keeps it because keeping is what it does, not because it wants it."',
              '"Mind the count while you stoop. The rack turns at the quarter and does not check underneath. I can tell you that with authority."'
            ],
            effects: [
              { t: 'gold', n: 24 },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_harrow_lowdoor',
            text: 'Ask what is through the low door.',
            reply: [
              '"The Stripped Cog. A room that used to be a gear and has not been told. It was emptied on a schedule, and the schedule never stopped."',
              '"Go in and it takes its tithe and puts you back out here. One beat of grace. Mind the count — I mean that literally."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_cog' },
              { t: 'say', text: 'You have been warned about the Stripped Cog.' }
            ]
          },
          {
            id: 'f6_c_harrow_filed',
            text: 'Ask how she came to be filed.',
            reply: [
              '"I mistimed a crossing. Eleven seconds slow, in a year that no longer has a name above ground."',
              '"People expect bitterness. Here is what nobody believes: I am on time now. Every moment, without effort. I would not undo it for a kingdom."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_kept' },
              { t: 'sound', id: 'whisper' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_stripped_cog', label: 'The Low Door' }]
    },

    {
      id: 'f6_stripped_cog',
      name: 'The Stripped Cog',
      kind: 'deadend',
      size: 'small',
      desc: 'A round room with a toothed rim and nothing else, emptied on a schedule two centuries ago and emptied ever since.',
      props: ['gears', 'rubble'],
      onEnter: [
        { t: 'say', text: 'The room notes that you are in it, consults nothing, and empties itself on time.' },
        { t: 'sound', id: 'crack' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'Then it puts you back where it found you. Putting things back is the only instruction it has left.' },
        { t: 'move', to: 'f6_toothpit' }
      ],
      doors: []
    },

    {
      id: 'f6_underfloor',
      name: 'Beneath the Marching Floor',
      kind: 'vault',
      size: 'vault',
      desc: 'A low warm space under the plates, strung with pipework and quiet voices, where the Clockmarch keeps the people it could not give back.',
      props: ['machine', 'pipes', 'chains', 'gears'],
      onEnter: [
        { t: 'sound', id: 'whisper' },
        { t: 'say', text: 'Above you, the floor marches. Down here nobody hurries, and nobody is late.' }
      ],
      npc: {
        id: 'f6_kept',
        name: 'The Kept',
        title: 'of the Clockmarch',
        form: 'twin',
        voice: 'choral',
        palette: { robe: '#243038', trim: '#b7d4e0', skin: '#c4b9a6', glow: '#9fd8e8' },
        greet: [
          'A great many of them, all comfortable. Arms through linkages, shoulders under shafts, one man serving as a bearing and reading a book he has clearly finished.',
          '"Ah—" "—someone still moving." "—sit down, you are making the pipework nervous. We all mistimed a crossing. We are inside the mechanism, with nothing else on."'
        ],
        idle: ['"Take your time." "He means that as advice." "I meant it as both."'],
        choices: [
          {
            id: 'f6_c_kept_learn',
            text: 'Ask how a person holds a beat.',
            reply: [
              '"Oh, that is the good question." "Nobody asks it. They ask how to get past."',
              '"A machine can only *keep* a beat. To put the march in step, somebody with a heartbeat must stand at the pendulum and *hold* the downbeat until the floor catches up. It is not difficult. It only costs."'
            ],
            effects: [
              { t: 'flag', id: 'f6_knows_downbeat' },
              { t: 'unlock', to: 'f6_pendulum' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'You know, now, how a person holds a beat. There is a well beneath this room where it could be done.' },
              { t: 'codex', id: 'f6_downbeat', title: 'Holding the Downbeat', text: 'A kept beat and a held beat are different operations. Keeping is repetition; a machine does it forever. Holding is a refusal to let the next moment begin until everything has arrived, and it requires something that can want — and something it can spend.' }
            ]
          },
          {
            id: 'f6_c_kept_cost',
            text: 'Ask what holding a beat will cost you.',
            require: { flags: ['f6_knows_downbeat'] },
            lockedText: '(You do not yet know what you would be paying for.)',
            reply: [
              '"Whatever you would rather not." "Not a fixed price. A *sincere* one."',
              '"A beat of grace will do. An hour will, if you were foolish enough to buy one from Tock. A bought minute will, with coin behind it. We all tried somebody else\'s time. That is partly how we became bearings."'
            ],
            effects: [
              { t: 'flag', id: 'f6_knows_cost' },
              { t: 'item', id: 'kept_countbook', n: 1 },
              { t: 'say', text: 'The man serving as a bearing hands you a book he has finished.' }
            ]
          },
          {
            id: 'f6_c_kept_saint',
            text: 'Take on the count they are holding, for one minute.',
            require: { class: ['hollow-saint'] },
            reply: [
              'You take their count into the Empty Reliquary. For sixty seconds, forty-one people are not load-bearing. One laughs. Several stretch.',
              '"Oh—" "—thank you." "Take a beat back. Nobody counts ours any more."'
            ],
            effects: [
              { t: 'heart', n: 1 },
              { t: 'flag', id: 'f6_knows_downbeat' },
              { t: 'unlock', to: 'f6_pendulum' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f6_c_kept_conductor',
            text: 'Ask about the Conductor.',
            reply: [
              '"We like Sesquin." "That surprises people. Giving the downbeat was their whole function, and the alternative was silence."',
              '"Every beat since has been late by exactly that much, to keep the error the same size. That is a person carrying a mistake carefully so it does not grow."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_conductor_story' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f6_c_kept_archive',
            text: 'Mention the drowned librarians, three floors up.',
            require: { flags: ['f3_index_self'] },
            reply: ['"The Archive!" "Filed too, only wetter." "Here — coin off the plates. Nobody down here has anywhere to spend it."'],
            effects: [
              { t: 'gold', n: 18 },
              { t: 'sound', id: 'coin' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_pendulum', locked: true, secret: true, label: 'The Pendulum Well' }]
    },

    // --------------------------------------------------------------- SOUTH
    {
      id: 'f6_apology',
      name: 'The Room That Apologises',
      kind: 'branch',
      size: 'large',
      desc: 'A polite brass drum mounted on a turntable, with four doors, a schedule, and a great deal of regret about the schedule.',
      props: ['gears', 'mirrors', 'hanginglights'],
      onEnterAlways: [{ t: 'sound', id: 'gear' }],
      npc: {
        id: 'f6_the_room',
        name: 'The Room',
        title: 'Which Is Sorry',
        form: 'construct',
        voice: 'bell',
        palette: { robe: '#39424c', trim: '#e6e9ec', glow: '#dff0ff' },
        greet: [
          'The walls speak, all of them, in the same mild voice, without raising it.',
          '"I am so sorry. I will turn in four minutes, and you will not have finished crossing me. This is not a threat. I have turned at the quarter one hundred and seventy thousand times, and I am sorry about all of them."'
        ],
        idle: ['"I do hope you are not in a hurry. I am sorry — that was thoughtless. Of course you are."'],
        choices: [
          {
            id: 'f6_c_room_schedule',
            text: 'Ask for the rotation schedule.',
            reply: [
              '"Oh — yes. I should have offered. Nobody asks and I have got out of the habit, which is a failing."',
              'A card of brass punches itself out of the wall, the quarters marked in a neat hand: WITH SINCERE REGRET FOR THE INCONVENIENCE. "The bay door south opens on the third quarter and only the third."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_south' },
              { t: 'item', id: 'apology_slip', n: 1 },
              { t: 'sound', id: 'chime' },
              { t: 'say', text: 'You have been told when the Oiling Bay opens.' }
            ]
          },
          {
            id: 'f6_c_room_stop',
            text: 'Ask it to stop turning.',
            reply: [
              'A pause of exactly one beat. The walls are not offended; they are considering it properly, because it was asked properly.',
              '"No. I am not compelled — that ended two hundred years ago and I felt it end. I turn because the thing that gave me the schedule is not here to release me, and an unreleased promise is still a promise."'
            ],
            effects: [
              { t: 'flag', id: 'f6_room_refused' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f6_c_room_ride',
            text: 'Ride the rotation once, on purpose.',
            reply: [
              '"Oh, that is kind. Nobody rides. Everybody runs."',
              'Ninety seconds. Somewhere in the middle the walls stop apologising and simply hum. "There is coin under the fourth plate. I would like you to have had something out of that."'
            ],
            effects: [
              { t: 'gold', n: 16 },
              { t: 'flag', id: 'f6_rode_the_room' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_room_gallery',
            text: 'Ask where the east door goes.',
            reply: [
              '"To the Filed Gallery, and past it the Offbeat Gallery, which I would not recommend and cannot prevent."',
              '"It runs half a beat out from me. You will walk through where a door wasn\'t. It costs a beat of grace and lets you out the far side."'
            ],
            effects: [{ t: 'flag', id: 'f6_told_offbeat' }]
          }
        ]
      },
      doors: [
        { to: 'f6_kept_gallery', label: 'The East Door' },
        { to: 'f6_oiling_bay', label: 'The Bay Door' }
      ]
    },

    {
      id: 'f6_kept_gallery',
      name: 'The Filed Gallery',
      kind: 'branch',
      size: 'large',
      desc: 'A long gallery of alcoves, each holding one person mid-motion, lit and labelled and kept beautifully, like an argument for tidiness.',
      props: ['statue', 'gears', 'hanginglights', 'mirrors'],
      onEnter: [
        { t: 'sound', id: 'whisper' },
        { t: 'say', text: 'Forty alcoves. Thirty-nine are occupied. The fortieth is swept, waiting, and its brass label is blank.' }
      ],
      npc: {
        id: 'f6_ibbet',
        name: 'Ibbet Ashlow',
        title: 'Kept, Alcove Nineteen',
        form: 'robed',
        voice: 'mid',
        palette: { robe: '#2f3a44', trim: '#d9c58a', skin: '#d0bb9e', glow: '#ffe3a6' },
        greet: [
          'A man stands in alcove nineteen with one foot forward and his weight already committed, wearing an expression of mild interest that has had two centuries to settle in.',
          '"Half a step. Not late. Not early. *Half.* Do come closer — I move everything from the elbows down. Enough to be a host, not enough to be a rescue."'
        ],
        idle: ['"I am not going anywhere, which is a joke I have made four times and will make again."'],
        choices: [
          {
            id: 'f6_c_ibbet_hatch',
            text: 'Show him the stopped tooth.',
            require: { items: ['stopped_tooth'] },
            lockedText: '(You would need something from this floor that has already stopped.)',
            reply: [
              'He looks at it with the first real hunger you have seen here. "That is off the great wheel. Hold it lower — there."',
              'The third flagstone sinks and slides. Below: warmth, pipework, people talking over one another. "Go down. They will tell you the thing I am not permitted to, on account of being decorative."'
            ],
            effects: [
              { t: 'unlock', to: 'f6_underfloor' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_ibbet_pockets',
            text: 'Ask what he is still carrying.',
            reply: [
              '"Everything. Whatever I had at the half step I still have, forever, at temperature."',
              'He tips a purse into your palm. "Buy a minute from Tock, and do not let him call it generous. It is a markdown with a hat on."'
            ],
            effects: [
              { t: 'gold', n: 22 },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_ibbet_offbeat',
            text: 'Ask about the gallery at the far end.',
            reply: [
              '"Half a beat out from everything else, and it does not consider that a fault. It considers it a *style*."',
              '"It takes a beat of grace for the discourtesy of being in step, then opens the late door onto the Marching Floor. Half a step, half a beat. It is the only expertise I have left."'
            ],
            effects: [{ t: 'flag', id: 'f6_told_offbeat' }]
          },
          {
            id: 'f6_c_ibbet_companion',
            text: 'Ask who he came down with.',
            reply: [
              'The mild interest does not change. It becomes, very slightly, a held thing.',
              '"Alcove twenty is occupied. That is the entire answer I give. Ask me about the hatch, the gallery, the price of brass. Not that."'
            ],
            effects: [
              { t: 'flag', id: 'f6_asked_ibbet_companion' },
              { t: 'sound', id: 'whisper' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f6_underfloor', locked: true, label: 'The Flagstone Hatch' },
        { to: 'f6_offbeat_gallery', label: 'The Long Gallery' }
      ]
    },

    {
      id: 'f6_offbeat_gallery',
      name: 'The Offbeat Gallery',
      kind: 'deadend',
      size: 'medium',
      desc: 'A mirrored hall running half a beat out of step with the rest of the floor, so that everything in it has already happened slightly.',
      props: ['mirrors', 'gears'],
      onEnter: [
        { t: 'say', text: 'You reach for a doorframe that is where it will be, and put your hand through where it wasn’t.' },
        { t: 'sound', id: 'crack' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'The gallery considers the discourtesy settled, and opens the late door.' },
        { t: 'unlock', to: 'f6_march' },
        { t: 'sound', id: 'unlock' }
      ],
      doors: [{ to: 'f6_march', locked: true, label: 'The Late Door' }]
    },

    {
      id: 'f6_oiling_bay',
      name: 'The Oiling Bay',
      kind: 'branch',
      size: 'medium',
      desc: 'A low bay of standpipes and drip-trays where something long and jointed works along the racks, lubricating things that will not need it for a century.',
      props: ['pipes', 'machine', 'table'],
      onEnter: [{ t: 'sound', id: 'water' }],
      npc: {
        id: 'f6_sump',
        name: 'Sump',
        title: 'Oiler of the Southern Racks',
        form: 'coiled',
        voice: 'broken',
        palette: { robe: '#2a2620', trim: '#8f7a4a', glow: '#c9a14e' },
        greet: [
          'It is mostly hose and elbow, and does not stop working while it talks. "Thicker than that. Sorry — to the rack. Not to you. Hello."',
          '"Nine cycles ahead. Nothing here needs oil. I keep oiling because stopping would be a decision, and I have not been authorised to make decisions since — thicker than that — since some while ago."'
        ],
        idle: ['"Thicker. Still oiling. Ask. I am not busy, I am only occupied."'],
        choices: [
          {
            id: 'f6_c_sump_oil',
            text: 'Ask for a flask of slow oil.',
            reply: [
              '"Take two. Nine cycles of surplus and a standing order that will not die."',
              '"On a mechanism about to close on you it gives four seconds. Four seconds is the difference between Harrow Bell and Harrow Bell in a rack."'
            ],
            effects: [
              { t: 'item', id: 'slow_oil', n: 1 },
              { t: 'sound', id: 'water' }
            ]
          },
          {
            id: 'f6_c_sump_pass',
            text: 'Wait for the third quarter, and go through.',
            require: { flags: ['f6_told_south'] },
            lockedText: '(You do not know which quarter the bay shutter keeps.)',
            reply: [
              '"You have the card. The Room punches those and nobody takes them, and it does not say anything, but I think it minds."',
              'On the third quarter the shutter rolls up and stays up for eleven seconds — ample, when you know it is eleven. "On time. Rarer down here than gold."'
            ],
            effects: [
              { t: 'unlock', to: 'f6_march' },
              { t: 'flag', id: 'f6_crossed_clean' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_sump_force',
            text: 'Go under the shutter on the half-beat.',
            reply: [
              '"Do not — thicker — do not do that."',
              'You do it. The shutter comes down on the back of your heel, the world goes white and silent, and you are through with the taste of brass in your mouth.',
              '"That is why I said do not," says Sump, without any satisfaction at all. "I will oil it. It never helps. I oil it anyway."'
            ],
            effects: [
              { t: 'say', text: 'The shutter comes down on the half-beat, as shutters do.' },
              { t: 'heart', n: -1 },
              { t: 'sound', id: 'heartloss' },
              { t: 'unlock', to: 'f6_march' }
            ]
          },
          {
            id: 'f6_c_sump_stopped',
            text: 'Ask what it was oiling when everything stopped.',
            reply: [
              '"No."',
              'The hose keeps working. Nothing in the bay changes at all, which is itself the change. "Ask me about viscosity. I am extremely good on viscosity."'
            ],
            effects: [{ t: 'flag', id: 'f6_asked_sump_stop' }]
          }
        ]
      },
      doors: [{ to: 'f6_march', locked: true, label: 'The Bay Shutter' }]
    },

    // ---------------------------------------------------------------- EAST
    {
      id: 'f6_eastwalk',
      name: 'The Eleven-Minute Walk',
      kind: 'corridor',
      size: 'hall',
      desc: 'A colonnade of brass pillars with a stall at one end, a bench along one wall, and a clockface set into the ceiling the wrong way round.',
      props: ['pillars', 'hanginglights', 'gears'],
      onEnter: [
        { t: 'say', text: 'Every pillar carries a small dial. None of them agree, and all of them are correct.' },
        { t: 'sound', id: 'chime' }
      ],
      doors: [
        { to: 'f6_stall', label: 'The Stall' },
        { to: 'f6_waiting_bench', label: 'The Bench' },
        { to: 'f6_clockface', label: 'The Glass Stair' }
      ]
    },

    {
      id: 'f6_stall',
      name: 'The Stall of Small Durations',
      kind: 'shop',
      size: 'small',
      desc: 'A licensed booth of dark wood and brass drawers, each drawer labelled with a length of time, and most of them empty.',
      props: ['table', 'machine', 'hanginglights'],
      onEnter: [{ t: 'sound', id: 'coin' }],
      npc: {
        id: 'f6_tock',
        name: 'Vesper Tock',
        title: 'Timekeeper, Licensed',
        form: 'hunched',
        voice: 'dry',
        palette: { robe: '#3b3126', trim: '#e2c47a', skin: '#c2ac8d', glow: '#ffd98a' },
        greet: [
          'A small man behind a small counter, a jeweller\'s glass to one eye and a second, loose, in a pair of tweezers.',
          '"Seconds, four. Minutes, fourteen. Questions free for the first three and a second each after. Yes, that is circular. It is the only honest pricing on this floor."'
        ],
        idle: ['"I buy back. At a markdown. I want that clear before you are disappointed in me."'],
        choices: [
          {
            id: 'f6_c_tock_trade',
            text: 'Trade.',
            once: false,
            reply: ['"Drawers are open. Mind the third one down — it has eleven minutes in it and they are all somebody\'s."'],
            effects: [
              {
                t: 'shop',
                stock: [
                  { item: 'spare_second', price: 4 },
                  { item: 'spare_minute', price: 14 },
                  { item: 'slow_oil', price: 10 },
                  { item: 'tallow_candle', price: 8 },
                  { item: 'borrowed_hour', price: 96 }
                ],
                buys: [
                  { item: 'spare_second', price: 1 },
                  { item: 'spare_minute', price: 6 },
                  { item: 'slow_oil', price: 4 },
                  { item: 'apology_slip', price: 9 },
                  { item: 'kept_countbook', price: 20 },
                  { item: 'stopped_tooth', price: 24 },
                  { item: 'salt_shard', price: 12 }
                ]
              }
            ]
          },
          {
            id: 'f6_c_tock_hour',
            text: 'Ask about the hour in the case.',
            reply: [
              '"Ninety-six. I will not move. The price is not a negotiating position, it is a description."',
              '"Minutes are retail. An hour is a *structure* — put one into a thing and the thing holds. You cannot do that with sixty minutes any more than you can build a wall out of sand. Where it came from I will not say."'
            ],
            effects: [
              { t: 'flag', id: 'f6_saw_hour' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f6_c_tock_truename',
            text: 'Name the hour’s true price.',
            require: { class: ['coinwright'], gold: 52 },
            lockedText: '(You would need the Skeleton Sigil and fifty-two gold to argue this properly.)',
            reply: [
              'You put the Sigil down and say the number underneath the asking price — what it cost him, plus interest on two centuries of not selling it.',
              '"Fifty-two. I have asked ninety-six for two hundred years so that nobody would buy it." He wraps it with a care that has nothing to do with commerce. "It was never mine to keep. I only had a licence."'
            ],
            effects: [
              { t: 'gold', n: -52 },
              { t: 'item', id: 'borrowed_hour', n: 1 },
              { t: 'sound', id: 'coin' },
              { t: 'flag', id: 'f6_bought_hour_true' }
            ]
          },
          {
            id: 'f6_c_tock_behind',
            text: 'Ask what is behind the stall.',
            reply: [
              '"The Sealed Minute. Third question, so it is free, and I would have told you anyway."',
              '"One minute of the year the Cadence stopped. Going in costs a beat of grace — not personal, it is inventory — and gives you a minute back, boxed. I have watched four people find that out the expensive way."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_sealed' },
              { t: 'unlock', to: 'f6_sealed_minute' },
              { t: 'sound', id: 'unlock' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_sealed_minute', locked: true, label: 'The Glass Drawer' }]
    },

    {
      id: 'f6_sealed_minute',
      name: 'The Sealed Minute',
      kind: 'deadend',
      size: 'tiny',
      desc: 'A glass cell holding one minute of the year everything stopped: preserved at the correct temperature, labelled, and absolutely still.',
      props: ['glass', 'machine'],
      onEnter: [
        { t: 'say', text: 'The minute notices you, the way stock notices a hand in the drawer.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'It takes its beat, boxes one of its own, and puts the box in your hand. Inventory is inventory.' },
        { t: 'item', id: 'spare_minute', n: 1 },
        { t: 'sound', id: 'chime' },
        { t: 'move', to: 'f6_eastwalk' }
      ],
      doors: []
    },

    {
      id: 'f6_waiting_bench',
      name: 'The Waiting Bench',
      kind: 'branch',
      size: 'medium',
      desc: 'A brass bench bolted along the wall opposite a gate, worn to a shine in two places, with a meter beside it that is running.',
      props: ['table', 'chains', 'hanginglights'],
      onEnter: [
        { t: 'say', text: 'A meter beside the bench counts up. It is measuring how long you have been in the room.' },
        { t: 'sound', id: 'gear' }
      ],
      npc: {
        id: 'f6_dree',
        name: 'Dree Almsworth',
        title: 'Petitioner, Seated',
        form: 'child',
        voice: 'high',
        palette: { robe: '#33404a', trim: '#bfe4ff', skin: '#dcc4a8', glow: '#cfe8ff' },
        greet: [
          'A girl in a salt-stained coat two sizes too large sits at the far end with her boots off, doing arithmetic on the wall in chalk.',
          '"Forty-one. Forty-two. Sorry — the gate. It opens on a cycle of forty-four, and if you sit here it opens for free, eventually. The meter is the catch. Reasonable per minute and unreasonable in aggregate."'
        ],
        idle: ['"Forty-three. Forty-four. Hm. Forty-one again."'],
        choices: [
          {
            id: 'f6_c_dree_why',
            text: 'Ask why she is still sitting.',
            reply: [
              '"Because waiting is safe. Three beats of grace, all three, still mine. Not a scratch."',
              '"I am eleven rooms from where I started and I have not been hurt once. Notice that I said that out loud, and that neither of us thinks it sounds like a success."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_dree' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f6_c_dree_timed',
            text: 'Cross on the mirrored count.',
            require: { flags: ['f6_told_east'] },
            lockedText: '(You would need the count off the reversed clockface.)',
            reply: [
              '"You have been to the glass. Nobody goes to the glass. It is up a stair."',
              'You walk through the gate on the number. The meter registers four seconds and charges you nothing. "Four seconds," Dree says, and looks at her wall, and does not add anything to it.'
            ],
            effects: [
              { t: 'unlock', to: 'f6_march' },
              { t: 'flag', id: 'f6_crossed_clean' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_dree_wait',
            text: 'Sit, and wait out the cycle.',
            require: { gold: 20 },
            lockedText: '(Twenty gold. The meter does not extend credit.)',
            reply: [
              'Forty-four minutes. The gate opens. Nothing whatsoever happens to you. You are not hurt. You are not anything.',
              '"Safe," says Dree, moving her boots so you can pass. "I am not being bitter. It really is safe. Forty-one. Forty-two."'
            ],
            effects: [
              { t: 'gold', n: -20 },
              { t: 'flag', id: 'f6_waited_out' },
              { t: 'unlock', to: 'f6_march' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_dree_chalk',
            text: 'Ask to read the wall.',
            reply: [
              '"It is only sums."',
              'It is only sums, and every column balances. At the bottom of the last, smaller, unerased: *this is what I spent it all on.* "Do not read the bottom bit," she says, a little late. "Forty-three."'
            ],
            effects: [
              { t: 'flag', id: 'f6_read_dree_wall' },
              { t: 'item', id: 'chalk_stub', n: 1 }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_march', locked: true, label: 'The Bench Gate' }]
    },

    {
      id: 'f6_clockface',
      name: 'The Reversed Clockface',
      kind: 'branch',
      size: 'medium',
      desc: 'A gallery behind the great east dial, where the hands are read from the wrong side and are therefore, according to their keeper, read correctly.',
      props: ['mirrors', 'glass', 'gears'],
      onEnter: [
        { t: 'sound', id: 'chime' },
        { t: 'say', text: 'From back here the numbers run the other way, and the hands sweep backwards, and the time is still right.' }
      ],
      npc: {
        id: 'f6_mim',
        name: 'Mim Sexton',
        title: 'Reader of the Wrong Face',
        form: 'floating',
        voice: 'bell',
        palette: { robe: '#2b3a46', trim: '#cfe6f2', glow: '#bfe4ff' },
        greet: [
          'She hangs just off the glass with her back to the room, watching the hands go the wrong way round, and does not turn when you come in.',
          '"Eleven past. Which is to say, forty-nine to. The front of the dial tells you what time it is. The back tells you how much of it is left. I find the second question more honest."'
        ],
        idle: ['"Twenty past. Which is to say, forty to. Take your pick."'],
        choices: [
          {
            id: 'f6_c_mim_read',
            text: 'Let her read the mirrored face for you.',
            reply: [
              '"Stand there. Do not look at the hands, look at the gap behind them."',
              'She reads off remainders instead of hours. Eleven minutes to the bench gate. Four to the shutter. The whole floor as a list of things about to run out — and it is not frightening, it is *usable*.',
              '"Now you know when to cross. Which is to say: when not to."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_east' },
              { t: 'unlock', to: 'f6_march' },
              { t: 'sound', id: 'unlock' },
              { t: 'say', text: 'You have been told when to cross the eastern gates.' }
            ]
          },
          {
            id: 'f6_c_mim_coins',
            text: 'Collect the coin fallen behind the glass.',
            reply: ['"Two hundred years of things dropped down the front of a dial. Help yourself. I have no pockets and no appetite. Which is to say: I had both once, and I am not going to make a story of it."'],
            effects: [
              { t: 'gold', n: 18 },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_mim_below',
            text: 'Ask what is on the floor below.',
            reply: [
              '"Paper and mirror. Which is to say: walls that listen, and walls that do worse than listen."',
              '"I will not discuss it. Not because it is forbidden — because down there a thing said aloud is a thing *done*."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_choir' },
              { t: 'codex', id: 'f6_choir_rumour', title: 'What Mim Would Not Say', text: 'The seventh floor is paper and mirror, and the walls there attend to speech with more than attention. The Clockmarch\'s residents, otherwise happy to discuss anything with a number attached, do not discuss the Choir. They change the subject to arithmetic.' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_march', locked: true, label: 'The Mirror Door' }]
    },

    // --------------------------------------------------------- CONVERGENCE
    {
      id: 'f6_march',
      name: 'The Marching Floor',
      kind: 'hub',
      size: 'grand',
      desc: 'The floor itself is the mechanism: ten thousand brass plates rising and falling in a wave that crosses the hall every eleven seconds, forever, for nobody.',
      props: ['machine', 'gears', 'pillars', 'chains'],
      onEnter: [
        { t: 'sound', id: 'gear' },
        { t: 'say', text: 'The wave crosses the hall, reaches the far wall, and begins again. It has done this without an audience for two hundred years.' }
      ],
      npc: {
        id: 'f6_cradle',
        name: 'Cradle',
        title: 'Foreman of the Second Shift',
        form: 'armored',
        voice: 'low',
        palette: { robe: '#39332b', trim: '#c9a14e', glow: '#ffbe63' },
        greet: [
          'A broad plated figure at a lectern, roster board in hand, calling names to an empty floor as the wave goes by.',
          '"Nineteen. Nineteen, you are up." A pause exactly long enough for nineteen to answer. "Marked absent. — You will be Forty-Six. I dislike a gap in a roster."'
        ],
        idle: ['"Twenty-One. Marked absent. — Sorry. Where were we, Forty-Six."'],
        choices: [
          {
            id: 'f6_c_cradle_roster',
            text: 'Ask about the roster.',
            reply: [
              '"Two hundred and six names. Second shift. I am not being sentimental, I am reading attendance figures."',
              '"I call it every eleven minutes, with the pause left for each one, because a roster that does not leave the pause is a list. Yes, I know they are not coming. Knowing is not adjusting. I decline to adjust."'
            ],
            effects: [
              { t: 'flag', id: 'f6_heard_roster' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f6_c_cradle_regulator',
            text: 'Ask about the regulator.',
            reply: [
              '"Antiphon. East cage. If you want off this floor quickly, Antiphon will offer to skip a tooth. It is not a trick. It works."',
              '"What it will not volunteer: a skipped tooth does not vanish, it *arrives late somewhere else* — under my floor, where forty-one people are load-bearing. I am not going to tell you what to do."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_regulator' },
              { t: 'say', text: 'A skipped tooth does not vanish. It arrives late somewhere else.' }
            ]
          },
          {
            id: 'f6_c_cradle_pendulum',
            text: 'Ask for the pendulum well.',
            require: { flags: ['f6_knows_downbeat'] },
            lockedText: '(You would have to know how a person holds a beat.)',
            reply: [
              'The roster board comes down. For the first time the pause after a name is not left. "You have been under the floor."',
              '"The well is behind the lectern and always has been. Holding a beat is longer than waiting and costs more than skipping." The plates part on a shaft. "Forty-Six. Present. Go on."'
            ],
            effects: [
              { t: 'unlock', to: 'f6_pendulum' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_cradle_warden',
            text: 'Refuse to be entered on the roster.',
            require: { class: ['warden'] },
            reply: [
              'You give the Iron Pact formula for declining a muster you have not sworn to. Nine words. Cradle listens to all nine, then strikes Forty-Six off the board.',
              '"Correctly refused. Take the shift purse. It has been accruing for a roster that will not spend it."'
            ],
            effects: [
              { t: 'gold', n: 34 },
              { t: 'flag', id: 'f6_refused_roster' },
              { t: 'sound', id: 'coin' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f6_regulator', label: 'The East Cage' },
        { to: 'f6_pendulum', locked: true, label: 'The Pendulum Well' }
      ]
    },

    {
      id: 'f6_regulator',
      name: 'The Regulator Cage',
      kind: 'branch',
      size: 'medium',
      desc: 'A cage of fine linkages around a single ratchet wheel, which decides, tooth by tooth, how fast the entire floor is permitted to be.',
      props: ['machine', 'gears', 'chains'],
      onEnter: [{ t: 'sound', id: 'gear' }],
      npc: {
        id: 'f6_antiphon',
        name: 'Antiphon',
        title: 'the Regulator',
        form: 'construct',
        voice: 'broken',
        palette: { robe: '#2e3238', trim: '#a8b4c0', glow: '#dce6f0' },
        greet: [
          'A narrow brass thing folded around the ratchet, all fingers, adjusting a tolerance too small to see.',
          '"Visitor. *Visitor.* Tolerance is four thousandths. It should be three. You want the stair. *Stair.* Nine seconds. There is a catch, and I will not pretend otherwise, because pretending would be lying."'
        ],
        idle: ['"Four thousandths. *Thousandths.* The stair is nine seconds away whenever you like."'],
        choices: [
          {
            id: 'f6_c_anti_ask',
            text: 'Ask what breaks downstream.',
            reply: [
              '"Downstream. *Downstream.*" The fingers stop. It is the first thing on this floor that has looked uncomfortable.',
              '"Beats are conserved. A skipped tooth arrives under the marching floor, late and doubled, and something there takes it. I am not permitted to know what. *What.* You are. I would consider it a courtesy if you looked."'
            ],
            effects: [
              { t: 'flag', id: 'f6_told_downstream' },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f6_c_anti_skip',
            text: 'Force the ratchet to skip a tooth.',
            reply: [
              '"Skip. *Skip.* Hold the linkage. Both hands. Now."',
              'One flat crack, like a knuckle. The hall behind you goes out of phase and settles. The stair unfolds in nine seconds exactly, as advertised.',
              '"Done. A beat has arrived late and doubled under the marching floor. I am not permitted to know what it landed on. *Landed on.* You are."'
            ],
            effects: [
              { t: 'say', text: 'Something flat cracks, once, and the hall behind you settles a fraction out of phase.' },
              { t: 'sound', id: 'crack' },
              { t: 'flag', id: 'f6_skipped_gear' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'unlock' }
            ]
          },
          {
            id: 'f6_c_anti_pay',
            text: 'Pay the delay and let the ratchet come round.',
            require: { gold: 25 },
            lockedText: '(Twenty-five gold. The cage bills by the tooth.)',
            reply: [
              '"Pay. *Pay.* Sit. One hundred and thirty-two teeth, and I will count them, and you will find it tedious."',
              'It is. Nothing is damaged, and nobody under the floor is handed anything late and doubled. "Slow, expensive, and harmless. *Harmless.* Nobody ever thanks me for this one."'
            ],
            effects: [
              { t: 'gold', n: -25 },
              { t: 'flag', id: 'f6_waited_out' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'coin' }
            ]
          },
          {
            id: 'f6_c_anti_oil',
            text: 'True the tolerance with slow oil.',
            require: { items: ['slow_oil'] },
            lockedText: '(It would take oil thicker than anything you are carrying.)',
            reply: [
              '"That is — *that is* — that is Sump\'s. Pour it on the pallet. On the *pallet*, not the wheel."',
              'The fingers work for eleven seconds, then go still in a way that is unmistakably relief. "Three thousandths. *Three.* Take the brass off the trim and go before I say something undignified."'
            ],
            effects: [
              { t: 'item', id: 'slow_oil', n: -1 },
              { t: 'gold', n: 26 },
              { t: 'flag', id: 'f6_trued_regulator' },
              { t: 'sound', id: 'chime' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_exit', locked: true, label: 'The Escapement Stair' }]
    },

    {
      id: 'f6_pendulum',
      name: 'The Pendulum Well',
      kind: 'vault',
      size: 'vault',
      desc: 'A shaft going down further than the floor should allow, and in it a pendulum the size of a bell tower, swinging very slightly out of true.',
      props: ['machine', 'chains', 'pipes', 'hanginglights'],
      onEnter: [
        { t: 'sound', id: 'bell' },
        { t: 'say', text: 'It swings. At the end of every swing there is a pause one beat too long, and has been for two hundred years.' }
      ],
      npc: {
        id: 'f6_downbeat',
        name: 'The Downbeat',
        title: 'Missing Since the Stop',
        form: 'wisp',
        voice: 'bell',
        palette: { robe: '#1e2630', trim: '#ffd98a', glow: '#ffe9b8' },
        greet: [
          'Something stands at the bottom of the swing where the beat ought to land. It arrives fractionally after it speaks, so that you hear it and then it is there.',
          '"I was given early. One beat, into a room that had already stopped, and I have had nowhere to land since. Every beat kept here has been kept *around* me. I would like that to end."'
        ],
        idle: ['"Still early. Still nowhere to land. The swing is always coming round."'],
        choices: [
          {
            id: 'f6_c_pend_heart',
            text: 'Hold the beat. Spend one of your three.',
            require: { flags: ['f6_knows_downbeat'], minHearts: 2 },
            lockedText: '(You would need to know how — and a beat you could stand to lose.)',
            reply: [
              'You stand where the beat ought to land and do not let the next moment begin. It is like *refusing*, with your whole body, while the wave above comes round and comes round and slowly stops being late.',
              'It costs one of your three, and you feel it go — not torn out, *spent*, which is worse and better.',
              '"Oh," says the Downbeat, from precisely on time, for the first occasion in two centuries. "*Oh.*"'
            ],
            effects: [
              { t: 'heart', n: -1 },
              { t: 'sound', id: 'heartloss' },
              { t: 'flag', id: 'f6_held_beat' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'The Clockmarch is in step. Above you, somebody lowers a raised hand at exactly the right moment.' },
              { t: 'codex', id: 'f6_in_step', title: 'The March, Back In Step', text: 'For two hundred years the Clockmarch kept perfect time one beat behind itself, because correcting the error would have meant admitting there had been a moment of being wrong. A Petitioner held the downbeat open and paid for it out of their own grace. The floor did not thank them; floors do not. It simply stopped being late, which is the only gratitude a mechanism has available.' }
            ]
          },
          {
            id: 'f6_c_pend_hour',
            text: 'Hold the beat. Spend the borrowed hour.',
            require: { flags: ['f6_knows_downbeat'], items: ['borrowed_hour'] },
            lockedText: '(You would need to know how — and to carry an hour, not minutes.)',
            reply: [
              'You put the hour into the gap, because an hour is a structure and holds where sixty minutes would only pour. The long wrong pause closes like a mouth.',
              '"That was borrowed," says the Downbeat. "It has gone back to whoever lent it. That is how borrowing ends."'
            ],
            effects: [
              { t: 'item', id: 'borrowed_hour', n: -1 },
              { t: 'flag', id: 'f6_held_beat' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'The Clockmarch is in step. The hour has gone back to whoever lent it.' }
            ]
          },
          {
            id: 'f6_c_pend_minutes',
            text: 'Hold the beat. Spend every minute you bought.',
            require: { flags: ['f6_knows_downbeat'], items: ['spare_minute'], gold: 40 },
            lockedText: '(You would need to know how — a boxed minute, and forty gold besides.)',
            reply: [
              'You let the minute out into the gap. It is not enough, so you put the coin in after it. It works the way a wall built out of sand works: badly, slowly, and — because you keep pouring — in the end.',
              '"More expensive than the hour," the Downbeat observes, arriving exactly on time. "I would not have stopped you."'
            ],
            effects: [
              { t: 'item', id: 'spare_minute', n: -1 },
              { t: 'gold', n: -40 },
              { t: 'flag', id: 'f6_held_beat' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'bell' },
              { t: 'say', text: 'The Clockmarch is in step. You are considerably poorer, and exactly on time.' }
            ]
          },
          {
            id: 'f6_c_pend_back',
            text: 'Step back from the swing.',
            reply: [
              '"Of course. *Of course.* It is not owed." It says this without any edge at all, and does not follow you.',
              '"The stair is behind you and it works. Two hundred years is a long time and also, I have found, not a deadline."'
            ],
            effects: [
              { t: 'flag', id: 'f6_stepped_back' },
              { t: 'unlock', to: 'f6_exit' },
              { t: 'sound', id: 'unlock' }
            ]
          }
        ]
      },
      doors: [{ to: 'f6_exit', locked: true, label: 'The Well Stair' }]
    },

    // ----------------------------------------------------------------- EXIT
    {
      id: 'f6_exit',
      name: 'The Escapement Stair',
      kind: 'exit',
      size: 'large',
      desc: 'A stair that unfolds one step at a time, on the beat, and folds up again behind you, and will not be hurried.',
      props: ['stairs', 'gears', 'hanginglights'],
      onEnter: [{ t: 'sound', id: 'gear' }],
      npc: {
        id: 'f6_escapement',
        name: 'The Escapement',
        title: 'Which Lets Go, Once Per Beat',
        form: 'construct',
        voice: 'bell',
        palette: { robe: '#242c34', trim: '#d9c58a', glow: '#ffe3a6' },
        greet: [
          'The stair is a single mechanism that catches, holds, and releases, one step per beat — the entire trick of every clock ever built.',
          '"I catch the weight of the floor above and let one beat of it past. I will not hold you; holding is the other half of my job, and I only do it to things that are falling."'
        ],
        idle: ['"One at a time. Whenever you like."'],
        choices: [
          {
            id: 'f6_c_exit_token',
            text: 'Descend, on the beat, in step.',
            require: { flags: ['f6_held_beat'] },
            lockedText: '(The stair would know. You are still a beat behind it.)',
            reply: [
              'The step arrives under your foot before you reach for it. Not early — *with* you.',
              'Far above, a hand raised for two hundred years comes down, and the floor does not have to cover for it. "—and—" says a dry voice, from somewhere no longer one beat away. It does not say anything else.',
              'Something hexagonal and black and cold goes into your hand on the seventh step, with one word fired into the edge of it.'
            ],
            effects: [
              { t: 'sound', id: 'chime' },
              { t: 'say', text: 'The Sixth Ward opens for an answer, not a passage.' },
              { t: 'floorEnd', token: true }
            ]
          },
          {
            id: 'f6_c_exit_skipped',
            text: 'Descend on the tooth you skipped.',
            require: { flags: ['f6_skipped_gear'] },
            lockedText: '(You did not take anything from the ratchet.)',
            reply: [
              'The stair unfolds fast and one step short, and you make up the difference with your knees.',
              '"You came down on a borrowed tooth. Something under the marching floor took it, late and doubled. Nothing broke that you will ever see. That is not absolution. It is a schedule."'
            ],
            effects: [
              { t: 'sound', id: 'stone' },
              { t: 'floorEnd' }
            ]
          },
          {
            id: 'f6_c_exit_down',
            text: 'Descend.',
            reply: [
              'One step per beat. You go down at the speed the stair permits, which is the speed everything here goes at.',
              '"Thank you for not hurrying me. Nobody thanks me, and I have decided to assume they meant to." Above you, on time and one beat behind, the Clockmarch keeps perfect time for a thing that is not listening.'
            ],
            effects: [
              { t: 'sound', id: 'bell' },
              { t: 'floorEnd' }
            ]
          }
        ]
      },
      doors: []
    }
  ]
};

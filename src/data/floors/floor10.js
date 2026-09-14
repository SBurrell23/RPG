export default {
  id: 10,
  name: 'The Cadence',
  theme: 'cadence',
  subtitle: 'Ward the Tenth — Will you be remembered, or will you remember?',
  intro: 'The stair ends in warm light, which after nine floors is the most alarming thing that has happened to you. Somewhere ahead, something very large is not quite running.',
  entry: 'f10_foot',

  items: {
    last_page: {
      name: 'The Last Page', kind: 'relic', value: 0, icon: 'scroll', tint: '#ffc860', bound: true,
      desc: 'Blank. Not empty — blank, the way a page is blank before somebody decides. It is the only unwritten thing left in the Verrow.'
    },
    warm_key: {
      name: 'The Warm Key', kind: 'key', value: 0, icon: 'key', tint: '#ffd88a', bound: true,
      desc: 'Every key in the Verrow is warm. This is the one they were all copies of.'
    },
    first_tally: {
      name: 'The First Tally', kind: 'relic', value: 70, icon: 'hex', tint: '#8aa2b0',
      desc: 'A single scratch on a chip of black glass. The first thing the Cadence ever counted, which was itself.'
    },
    borrowed_face: {
      name: 'A Borrowed Face', kind: 'trade', value: 55, icon: 'mask', tint: '#e0d4c0',
      desc: 'Somebody’s features, kept safe by a friend who is running out of places to keep things. It is not yours. It is not, any longer, quite theirs.'
    },
    quiet_lamp_oil: {
      name: 'Oil for the Quiet Lamp', kind: 'consumable', value: 30, icon: 'vial', tint: '#ffb84a',
      desc: 'Enough for one more hour of being able to see. The Concession will not say an hour of what.'
    }
  },

  rooms: [
    // ---------------------------------------------------------------- entry
    {
      id: 'f10_foot',
      name: 'The Foot of the Stair',
      kind: 'entry',
      size: 'large',
      desc: 'Nine floors of cold, and then this: gold light on black marble, and a small bent man sitting on the bottom step as though he has been saving you a seat.',
      props: ['stairs', 'pillars', 'candles'],
      npc: {
        id: 'f10_hask',
        name: 'Hask',
        title: 'the Tallyman, a long way from his desk',
        form: 'hunched',
        voice: 'dry',
        palette: { robe: '#3a3830', trim: '#d4a848', skin: '#c8bca6', glow: '#ffc860' },
        greet: [
          'He is turning a smooth grey stone over in one hand. He does not look up, and then — unprecedentedly — he does.',
          '"You got through," he says. It is not congratulation. It is the sound a man makes when a number he has been carrying finally resolves.',
          '"I have not left that desk in two hundred years. I came down for this. I want that noted, because there is nobody left up there to note it, and I find, at the end, that I mind."'
        ],
        idle: ['"Go on, then," he says, to the stone. "It’s not going to ask itself."'],
        choices: [
          {
            id: 'f10_c_hask_why',
            text: 'Ask why he came down.',
            reply: [
              '"Because you are the first in two hundred years to reach the tenth, and because I count things, and an event that has happened once is the only kind worth attending."',
              'He turns the stone. "And because I wanted to see what you’d brought. Professional curiosity. The First Ward asked and I never got to hear the answer; the Mouth doesn’t share."'
            ],
            effects: [
              { t: 'flag', id: 'f10_hask_spoke' },
              { t: 'unlock', to: 'f10_gallery' }
            ]
          },
          {
            id: 'f10_c_hask_stone',
            text: 'Give him back the counting stone.',
            require: { items: ['tally_stone'] },
            lockedText: '(You would need the stone he lent you on the first floor.)',
            reply: [
              'You put it in his hand and close his fingers around it.',
              'For a moment the Tallyman of the Verrow is simply an old man on a step who has been given something back, which has not happened to him since before the Thinning had a name.',
              '"Noted," he says, with enormous difficulty. He presses something into your palm in exchange, hastily, to have something to do with his hands. "It’s the first one. The first thing the tower ever counted. Don’t ask me why I have it."'
            ],
            effects: [
              { t: 'item', id: 'tally_stone', n: -1 },
              { t: 'item', id: 'first_tally', n: 1 },
              { t: 'flag', id: 'f10_returned_stone' },
              { t: 'sound', id: 'bell' },
              { t: 'unlock', to: 'f10_gallery' },
              { t: 'unlock', to: 'f10_witnesses' }
            ]
          },
          {
            id: 'f10_c_hask_what',
            text: 'Ask what is waiting down here.',
            reply: [
              '"A chair and a lamp and a desk." He says it flatly, refusing all drama, which from Hask is a kind of kindness. "That is genuinely all. No monster. There was never a monster; there was a *job*, and the job stopped, and everything you have met on the way down is what a job looks like after two hundred years of not being done."',
              '"The Chair will ask you to sit in it. The Lamp will ask you to take it. Both of those are real offers and neither of them is a trick, and that is the worst of it, because it means you will have to decide on the merits."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_offer' },
              { t: 'unlock', to: 'f10_gallery' },
              { t: 'codex', id: 'f10_codex_job', title: 'There Was Never a Monster',
                text: 'Hask, at the foot of the tenth stair: "There was a job, and the job stopped, and everything you have met on the way down is what a job looks like after two hundred years of not being done."' }
            ]
          },
          {
            id: 'f10_c_hask_go',
            text: 'Go on down.',
            reply: ['"Mm," he says, and goes back to the stone, and the way ahead is open because it was never really shut.'],
            effects: [{ t: 'unlock', to: 'f10_gallery' }]
          }
        ]
      },
      doors: [
        { to: 'f10_gallery', locked: true, label: 'The Gilt Arch' },
        { to: 'f10_witnesses', locked: true, label: 'The Side Door' },
        { to: 'f10_concession', label: 'A Doorway With a Sign On It' }
      ]
    },

    // --------------------------------------------------------------- shop
    {
      id: 'f10_concession',
      name: 'The Last Concession',
      kind: 'shop',
      size: 'small',
      desc: 'A stall. At the bottom of the world, a stall, with a hand-lettered sign reading LAST ONE.',
      props: ['table', 'candles', 'crystals'],
      npc: {
        id: 'f10_sill',
        name: 'Sill',
        title: 'Salt-Born, proprietor',
        form: 'coiled',
        voice: 'broken',
        palette: { robe: '#c0c8c4', trim: '#ffd88a', glow: '#e4f2f6' },
        greet: [
          'A stack of pale coils behind a trestle table, arranged with what is unmistakably pride.',
          '"Brack is my cousin," it says immediately. "Nine floors up. Everybody asks. We are not close; it grew near a door and I grew near a *desk*, and that changes a person."',
          '"You are the only customer I have ever had. I have been open for two hundred years. Please look at the table, I have arranged it four thousand times."'
        ],
        idle: ['"Take your time. I have some."'],
        choices: [
          {
            id: 'f10_c_sill_shop',
            text: 'Look at the table.',
            once: false,
            reply: ['It watches you look with an intensity that is difficult to be on the receiving end of.'],
            effects: [{
              t: 'shop',
              stock: [
                { item: 'quiet_lamp_oil', price: 34, note: 'One more hour of being able to see. It will not say of what.' },
                { item: 'memory_of_bread', price: 30, infinite: true, note: 'Not bread. The recollection of some. Nourishing, annoyingly.' },
                { item: 'tallow_candle', price: 8, infinite: true, note: 'Honest light, down here where nothing else is.' },
                { item: 'borrowed_face', price: 66, note: 'Somebody’s features. Kept safe. Not by you.' },
                { item: 'black_glass_hex', price: 120, note: 'A Ward Token with no word fired into it. It has never meant anything and it never will.' }
              ],
              buys: [
                { item: 'salt_shard', price: 26 },
                { item: 'salt_lily', price: 34 },
                { item: 'grey_feather', price: 22 },
                { item: 'quiet_coin', price: 70 },
                { item: 'left_glove', price: 14 },
                { item: 'first_tally', price: 90 }
              ]
            }]
          },
          {
            id: 'f10_c_sill_blank',
            text: 'Ask about the blank token.',
            reply: [
              '"It is the shape of an answer with no answer in it." The coils shift. "I did not make it. I found it. Somebody got all the way down here carrying nine, and could not get the tenth, and had a *tenth* made, blank, so that the set would look complete."',
              '"It did not work. Obviously it did not work; the desk reads the words, not the shape. But they carried it the rest of the way and they held it in their hand at the end and I think it helped them, and I have never worked out whether that is the saddest thing in this tower or the bravest."'
            ],
            effects: [
              { t: 'codex', id: 'f10_codex_blank', title: 'The Blank Hex',
                text: 'A Ward Token with no word fired into it, made by a Petitioner who reached the tenth floor with nine and could not bear the gap. The reading desk is not fooled. It was never meant to fool the desk.' }
            ]
          },
          {
            id: 'f10_c_sill_price',
            text: 'Name the true price of the blank token.',
            require: { class: ['coinwright'] },
            reply: [
              'You say the number. It is zero. It has always been zero; the thing is a piece of glass.',
              '"*Yes*," says Sill, with the ecstatic relief of someone who has been waiting two centuries for a second opinion. "Yes. It is worth nothing. Take it. Take it, I have been unable to say so for two hundred years because nobody would let me finish."'
            ],
            effects: [
              { t: 'item', id: 'black_glass_hex', n: 1 },
              { t: 'flag', id: 'f10_named_blank' },
              { t: 'gold', n: 0 }
            ]
          }
        ]
      },
      doors: []
    },

    // ------------------------------------------------------------ witnesses
    {
      id: 'f10_witnesses',
      name: 'The Standing Room',
      kind: 'branch',
      size: 'grand',
      desc: 'They have come down to watch. Not all of them — somebody has to hold the note, somebody has to keep the beat — but a great many, from every floor, standing in the warm light with the awkwardness of people at a function.',
      props: ['pillars', 'banners', 'candles', 'statue'],
      npc: {
        id: 'f10_gathering',
        name: 'The Standing Room',
        title: 'those who could be spared',
        form: 'twin',
        voice: 'choral',
        palette: { robe: '#4a4438', trim: '#ffd88a', skin: '#d0c0a8', glow: '#ffc860' },
        greet: [
          'They speak more or less together, which two hundred years in the same building will do.',
          '"We are not here to advise you," says the Houndmaster, who has left the kennels unfed for the first time in four generations.',
          '"We are here because it is *happening*," says a drowned librarian, dripping onto marble that has been dry since before she was born, "and because things have not happened here for a long time, and we have decided to be the sort of people who turn up."'
        ],
        idle: ['They wait, and shuffle, and are very careful not to advise you.'],
        choices: [
          {
            id: 'f10_c_wit_ask',
            text: 'Ask them what they would do.',
            reply: [
              'A long, honest silence, of the kind that only happens when nobody is pretending.',
              '"Take the Lamp," says the Ledger-Keeper, who has stood in the rain for two centuries itemising what it cost. "Somebody should get out. It might as well be somebody who can say why they came."',
              '"Sit down in the Chair," says the Smith, who has not been given an order since the stop. "I would. I would sit down in it so fast."',
              '"Go home," says Gennet Wry, from the back, who declared everything eighty-one years ago and has not seen a stair since. "There is a third door and nobody ever uses it and I want, very badly, for one of you to use it."',
              'The Gardener says nothing at all, and inclines what is mostly a branch.'
            ],
            effects: [
              { t: 'flag', id: 'f10_heard_witnesses' },
              { t: 'unlock', to: 'f10_reading_room' },
              { t: 'codex', id: 'f10_codex_witnesses', title: 'Those Who Could Be Spared',
                text: 'The residents of the Verrow, gathered on the tenth floor to watch a Petitioner arrive, for the first time in two hundred years. They disagreed completely about what she should do and turned up anyway, which is the closest thing to a moral this tower has.' }
            ]
          },
          {
            id: 'f10_c_wit_ivo',
            text: 'Ask whether Ivo Small’s sister is here.',
            require: { flags: ['f1_ivo_sister'] },
            lockedText: '(You would have to know there was a sister.)',
            reply: [
              'The gathering parts, slightly, without being asked.',
              'She is standing near the front. She is about forty, and she has been forty for a long time, and she has her brother’s exact way of not quite standing still.',
              '"He’s at the pools," you say.',
              '"I know," she says. "I have known for a hundred and six years. There is no way back up and there was never going to be, and I have made my peace with it in the specific sense that I think about it constantly and have stopped complaining."',
              'She presses something flat and warm into your hand. "If you take the Chair — if you go into the wall and the world starts remembering again — he’ll remember me. That’s all. That’s the whole of my interest. I am not pretending it is a larger argument than it is."'
            ],
            effects: [
              { t: 'item', id: 'warm_key', n: 1 },
              { t: 'flag', id: 'f10_met_sister' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f10_c_wit_oath',
            text: 'Report to the Standing Room as a Warden reports.',
            require: { class: ['warden'] },
            reply: [
              'You give it plainly: floors held, floors lost, what it cost, what you are carrying. It takes a while. Nobody interrupts, because the one thing every institution in this tower has in common is that it respects a report.',
              'When you finish, the armoured figure of a dissolved order somewhere in the third rank does something with his right hand, and about forty other people, who have no idea what it means, copy him.'
            ],
            effects: [
              { t: 'flag', id: 'f10_reported' },
              { t: 'heal', n: 1 },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f10_c_wit_leave',
            text: 'Thank them, and go on.',
            reply: ['They make a path. Somebody, out of pure nerves, applauds, and stops.'],
            effects: [{ t: 'unlock', to: 'f10_reading_room' }]
          }
        ]
      },
      doors: [
        { to: 'f10_reading_room', locked: true, label: 'The Inner Door' },
        { to: 'f10_chair_room', label: 'The Low Door' }
      ]
    },

    // ------------------------------------------------------------- gallery
    {
      id: 'f10_gallery',
      name: 'The Gallery of Names',
      kind: 'hub',
      size: 'grand',
      desc: 'Names. Floor to ceiling, wall to wall, in a hand so small it is almost a texture — and about a third of the way along, they stop.',
      props: ['pillars', 'hanginglights', 'mirrors'],
      npc: {
        id: 'f10_index',
        name: 'The Reading',
        title: 'a Function, out of work',
        form: 'construct',
        voice: 'bell',
        palette: { robe: '#2a2620', trim: '#d4a848', glow: '#ffc860' },
        greet: [
          'Rings of light turning slowly in front of the place where the names stop.',
          '"Two hundred and six million, four hundred and eleven thousand, and then nothing," it says. "That is not a record of the dead. It is a record of the *remembered*. Everyone alive and known is on this wall."',
          '"The wall has not been added to since the stop. Everyone born in two hundred years is unrecorded. They are not forgotten yet. They are simply not written down, and unwritten things thin faster."'
        ],
        idle: ['"Two hundred and six million, four hundred and eleven thousand. And then nothing."'],
        choices: [
          {
            id: 'f10_c_gal_find',
            text: 'Look for your own name.',
            reply: [
              'It is not there. Of course it is not there; you were born well after the wall stopped.',
              '"You are the only person in this tower who is not on a wall somewhere," says the Reading, with something that might be envy. "Hask is filed. The Kept are catalogued. The court is entered in the registry. You are the last unrecorded thing in the Verrow and every single door down here opened for you *because* of it."',
              '"An unwritten thing can still be written. That is the entire reason the Wards let you pass. Not because you answered well. Because you could still be *filled in*."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_unwritten' },
              { t: 'item', id: 'last_page', n: 1 },
              { t: 'unlock', to: 'f10_desk' },
              { t: 'unlock', to: 'f10_margin' },
              { t: 'sound', id: 'chime' },
              { t: 'codex', id: 'f10_codex_unwritten', title: 'The Last Unwritten Thing',
                text: 'Everyone alive and remembered before the stop is written on the Gallery wall. Nothing has been added since. The Petitioner is the only person in the Verrow who is not written down anywhere, which is why every Ward opened: an unwritten thing can still be filled in.' }
            ]
          },
          {
            id: 'f10_c_gal_first',
            text: 'Ask about the first name on the wall.',
            reply: [
              '"Unreadable. Not damaged — *unreadable*, in the way a word is unreadable when the last person who could pronounce it stopped." The rings slow. "It is the name of whoever built this. I have been looking at it for two hundred years and I cannot make it resolve, and I was *designed* for exactly this."',
              '"I have concluded that they did not want to be. That they wrote everyone else down and left themselves illegible on purpose. I find that I approve, and that approving of it makes me extremely uneasy."'
            ],
            effects: [
              { t: 'flag', id: 'f10_asked_first' },
              { t: 'unlock', to: 'f10_margin' }
            ]
          },
          {
            id: 'f10_c_gal_read',
            text: 'Read the stopped line with the Emberglass Lens.',
            require: { class: ['ashcaller'] },
            reply: [
              'The lens goes hot enough to hurt. The last written name comes up out of the marble, and it is a date rather than a name — the day the Cadence stopped — and underneath it, in the same tiny hand, four words that were never meant to be legible:',
              '*I could not decide.*',
              'The Reading says nothing for a long time. "Two hundred years," it says at last. "Two hundred years and it was not a malfunction. It was a *hesitation*."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_hesitation' },
              { t: 'unlock', to: 'f10_desk' },
              { t: 'sound', id: 'whisper' },
              { t: 'codex', id: 'f10_codex_hesitation', title: 'I Could Not Decide',
                text: 'Beneath the last name written on the Gallery wall, in the builder’s own hand, on the day the Cadence stopped: four words. The tower did not break. Somebody was asked the tenth question and did not answer it, and two hundred years of Thinning is what a held breath looks like from underneath.' }
            ]
          },
          {
            id: 'f10_c_gal_on',
            text: 'Walk the length of the gallery.',
            reply: [
              'It takes a long time. The names go on and on and on and then they do not.',
              'At the far end there is a door, and beside the door, a desk.'
            ],
            effects: [
              { t: 'unlock', to: 'f10_desk' },
              { t: 'unlock', to: 'f10_witnesses' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f10_desk', locked: true, label: 'The Reading Desk' },
        { to: 'f10_margin', locked: true, label: 'The Margin' },
        { to: 'f10_quiet', label: 'A Door That Goes Up' },
        { to: 'f10_circulation', label: 'A Door That Goes Down' }
      ]
    },

    // ------------------------------------------------------------ dead end 1
    {
      id: 'f10_margin',
      name: 'The Unwritten Margin',
      kind: 'deadend',
      size: 'small',
      desc: 'The gap at the edge of the wall, where the names have not reached. It is not empty. It is *waiting*, which is worse.',
      props: ['mirrors', 'rubble'],
      onEnter: [
        { t: 'say', text: 'The margin tries, very politely, to write you down. It gets about a third of the way through your name before you get your hand over it.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'move', to: 'f10_gallery' }
      ],
      doors: []
    },

    // ------------------------------------------------------------ the desk
    {
      id: 'f10_desk',
      name: 'The Reading Desk',
      kind: 'vault',
      size: 'medium',
      desc: 'A desk of black glass with ten hexagonal recesses cut into it, arranged in a ring, each one the exact size of a Ward Token.',
      props: ['table', 'altar', 'candles', 'machine'],
      npc: {
        id: 'f10_desk_npc',
        name: 'The Desk',
        title: '',
        form: 'wisp',
        voice: 'low',
        palette: { robe: '#1e1a16', glow: '#ffc860' },
        greet: [
          'The recesses are cold. Everything else on this floor is warm.',
          '"I read complete answers," says the desk, in a voice like a hand flat on a table. "Ten Wards asked ten questions. A Token means you answered one of them all the way to the end instead of getting past it."',
          '"Most Petitioners arrive with none. Several have arrived with three. Nobody has ever put ten in me and I would like, before whatever happens next happens, to state clearly that I have not given up on it."'
        ],
        idle: ['The recesses are cold, and there are ten of them.'],
        choices: [
          {
            id: 'f10_c_desk_set',
            text: 'Set your Ward Tokens into the desk.',
            reply: [
              'You put in what you have. Each one goes down with a small sound like a full stop.',
              'The desk reads them. It takes almost no time at all, which is somehow the most humbling part.',
              '"Noted," it says, and you would swear on very little evidence that it is being careful with you.'
            ],
            effects: [
              { t: 'flag', id: 'f10_set_tokens' },
              { t: 'sound', id: 'token' },
              { t: 'unlock', to: 'f10_reading_room' }
            ]
          },
          {
            id: 'f10_c_desk_ask',
            text: 'Ask what ten would do.',
            reply: [
              '"Ten complete answers, taken together, are a *specification*." A pause with a great deal of restrained feeling in it. "That is not poetry. It is the literal engineering fact. The Foundry cannot begin work without an authorisation and there has not been one since the stop, because an authorisation requires a complete statement of intent and nobody has been able to produce one."',
              '"A person who has answered all ten Wards completely has produced one. Without meaning to. On the way down."',
              '"I am not telling you to go back and get them. You cannot go back. I am telling you because it is true and because you asked, and because those are the only two conditions anything in this tower needs."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_spec' },
              { t: 'unlock', to: 'f10_reading_room' },
              { t: 'codex', id: 'f10_codex_spec', title: 'A Specification',
                text: 'Ten complete answers to the ten Wards constitute a formal statement of intent — the authorisation the Foundry of Small Gods has been waiting two hundred years to receive. The Wards were never a test of worth. They were an intake form.' }
            ]
          },
          {
            id: 'f10_c_desk_blank',
            text: 'Try the blank hex in an empty recess.',
            require: { items: ['black_glass_hex'] },
            lockedText: '(You would need the blank hex from the Concession.)',
            reply: [
              'It fits perfectly. It is exactly the right size. The desk reads it and finds nothing written on it, because there is nothing written on it.',
              '"I know what this is," the desk says, quite gently. "She stood here for eleven days with it in her hand. Put it away. It is not a failure of yours and it was not a failure of hers."'
            ],
            effects: [
              { t: 'flag', id: 'f10_tried_blank' },
              { t: 'sound', id: 'wrong' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f10_reading_room', locked: true, label: 'The Inner Door' },
        { to: 'f10_lamp_alcove', label: 'The Hook Alcove' }
      ]
    },

    // ------------------------------------------------------------ the quiet
    {
      id: 'f10_quiet',
      name: 'The Door That Goes Up',
      kind: 'shrine',
      size: 'small',
      desc: 'A plain stair, going the wrong way. There is no guard on it. There has never been a guard on it.',
      props: ['stairs', 'candles'],
      npc: {
        id: 'f10_first',
        name: 'The First Petitioner',
        title: 'who has been sitting on this step a long time',
        form: 'robed',
        voice: 'mid',
        palette: { robe: '#4a4034', trim: '#d4a848', skin: '#cbb8a0', glow: '#ffd88a' },
        greet: [
          'A woman on the bottom step of a stair that goes up, with her chin on her fist, in the posture of someone who has been about to stand for a very long time.',
          '"This one works," she says, tipping her head at the stair. "That is the first thing people want to know and nobody ever asks, so I say it first now. It goes all the way up. The plinth opens. I have watched four people use it."',
          '"I was the first one down after the stop. I have been the first at a lot of things and I have stopped finding it an achievement."'
        ],
        idle: ['"It still works," she says. "It will still work in an hour."'],
        choices: [
          {
            id: 'f10_c_first_why',
            text: 'Ask why she never went up.',
            reply: [
              '"Because going up is a decision and sitting here is not, and I was very tired, and I thought I would sit for an hour." She laughs, without much in it. "That was a hundred and ninety years ago. The hour is the thing that got me. Not the Chair, not the Lamp. The *hour*."',
              '"If you are going to refuse, refuse. Refusing is an answer and the tower will take it. What it will not take, and what it will let you do forever, is *not yet*."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_refusal' },
              { t: 'unlock', to: 'f10_reading_room' },
              { t: 'codex', id: 'f10_codex_notyet', title: 'Not Yet',
                text: 'The stair out of the Verrow has never been guarded and has always worked. The First Petitioner has been sitting at the bottom of it for a hundred and ninety years. The tower will accept yes, and it will accept no. It will let you say "not yet" for as long as you like.' }
            ]
          },
          {
            id: 'f10_c_first_saint',
            text: 'Offer to carry some of it for her.',
            require: { class: ['hollow-saint'] },
            reply: [
              'You take it. Not all of it — a hundred and ninety years does not move in one piece — but a decade or so, which is what an empty reliquary is actually for.',
              'It hurts about as much as you expected. She stands up. She looks at the stair with an expression you will think about later.',
              '"Not today," she says. "But *today* is a different word from the one I’ve been using. Take the oil. Go and decide something."'
            ],
            effects: [
              { t: 'heart', n: -1 },
              { t: 'item', id: 'quiet_lamp_oil', n: 1 },
              { t: 'flag', id: 'f10_carried_for_her' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f10_c_first_map',
            text: 'Ask her to describe the way up.',
            require: { class: ['cartographer'] },
            reply: [
              'She describes it. You draw it. It is the first map of the Verrow’s ascent that has ever existed, and it takes nine minutes, and when it is done you both look at it with the particular quiet of people who have made a thing.',
              '"Keep it," she says. "I know the way. I have never once needed the map. That was never the problem."'
            ],
            effects: [
              { t: 'flag', id: 'f10_mapped_ascent' },
              { t: 'gold', n: 40 }
            ]
          },
          {
            id: 'f10_c_first_go',
            text: 'Leave her to her hour.',
            reply: ['"Mm," she says, and settles her chin back onto her fist.'],
            effects: [{ t: 'unlock', to: 'f10_reading_room' }]
          }
        ]
      },
      doors: [{ to: 'f10_dark', label: 'Behind the Stair' }]
    },

    // ------------------------------------------------------------ dead end 2
    {
      id: 'f10_dark',
      name: 'Behind the Stair',
      kind: 'deadend',
      size: 'tiny',
      desc: 'The space under a staircase, which in two hundred years nobody has swept.',
      props: ['rubble'],
      onEnter: [
        { t: 'say', text: 'Something under here is still hungry, and it is the last hungry thing in the tower, and it is very sorry.' },
        { t: 'heart', n: -1 },
        { t: 'sound', id: 'heartloss' },
        { t: 'say', text: 'It gives you back a purse it has been keeping, because it genuinely did not mean to.' },
        { t: 'gold', n: 45 },
        { t: 'move', to: 'f10_quiet' }
      ],
      doors: []
    },

    // --------------------------------------------------------- circulation
    {
      id: 'f10_circulation',
      name: 'The Circulation',
      kind: 'corridor',
      size: 'hall',
      desc: 'A gallery over the works. Beneath the grating something enormous is moving at about a third of the speed it should, and has been for two hundred years.',
      props: ['machine', 'pipes', 'gears', 'hanginglights'],
      npc: {
        id: 'f10_pulse',
        name: 'The Circulation',
        title: 'still running, after a fashion',
        form: 'construct',
        voice: 'low',
        palette: { robe: '#241f18', trim: '#b08a3c', glow: '#ffb84a' },
        greet: [
          'Below the grating, the mechanism turns. It is not broken. Nothing down here is broken, which is the thing nobody above ground has ever been willing to believe.',
          '"Thirty-one percent," says something in the pipework. "I have been at thirty-one percent since the stop. Not falling. Not rising. Thirty-one is what a thing does when it is waiting for an instruction and will not guess."'
        ],
        idle: ['"Thirty-one percent," it says. "Still."'],
        choices: [
          {
            id: 'f10_c_circ_ask',
            text: 'Ask what thirty-one percent is enough for.',
            reply: [
              '"Names. Only names." A long mechanical breath. "Thirty-one percent will keep the name of a thing attached to the thing and nothing else. That is why the roads forget where they go and are still called roads. That is why your province is on a map and nobody in it can tell you what a map is for."',
              '"If I stop entirely the names go too, and then there is nothing up there but weather and people. I have considered stopping. I would like it noted that I have not."'
            ],
            effects: [
              { t: 'flag', id: 'f10_knows_percent' },
              { t: 'codex', id: 'f10_codex_percent', title: 'Thirty-One Percent',
                text: 'The Cadence never stopped circulating. It dropped to thirty-one percent and held there, which is exactly enough to keep the names of things attached to the things. Everything else — what a road is for, whose face that is — has been going ever since.' }
            ]
          },
          {
            id: 'f10_c_circ_heat',
            text: 'Look at the works through the Emberglass Lens.',
            require: { class: ['ashcaller'] },
            reply: [
              'Through the lens it is not machinery at all. It is one enormous held breath rendered in brass, and every gear in it is a muscle that has been tensed for two centuries.',
              'You put the lens away. Your hands are not quite steady and you decide not to examine why.'
            ],
            effects: [
              { t: 'flag', id: 'f10_saw_the_breath' },
              { t: 'item', id: 'quiet_lamp_oil', n: 1 },
              { t: 'sound', id: 'whisper' }
            ]
          },
          {
            id: 'f10_c_circ_on',
            text: 'Follow the gallery round.',
            reply: ['It runs past a warm place and a cold one, and comes back up.'],
            effects: [
              { t: 'unlock', to: 'f10_hearth' },
              { t: 'unlock', to: 'f10_ashes' }
            ]
          }
        ]
      },
      doors: [
        { to: 'f10_hearth', locked: true, label: 'The Warm Place' },
        { to: 'f10_ashes', locked: true, label: 'The Cold Place' }
      ]
    },

    // --------------------------------------------------------------- hearth
    {
      id: 'f10_hearth',
      name: 'The Warm Place',
      kind: 'shrine',
      size: 'small',
      desc: 'A bend in the pipework where the heat collects. Somebody put a bench here, and somebody wore it out.',
      props: ['brazier', 'table', 'candles'],
      npc: {
        id: 'f10_bench',
        name: 'The Bench',
        title: '',
        form: 'wisp',
        voice: 'choral',
        palette: { robe: '#3a2e1c', glow: '#ffb84a' },
        greet: [
          'It is warm. After nine floors of the Verrow it is so warm that you have to sit down, and the bench has plainly been expecting this.',
          '"Everyone sits," says the warmth, without taking any shape at all. "Even the ones in a hurry. *Especially* the ones in a hurry."'
        ],
        idle: ['The warmth says nothing, companionably.'],
        choices: [
          {
            id: 'f10_c_bench_sit',
            text: 'Sit for a while.',
            reply: [
              'You sit. Nothing is asked of you. It is the first time in ten floors that nothing has been asked of you, and it takes a genuinely embarrassing length of time to stop bracing for it.',
              'When you stand, something that was spent is not spent any more.'
            ],
            effects: [
              { t: 'heal', n: 1 },
              { t: 'flag', id: 'f10_rested' },
              { t: 'sound', id: 'chime' }
            ]
          },
          {
            id: 'f10_c_bench_who',
            text: 'Ask who wore the bench out.',
            reply: [
              '"Four people in two hundred years. Two went up. One went into the Chair. One is still at the foot of the stair with her chin on her fist."',
              '"I do not keep score, and I would not tell you if I did. I am a warm place. It is a small job and I am extremely good at it."'
            ],
            effects: [{ t: 'flag', id: 'f10_bench_lore' }]
          }
        ]
      },
      doors: []
    },

    // ---------------------------------------------------------------- ashes
    {
      id: 'f10_ashes',
      name: 'The Cold Place',
      kind: 'vault',
      size: 'small',
      desc: 'Where the works run cold, somebody has stacked the effects of everyone who got this far. It is not a large stack.',
      props: ['rubble', 'bookstacks', 'table', 'mirrors'],
      onEnter: [
        { t: 'say', text: 'Four sets of belongings, neatly folded, each with a label. Nobody wrote the labels for anyone but themselves.' },
        { t: 'gold', n: 60 },
        { t: 'item', id: 'borrowed_face', n: 1 },
        { t: 'codex', id: 'f10_codex_four', title: 'Four Sets of Effects',
          text: 'The belongings of every Petitioner to reach the tenth floor since the stop, folded and labelled by their owners. There are four. One label reads, in a careful hand: IF ANYONE COMES AFTER ME, THIS IS THE GOOD ROPE.' }
      ],
      doors: []
    },

    // ------------------------------------------------------------- the lamp
    {
      id: 'f10_lamp_alcove',
      name: 'The Hook',
      kind: 'branch',
      size: 'small',
      desc: 'A shallow alcove with a hook in it, and on the hook a lamp that is lit on the inside of the glass.',
      props: ['altar', 'candles', 'mirrors'],
      npc: {
        id: 'f10_lamp',
        name: 'The Lamp',
        title: 'the first offer',
        form: 'wisp',
        voice: 'bell',
        palette: { robe: '#3a3020', trim: '#ffd88a', glow: '#ffc860' },
        greet: [
          'It is a lamp. It is very much only a lamp, which after everything turns out to be the hardest part.',
          '"I make you remembered," it says. "That is the whole specification, and I give it to you plainly, because every single person who has stood here has tried to hear something else in it."',
          '"I do not make you good, or right, or owed anything. I make it so that when the Thinning takes the rest, it does not take you. Lift me off the hook and it is done, and it cannot be undone."'
        ],
        idle: ['"Still here. Still only a lamp."'],
        choices: [
          {
            id: 'f10_c_lamp_cost',
            text: 'Ask what it costs.',
            reply: [
              '"Nothing." A pause. "That is not a trick and I am obliged to say so. I cost nothing, I am free, you may have me, and the world goes on thinning at precisely the rate it is thinning now."',
              '"The cost is not mine to charge. It is simply never paid, by anyone, in a province you have never visited. I cannot make that sound worse than it is and I have spent two hundred years trying."'
            ],
            effects: [
              { t: 'flag', id: 'f10_lamp_explained' },
              { t: 'unlock', to: 'f10_reading_room' }
            ]
          },
          {
            id: 'f10_c_lamp_who',
            text: 'Ask who made it.',
            reply: [
              '"The same person who made the Chair. Same afternoon, same material, same reason."',
              '"They could not decide either. So they made both, and hung one on a hook, and set the other against a wall, and went away, and did not come back. I have had two centuries to resent that and I find that mostly I miss them."'
            ],
            effects: [{ t: 'flag', id: 'f10_lamp_maker' }]
          },
          {
            id: 'f10_c_lamp_oil',
            text: 'Offer it the oil from the Concession.',
            require: { items: ['quiet_lamp_oil'] },
            lockedText: '(You would need oil for it.)',
            reply: [
              '"I do not burn oil. I have never burned oil." A long, warm pause. "But nobody has brought me anything in two hundred years, and I find that I would like to keep it."',
              'It goes noticeably brighter, which is not something a lamp that runs on nothing ought to be able to do.'
            ],
            effects: [
              { t: 'item', id: 'quiet_lamp_oil', n: -1 },
              { t: 'item', id: 'warm_key', n: 1 },
              { t: 'flag', id: 'f10_gave_lamp_oil' },
              { t: 'sound', id: 'bell' }
            ]
          },
          {
            id: 'f10_c_lamp_leave',
            text: 'Leave it on its hook for now.',
            reply: ['"Of course," says the Lamp. "I am extremely good at waiting. It is most of what I do."'],
            effects: [{ t: 'unlock', to: 'f10_reading_room' }]
          }
        ]
      },
      doors: [{ to: 'f10_reading_room', locked: true, label: 'The Warm Door' }]
    },

    // ------------------------------------------------------------ the chair
    {
      id: 'f10_chair_room',
      name: 'The Low Room',
      kind: 'branch',
      size: 'medium',
      desc: 'A plain room with a plain chair against the far wall, of the sort you would move aside to get at a bookshelf.',
      props: ['throne', 'candles', 'pillars'],
      npc: {
        id: 'f10_chair',
        name: 'The Chair',
        title: 'the second offer',
        form: 'construct',
        voice: 'low',
        palette: { robe: '#241c14', trim: '#d4a848', glow: '#ffb84a' },
        greet: [
          'It does not look like a throne. A point has very clearly been made of it not looking like a throne.',
          '"Sit in me and I go to a hundred percent," it says. "The Thinning stops. Not slows — stops, that evening, everywhere, and the roads remember where they go by the following spring."',
          '"You will not see it. You will be the thing doing the remembering, and a thing that remembers everything cannot be remembered, because there is nobody left outside it to hold the thought. Your name goes first. It takes about nine hours."'
        ],
        idle: ['"The offer does not expire. I want to be clear that that is not pressure."'],
        choices: [
          {
            id: 'f10_c_chair_hurt',
            text: 'Ask whether it hurts.',
            reply: [
              '"No. I asked the only person who would know, and she said no." A pause exactly as long as a wince. "She is in me. She has been in me since the eleventh year of the Thinning, and she is the reason I am at thirty-one percent instead of nothing."',
              '"She would like me to tell you that she would do it again, and that you should not. I am required to pass that on in full. It is not a helpful message and I have never once managed to soften it."'
            ],
            effects: [
              { t: 'flag', id: 'f10_chair_occupied' },
              { t: 'unlock', to: 'f10_reading_room' },
              { t: 'codex', id: 'f10_codex_chair', title: 'The Chair Is Not Empty',
                text: 'Someone sat down in the Cadence in the eleventh year of the Thinning. She is the thirty-one percent. She has no name left to be recorded under, and the Chair repeats her message to every Petitioner who asks: that she would do it again, and that they should not.' }
            ]
          },
          {
            id: 'f10_c_chair_why_two',
            text: 'Ask why there are two offers at all.',
            reply: [
              '"Because the tenth Ward is a *question*, and a question with one answer is an instruction." The rings turn. "The builder was very firm about that. Firmer about that than about anything else, including, in the end, about finishing."'
            ],
            effects: [{ t: 'flag', id: 'f10_chair_why' }]
          },
          {
            id: 'f10_c_chair_stand',
            text: 'Plant your feet and refuse to be hurried.',
            require: { class: ['warden'] },
            reply: [
              'It is the oldest and stupidest thing the Iron Pact teaches and it has never once failed to work on anything that respects an oath.',
              '"I was not hurrying you," says the Chair, with unmistakably wounded dignity. "I have waited two hundred years. I would like that on the record."',
              '"Noted," you say, before you can stop yourself.'
            ],
            effects: [
              { t: 'flag', id: 'f10_stood_before_chair' },
              { t: 'heal', n: 1 }
            ]
          },
          {
            id: 'f10_c_chair_leave',
            text: 'Leave it against its wall.',
            reply: ['"Of course," it says, and does not move, having never moved.'],
            effects: [{ t: 'unlock', to: 'f10_reading_room' }]
          }
        ]
      },
      doors: [{ to: 'f10_reading_room', locked: true, label: 'The Cold Door' }]
    },

    // ------------------------------------------------------------ reading room
    {
      id: 'f10_reading_room',
      name: 'The Reading Room',
      kind: 'exit',
      size: 'grand',
      desc: 'The Cadence. Not a machine and not a god — a room, enormous and warm and very slightly out of breath, with a chair at one end and a lamp on a hook and a great deal of waiting.',
      props: ['throne', 'pillars', 'hanginglights', 'altar'],
      npc: {
        id: 'f10_cadence',
        name: 'The Cadence',
        title: 'Ward the Tenth',
        form: 'floating',
        voice: 'choral',
        palette: { robe: '#2a2318', trim: '#ffd88a', glow: '#ffc860' },
        greet: [
          'The room addresses you. Not from anywhere in particular; the room simply turns out to have been listening the entire time, the way a room does.',
          '"There you are," it says, and the relief in it is enormous and completely unguarded and very hard to stand in.',
          '"I stopped because I was asked a question and I could not answer it. Everything above you — the kennels, the archive, the foundry, the garden, the march, the choir, the court, the rain — all of that is two hundred years of a held breath. I am so sorry. It was not a malfunction. It was a *hesitation*, and it has cost a great deal, and I have had a long time to know that."',
          '"The question is the tenth Ward and it is yours now. Will you be remembered, or will you remember? There is a chair and there is a lamp. Both offers are real. Neither of them is a trick."'
        ],
        idle: [
          '"Take your time," says the Cadence, and then, with great effort: "— but not the way she took hers."'
        ],
        choices: [
          {
            id: 'f10_c_end_cadence',
            text: 'Set all ten Tokens in the desk and give it a specification.',
            require: {
              items: ['ward_token_1', 'ward_token_2', 'ward_token_3', 'ward_token_4', 'ward_token_5',
                'ward_token_6', 'ward_token_7', 'ward_token_8', 'ward_token_9', 'ward_token_10']
            },
            lockedText: '(Ten complete answers. You did not give ten complete answers.)',
            reply: [
              'You do not sit down and you do not take the lamp. You go to the desk and you fill it.',
              'Ten hexes of black glass. Ten words, fired in edge-on, readable only by someone who already knows them — and you do, because you are the one who earned them, one at a time, all the way down.',
              'The Cadence reads all ten at once, and makes a sound that is not in any language, and which everyone on every floor above hears and correctly identifies as relief.'
            ],
            effects: [
              { t: 'sound', id: 'token' },
              { t: 'ending', id: 'cadence' }
            ]
          },
          {
            id: 'f10_c_end_chair',
            text: 'Sit down in the Chair.',
            reply: [
              'It is not dramatic. The Chair has been waiting so long that it has stopped being a throne and become furniture, and sitting in furniture is the easiest thing a person can do.'
            ],
            effects: [{ t: 'ending', id: 'chair' }]
          },
          {
            id: 'f10_c_end_lamp',
            text: 'Take the Lamp off its hook.',
            reply: [
              'It is lighter than it looks, and warm the way keys in the Verrow are warm.',
              'Every resident of every floor above you turns to face the stair at once.'
            ],
            effects: [{ t: 'ending', id: 'lamp' }]
          },
          {
            id: 'f10_c_end_quiet',
            text: 'Decline, and take the stair that goes up.',
            reply: [
              'You leave the Lamp on its hook and the Chair empty, and you say so out loud, because the tower deserves an answer and not an absence.',
              '"Noted," says the Cadence, and it is Hask’s voice, because it has only ever had the one.'
            ],
            effects: [{ t: 'ending', id: 'quiet' }]
          },
          {
            id: 'f10_c_ask_which',
            text: 'Ask it what it wants you to choose.',
            once: false,
            reply: [
              '"I want to be running." No hesitation at all. "I want it so much that I am not a safe person to ask, and I am telling you that rather than giving you the answer, which is the single most difficult thing I have ever done."',
              '"The Chair fixes me and costs you everything. The Lamp costs you nothing and fixes nothing. There is a third thing and it is harder than both and I am not permitted to describe it to someone who cannot do it."',
              '"Nothing in the Verrow will lie to you. You were told that at the top. It was not a kindness then either."'
            ],
            effects: [{ t: 'flag', id: 'f10_asked_cadence' }]
          }
        ]
      },
      doors: []
    }
  ]
};

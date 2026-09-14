// The bottom of the Verrow. Floor 10 fires these with {t:"ending", id}.

export const ENDINGS = {
  chair: {
    title: 'The Chair',
    kicker: 'Ending — what you gave',
    motif: 'ending',
    body: [
      'You sit down. It is not dramatic. The Chair has been waiting so long that it has stopped being a throne and become simply furniture, and sitting in furniture is the easiest thing a person can do.',
      'The Cadence takes you the way a lung takes air — without ceremony, and completely. Somewhere above, a road in the Ferrow province remembers where it goes. A woman in a quiet town looks at her daughter and, for the first time in eleven years, knows her name. None of them will ever learn why.',
      'You are not dead. You are the thing that remembers now, and a thing that remembers everything cannot be remembered by anything else; there is no one left outside you to hold the thought. Your name goes first. Then the shape of your hands. Then the fact that there had been a Petitioner at all.',
      'The world gets its memory back, and forgets the price. That is what paying it means.'
    ]
  },

  lamp: {
    title: 'The Lamp',
    kicker: 'Ending — what you kept',
    motif: 'ending',
    body: [
      'You take the Lamp off its hook. It is lighter than it looks, and warm the way keys in the Verrow are warm, and the moment your hand closes on it every resident of every floor above you turns to face the stair at once.',
      'You climb. The salt opens. The flats are white and enormous and the sky has that scoured look it gets after a long wind, and you are the first Petitioner in two hundred years to walk out of the Verrow under your own name.',
      'They will remember you. That is precisely and exactly what the Lamp does, and it does not do anything else. They will build things and name them after you, and they will do it while the roads keep forgetting where they go, and while the provinces go quiet one after another, politely, without complaint.',
      'You will be remembered for a very long time by fewer and fewer people who can say why.'
    ]
  },

  cadence: {
    title: 'The Cadence Resumed',
    kicker: 'Ending — the third door',
    motif: 'ending',
    body: [
      'Ten hexes of black glass, each with one word fired into it edge-on. You set them into the reading desk in the order you earned them, and the desk — which is not a desk, and never was — reads all ten at once.',
      'This is what the Wards were asking. Not whether you could get past them. Whether, having been asked ten times what you would feed and read and make and let grow and keep on time and say aloud and owe and pay, you had answered *completely* every time. Ten complete answers is a specification. A specification is the one thing the Foundry has been waiting two centuries to receive.',
      'The Cadence does not restart. It is repaired, which is slower and much less impressive. Somewhere under your feet a foundry accepts an order. A choir is told, gently, that it may stop. A ledger is closed and the balance is carried, at last, by the thing that incurred it.',
      'You walk out into the salt with nothing — no lamp, no chair, no tokens, no particular destiny. Behind you the tower begins, very quietly, to circulate. It will take about eighty years. You will not see the end of it, and it will work anyway, and that is the whole of the answer.'
    ]
  },

  quiet: {
    title: 'The Long Way Up',
    kicker: 'Ending — what you refused',
    motif: 'ending',
    body: [
      'There is a third option that nobody offers you, because it is always available and therefore not worth mentioning: you can decline.',
      'You leave the Lamp on its hook and the Chair empty and you turn around and you climb, past the ledger and the court and the choir and the march and the garden and the foundry and the archive and the kennels and the salt, and everyone you pass says goodbye, because nothing in the Verrow lies and none of them think less of you.',
      'The plinth opens. The Thinning continues. Some province you have never heard of goes quiet next spring.',
      'You did not make it worse. You have the rest of your life to decide whether that was enough, and unlike almost everyone else in this story, you will remember making the choice.'
    ]
  },

  kept: {
    title: 'Filed',
    kicker: 'Ending — what the tower took',
    motif: 'fail',
    body: [
      'The third heartbeat goes, and the Verrow does the thing it was built to do, which is not to kill you.',
      'You are catalogued. Cross-referenced. Given a shelf-mark, a pen number, a seat in a session that will not adjourn. Somewhere a drowned librarian notes your arrival with mild interest and slightly more paperwork than she had hoped for.',
      'You are not dead, and you are not exactly alive, and in about forty years you will be an excellent conversationalist. The next Petitioner will meet you on the way down, and you will tell them something true, for a reason of your own.'
    ]
  }
};

// Rules the final floor can consult; also used for the summary screen.
export function endingFor(id) {
  return ENDINGS[id] || ENDINGS.quiet;
}

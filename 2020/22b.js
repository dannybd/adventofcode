(decks =>
  (
    // Y combinator!
    // Credit: https://blog.klipse.tech/lambda/2016/08/10/pure-y-combinator-javascript.html
    f => (x => x(x))(x => f(y => x(x)(y)))
  )(
    runGame => decks =>
      [...Array(10000).keys()]
        .slice(1)
        .reduce(data =>
          data.winner !== null
            ? data
            : (newDecks =>
                ({
                  decks: newDecks,
                  priorDecks: [...data.priorDecks, newDecks.join(';')],
                  winner:
                    data.priorDecks.includes(newDecks.join(';'))
                      ? 0
                      : (nonEmptyDeckPlayer =>
                          nonEmptyDeckPlayer !== -1 ? nonEmptyDeckPlayer : null
                        )(
                          newDecks.findIndex((_, i) => !newDecks[1 - i].length)
                        ),
                })
              )(
                ((drawnCards, remainingDecks) =>
                  (roundWinner =>
                    remainingDecks[roundWinner]
                      .push(
                        drawnCards[roundWinner],
                        drawnCards[1 - roundWinner],
                      ) &&
                      remainingDecks
                  )(
                    (
                      drawnCards[0] <= remainingDecks[0].length &&
                      drawnCards[1] <= remainingDecks[1].length
                    )
                      ? runGame(
                          remainingDecks
                            .map((deck, i) => deck.slice(0, drawnCards[i]))
                        )
                          .winner
                      : drawnCards.indexOf(Math.max(...drawnCards))
                  )
                )(
                  data.decks.map(deck => deck[0]),
                  data.decks.map(deck => deck.slice(1)),
                )
              ),
          {
            decks,
            priorDecks: [],
            winner: null,
          }
        )
  )(decks)
    .decks
    .find(x => x.length)
    .reduce((prod, card, i, cards) => prod + card * (cards.length - i), 0)
)(
  document.body.innerText.trim()
    .split('\n\n')
    .map(x =>
      x
        .split('\n')
        .slice(1)
        .map(n => n - 0)
    )
)

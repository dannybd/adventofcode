(decks =>
  [...Array(2000)]
    .reduce(decks =>
      decks[1].length
        ? ((winner, loser) =>
            [
              [...winner.slice(1), winner[0], loser[0]],
              loser.slice(1)
            ]
          )(...decks.sort((a, b) => b[0] - a[0]))
        : decks,
      decks
    )
    [0]
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

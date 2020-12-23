((cups, rounds) =>
  ((rotateLeft) =>
    (cupsAfterGame =>
      [...Array(cupsAfterGame.indexOf(1))]
        .reduce(cups => rotateLeft(cups), cupsAfterGame)
        .slice(1)
        .join('')
    )(
      [...Array(rounds).keys()]
        .reduce((cups, round) =>
          ((currentCup, pickUpCups, remainingCups) =>
            rotateLeft(
              remainingCups
                .splice(
                  1 + remainingCups.indexOf(
                    [...remainingCups]
                      .sort((a, b) =>
                        (f =>
                          f(b) - f(a)
                        )(
                          n => n + 100 * (n < currentCup)
                        )
                      )
                      [0]
                  ),
                  0,
                  ...pickUpCups,
                ) &&
              remainingCups
            )
          )(
            cups[0],
            cups.slice(1, 4),
            [cups[0], ...cups.slice(4)],
          ),
          cups
        )
    )
  )(
    cups => [...cups.slice(1), cups[0]]
  )
)(
  '158937462'
    .split('')
    .map(n => n - 0),
  100
)

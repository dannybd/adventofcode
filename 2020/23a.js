((cupsList, rounds) =>
  (linkedCups =>
    (cupsAfterGame =>
      [...Array(cupsList.length - 1)]
        .reduce(
          cups =>
            cups.push(cupsAfterGame[cups.slice(-1)[0]]) && cups,
          [1]
        )
        .slice(1)
        .join('')
    )(
      [...Array(rounds).keys()]
        .reduce(({cups, current}) =>
          (newCups =>
            ({
              cups: newCups,
              current: newCups[current],
            })
          )(
            ((destination, tail) =>
              ((currentVal, destinationVal, tailVal) =>
                (cups[destination] = currentVal) &&
                (cups[current] = tailVal) &&
                (cups[tail] = destinationVal) &&
                cups
              )(
                cups[current],
                cups[destination],
                cups[tail],
              )
            )(
              [current - 1, current - 2, current - 3, current - 4]
                .map(n => n < 1 ? n + cupsList.length : n)
                .find(n =>
                  n !== cups[current] &&
                  n !== cups[cups[current]] &&
                  n !== cups[cups[cups[current]]]
                ),
              cups[cups[cups[current]]],
            )
          ),
          {
            cups: linkedCups,
            current: cupsList[0],
          },
        )
        .cups
    )
  )(
    cupsList
      .reduce(
        (linkedCups, n, i, cupsList) =>
          (linkedCups[n] = cupsList[(i + 1) % cupsList.length]) && linkedCups,
        []
      )
  )
)(
  '158937462'
    .split('')
    .map(n => n - 0),
  100
)

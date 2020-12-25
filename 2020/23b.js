((cupsList, rounds, postGame) =>
  (linkedCups =>
    postGame(
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
                // Destination points to the pickup head
                (cups[destination] = currentVal) &&
                // Current points to whatever was after the pickup tail
                (cups[current] = tailVal) &&
                // Tail points to whatever destination was pointing to
                (cups[tail] = destinationVal) &&
                cups
              )(
                // We're mutating the cups list in place, so extract our
                // values at these locations first so we don't overwrite.
                cups[current],
                cups[destination],
                cups[tail],
              )
            )(
              // The destination cup is the next lowest cup value
              // after current which is not included among the 3
              // picked up cups (which are the next 3 cups after current).
              [current - 1, current - 2, current - 3, current - 4]
                // 0 & negative values must wrap around to the top
                .map(n => n < 1 ? n + cupsList.length : n)
                // Pigeonhole principle means that of the four values
                // we are trying, at least one will satisfy this.
                .find(n =>
                  n !== cups[current] &&
                  n !== cups[cups[current]] &&
                  n !== cups[cups[cups[current]]]
                ),
              // The tail cup is 3 hops downstream from current
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
    // Turn the list of cups (where each cup maps to the cup succeeding it)
    // into a linked list, where 2 -> 1 -> 3 -> 2 is represented: [0, 3, 1, 2]
    // (Ignore the 0.) Index 2 points to 1, index 1 points to 3, etc.
    cupsList
      .reduce(
        (linkedCups, n, i, cupsList) =>
          (linkedCups[n] = cupsList[(i + 1) % cupsList.length]) && linkedCups,
        []
      )
  )
)(
  (input =>
    // Append (10^6 - 9) values to the given input
    [...input, ...[...Array(1e6 + 1).keys()].slice(input.length + 1)]
  )(
    '158937462'
      .split('')
      .map(n => n - 0)
  ),
  // rounds
  1e7,
  // postGame
  cupsAfterGame =>
    // Multiply the two values after 1 to get our answer
    cupsAfterGame[1] * cupsAfterGame[cupsAfterGame[1]],
)

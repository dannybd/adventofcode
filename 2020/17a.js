((input, turns) =>
  [...Array(turns)]
    .reduce(grid =>
      grid
        .map((plane, z) =>
          plane
            .split('\n')
            .map((line, x) =>
              [...line]
                .map((c, y) =>
                  (activeNeighborCount =>
                    c === '#'
                      ? ([2, 3].includes(activeNeighborCount) ? '#' : '.')
                      : (activeNeighborCount === 3 ? '#' : '.')
                  )(
                    [
                      [-1, -1, -1], [-1,  0, -1], [-1,  1, -1],
                      [ 0, -1, -1], [ 0,  0, -1], [ 0,  1, -1],
                      [ 1, -1, -1], [ 1,  0, -1], [ 1,  1, -1],

                      [-1, -1,  0], [-1,  0,  0], [-1,  1,  0],
                      [ 0, -1,  0], /*  self  */  [ 0,  1,  0],
                      [ 1, -1,  0], [ 1,  0,  0], [ 1,  1,  0],

                      [-1, -1,  1], [-1,  0,  1], [-1,  1,  1],
                      [ 0, -1,  1], [ 0,  0,  1], [ 0,  1,  1],
                      [ 1, -1,  1], [ 1,  0,  1], [ 1,  1,  1],
                    ]
                      .filter(offsets =>
                        ((dx, dy, dz) =>
                          grid[z + dz]
                            ?.split('\n')
                            ?.[x + dx]
                            ?.[y + dy]
                            === '#'
                        )(...offsets)
                      )
                      .length
                  )
                )
                .join('')
            )
            .join('\n')
        ),
      [
        ...Array(turns)
          .fill(
            Array(input.length + 2 * turns)
              .fill(
                Array(input.length + 2 * turns)
                  .fill('.')
                  .join('')
              )
              .join('\n')
            ),

        [
          Array(turns)
            .fill(
              Array(input.length + 2 * turns)
                .fill('.')
                .join('')
            ),

          input
            .map(x =>
              Array(turns).fill('.').join('') +
              x +
              Array(turns).fill('.').join('')
            ),

          Array(turns)
            .fill(
              Array(input.length + 2 * turns)
                .fill('.')
                .join('')
            )
        ]
          .flat()
          .join('\n'),

        ...Array(turns)
          .fill(
            Array(input.length + 2 * turns)
              .fill(
                Array(input.length + 2 * turns)
                  .fill('.')
                  .join('')
              )
              .join('\n')
            )
      ]
    )
    .join('\n\n')
    .match(/#/g)
    .length
)(
  document.body.innerText.trim().split('\n'),
  6
)

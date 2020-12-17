((input, turns) =>
  [...Array(turns)]
    .reduce(grid =>
      grid
        .map((cube, w) =>
          cube
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
                          [-1, -1, -1, -1], [-1,  0, -1, -1], [-1,  1, -1, -1],
                          [ 0, -1, -1, -1], [ 0,  0, -1, -1], [ 0,  1, -1, -1],
                          [ 1, -1, -1, -1], [ 1,  0, -1, -1], [ 1,  1, -1, -1],

                          [-1, -1,  0, -1], [-1,  0,  0, -1], [-1,  1,  0, -1],
                          [ 0, -1,  0, -1], [ 0,  0,  0, -1], [ 0,  1,  0, -1],
                          [ 1, -1,  0, -1], [ 1,  0,  0, -1], [ 1,  1,  0, -1],

                          [-1, -1,  1, -1], [-1,  0,  1, -1], [-1,  1,  1, -1],
                          [ 0, -1,  1, -1], [ 0,  0,  1, -1], [ 0,  1,  1, -1],
                          [ 1, -1,  1, -1], [ 1,  0,  1, -1], [ 1,  1,  1, -1],


                          [-1, -1, -1,  0], [-1,  0, -1,  0], [-1,  1, -1,  0],
                          [ 0, -1, -1,  0], [ 0,  0, -1,  0], [ 0,  1, -1,  0],
                          [ 1, -1, -1,  0], [ 1,  0, -1,  0], [ 1,  1, -1,  0],

                          [-1, -1,  0,  0], [-1,  0,  0,  0], [-1,  1,  0,  0],
                          [ 0, -1,  0,  0], /*    self    */  [ 0,  1,  0,  0],
                          [ 1, -1,  0,  0], [ 1,  0,  0,  0], [ 1,  1,  0,  0],

                          [-1, -1,  1,  0], [-1,  0,  1,  0], [-1,  1,  1,  0],
                          [ 0, -1,  1,  0], [ 0,  0,  1,  0], [ 0,  1,  1,  0],
                          [ 1, -1,  1,  0], [ 1,  0,  1,  0], [ 1,  1,  1,  0],


                          [-1, -1, -1,  1], [-1,  0, -1,  1], [-1,  1, -1,  1],
                          [ 0, -1, -1,  1], [ 0,  0, -1,  1], [ 0,  1, -1,  1],
                          [ 1, -1, -1,  1], [ 1,  0, -1,  1], [ 1,  1, -1,  1],

                          [-1, -1,  0,  1], [-1,  0,  0,  1], [-1,  1,  0,  1],
                          [ 0, -1,  0,  1], [ 0,  0,  0,  1], [ 0,  1,  0,  1],
                          [ 1, -1,  0,  1], [ 1,  0,  0,  1], [ 1,  1,  0,  1],

                          [-1, -1,  1,  1], [-1,  0,  1,  1], [-1,  1,  1,  1],
                          [ 0, -1,  1,  1], [ 0,  0,  1,  1], [ 0,  1,  1,  1],
                          [ 1, -1,  1,  1], [ 1,  0,  1,  1], [ 1,  1,  1,  1],
                        ]
                          .map(offsets =>
                            ((dx, dy, dz, dw) =>
                              grid[w + dw]?.[z + dz]?.split('\n')?.[x + dx]?.[y + dy] || '?'
                            )(...offsets)
                          )
                          .join('')
                          .match(/#/g)
                          ?.length || 0
                      )
                    )
                    .join('')
                )
                .join('\n')
            )
        ),
      [
        ...Array(turns)
          .fill(
            Array(1 + 2 * turns)
              .fill(
                Array(input.length + 2 * turns)
                  .fill(
                    Array(input.length + 2 * turns)
                      .fill('.')
                      .join('')
                  )
                  .join('\n')
              )
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
        ],

        ...Array(turns)
          .fill(
            Array(1 + 2 * turns)
              .fill(
                Array(input.length + 2 * turns)
                  .fill(
                    Array(input.length + 2 * turns)
                      .fill('.')
                      .join('')
                  )
                  .join('\n')
              )
          )
      ]
    )
    .map(cube => cube.join('\n\n'))
    .join('\n\n~~~~~~~~~~~\n\n')
    .match(/#/g)
    .length
)(
  document.body.innerText.trim().split('\n'),
  6
)
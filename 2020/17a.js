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
                    // Handles the cell-level logic its next step
                    c === '#'
                      ? ([2, 3].includes(activeNeighborCount) ? '#' : '.')
                      : (activeNeighborCount === 3 ? '#' : '.')
                  )(
                    // All 3^3 - 1 = 26 neighbor positions to check:
                    [
                      // dz = -1 plane
                      [-1, -1, -1], [-1,  0, -1], [-1,  1, -1],
                      [ 0, -1, -1], [ 0,  0, -1], [ 0,  1, -1],
                      [ 1, -1, -1], [ 1,  0, -1], [ 1,  1, -1],

                      // dz = 0 plane
                      [-1, -1,  0], [-1,  0,  0], [-1,  1,  0],
                      [ 0, -1,  0], /*  self  */  [ 0,  1,  0],
                      [ 1, -1,  0], [ 1,  0,  0], [ 1,  1,  0],

                      // dz = 1 plane
                      [-1, -1,  1], [-1,  0,  1], [-1,  1,  1],
                      [ 0, -1,  1], [ 0,  0,  1], [ 0,  1,  1],
                      [ 1, -1,  1], [ 1,  0,  1], [ 1,  1,  1],
                    ]
                      // Filter to active neighbors
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
      // Constructing the initial 3D grid. We know how many turns we want (N),
      // so if the initial 2D data is (1 x A x A) then we can contain all of
      // the final grid within a space which is expanded on each side by N:
      // (N + 1 + N) x (N + A + N) x (N + A + N)
      [
        // Construct N planes of (A + 2N) x (A + 2N)
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

        // Construct 1 plane of (A + 2N) x (A + 2N)
        [
          // N lines of (A + 2N)
          Array(turns)
            .fill(
              Array(input.length + 2 * turns)
                .fill('.')
                .join('')
            ),

          // A lines of (A + 2N), by padding each line with N on either side
          input
            .map(x =>
              Array(turns).fill('.').join('') +
              x +
              Array(turns).fill('.').join('')
            ),

          // N lines of (A + 2N)
          Array(turns)
            .fill(
              Array(input.length + 2 * turns)
                .fill('.')
                .join('')
            )
        ]
          .flat()
          .join('\n'),

        // Construct N planes of (A + 2N) x (A + 2N)
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
    // Join the planes together (easier for debugging too)
    .join('\n\n')
    // Search the big string for active cells
    .match(/#/g)
    .length
)(
  document.body.innerText.trim().split('\n'),
  6
)

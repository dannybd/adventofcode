(field =>
  // 100 steps ought to be enough for anyone
  (neighbors => [...Array(100)]
    .reduce(
      data =>
        // Stopping condition: the grid didn't change
        data.area.join('\n') === data.lastAreas[0]
          ? data
          // Otherwise, we need to update the grid
          : {
              // Walk through each row, then each char in that row
              area: data.area
                .map((row, y) => [...row]
                  .map((s, x) =>
                    (
                      occupiedNeighborCount =>
                        // The actual work for updating individual seats
                        (s === 'L' && occupiedNeighborCount === 0)
                          ? '#'
                          : (s === '#' && occupiedNeighborCount > 4)
                            ? 'L'
                            : s
                    )(
                      // We pre-computed the neighbors' offsets below
                      neighbors[y][x]
                        .map(offset =>
                          data.area[y + offset[0]]?.[x + offset[1]] || '.'
                        )
                        .join('')
                        // This does the work of counting occupied seats
                        .match(/#/g)
                        ?.length
                        || 0
                    )
                  )
                  // Re-collapse rows back into strings
                  .join('')
                ),
              // Prepend the latest area
              lastAreas: [data.area.join('\n'), ...data.lastAreas]
            },
      {area: field, lastAreas: []}
    )
    // Then, count the occupied seats in the final area
    .area
    .join('')
    .match(/#/g)
    .length
  )(
    // The seat positions don't change, so the positions of each seat's
    // neighbors is fixed throughout the steps. Let's precompute it, based
    // on the initial state, to save time.
    field
      .map((row, y) => [...row]
        .map((_, x) =>
          // These are the offsets
          [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
          ]
            // and we scale each offset by the distance to its neighbor
            .map(offset =>
              (distanceToNeighbor =>
                offset.map(z => z * distanceToNeighbor)
              )
              (
                // Neighbor distance is found by iteratively stepping
                // farther away and seeing if we find a seat
                [...Array(row.length).keys()]
                  .slice(1)
                  .find(n => /[L#]/.test(
                    field[y + n * offset[0]]?.[x + n * offset[1]] || ''
                  ))
                  // If we don't find any seats in that direction,
                  // pick a distance outside the size of the field
                  || row.length
              )
            )
        )
      )
  )
)(document.body.innerText.trim().split('\n'))

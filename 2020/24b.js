((input, directions) =>
  (finalTiles =>
    Object.keys(finalTiles).filter(tile => finalTiles[tile]).length
  )(
    (tiles =>
      // Now let's play 100 iterations of our hexagonal game of life
      [...Array(100)]
        .reduce(tiles =>
          ((knownPositions, getPositionNeighbors) =>
            Object.fromEntries(
              [...new Set([
                // We'll need to iterate over all the known positions...
                ...knownPositions,
                // ...*and* over all of their neighbors, to check for
                // new active tiles. Not the fastest approach but w/e
                ...knownPositions
                  .flatMap(position => getPositionNeighbors(position)),
              ])]
                // For each position we've highlighted, solve whether it
                // should now be active or not based on its neighbors.
                // Return as [position, active] so Object.fromEntries
                // can reconstitute the tiles list for the next round
                .map(position =>
                  [
                    position,
                    ((numActiveAdjacent, active) =>
                      active
                        ? [1, 2].includes(numActiveAdjacent)
                        : numActiveAdjacent === 2
                    )(
                      // How many neighbors are active?
                      getPositionNeighbors(position)
                        .filter(position => tiles[position])
                        .length,
                      !!tiles[position],
                    )
                  ]
                )
            )
          )(
            Object.keys(tiles),
            // getPositionNeighbors
            position =>
              (([x, y]) =>
                Object.values(directions)
                  .map(([dx, dy]) => [x + dx, y + dy].join(','))
              )(position.split(',').map(n => n - 0))
          ),
          tiles
        )
    )(
      // Same as 24a:
      input
        .map(x =>
          x
            // Regex will split out our six directional instructions into a list
            .match(/e|se|sw|w|nw|ne/g)
            // Now walk for each. Start at [0, 0] and move according to
            // each direction accordingly.
            .reduce(([x, y], move) =>
              ((dx, dy) => [x + dx, y + dy]
              )(...directions[move]),
              [0, 0]
            )
        )
        // For each of those tile positions, build a mapping,
        // flipping the value of tiles reach multiple times.
        .reduce((tiles, position) =>
          ({
            ...tiles,
            [position]: !tiles[position],
          }),
          {}
        )
    )
  )
)(
  document.body.innerText.trim().split('\n'),
  // I build the hexagonal grid instead as a checkerboard:
  //
  //                    [ ][X][ ][X][ ]
  //                    [X][ ][O][ ][X]
  //                    [ ][X][ ][X][ ]
  //
  // From the central [O], you can move in [dx, dy] offsets
  // equivalently to the six hexagonal directions.
  {
    e:  [ 2,  0],
    se: [ 1, -1],
    sw: [-1, -1],
    w:  [-2,  0],
    nw: [-1,  1],
    ne: [ 1,  1],
  },
)

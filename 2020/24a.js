(finalTiles =>
  // Counts the final number of active tiles
  Object.keys(finalTiles).filter(tile => finalTiles[tile]).length
)(
  document.body.innerText.trim()
    .split('\n')
    .map(x =>
      x
        // Regex will split out our six directional instructions into a list
        .match(/e|se|sw|w|nw|ne/g)
        // Now walk for each. Start at [0, 0] and move according to
        // each direction accordingly.
        .reduce(([x, y], move) =>
          ((dx, dy) =>
            [x + dx, y + dy]
          )(
            // I build the hexagonal grid instead as a checkerboard:
            //
            //                    [ ][X][ ][X][ ]
            //                    [X][ ][O][ ][X]
            //                    [ ][X][ ][X][ ]
            //
            // From the central [O], you can move in [dx, dy] offsets
            // equivalently to the six hexagonal directions.
            ...({
              e:  [ 2,  0],
              se: [ 1, -1],
              sw: [-1, -1],
              w:  [-2,  0],
              nw: [-1,  1],
              ne: [ 1,  1],
            })[move]
          ),
          [0, 0]
        )
    )
    // For each of those tile positions, build a mapping,
    // flipping the value of tiles reach multiple times.
    .reduce((tiles, pos) =>
      ({
        ...tiles,
        [pos]: !tiles[pos],
      }),
      {}
    )
)

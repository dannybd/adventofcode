((input, getEdges, edgePosition, rotate, flip, seaMonster) =>
  ((hasSeaMonster, solvedGrid) =>
    // One of the 8 possible solvedGrid arrangements contains sea monsters
    [
      solvedGrid,
      rotate(solvedGrid),
      rotate(rotate(solvedGrid)),
      rotate(rotate(rotate(solvedGrid))),
      rotate(rotate(rotate(flip(solvedGrid)))),
      rotate(rotate(flip(solvedGrid))),
      rotate(flip(solvedGrid)),
      flip(solvedGrid),
    ]
      // Walk through the grid and decrement for every sea monster spotted
      .map(grid =>
        grid
          .slice(0, -seaMonster.length)
          .reduce((found, line, y) =>
            found + [...line]
              .slice(0, line.length - seaMonster[0].length)
              .reduce((found, _, x) =>
                found - hasSeaMonster(grid, x, y),
                0
              ),
            0
          )
      )
      // Only one arrangement contains any sea monsters, so grab its count
      .find(n => n < 0)
      // Multiply by the number of #s in the sea monster
      * seaMonster.join('').match(/#/g).length
      // And finally add the number of #s in the solvedGrid,
      // to compute the habitat's water roughness
      + solvedGrid.join('').match(/#/g).length
  )(
    // hasSeaMonster: is a position in the grid a valid
    // start point (top left corner) for a sea monster?
    (grid, x, y) =>
      seaMonster
        // Pull the offset coords of all of the #s in the monster
        .flatMap((line, dy) =>
          [...line]
            .map((c, dx) => c === '#' ? [dx, dy] : null)
            .filter(k => k !== null)
        )
        // Does the grid have #s at all of those offsets?
        .every(offset =>
          ((dx, dy) =>
            grid[y + dy]?.[x + dx] === '#'
          )(...offset)
        ),
    // solvedGrid: where we actually figure out how this thing goes together
    // Our list of tiles is computed below. Before solving, let's pre-compute
    // some useful things and pass them in as arguments.
    (tiles =>
      ((size, tiles, tilesMap, topLeftTile, fixNextTile) =>
        [...Array(size).keys()]
          .slice(1)
          .reduce((grid, y) =>
            [
              ...grid,
              // For all rows past 0, we fill in each row by checking
              // neighbors against the tile directly above them.
              [...Array(size).keys()]
                .map(x =>
                  fixNextTile(tilesMap, grid[y - 1][x], edgePosition.TOP)
                )
            ],
            // For row 0, we walk right, and check neighbors against
            // the tile on their left.
            [
              [...Array(size).keys()]
                .slice(1)
                .reduce((row, x) =>
                  [
                    ...row,
                    fixNextTile(tilesMap, row[x - 1], edgePosition.LEFT)
                  ],
                  // [0, 0] is set to affix the rest of the grid.
                  // Its orientation is chosen so its two neighbors
                  // will be below it and to the right of it--
                  [
                    (
                      topLeftTile.fixed =
                        topLeftTile
                          .orientations
                          // Find the orientation index which puts its
                          // two neighbors below and to the right of it;
                          // from the neighbors' perspective, this means
                          // their meshing edges are LEFT and TOP.
                          .findIndex((_, i) =>
                            topLeftTile
                              .neighbors
                              .map(n => n.alignments[i].meshingEdgePosition)
                              .join(',')
                            === [edgePosition.LEFT, edgePosition.TOP].join(',')
                          )
                    ) !== undefined &&
                    topLeftTile
                  ]
                ),
            ]
          )
          // If we got here, then all tiles were successfully affixed
          // and orientated into the grid! The problem now tells us to strip
          // the border from each tile and glue them together.
          .map(row =>
            row
              .map(tile =>
                // Again, tile.fixed holds the correct final orientation
                // for the grid
                tile
                  .orientations[tile.fixed]
                  .grid
                  // We're removing the border, so cut the top and bottom rows
                  .slice(1, -1)
                  // For each remaining line, cut left and right characters
                  .map(x => x.slice(1, -1))
              )
          )
          // Now merge the tiles together: map each row into rows of lines,
          // and flatMap the list of rows of lines together
          .flatMap(row =>
            // Use the first tile as an iterator over its lines
            row[0].map((_, i) =>
              // Turn each row into a concatenation of the inner rows
              row.map(tile => tile[i]).join('')
            )
          )
      )(
        // size: 144 tiles -> size of 12
        Math.sqrt(tiles.length),
        tiles,
        // tilesMap: makes tile lookup much easier as tilesMap[tile.id]
        Object.fromEntries(tiles.map(tile => [tile.id, tile])),
        // topLeftTile: since any piece can be rotated 8 ways,
        // there are technically 8 unique solutions to the solved grid.
        // This affixes one of the corner pieces to be our topLeft piece,
        // which narrows us to 2 unique solutions to the solved grid.
        // (We'll narrow further soon.)
        tiles.find(tile => tile.neighbors.length === 2),
        // fixNextTile: Given an already-fixed tile and which edge we're
        // trying to match against, find out which neighbor can be oriented
        // so that it fits against that tile's specific edge.
        (tilesMap, relative, meshingEdgePosition) =>
          (neighbor =>
            // Saves the correct orientation for the tile,
            // and allows us to read it on the next pass
            (
              tilesMap[neighbor.id].fixed =
                neighbor
                  .alignments[relative.fixed]
                  .neighborOrientationIndex
            ) !== undefined &&
            // Return the neighbor tile itself
            tilesMap[neighbor.id]
          )(
            relative
              .neighbors
              // Only consider unfixed neighbors
              .filter(neighbor => tilesMap[neighbor.id].fixed === null)
              // We know the fixed tile's orientation (relative.fixed):
              // For each neighbor, check which one aligns against that
              // orientation with its meshing edge position in the one
              // specified (e.g. LEFT, or TOP)
              .find(neighbor =>
                neighbor.alignments[relative.fixed].meshingEdgePosition ===
                  meshingEdgePosition
              )
          ),
      )
    )(
      // Built out the list of tiles
      input
        .split('\n\n')
        .map(tile =>
          ((id, grid) =>
            ({
              id,
              // List both directions of the edges
              allEdges: [...getEdges(grid), ...getEdges(rotate(rotate(grid)))],
              // Holds the index into the orientations list
              // which is correct for arranging the tiles
              fixed: null,
              orientations:
                [
                  grid,
                  rotate(grid),
                  rotate(rotate(grid)),
                  rotate(rotate(rotate(grid))),
                  rotate(rotate(rotate(flip(grid)))),
                  rotate(rotate(flip(grid))),
                  rotate(flip(grid)),
                  flip(grid),
                ]
                  // Pre-compute the edges for each orientation, too
                  .map(grid => ({grid, edges: getEdges(grid)})),
            })
          )(
            tile.match(/\d+/) - 0,
            tile.split('\n').slice(1)
          )
        )
        // Augment the tiles with info on their neighbors, too
        .map((tile, _, tiles) =>
          ({
            ...tile,
            neighbors: tiles
              .filter(neighbor =>
                // Neighbors aren't yourself
                tile.id !== neighbor.id &&
                // Neighbors overlap an edge with you. If you didn't overlap,
                // then the edge sets would be distinct, and this would equal
                // 8 + 8 = 16. The tiles share at most one edge, as well as
                // sharing its flipped inverse, so the set size is 16 - 2 = 14.
                (new Set([...tile.allEdges, ...neighbor.allEdges])).size === 14
              )
              // Store the minimum necessary info about each neighbor
              .map(neighbor =>
                ({
                  id: neighbor.id,
                  // For each orientation of the given tile, how must we
                  // orient the neighbor tile to make it fit? Which edge
                  // face fits in those cases?
                  alignments: tile.orientations
                    .map(tileOrientation =>
                      neighbor
                        .orientations
                        .map((neighborOrientation, neighborOrientationIndex) =>
                          (meshingEdgePosition =>
                            // For each tile orientation where is exactly
                            // one neighbor orientation which allows it to
                            // fit against that tile. This records the
                            // orientation index of the neighbor, and which
                            // edge was used for the fit.
                            meshingEdgePosition !== -1
                              ? {neighborOrientationIndex, meshingEdgePosition}
                              : null
                          )(
                            neighborOrientation.edges
                              // Here, we want to find where the neighbor's
                              // edge is correctly meshed against the tile's.
                              // Index (3 - j) works b/c of getEdges, below
                              .findIndex((neighborEdge, j) =>
                                neighborEdge === tileOrientation.edges[3 - j]
                              )
                          )
                        )
                        // It's a list of nulls with one correct orientation,
                        // so pull that orientation out.
                        .find(alignment => alignment !== null)
                    )
                })
              ),
          })
        )
    )
  )
)(
  document.body.innerText.trim(),
  // getEdges: Our edge data is specifically arranged so that
  // opposite edges are symmetric in the list: e.g. TOP = 0, BOTTOM = 3.
  // This lets us take 3 - the index to match opposite edges.
  grid => [
    // Top
    grid[0],
    // Right
    grid.map(line => line[grid.length - 1]).join(''),
    // Left
    grid.map(line => line[0]).join(''),
    // Bottom
    grid[grid.length - 1],
  ],
  // edgePosition: for human-readable edge names
  {
    TOP: 0,
    RIGHT: 1,
    LEFT: 2,
    BOTTOM: 3,
  },
  // rotate
  grid =>
    [...Array(grid.length).keys()]
      .map((_, y) =>
        [...Array(grid.length).keys()]
          .map((_, x) =>
            grid[grid.length - 1 - x][y]
          )
          .join('')
      ),
  // flip
  grid => grid.map(line => line.split('').reverse().join('')),
  // seaMonster
  [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   ',
  ]
)

((input, getEdges, edgePosition, rotate, flip, seaMonster) =>
  ((hasSeaMonster, seaMonsterHashCount, solvedGrid) =>
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
      .map(grid =>
        grid
          .slice(0, -seaMonster.length)
          .reduce((found, line, y) =>
            found + [...line]
              .slice(0, line.length - seaMonster[0].length)
              .reduce((found, _, x) =>
                found - hasSeaMonster(grid, x, y) * seaMonsterHashCount,
                0
              ),
            0
          )
      )
      .find(n => n < 0)
      + solvedGrid.join('').match(/#/g).length
  )(
    // hasSeaMonster
    (grid, x, y) =>
      seaMonster
        .flatMap((line, dy) =>
          [...line]
            .map((c, dx) => c === '#' ? [dx, dy] : null)
            .filter(k => k !== null)
        )
        .every(offset =>
          ((dx, dy) =>
            grid[y + dy]?.[x + dx] === '#'
          )(...offset)
        ),
    // seaMonsterHashCount
    seaMonster.join('').match(/#/g).length,
    // solvedGrid
    (tiles =>
      ((size, tiles, tilesMap, topLeftTile, fixNextTile) =>
        (window.tilesMap = tilesMap) !== undefined &&
        [...Array(size).keys()]
          .slice(1)
          .reduce((grid, y) =>
            [
              ...grid,
              // For all rows past 0, we fill in each row by checking
              // neighbors against the tile directly above them.
              [...Array(size).keys()]
                .map(x =>
                  fixNextTile(grid[y - 1][x], edgePosition.BOTTOM)
                )
            ],
            // For row 0, we walk right, and check neighbors against
            // the tile on their left.
            [
              [...Array(size).keys()]
                .slice(1)
                .reduce((line, x) =>
                  [
                    ...line,
                    fixNextTile(line[x - 1], edgePosition.RIGHT)
                  ],
                  // [0, 0] is set to affix the rest of the grid.
                  // Its orientation is chosen so its two neighbors
                  // will be below it and to the right of it.
                  [
                    (
                      topLeftTile.fixed =
                        topLeftTile
                          .orientations
                          .map((o, i) =>
                            topLeftTile
                              .neighbors
                              .map(n => n.alignments[i].edgeIndex)
                              .join(',')
                          )
                          .findIndex(n =>
                            n === `${edgePosition.RIGHT},${edgePosition.BOTTOM}`
                          )
                    ) !== undefined &&
                    topLeftTile
                  ]
                ),
            ]
          )
          .map(line =>
            line
              .map(tile =>
                tile
                  .orientations[tile.fixed]
                  .grid
                  .slice(1, 9)
                  .map(x => x.substr(1, 8))
              )
          )
          .flatMap(line =>
            line[0].map((_, i) =>
              line.map(tile => tile[i]).join('')
            )
          )
      )(
        // size
        Math.sqrt(tiles.length),
        tiles,
        // tilesMap
        Object.fromEntries(tiles.map(tile => [tile.id, tile])),
        // topLeftTile
        tiles.find(tile => tile.neighbors.length === 2),
        // fixNextTile
        (relative, edgePosition) =>
          (neighbor =>
            // Saves the correct orientation for the tile,
            // and allows us to read it on the next pass
            (
              tilesMap[neighbor.id].fixed =
                neighbor
                  .alignments[relative.fixed]
                  .neighborOrientationIndex
            ) !== undefined &&
            tilesMap[neighbor.id]
          )(
            relative
              .neighbors
              .filter(neighbor =>
                tilesMap[neighbor.id].fixed === null
              )
              .find(neighbor =>
                neighbor.alignments[relative.fixed].edgeIndex === edgePosition
              )
          ),
      )
    )(
      input
        .split('\n\n')
        .map(tile =>
          ((id, grid) =>
            ({
              id,
              // List both directions of the edges
              allEdges: [...getEdges(grid), ...getEdges(rotate(rotate(grid)))],
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
                  .map(grid =>
                    ({
                      grid,
                      edges: getEdges(grid),
                    })
                  ),
            })
          )(
            tile.match(/\d+/) - 0,
            tile.split('\n').slice(1)
          )
        )
        .map((tile, _, tiles) =>
          ({
            ...tile,
            neighbors: tiles
              .filter(neighbor =>
                tile.id !== neighbor.id &&
                (new Set([...tile.allEdges, ...neighbor.allEdges])).size === 14
              )
              .map(neighbor =>
                ({
                  id: neighbor.id,
                  alignments: tile.orientations
                    .map(tileOrientation =>
                      neighbor
                        .orientations
                        .map((neighborOrientation, neighborOrientationIndex) =>
                          (edgeIndex =>
                            edgeIndex !== -1
                              ? {neighborOrientationIndex, edgeIndex}
                              : null
                          )(
                            tileOrientation.edges
                              .findIndex((edge, j) =>
                                edge === neighborOrientation.edges[3 - j]
                              )
                          )
                        )
                        .find(x => x !== null)
                    )
                })
              ),
          })
        )
    )
  )
)(
  document.body.innerText.trim(),
  // getEdges
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

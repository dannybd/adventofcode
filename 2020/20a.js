document.body.innerText.trim()
  .split('\n\n')
  .map(tile =>
    // The info we care about from each tile is its id and
    // the edges of the grid in both directions
    ((id, grid) =>
      ({
        id,
        edges:
          [
            grid[0],
            grid.map(l => l[grid.length - 1]).join(''),
            grid[grid.length - 1],
            grid.map(l => l[0]).join(''),
          ]
            // List both directions of the edges
            .flatMap(dir => [dir, dir.split('').reverse().join('')])
      })
    )(
      tile.match(/\d+/) - 0,
      tile.split('\n').slice(1)
    )
  )
  .filter((tile, _, tiles) =>
    tiles
      .filter(neighbor =>
        // If the tile has edges in common with the neighbor,
        // this set will have overlap, and the set size will be
        // less than 8 + 8 = 16
        (new Set([...tile.edges, ...neighbor.edges])).size < 16
      )
      .length
      // Why 3? Because we checked the tile against itself, too
      === 3
  )
  // Take the product of the IDs
  .reduce((a, b) => a * b.id, 1)

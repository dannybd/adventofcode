document.body.innerText.trim()
  .split('\n\n')
  .map(tile =>
    ((id, grid) =>
      ({
        id,
        grid,
        possibleEdges: new Set(
          [
            grid[0],
            grid.map(l => l[grid.length - 1]).join(''),
            grid[grid.length - 1],
            grid.map(l => l[0]).join(''),
          ]
            .flatMap(dir => [dir, dir.split('').reverse().join('')])
            .map(dir =>
              parseInt(dir.replace(/./g, c => c === '#' ? 1 : 0), 2)
            )
        )
      })
    )(
      tile.match(/\d+/) - 0,
      tile.split('\n').slice(1)
    )
  )
  .map((tile, _, tiles) =>
    ({
      ...tile,
      possibleNeighbors: tiles
        .map(neighbor =>
          ({
            id: neighbor.id,
            overlap:
              16 -
              (new Set([...tile.possibleEdges, ...neighbor.possibleEdges]))
                .size
          })
        )
        .filter(neighbor => neighbor.overlap)
    })
  )
  .filter(tile => tile.possibleNeighbors.length <= 3)
  .map(tile => tile.id)
  .reduce((a, b) => a * b)

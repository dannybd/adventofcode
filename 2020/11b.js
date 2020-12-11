(field =>
  (neighbors => [...Array(100)]
    .reduce(
      data =>
        data.area.join('\n') === data.lastAreas[0]
          ? data
          : {
              area: data.area
                .map((row, y) => [...row]
                  .map((s, x) =>
                    (
                      occupiedNeighborCount =>
                        (s === 'L' && occupiedNeighborCount === 0)
                          ? '#'
                          : (s === '#' && occupiedNeighborCount > 4) ? 'L' : s
                    )(
                      neighbors[y][x]
                        .map(offsets =>
                          data.area[y + offsets[0]]?.[x + offsets[1]] || '.'
                        )
                        .join('')
                        .match(/#/g)
                        ?.length || 0
                    )
                  )
                  .join('')
                ),
              lastAreas: [data.area.join('\n'), ...data.lastAreas]
            },
      {area: field, lastAreas: []}
    )
    .area
    .join('')
    .match(/#/g)
    .length
  )(
    field
      .map((row, y) => [...row]
        .map((_, x) =>
          [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
          ]
            .map(offsets =>
              (distanceToNeighbor =>
                offsets.map(x => x * distanceToNeighbor)
              )
              (
                [...Array(row.length).keys()]
                  .slice(1)
                  .find(n => /[L#]/.test(
                    field[y + n * offsets[0]]?.[x + n * offsets[1]] || ''
                  )) || row.length
              )
            )
        )
      )
  )
)(document.body.innerText.trim().split('\n'))

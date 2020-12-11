(field => [...Array(100).fill(field[0].length)]
  .reduce(
    (data, rowSize) =>
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
                        : (s === '#' && occupiedNeighborCount > 3) ? 'L' : s
                  )(
                    [
                      [-1, -1], [-1, 0], [-1, 1],
                      [ 0, -1],          [ 0, 1],
                      [ 1, -1], [ 1, 0], [ 1, 1]
                    ]
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
)(document.body.innerText.trim().split('\n'))

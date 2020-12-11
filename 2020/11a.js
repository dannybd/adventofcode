(field => [...Array(100).fill(field.split('\n')[0].length + 1)]
  .reduce(
    (data, rowSize) =>
      data.area === data.lastAreas[0]
        ? data
        : {
          area: [...data.area]
            .map((s, i) =>
              (
                occupiedNeighborCount =>
                  (s === 'L' && occupiedNeighborCount === 0)
                    ? '#'
                    : (s === '#' && occupiedNeighborCount > 3) ? 'L' : s
              )(
                [
                  -rowSize - 1, -rowSize, -rowSize + 1,
                  -1, 1,
                  rowSize - 1, rowSize, rowSize + 1
                ]
                  .map(offset => data.area[i + offset] || '.')
                  .join('')
                  .match(/#/g)
                  ?.length || 0
              )
            )
            .join(''),
          lastAreas: [data.area, ...data.lastAreas]
        },
    {area: field.replace(/\n/g, '.'), lastAreas: []}
  )
  .area
  .match(/#/g)
  .length
)(document.body.innerText.trim())

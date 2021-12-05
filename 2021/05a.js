((lines, grid) =>
  lines
    // Remove diagonals (comment this out for 5b's solution)
    .filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
    .forEach(([[x1, y1], [x2, y2]]) =>
      [...Array((x2 - x1 || y2 - y1) + 1).keys()]
        .map(t => [
          x1 + t * Math.sign(x2 - x1),
          y1 + t * Math.sign(y2 - y1),
        ])
        .forEach(([x, y]) => grid[y][x]++),
    ) ||
  grid.flat().filter(n => n > 1).length
)(
  // lines
  document.body.innerText.trim().split('\n')
    .map(line =>
      line.split(' -> ')
        .map(coord => coord.split(',').map(n => +n))
        // Sort by x1 < x2, then y1 < y2
        .sort(([x1, y1], [x2, y2]) => x1 !== x2 ? x1 - x2 : y1 - y2),
    ),
  // grid
  [...Array(1000).keys()].map(_ => Array(1000).fill(0)),
)

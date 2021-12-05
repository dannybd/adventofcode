((lines, grid, drawVertical, drawDiagonal) =>
  lines
    // Do NOT remove diagonals
    // .filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
    .forEach(line =>
      line[0][0] === line[1][0]
        ? drawVertical(grid, line)
        : drawDiagonal(grid, line)
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
  // drawVertical
  (grid, [[x1, y1], [_, y2]]) =>
    [...Array(y2 - y1 + 1).keys()]
      .map(dy => [x1, dy + y1])
      .forEach(([x, y]) => grid[y][x]++),
  // drawDiagonal
  (grid, [[x1, y1], [x2, y2]]) =>
    [...Array(x2 - x1 + 1).keys()]
      .map(dx => [dx + x1, Math.sign(y2 - y1) * dx + y1])
      .forEach(([x, y]) => grid[y][x]++),
)

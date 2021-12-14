document.body.innerText.trim().split('\n')
  .map(l => l.split('').map(n => +n))
  .flatMap((line, y, lines) =>
    line.filter((n, x) =>
      [lines[y][x - 1], lines[y][x + 1], lines[y - 1]?.[x], lines[y + 1]?.[x]]
        .filter(k => k !== undefined)
        .every(k => k > n),
    ),
  )
  .reduce((a, b) => a + b + 1, 0)

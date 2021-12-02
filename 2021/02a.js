(
  c => c[0] * c[1]
)(
  document.body.innerText.trim()
    .split('\n')
    .map(x => (y => [y[0], +y[1]])(x.split(' ')))
    .reduce(
      ([x, y], [dir, n]) =>
        ({
          forward: [x + n, y    ],
          up:      [x,     y - n],
          down:    [x,     y + n],
        })[dir],
      [0, 0],
    )
)

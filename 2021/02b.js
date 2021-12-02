(
  c => c[0] * c[1]
)(
  document.body.innerText.trim()
    .split('\n')
    .map(x => (y => [y[0], +y[1]])(x.split(' ')))
    .reduce(
      ([x, y, z], [dir, n]) =>
        ({
          forward: [x + n, y + z * n, z    ],
          up:      [x,     y,         z - n],
          down:    [x,     y,         z + n],
        })[dir],
      [0, 0, 0],
    )
)

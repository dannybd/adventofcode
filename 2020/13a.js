((t, ids) =>
  ids
    .split(',')
    .map(x => x - 0)
    // Remove non-numeric IDs
    .filter(x => x)
    // The wait is equal to -t (mod x)
    .map(x => [x, x - (t % x)])
    // Sort by earliest wait time, grab the first one
    .sort((a, b) => a[1] - b[1])[0]
    // Then multiple together
    .reduce((a, b) => a * b, 1)
)(...document.body.innerText.trim().split('\n'))

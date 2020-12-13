(ids =>
  (product => ids
    .map(id =>
      ((num, remainder, inverse) =>
        // This was my undoing. remainder * inverse * (product / num)
        // can exceed 2^53 - 1, and so JS was quietly rounding...
        // which is *very bad* for getting an exact answer.
        // This, instead, makes an array whose elements sum
        // to the same product; this way, JS never stores too
        // big a number at any given time.
        // In the official input, product can be stored safely,
        // and since remainder < num, so too can each element here.
        Array(inverse).fill(remainder * (product / num))
      )(
        ...id,
        // Scan over the values from 0 to N - 1 to see if
        // that value * (product / x) === 1 (mod x).
        // If so, that's our inverse. If none is found, use 0.
        [...Array(id[0]).keys()]
          // The parentheses around (product / id[0]) are
          // load-bearing: remove them and JS will multiply
          // inv * product first, exceeding the max safe int size.
          .find(inv => (inv * (product / id[0])) % id[0] === 1)
          || 0
      )
    )
    // We have an array of arrays of numbers, which we then flatten
    .flat()
    // and sum. We cannot just sum them and then modulo product,
    // because of JavaScript's max safe int: 2^53 - 1. Instead,
    // we take modulo product each time, so the stored value
    // is never unintentionally rounded.
    .reduce((a, b) => (a + b) % product, 0)
  )(
    // Product calculation
    ids.reduce((a, b) => a * b[0], 1)
  )
)(
  document.body.innerText.trim().split('\n')[1]
    .split(',')
    .map(x => (x - 0) || 0)
    // Solving via Chinese remainder theorem!
    // To translate the problem statement into the CRT:
    // The ith bus with ID x should arrive at t + i.
    //   -> (t + i) === 0 (mod x)
    //   -> t === (kx - i) (mod x), where kx > i (to ensure it's positive)
    // We need to multiply by k (a.length) because JS does wonky things
    // with negative numbers and modulo operations.
    .map((x, i, a) => [x, (a.length * x - i) % x])
    // Only needed to keep the `x` values around long enough to
    // record their positions in the array
    .filter(x => x[0])
)

((input, cost) =>
  Math.min(
    // *sigh* just brute force the keys I guess
    ...[...Array(Math.max(...input)).keys()]
      .map(k =>
        input
          .map(n => cost(n, k))
          // Sum all costs
          .reduce((a, b) => a + b, 0),
      )
  )
)(
  document.body.innerText.trim().split(',').map(n => +n),
  // cost formula: distance
  (n, k) => Math.abs(n - k),
)

document.body.innerText.trim().split('\n')
  .map(n => n - 0)
  .sort((a, b) => a - b)
  .map((x, i, arr) => x - (arr[i - 1] || 0))
  .join('')
  // The 1 preceding a 3 or the end (an implicit 3)
  // is essential for the adapter chain; otherwise
  // the next gap would be 4
  .split(/13+|1$/)
  // The number of options in each subsequent block
  // of 1s depends on their length:
  //  - 0 ones contribute 1 state
  //  - 1 one contributes present/absent: 2 states
  //  - 2 ones contribute 2 * present/absent: 4 states
  //  - 3 ones contribute 2 * 2 * present/absent, BUT
  //    all three cannot simultaneously be removed, so
  //    we get 2^3 - 1: 7 states
  .reduce((x, d) => x * [1, 2, 4, 7][d.length], 1)

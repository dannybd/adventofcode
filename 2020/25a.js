((loops, publicKeys) =>
  publicKeys
    .map((key, i) =>
      // For that key's secret loop size, use the other
      // public key as the subject number.
      [...Array(loops.indexOf(key))]
        .reduce(n => (n * publicKeys[1 - i]) % 20201227, 1)
    )
    // Provide some validation that the two encryption keys match
    .reduce((a, b) => a === b ? a : 'error!')
)(
  // Build a big list of loop size -> keys
  [...Array(20000000).keys()]
    .reduce(list =>
      list.push((list.slice(-1)[0] * 7) % 20201227) && list,
      [1],
    ),
  // Get the two existing public keys
  document.body.innerText.trim().split('\n').map(n => n - 0),
)

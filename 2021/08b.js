((lines, trueDigits, allPermutations, getValueWithPermutation) =>
  lines
    .map(([digitStrings, outputStrings]) =>
      // This is a very slow implementation, but it works.
      allPermutations
        .map(
          permutation =>
            // Match each permutation with what the digit & output values
            // would be with this permutation scrambling the segments
            ({
              permutation,
              digits: digitStrings
                .map(d => getValueWithPermutation(d, permutation)),
              outputs: outputStrings
                .map(d => getValueWithPermutation(d, permutation)),
            })
        )
        // Only one of these cases with find 10 digits which match the
        // true digits in sorted order. Using .filter() instead of .find()
        // so I can keep chaining my logic.
        // (Please, TC39, I beg for a pipe operator so I may know peace.)
        .filter(({digits}) =>
          [...digits].sort().toString() === [...trueDigits].sort().toString(),
        )
        // If the digits match, then the output values are correct as well.
        // Shall we commit some JS number bashing crimes while we're here?
        .map(({outputs}) =>
          +outputs
            // Lookup this value in trueDigits (which we now know to be
            // a valid mapping for this permutation). Since trueDigits
            // is a mapping from true digit (index) to true segments (value),
            // indexOf performed the correct reverse lookup for us.
            .map(d => trueDigits.indexOf(d))
            // Join our digits together as a string.
            // The leading + operator, above, casts that string back to an int.
            // (It works, sue me.)
            .join(''),
        )
        // We no longer need the array; there's only one value anyway.
        // Grab the only element.
        [0]
    )
    // And finally, sum the values from each line
    .reduce((a, b) => a + b, 0)
)(
  document.body.innerText.trim()
    .split('\n')
    .map(l => l.split(' | ').map(x => x.split(' '))),
  // trueDigits: bitmapping which bars are on in the real arrangement
  [
  //  abcdefg
    0b1110111, // 0
    0b0010010, // 1
    0b1011101, // 2
    0b1011011, // 3
    0b0111010, // 4
    0b1101011, // 5
    0b1101111, // 6
    0b1010010, // 7
    0b1111111, // 8
    0b1111011, // 9
  ],
  // allPermutations: All 7! permutations of values [0, 6]
  (x =>
    // This is a terrible implementation
    [...Array(x ** x).keys()]
      // Converting to base 7 so we get just the digits we want
      .map(n => n.toString(x).padStart(x, '0'))
      // Filter to cases there are no duplicate digits
      .filter(n => new Set([...n]).size === x)
      // Split and treat the digits as distinct ints
      .map(n => n.split('').map(k => +k))
  )(7),
  // getValueWithPermutation
  (str, permutation) =>
    [...str]
      // This is where the permutation is applied.
      // Normally, `a` would map to 2 ** 0 = 1
      // Here, we map it to, say, 2 ** permutation[0] = 2 ** 5 = 32
      .map(c => 2 ** permutation[c.charCodeAt(0) - 97])
      // Then we or the powers of 2 together to get the digit
      .reduce((a, b) => a | b, 0),
)

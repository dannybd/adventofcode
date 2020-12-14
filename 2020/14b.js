(
  // After mutating all of the memory, sum the stored values
  data => Object.values(data.mem).reduce((a, b) => a + b, 0)
)(
  document.body.innerText.trim().split('\n')
    // First, let's clean up the data into something easier to use
    .map(inst =>
      ((op, ...args) => op === 'mask'
        ? {mask: args[0]}
        : {addr: args[0] - 0, value: args[1] - 0}
      )(...inst.match(/\w+/g))
    )
    // Run through the commands
    .reduce((data, inst) =>
      ({
        // Replace the mask if it's set
        mask: inst.mask || data.mask,
        mem: inst.mask
          // If this is a mask instruction, do not mutate memory
          ? data.mem
          // Otherwise, update a specific set of addresses
          : (addrs =>
              ({
                ...data.mem,
                ...Object.fromEntries(addrs.map(addr => [addr, inst.value]))
              })
            )(
              // Which addresses? Well, after we apply the addr mask,
              // we have a fuzzy mask which should map to a set of addresses.
              (fuzzyAddr =>
                (numX =>
                  // To split it out, we count the number of Xs, and create
                  // a list of 2**N permutations
                  [...Array(2 ** numX).keys()]
                    // Translate each permutation into binary, left-padded
                    // to match the number of Xs in the mask
                    .map(n =>
                      [...Array(numX).fill(0), ...n.toString(2)]
                        .slice(-numX)
                        .join('')
                    )
                    // Replace all Xs, swapping the kth X with the kth
                    // binary digit in n.
                    .map(n =>
                      fuzzyAddr
                        .replace(
                          /X/g,
                          (_, i) =>
                            n[
                              fuzzyAddr
                                .substr(0, i)
                                .match(/X/g)
                                ?.length | 0
                            ]
                        )
                    )
                )(
                  fuzzyAddr.match(/X/g)?.length || 0
                )
              )(
                // Takes whatever the current mask is and applies it to
                // the instruction's address
                [...Array(36).fill('0'), ...inst.addr.toString(2)]
                  .slice(-36)
                  .map((c, i) => data.mask[i] !== '0' ? data.mask[i] : c)
                  .join('')
              )
            ),
      }),
      {
        mask: Array(36).fill(0).join(''),
        mem: {}
      }
    )
)

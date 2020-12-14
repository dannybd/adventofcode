(
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
          // Otherwise, find the address and update its value, once it's
          // modified by the mask.
          : {
              ...data.mem,
              [inst.addr]:
                parseInt(
                  [...Array(36).fill('0'), ...inst.value.toString(2)]
                    .slice(-36)
                    .map((c, i) => data.mask[i] !== 'X' ? data.mask[i] : c)
                    .join(''),
                  2
                )
            }
      }),
      {mem: {}}
    )
)

document.body.innerText.trim().split('\n')
  .map(x => x.match(/\w+/g))
  .reduce((data, x) =>
    ({
      mem: x[0] === 'mask'
        ? data.mem
        : data.mem.map((v, i) =>
            i !== x[1] - 0
              ? v
              : parseInt(
                  [...Array(36).fill('0'), ...(x[2] - 0).toString(2)]
                    .slice(-36)
                    .map((c, i) =>
                      data.mask[i] !== 'X' ? data.mask[i] : c
                    )
                    .join(''),
                  2
                )
        ),
      mask: x[0] === 'mask'
        ? x[1]
        : data.mask
    }),
    {mem: Array(65536).fill(0), mask: (v => v)}
  )
  .mem
  .reduce((a, b) => a + b, 0)

(input =>
  [...Array(3E7).keys()]
    .slice(input.length)
    .reduce(
      (data, turn) =>
        (spoken =>
          // This feels like cheating, but otherwise copying data.last
          // (size ~3.1M by the end) will break JS console's ability to
          // run the code. Instead, we mutate the provided data object
          // directly, and chain together using booleans to ensure
          // the modified data object is returned at the end.
          (data.last[data.spoken] = turn) !== undefined &&
          (data.spoken = spoken) !== undefined &&
          data
        )
        (
          data.spoken in data.last
            ? turn - data.last[data.spoken]
            : 0
        ),
      {
        last: Object.fromEntries(input.map((n, i) => [n, i + 1])),
        spoken: input[input.length - 1]
      }
    )
    .spoken
)(
  '13,0,10,12,1,5,8'
    .split(',')
    .map(n => n - 0)
)

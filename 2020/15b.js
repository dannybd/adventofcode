(input =>
  [...Array(3E7).keys()]
    .slice(input.length)
    .reduce((data, turn) =>
      ({
        last: {
          ...data.last,
          [data.spoken]: turn
        },
        spoken: data.spoken in data.last
          ? turn - data.last[data.spoken]
          : 0
      }),
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

(input =>
  [...Array(2020 - input.length)]
    .reduce(spoken =>
      [
        spoken.slice(1).indexOf(spoken[0]) + 1,
        ...spoken
      ],
      input
    )[0]
)(
  '13,0,10,12,1,5,8'
    .split(',')
    .map(n => n - 0)
    .reverse()
)

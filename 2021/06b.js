(startFish =>
  Array(256).fill()
    .reduce(fish =>
      [
        fish
          .filter((_, age) =>
            age === 8 ||
            (age > 8 && (age - 8) % 7 === 0)
          )
          .reduce((a, b) => a + b, 0),
        ...fish,
      ],
      startFish,
    )
    .reduce((a, b) => a + b, 0)
)(
  document.body.innerText.trim()
    .split(',').map(n => +n)
    .reduce((counts, n) => ++counts[8 - n] && counts, Array(8).fill(0)),
)

(input =>
  Array(80).fill()
    .reduce(({fish, nextCount}) =>
      (newFish =>
        ({
          fish: newFish,
          nextCount: newFish.length + newFish.filter(n => n === 0).length,
        })
      )(
        [...Array(nextCount).keys()]
          .map(i =>
            fish[i] === undefined ? 8 : (fish[i] === 0 ? 6 : fish[i] - 1),
          ),
      ),
      {fish: input, nextCount: input.length},
    )
    .fish
    .length
)(
  document.body.innerText.trim().split(',').map(n => +n)
)

(
  (bags, y) => y(
      numBags => bag => bags[bag.type]
        .map(subbag => numBags(
          {type: subbag.type, count: subbag.count * bag.count}
        ))
        .reduce((a, b) => a + b, bag.count),
      {type: 'shiny gold', count: 1}
    ) - 1
)(
  // Map of bags to list of list of bags with their counts
  Object.fromEntries(
    document.body.innerText.trim()
      .replace(/no other bag/g, '')
      .split('\n')
      .map(line => line.match(/(\d+ )?\w+ \w+(?= bag)/g))
      .map(bagGroup => [
        bagGroup[0],
        bagGroup.slice(1).map(bagData =>
          (
            parts => ({count: parts[0] - 0, type: parts.slice(1).join(' ')})
          )(
            bagData.split(' ')
          )
        )
      ])
  ),
  // Y combinator, allowing recursive lambda g to be called w/ initial value z
  // Credit: http://kestas.kuliukas.com/YCombinatorExplained/
  (g, z) => (y => y(g)(z))(le => (f => f(f))(f => le(x => (f(f))(x))))
)

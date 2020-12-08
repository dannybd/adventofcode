(
  (bags, y) => y(
    numBags => bag => bags[bag.type]
      .map(subbag =>
        numBags({type: subbag.type, count: subbag.count * bag.count})
      )
      .reduce((a, b) => a + b, bag.count)
  )({type: 'shiny gold', count: 1}) - 1
)(
  // Map of bags to list of bags with their counts
  Object.fromEntries(
    document.body.innerText.trim()
      .replace(/no other bag/g, '')
      .split('\n')
      .map(line => line.match(/(\d+ )?\w+ \w+(?= bag)/g))
      .map(bagGroup => [
        bagGroup[0],
        bagGroup.slice(1).map(bagData =>
          (
            // {type: string, count: number}
            parts => ({type: parts.slice(1).join(' '), count: parts[0] - 0})
          )(
            bagData.split(' ')
          )
        )
      ])
  ),
  // Y combinator!
  // Credit: https://blog.klipse.tech/lambda/2016/08/10/pure-y-combinator-javascript.html
  f => (x => x(x))(x => f(y => x(x)(y)))
)

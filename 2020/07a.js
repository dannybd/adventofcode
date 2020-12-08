(
  (bags, y) => Object.keys(bags)
    .filter(bagToCheck =>
      y(
        holdsShiny => bag => bags[bag]
          .some(subbag => subbag === 'shiny gold' || holdsShiny(subbag))
      )(bagToCheck)
    )
    .length
)(
  // Map of bags to list of sub bags
  Object.fromEntries(
    document.body.innerText.trim()
      .replace(/no other bag/g, '')
      .split('\n')
      .map(x => x.match(/\w+ \w+(?= bag)/g))
      .map(x => [x[0], x.slice(1)])
  ),
  // Y combinator!
  // Credit: https://blog.klipse.tech/lambda/2016/08/10/pure-y-combinator-javascript.html
  f => (x => x(x))(x => f(y => x(x)(y)))
)

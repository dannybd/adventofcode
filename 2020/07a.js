(
  (bags, y) => Object.keys(bags)
    .filter(bagToCheck => y(
      holdsShiny => bag => bags[bag].some(
        subbag => subbag === 'shiny gold' || holdsShiny(subbag)
      ),
      bagToCheck
    ))
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
  // Y combinator, allowing recursive lambda g to be called w/ initial value z
  // Credit: http://kestas.kuliukas.com/YCombinatorExplained/
  (g, z) => (y => y(g)(z))(le => (f => f(f))(f => le(x => (f(f))(x))))
)

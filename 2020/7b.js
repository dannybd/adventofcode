const bags = Object.fromEntries(
  document.body.innerText.trim()
    .replace(/no other bag/g, '')
    .split('\n')
    .map(x => x.match(/(\d+ )?\w+ \w+(?= bag)/g))
    .map(x => [
      x[0],
      x.slice(1).map(y =>
        (
          z => ({count: z[0] - 0, type: z.slice(1).join(' ')})
        )(y.split(' '))
      )
    ])
);
function numBags(b) {
  return bags[b.type]
    .map(v => numBags({type: v.type, count: v.count * b.count}))
    .reduce((a, b) => a + b, b.count);
}
numBags({type: 'shiny gold', count: 1}) - 1;

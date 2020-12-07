const bags = Object.fromEntries(
  document.body.innerText.trim()
    .replace(/no other bag/g, '')
    .split('\n')
    .map(x => x.match(/\w+ \w+(?= bag)/g))
    .map(x => [x[0], x.slice(1)])
);
function holdsShiny(b) {
  return bags[b].some(v => v === 'shiny gold' || holdsShiny(v));
}
Object.keys(bags).filter(b => holdsShiny(b)).length;

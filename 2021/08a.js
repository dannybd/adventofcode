document.body.innerText.trim()
  .split('\n')
  .map(l => l.split(' | ')[1].split(' '))
  .reduce(
    (sum, output) =>
      sum + output.filter(d => [2, 3, 4, 7].includes(d.length)).length,
    0,
  )

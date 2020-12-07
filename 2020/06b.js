document.body.innerText.trim()
  .split('\n\n')
  .map(group => group.split('\n').map(l => [...l]))
  .map(sets => [...new Set(sets.flat())]
    .filter(c => sets.every(x => x.includes(c)))
    .length
  )
  .reduce((a, b) => a + b, 0)

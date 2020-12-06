document.body.innerText.trim()
  .split('\n\n')
  .map(group => group.split('\n').map(l => l.match(/\w/g)))
  .map(group => group
    .reduce((a, b) => a.filter(x => b.includes(x)), group[0])
    .length
  )
  .reduce((a, b) => a + b, 0)

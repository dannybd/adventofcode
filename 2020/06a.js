document.body.innerText.trim()
  .split('\n\n')
  .map(g => (new Set(g.match(/\w/g))).size)
  .reduce((a, b) => a + b, 0)

document.body.innerText.trim()
  .replace(/\w/g, c => /[BR]/.test(c) | 0)
  .split('\n')
  .sort()
  .map(b => parseInt(b, 2))
  .reverse()[0]

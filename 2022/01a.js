Math.max(
  ...document.body.innerText.trim()
    .split('\n\n')
    .map(t => t.split('\n').reduce((a, b) => +b+a, 0))
)

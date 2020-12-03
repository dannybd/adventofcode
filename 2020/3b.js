((lines, steps) => steps
  .map(step => lines
    .filter((line, i) => line[(i * step) % line.length] === '#')
    .length
  )
  .reduce((a, b) => a * b, 1)
)(document.body.innerText.trim().split('\n'), [1, 3, 5, 7, 0.5])

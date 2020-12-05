(seats =>
  seats.find((seat, i) => seats[i + 1] - seat !== 1) + 1
)(document.body.innerText.trim()
  .replace(/\w/g, c => /[BR]/.test(c) | 0)
  .split('\n')
  .sort()
  .map(b => parseInt(b, 2))
)

(
  t => t.filter((l, i) => l[(3 * i) % l.length] === '#').length
)(document.body.innerText.trim().split('\n'))

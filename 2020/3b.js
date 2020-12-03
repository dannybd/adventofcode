(t =>
  (paths => paths
    .map(path => t.filter(path).length)
    .reduce((a, b) => a * b, 1)
  )
  ([
    (l, i) => l[i % l.length] === '#',
    (l, i) => l[(3 * i) % l.length] === '#',
    (l, i) => l[(5 * i) % l.length] === '#',
    (l, i) => l[(7 * i) % l.length] === '#',
    (l, i) => l[(i / 2) % l.length] === '#'
  ])
)(document.body.innerText.trim().split('\n'))

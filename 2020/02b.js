document.body.innerText.trim().split('\n').filter(
  x => (
    a => (
      (s, c) => s[a[0] - 1] === c ^ s[a[1] - 1] === c
    )(a[4], a[2])
  )(x.split(/\W/))
).length

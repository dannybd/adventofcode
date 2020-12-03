document.body.innerText.trim().split('\n').filter(
  x => (
    a => (
      n => n >= a[0] - 0 && n <= a[1] - 0
    )(a[4].split(a[2]).length - 1)
  )(x.split(/\W/))
).length
